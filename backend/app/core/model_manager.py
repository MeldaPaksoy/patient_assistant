import torch
from transformers import AutoProcessor, AutoModelForImageTextToText, TextIteratorStreamer
from threading import Thread
from typing import Dict, Any, Generator
import json
from app.config import settings
from app.utils import get_system_prompt

class ModelManager:
    """Manages ML model loading and inference"""
    
    def __init__(self):
        self.model = None
        self.processor = None
        self.device = None
        
    def check_gpu(self) -> str:
        """
        Check GPU availability and return device type
        
        Returns:
            str: Device type ('cuda' or 'cpu')
        """
        if torch.cuda.is_available():
            print(f"✅ GPU: {torch.cuda.get_device_name(0)}")
            return "cuda"
        print("❌ GPU yok, CPU kullanılacak")
        return "cpu"
    
    def load_model(self):
        """Load and initialize the model and processor"""
        self.device = self.check_gpu()
        
        # GPU optimizations
        if self.device == "cuda":
            torch.backends.cudnn.benchmark = True
            torch.backends.cuda.matmul.allow_tf32 = True
            torch.backends.cudnn.allow_tf32 = True
            torch.cuda.empty_cache()
        
        # Load processor
        self.processor = AutoProcessor.from_pretrained(settings.MODEL_ID, use_fast=True)
        
        # Model configuration
        model_kwargs = {
            "trust_remote_code": True,
            "device_map": "auto",
            "torch_dtype": torch.bfloat16 if self.device == "cuda" else torch.float32,
        }
        
        # Load model
        self.model = AutoModelForImageTextToText.from_pretrained(settings.MODEL_ID, **model_kwargs)
        self.model.generation_config.do_sample = True
        self.model.generation_config.use_cache = True
        
        # Configure tokenizer
        if not hasattr(self.processor.tokenizer, 'pad_token') or self.processor.tokenizer.pad_token is None:
            self.processor.tokenizer.pad_token = self.processor.tokenizer.eos_token
        
        if hasattr(self.processor.tokenizer, 'eos_token_id'):
            self.model.generation_config.pad_token_id = self.processor.tokenizer.eos_token_id
        
        # Warm-up the model
        self._warmup_model()
    
    def _warmup_model(self):
        """Warm up the model with a test input"""
        if self.device == "cuda":
            try:
                warm_messages = [{"role": "user", "content": [{"type": "text", "text": "Test"}]}]
                warm_inputs = self.processor.apply_chat_template(
                    warm_messages,
                    add_generation_prompt=True,
                    tokenize=True,
                    return_dict=True,
                    return_tensors="pt"
                ).to(self.device)
                
                with torch.no_grad():
                    _ = self.model.generate(**warm_inputs, max_new_tokens=5, do_sample=False)
                torch.cuda.empty_cache()
                print("✅ Model hazır!")
            except Exception as e:
                print(f"⚠️ Warm-up hatası: {e}")
    
    def memory_to_messages(self, memory, user_profile: dict = None) -> list:
        """
        Convert LangChain memory to model message format
        
        Args:
            memory: LangChain ConversationBufferWindowMemory instance
            user_profile: User profile information for personalized responses
            
        Returns:
            list: Messages in model format
        """
        from langchain.schema import HumanMessage, AIMessage
        
        messages = [{"role": "system", "content": [{"type": "text", "text": get_system_prompt(user_profile)}]}]
        
        for message in memory.chat_memory.messages:
            if isinstance(message, HumanMessage):
                messages.append({
                    "role": "user", 
                    "content": [{"type": "text", "text": message.content}]
                })
            elif isinstance(message, AIMessage):
                messages.append({
                    "role": "assistant", 
                    "content": [{"type": "text", "text": message.content}]
                })
        
        return messages
    
    def prepare_inputs(self, messages: list) -> Dict[str, Any]:
        """
        Prepare model inputs from messages
        
        Args:
            messages: List of messages in model format
            
        Returns:
            Dict: Model inputs
        """
        inputs = self.processor.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt",
            max_length=settings.MAX_LENGTH,
            truncation=True
        )
        
        if self.device == "cuda":
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        return inputs
    
    def get_generation_kwargs(self) -> Dict[str, Any]:
        """
        Get generation parameters
        
        Returns:
            Dict: Generation parameters
        """
        return {
            "max_new_tokens": settings.MAX_NEW_TOKENS,
            "do_sample": True,
            "temperature": settings.TEMPERATURE,
            "top_p": settings.TOP_P,
            "top_k": settings.TOP_K,
            "repetition_penalty": settings.REPETITION_PENALTY,
            "use_cache": True,
        }
    
    def generate_response(self, inputs: Dict[str, Any]) -> str:
        """
        Generate a single response (non-streaming)
        
        Args:
            inputs: Model inputs
            
        Returns:
            str: Generated response
        """
        gen_kwargs = self.get_generation_kwargs()
        
        with torch.no_grad():
            outputs = self.model.generate(**inputs, **gen_kwargs)
            generated_tokens = outputs[0][inputs['input_ids'].shape[1]:]
            response = self.processor.tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()
        
        if self.device == "cuda":
            torch.cuda.empty_cache()
        
        return response
    
    def generate_streaming_response(self, inputs: Dict[str, Any]) -> Generator[str, None, None]:
        """
        Generate streaming response
        
        Args:
            inputs: Model inputs
            
        Yields:
            str: Response chunks in SSE format
        """
        streamer = TextIteratorStreamer(
            self.processor.tokenizer,
            skip_prompt=True,
            skip_special_tokens=True,
            timeout=60  # Increased from 30 seconds
        )
        
        gen_kwargs = self.get_generation_kwargs()
        gen_kwargs["streamer"] = streamer
        
        # Start generation thread
        generation_thread = Thread(
            target=self.model.generate,
            kwargs={**inputs, **gen_kwargs}
        )
        generation_thread.start()
        
        # Yield tokens
        full_response = ""
        try:
            for token in streamer:
                if token:
                    full_response += token
                    # Send in SSE format
                    yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"

        generation_thread.join()

        # Final message
        yield f"data: {json.dumps({'token': '', 'done': True, 'full_response': full_response})}\n\n"
        
        if self.device == "cuda":
            torch.cuda.empty_cache()
    
    def is_loaded(self) -> bool:
        """
        Check if model is loaded
        
        Returns:
            bool: True if model is loaded
        """
        return self.model is not None and self.processor is not None

# Global model manager instance
model_manager = ModelManager()