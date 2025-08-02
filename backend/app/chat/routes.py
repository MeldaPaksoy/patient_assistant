from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from .models import ChatRequest, ChatResponse, SessionInfo, UserChatHistory, ChatSessionHistory, ChatMessage #
from .service import chat_service
from app.auth import verify_token
from app.core import session_manager
from typing import List

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, user_id: str = Depends(verify_token)):
    """
    Normal chat endpoint (non-streaming)
    
    Args:
        request: Chat request containing message
        user_id: User ID from token verification
        
    Returns:
        ChatResponse: Generated response with session info
    """
    try:
        return chat_service.generate_response(request, user_id)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def chat_stream_endpoint(request: ChatRequest, user_id: str = Depends(verify_token)):
    """
    Streaming chat endpoint
    
    Args:
        request: Chat request containing message
        user_id: User ID from token verification
        
    Returns:
        StreamingResponse: Server-sent events with response chunks
    """
    try:
        return StreamingResponse(
            chat_service.generate_streaming_response(request, user_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
            }
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session", response_model=SessionInfo)
async def get_session_info(user_id: str = Depends(verify_token)):
    """
    Get user's current active session information
    
    Args:
        user_id: User ID from token verification
        
    Returns:
        SessionInfo: Session information
    """
    try:
        session_info = session_manager.get_user_session_info(user_id)
        return SessionInfo(**session_info)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session bulunamadı")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/session")
async def clear_session(user_id: str = Depends(verify_token)):
    """
    Clear user's current active session memory (in-memory LangChain buffer).
    The full chat history in the database for this session is NOT cleared by this endpoint.
    
    Args:
        user_id: User ID from token verification
        
    Returns:
        dict: Success message
    """
    try:
        session_manager.clear_user_session_memory(user_id)
        return {"message": "Aktif session belleği temizlendi."} #
    except KeyError:
        raise HTTPException(status_code=404, detail="Session bulunamadı")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/session/{session_id}")
async def delete_session(session_id: str, user_id: str = Depends(verify_token)):
    """
    Delete a specific session and all its messages from Firestore
    
    Args:
        session_id: Session ID to delete
        user_id: User ID from token verification
        
    Returns:
        dict: Success message with deleted count
    """
    try:
        from app.auth.service import auth_service
        deleted_count = auth_service.delete_chat_session(user_id, session_id)
        
        # Memory'den de sil eğer aktif session ise
        try:
            current_session_info = session_manager.get_user_session_info(user_id)
            if current_session_info.get("session_id") == session_id:
                session_manager.clear_user_session_memory(user_id)
        except KeyError:
            pass  # Session zaten yok
        
        return {"message": f"Session {session_id} silindi. {deleted_count} mesaj silindi."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=UserChatHistory) # (YENİ ENDPOINT)
async def get_chat_history(user_id: str = Depends(verify_token)): #
    """
    Get a user's complete chat history from the database, grouped by session.
    
    Args:
        user_id: User ID from token verification
        
    Returns:
        UserChatHistory: A list of chat sessions with their messages.
    """
    try:
        raw_history = session_manager.get_user_chat_history(user_id) #
        
        sessions_list: List[ChatSessionHistory] = [] #
        for session_id, messages_data in raw_history.items(): #
            chat_messages: List[ChatMessage] = [ChatMessage(**msg) for msg in messages_data] #
            sessions_list.append(ChatSessionHistory(session_id=session_id, messages=chat_messages)) #
        
        return UserChatHistory(user_id=user_id, sessions=sessions_list) #
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sohbet geçmişi getirilirken hata oluştu: {str(e)}") #