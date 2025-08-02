import uuid
from typing import Dict, Tuple, List
from langchain.memory import ConversationBufferWindowMemory
from app.config import settings
from app.auth.service import auth_service # Yeni import

class SessionManager:
    """Manages user chat sessions and memory"""
    
    def __init__(self):
        self.sessions: Dict[str, ConversationBufferWindowMemory] = {}
        self.user_sessions: Dict[str, str] = {}  # user_id -> session_id mapping
    
    def get_or_create_user_session(self, user_id: str) -> Tuple[str, ConversationBufferWindowMemory]:
        """
        Get existing session or create new one for user
        """
        if user_id in self.user_sessions:
            session_id = self.user_sessions[user_id]
            if session_id in self.sessions:
                return session_id, self.sessions[session_id]
        
        session_id = str(uuid.uuid4())
        memory = ConversationBufferWindowMemory(
            k=settings.MEMORY_WINDOW_SIZE,
            return_messages=True,
            memory_key="chat_history"
        )
        
        self.sessions[session_id] = memory
        self.user_sessions[user_id] = session_id
        
        return session_id, memory
    
    def has_user_session(self, user_id: str) -> bool:
        """
        Check if user has an active session
        """
        return user_id in self.user_sessions and self.user_sessions[user_id] in self.sessions
    
    def get_user_session_info(self, user_id: str) -> Dict:
        """
        Get session information for user
        """
        if not self.has_user_session(user_id):
            raise KeyError("Session not found")
        
        session_id = self.user_sessions[user_id]
        memory = self.sessions[session_id]
        
        return {
            "session_id": session_id,
            "message_count": len(memory.chat_memory.messages),
            "window_size": memory.k,
            "user_id": user_id
        }
    
    def clear_user_session(self, user_id: str):
        """
        Clear user's session from in-memory and Firestore chat history.
        """
        if user_id in self.user_sessions:
            session_id = self.user_sessions[user_id]
            if session_id in self.sessions:
                del self.sessions[session_id]
            del self.user_sessions[user_id]
        
        # Firestore'dan sohbet geçmişini sil
        auth_service.delete_user_chat_history(user_id)

    def clear_user_session_memory(self, user_id: str):
        """
        Clear user's current active session memory (in-memory).
        """
        if not self.has_user_session(user_id):
            raise KeyError("Session not found")
        
        session_id = self.user_sessions[user_id]
        self.sessions[session_id].clear()
        
    def clear_all_sessions(self):
        """Clear all sessions (in-memory)"""
        self.sessions.clear()
        self.user_sessions.clear()
        
    def get_all_sessions_info(self) -> list:
        """
        Get information about all active in-memory sessions
        """
        session_info = []
        for user_id, session_id in self.user_sessions.items():
            if session_id in self.sessions:
                memory = self.sessions[session_id]
                session_info.append({
                    "user_id": user_id,
                    "session_id": session_id,
                    "message_count": len(memory.chat_memory.messages),
                    "window_size": memory.k
                })
        return session_info
    
    def get_session_count(self) -> int:
        """
        Get total number of active in-memory sessions
        """
        return len(self.sessions)
    
    def get_user_count(self) -> int:
        """
        Get total number of users with active in-memory sessions
        """
        return len(self.user_sessions)
        
    def get_user_chat_history(self, user_id: str) -> Dict[str, List[Dict]]:
        """
        Retrieves a user's complete chat history from Firestore, grouped by session.
        """
        return auth_service.get_user_chat_history_from_db(user_id)

# Global session manager instance
session_manager = SessionManager()