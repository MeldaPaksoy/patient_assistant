from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.auth import router as auth_router
from app.chat import router as chat_router
from app.core import model_manager, session_manager
import uvicorn
# app.database importunu kaldırın

# Create FastAPI app
app = FastAPI(
    title=settings.TITLE,
    description=settings.DESCRIPTION,
    version=settings.VERSION
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(chat_router)

# Admin routes
admin_router = APIRouter(prefix="/admin", tags=["Admin"])

@admin_router.delete("/sessions")
async def clear_all_sessions_endpoint():
    """Clear all sessions (Admin endpoint)"""
    session_manager.clear_all_sessions()
    return {"message": "Tüm session'lar temizlendi"}

@admin_router.get("/sessions")
async def list_all_sessions():
    """List all active sessions (Admin endpoint)"""
    sessions_info = session_manager.get_all_sessions_info()
    return {"sessions": sessions_info}

app.include_router(admin_router)

# System endpoints
@app.get("/health")
async def health_check():
    """System health check"""
    return {
        "status": "healthy",
        "model_loaded": model_manager.is_loaded(),
        "device": model_manager.device,
        "active_sessions": session_manager.get_session_count(),
        "active_users": session_manager.get_user_count(),
        "firebase_configured": settings.is_firebase_configured
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Patient Assistant API",
        "version": settings.VERSION,
        "endpoints": {
            "auth": {
                "signup": "/auth/signup",
                "login": "/auth/login",
                "reset_password": "/auth/reset-password",
                "delete_account": "/auth/delete-account",
                "profile": "/auth/profile"
            },
            "chat": {
                "chat": "/chat/",
                "chat_stream": "/chat/stream",
                "session_info": "/chat/session",
                "clear_session": "/chat/session",
                "history": "/chat/history"
            },
            "admin": {
                "all_sessions": "/admin/sessions",
                "clear_all_sessions": "/admin/sessions"
            },
            "system": {
                "health": "/health",
                "docs": "/docs"
            }
        }
    }

@app.on_event("startup")
async def startup_event():
    """Application startup event"""
    # SQLite initialization code has been removed.
    # check Firebase configuration
    if not settings.is_firebase_configured:
        print("⚠️ Firebase yapılandırması eksik!")
    else:
        print("✅ Firebase yapılandırması tamam")
    
    # Load ML model
    try:
        print("🔄 Model yükleniyor...")
        model_manager.load_model()
        print("✅ Model başarıyla yüklendi!")
    except Exception as e:
        print(f"❌ Model yükleme hatası: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event"""
    print("🔄 Uygulama kapatılıyor...")
    session_manager.clear_all_sessions()
    print("✅ Uygulama kapatıldı")

def run_server():
    """Run the FastAPI server"""
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

if __name__ == "__main__":
    run_server()