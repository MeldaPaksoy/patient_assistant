import os
import pyrebase
import firebase_admin
from firebase_admin import credentials, auth as admin_auth, firestore 
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

# Initialize Firebase
firebase = pyrebase.initialize_app(settings.firebase_config)
auth = firebase.auth()

# Firebase Admin SDK (server-side operations)
admin_app = None
if settings.SERVICE_ACCOUNT_PATH and os.path.exists(settings.SERVICE_ACCOUNT_PATH):
    try:
        cred = credentials.Certificate(settings.SERVICE_ACCOUNT_PATH)
        admin_app = firebase_admin.initialize_app(cred) #
        print("✅ Firebase Admin SDK initialized")
    except Exception as e:
        print(f"⚠️ Firebase Admin SDK initialization failed: {e}")
else:
    print(f"⚠️ Service account file not found: {settings.SERVICE_ACCOUNT_PATH}")

# Security
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Verify Firebase authentication token and return user_id
    
    Args:
        credentials: HTTP Authorization credentials
        
    Returns:
        str: User ID from Firebase token
        
    Raises:
        HTTPException: If token is invalid
    """
    try:
        token = credentials.credentials
        # Firebase token verification
        decoded_token = auth.get_account_info(token)
        user_id = decoded_token['users'][0]['localId']
        return user_id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_firebase_auth():
    """Get Firebase auth instance"""
    return auth

def get_firebase_admin_auth():
    """Get Firebase admin auth instance (to access Firebase Admin SDK features like Firestore, Auth management)""" #
    return admin_app # (direkt admin_app döndürüyoruz, None ise zaten AuthService içinde kontrol edilecek)