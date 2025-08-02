from pydantic import BaseModel
from typing import Optional, List, Dict

class ChatRequest(BaseModel):
    """Chat request model"""
    message: str
    stream: bool = True

class ChatResponse(BaseModel):
    """Chat response model"""
    response: str
    session_id: str
    supports_tts: bool = True  # Frontend TTS desteği var

class SessionInfo(BaseModel):
    """Session information model"""
    session_id: str
    message_count: int
    window_size: int
    user_id: str

class StreamingChatData(BaseModel):
    """Streaming chat data model"""
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    started: Optional[bool] = None
    token: Optional[str] = None
    done: Optional[bool] = None
    full_response: Optional[str] = None
    error: Optional[str] = None

# --- YENİ MODELLER (Sohbet Geçmişi İçin) ---

class ChatMessage(BaseModel):
    """Model for a single chat message in history."""
    message_content: str
    message_type: str # 'user' or 'ai'
    timestamp: str

class ChatSessionHistory(BaseModel):
    """Model for a historical chat session."""
    session_id: str
    messages: List[ChatMessage]

class UserChatHistory(BaseModel):
    """Model for a user's complete chat history."""
    user_id: str
    sessions: List[ChatSessionHistory]