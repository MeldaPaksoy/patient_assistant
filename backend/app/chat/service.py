from typing import Generator
from app.core import model_manager, session_manager
from .models import ChatRequest, ChatResponse
import json
import warnings
import numpy as np
import faiss
from app.auth.service import auth_service # Yeni import
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone

warnings.filterwarnings("ignore")

class RAGService:
    """RAG (Retrieval-Augmented Generation) Service for enhanced responses"""
    
    def __init__(self):
        # Pinecone setup
        self.pc = Pinecone(api_key="pcsk_2Kt7Yb_AnAP1pCZnzZRn1wmravyNemxCLFhdfQK33hqqq2mwV8ohENsHLCFUaNsmEbJnJT")
        self.pinecone_index = self.pc.Index("commit-index")
        
        # Embedding model
        self.embed_model = SentenceTransformer("all-MiniLM-L6-v2")
        
        # Use existing Firestore client from auth service
        self.db = None
        self._initialize_firestore()
        
        # FAISS indices (will be loaded lazily)
        self.questions_index = None
        self.myths_index = None
        self.questions_data = []
        self.myths_data = []
    
    def _initialize_firestore(self):
        """Initialize Firestore using auth service connection"""
        try:
            # Use the same Firestore client as auth service
            self.db = auth_service.db
            if self.db:
                print("✅ RAG Service: Firestore client initialized from auth service.")
            else:
                print("❌ RAG Service: Firestore client not available from auth service.")
        except Exception as e:
            print(f"❌ RAG Service: Firestore initialization failed: {e}")
            self.db = None
        
    def _load_firestore_data(self):
        """Load data from Firestore collections and create FAISS indices"""
        if self.questions_index is not None and self.myths_index is not None:
            return  # Already loaded
        
        if not self.db:
            print("❌ RAG Service: Firestore client not available. Skipping data loading.")
            return
            
        try:
            # Load questions collection
            questions_ref = self.db.collection('questions')
            questions_docs = questions_ref.stream()
            
            question_embeddings = []
            self.questions_data = []
            
            for doc in questions_docs:
                data = doc.to_dict()
                if 'prompt_embedding' in data:
                    question_embeddings.append(data['prompt_embedding'])
                    self.questions_data.append({
                        'id': doc.id,
                        'category': data.get('category', ''),
                        'prompt': data.get('prompt', ''),
                        'completion': data.get('completion', ''),
                        'source': 'Medical Q&A Dataset'
                    })
            
            # Load myth_facts collection
            myths_ref = self.db.collection('myth_facts')
            myths_docs = myths_ref.stream()
            
            myth_embeddings = []
            self.myths_data = []
            
            for doc in myths_docs:
                data = doc.to_dict()
                if 'embedding' in data:
                    myth_embeddings.append(data['embedding'])
                    self.myths_data.append({
                        'id': doc.id,
                        'myth': data.get('myth', ''),
                        'fact': data.get('fact', ''),
                        'section': data.get('section', ''),
                        'source': data.get('source', 'Health Facts Database')
                    })
            
            # Create FAISS indices with L2 norm
            if question_embeddings:
                question_embeddings = np.array(question_embeddings, dtype=np.float32)
                self.questions_index = faiss.IndexFlatL2(question_embeddings.shape[1])
                self.questions_index.add(question_embeddings)
                print(f"✅ RAG Service: Loaded {len(question_embeddings)} questions into FAISS index.")
                
            if myth_embeddings:
                myth_embeddings = np.array(myth_embeddings, dtype=np.float32)
                self.myths_index = faiss.IndexFlatL2(myth_embeddings.shape[1])
                self.myths_index.add(myth_embeddings)
                print(f"✅ RAG Service: Loaded {len(myth_embeddings)} myths/facts into FAISS index.")
                
        except Exception as e:
            print(f"❌ RAG Service: Error loading Firestore data: {e}")
            # Ensure indices are None if loading fails
            self.questions_index = None
            self.myths_index = None
    
    def pinecone_query(self, query_text: str, top_k: int = 3) -> tuple[str, list]:
        """Query Pinecone for relevant context"""
        try:
            vector = self.embed_model.encode(query_text).tolist()
            results = self.pinecone_index.query(vector=vector, top_k=top_k, include_metadata=True)
            
            contexts = []
            sources = []
            for match in results['matches']:
                metadata = match.get('metadata', {})
                completion = metadata.get('completion', '')
                if completion:
                    contexts.append(completion)
                    sources.append({
                        'source': 'Pinecone Database',
                        'score': match.get('score', 0),
                        'id': match.get('id', '')
                    })
            
            return "\n".join(contexts), sources
        except Exception as e:
            print(f"Pinecone query error: {e}")
            return "", []
    
    def firestore_query(self, query_text: str, top_k: int = 3) -> tuple[str, list]:
        """Query Firestore collections using FAISS similarity search"""
        if not self.db:
            print("❌ RAG Service: Firestore not available for query.")
            return "", []
            
        self._load_firestore_data()
        
        # Encode query
        query_vector = self.embed_model.encode(query_text).astype(np.float32).reshape(1, -1)
        
        contexts = []
        sources = []
        
        # Search in questions
        if self.questions_index and len(self.questions_data) > 0:
            distances, indices = self.questions_index.search(query_vector, min(top_k, len(self.questions_data)))
            for i, idx in enumerate(indices[0]):
                if idx < len(self.questions_data):
                    data = self.questions_data[idx]
                    contexts.append(f"Q: {data['prompt']}\nA: {data['completion']}")
                    sources.append({
                        'source': data['source'],
                        'category': data['category'],
                        'distance': float(distances[0][i]),
                        'type': 'Q&A'
                    })
        
        # Search in myths/facts
        if self.myths_index and len(self.myths_data) > 0:
            distances, indices = self.myths_index.search(query_vector, min(top_k, len(self.myths_data)))
            for i, idx in enumerate(indices[0]):
                if idx < len(self.myths_data):
                    data = self.myths_data[idx]
                    contexts.append(f"Myth: {data['myth']}\nFact: {data['fact']}")
                    sources.append({
                        'source': data['source'],
                        'section': data['section'],
                        'distance': float(distances[0][i]),
                        'type': 'Myth/Fact'
                    })
        
        return "\n\n".join(contexts), sources
    
    def get_enhanced_context(self, query_text: str) -> tuple[str, list]:
        """Get enhanced context from both Pinecone and Firestore"""
        pinecone_context, pinecone_sources = self.pinecone_query(query_text, top_k=2)
        firestore_context, firestore_sources = self.firestore_query(query_text, top_k=3)
        
        combined_context = []
        all_sources = []
        
        if firestore_context:
            combined_context.append("=== Medical Knowledge Base ===")
            combined_context.append(firestore_context)
            all_sources.extend(firestore_sources)
        
        if pinecone_context:
            combined_context.append("=== External Medical Database ===")
            combined_context.append(pinecone_context)
            all_sources.extend(pinecone_sources)
        
        return "\n\n".join(combined_context), all_sources

class ChatService:
    """Service for handling chat operations"""
    
    def __init__(self):
        self.model_manager = model_manager
        self.session_manager = session_manager
        self.rag_service = RAGService()
    
    def _enhance_message_with_rag(self, message: str, user_profile: dict) -> str:
        """Enhance user message with RAG context"""
        # Get relevant context from RAG
        context, sources = self.rag_service.get_enhanced_context(message)
        
        if not context:
            return message
        
        # Format enhanced prompt with context and sources
        enhanced_prompt = f"""Kullanıcı sorusu: {message}

İlgili bilgi kaynaklarından:
{context}

Kullanıcı profili: {user_profile}

Lütfen yukarıdaki güvenilir kaynaklardan gelen bilgileri kullanarak soruyu yanıtla. 
Yanıtının sonunda kullandığın kaynakları belirt.
Eğer kesin bir tıbbi tanı gerektiren bir durum varsa, mutlaka bir sağlık profesyoneline danışmasını öner.
Yanıtın eğitici ve bilgilendirici olsun, ancak tıbbi tavsiye yerine geçmediğini belirt."""

        return enhanced_prompt
    
    def generate_response(self, request: ChatRequest, user_id: str) -> ChatResponse:
        """
        Generate a single response (non-streaming) with RAG enhancement
        """
        if not self.model_manager.is_loaded():
            raise RuntimeError("Model not loaded")

        # Kullanıcı profilini al
        user_profile = auth_service.get_user_profile(user_id)
        
        session_id, memory = self.session_manager.get_or_create_user_session(user_id)
        
        # RAG ile mesajı güçlendir
        enhanced_message = self._enhance_message_with_rag(request.message, user_profile)
        
        messages = self.model_manager.memory_to_messages(memory, user_profile)
        messages.append({"role": "user", "content": [{"type": "text", "text": enhanced_message}]})
        
        inputs = self.model_manager.prepare_inputs(messages)
        
        response = self.model_manager.generate_response(inputs)
        
        memory.chat_memory.add_user_message(request.message)
        memory.chat_memory.add_ai_message(response)
        
        # Firestore'a kaydet
        auth_service.save_chat_message(user_id, session_id, request.message, "user")
        auth_service.save_chat_message(user_id, session_id, response, "ai")
        
        return ChatResponse(response=response, session_id=session_id)
    
    def generate_streaming_response(self, request: ChatRequest, user_id: str) -> Generator[str, None, None]:
        """
        Generate streaming response with RAG enhancement
        """
        if not self.model_manager.is_loaded():
            raise RuntimeError("Model not loaded")

        # Kullanıcı profilini al
        user_profile = auth_service.get_user_profile(user_id)
        
        session_id, memory = self.session_manager.get_or_create_user_session(user_id)
        
        try:
            yield f"data: {json.dumps({'session_id': session_id, 'user_id': user_id, 'started': True})}\n\n"
            
            # RAG ile mesajı güçlendir
            enhanced_message = self._enhance_message_with_rag(request.message, user_profile)
            
            messages = self.model_manager.memory_to_messages(memory, user_profile)
            messages.append({"role": "user", "content": [{"type": "text", "text": enhanced_message}]})
            
            inputs = self.model_manager.prepare_inputs(messages)
            
            full_response = ""
            for chunk in self.model_manager.generate_streaming_response(inputs):
                if 'full_response' in chunk:
                    data = json.loads(chunk.split('data: ')[1])
                    full_response = data.get('full_response', '')
                yield chunk
            
            if full_response:
                memory.chat_memory.add_user_message(request.message)
                memory.chat_memory.add_ai_message(full_response)
                
                # Firestore'a kaydet
                auth_service.save_chat_message(user_id, session_id, request.message, "user")
                auth_service.save_chat_message(user_id, session_id, full_response, "ai")
                
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"

# Global chat service instance
chat_service = ChatService()