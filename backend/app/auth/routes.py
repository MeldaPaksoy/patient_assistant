from fastapi import APIRouter, HTTPException, Depends
from .models import SignupRequest, LoginRequest, ResetPasswordRequest, AuthResponse, UserProfile, UpdateProfileRequest, ChangePasswordRequest, DeleteAccountRequest
from .dependencies import verify_token, get_firebase_auth, get_firebase_admin_auth
from app.core.session_manager import session_manager
import firebase_admin.auth as admin_auth
from app.auth.service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """
    User registration endpoint, creates Firebase Auth user and saves all data except password to Firestore.
    """
    try:
        auth = get_firebase_auth()
        
        # Firebase Auth'ta email ve password ile kullanıcı oluştur
        user = auth.create_user_with_email_and_password(request.email, request.password)
        user_id = user['localId']

        # Tüm bilgileri (şifre hariç) Firestore'a kaydet
        profile_data = request.dict(exclude_unset=True)
        profile_data['email'] = request.email
        profile_data.pop('password', None)  # Şifreyi Firestore'a kaydetme
        
        for field in ['allergies', 'diseases', 'medications', 'past_surgeries']:
            if field not in profile_data or profile_data[field] is None:
                profile_data[field] = []
        
        auth_service.create_user_profile(user_id, profile_data)

        return AuthResponse(
            message="Kayıt başarılı!",
            user_id=user_id,
            token=user['idToken']
        )
    except Exception as e:
        error_msg = str(e)
        if "EMAIL_EXISTS" in error_msg:
            raise HTTPException(status_code=400, detail="Email zaten kullanımda!")
        elif "WEAK_PASSWORD" in error_msg:
            raise HTTPException(status_code=400, detail="Parola çok zayıf! En az 6 karakter olmalı.")
        else:
            raise HTTPException(status_code=400, detail=f"Kayıt hatası: {error_msg}")


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    User login endpoint
    
    Args:
        request: LoginRequest containing email and password
        
    Returns:
        AuthResponse: Login result with user info and token
    """
    try:
        auth = get_firebase_auth()
        user = auth.sign_in_with_email_and_password(request.email, request.password)
        return AuthResponse(
            message="Giriş başarılı!",
            user_id=user['localId'],
            token=user['idToken']
        )
    except Exception as e:
        error_msg = str(e)
        if "INVALID_EMAIL" in error_msg or "EMAIL_NOT_FOUND" in error_msg:
            raise HTTPException(status_code=401, detail="Email bulunamadı!")
        elif "INVALID_PASSWORD" in error_msg:
            raise HTTPException(status_code=401, detail="Yanlış parola!")
        else:
            raise HTTPException(status_code=401, detail="Eposta veya parola yanlış!")

@router.post("/reset-password", response_model=AuthResponse)
async def reset_password(request: ResetPasswordRequest):
    """
    Password reset endpoint
    
    Args:
        request: ResetPasswordRequest containing email
        
    Returns:
        AuthResponse: Password reset result
    """
    try:
        auth = get_firebase_auth()
        auth.send_password_reset_email(request.email)
        return AuthResponse(message="Şifre sıfırlama e-postası gönderildi.")
    except Exception as e:
        error_msg = str(e)
        if "EMAIL_NOT_FOUND" in error_msg:
            raise HTTPException(status_code=404, detail="Email bulunamadı!")
        else:
            raise HTTPException(status_code=400, detail=f"E-posta gönderilemedi: {error_msg}")

@router.put("/change-password", response_model=AuthResponse)
async def change_password(request: ChangePasswordRequest, user_id: str = Depends(verify_token)):
    """
    Change user password after verifying old password.
    """
    try:
        # Önce eski şifreyi doğrula
        auth = get_firebase_auth()
        
        # Kullanıcının email adresini al
        user_profile = auth_service.get_user_profile(user_id)
        if not user_profile or not user_profile.get('email'):
            raise HTTPException(status_code=400, detail="Kullanıcı email adresi bulunamadı!")
        
        email = user_profile['email']
        
        # Eski şifreyi doğrula (giriş yaparak)
        try:
            auth.sign_in_with_email_and_password(email, request.old_password)
        except Exception as e:
            error_msg = str(e)
            if "INVALID_PASSWORD" in error_msg or "INVALID_LOGIN_CREDENTIALS" in error_msg:
                raise HTTPException(status_code=400, detail="Mevcut şifre yanlış!")
            else:
                raise HTTPException(status_code=400, detail="Şifre doğrulanamadı!")
        
        # Yeni şifreyi güncelle
        admin_auth.update_user(user_id, password=request.new_password)
        
        return AuthResponse(message="Şifre başarıyla değiştirildi.")
        
    except HTTPException:
        raise
    except admin_auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı!")
    except Exception as e:
        error_msg = str(e)
        if "WEAK_PASSWORD" in error_msg:
            raise HTTPException(status_code=400, detail="Yeni şifre çok zayıf! En az 6 karakter olmalı.")
        else:
            raise HTTPException(status_code=400, detail=f"Şifre değiştirilemedi: {error_msg}")

@router.delete("/delete-account", response_model=AuthResponse)
async def delete_account(request: DeleteAccountRequest, user_id: str = Depends(verify_token)):
    """
    Account deletion endpoint with password verification.
    """
    try:
        # Önce şifreyi doğrula
        auth = get_firebase_auth()
        
        # Kullanıcının email adresini al
        user_profile = auth_service.get_user_profile(user_id)
        if not user_profile or not user_profile.get('email'):
            raise HTTPException(status_code=400, detail="Kullanıcı email adresi bulunamadı!")
        
        email = user_profile['email']
        
        # Şifreyi doğrula (giriş yaparak)
        try:
            auth.sign_in_with_email_and_password(email, request.password)
        except Exception as e:
            error_msg = str(e)
            if "INVALID_PASSWORD" in error_msg or "INVALID_LOGIN_CREDENTIALS" in error_msg:
                raise HTTPException(status_code=400, detail="Şifre yanlış!")
            else:
                raise HTTPException(status_code=400, detail="Şifre doğrulanamadı!")
        
        # Şifre doğru ise hesabı sil
        # Önce session'ı temizle
        session_manager.clear_user_session(user_id)
        
        # Firestore'dan kullanıcı verilerini sil
        auth_service.delete_user_profile(user_id)
        auth_service.delete_user_chat_history(user_id)
        
        # Firebase Auth'tan kullanıcıyı sil
        admin_auth.delete_user(user_id)
        
        return AuthResponse(message="Hesap başarıyla silindi.")
            
    except HTTPException:
        raise
    except admin_auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı!")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Hesap silinemedi: {str(e)}")

@router.delete("/delete-account-old", response_model=AuthResponse)
async def delete_account_old(user_id: str = Depends(verify_token)):
    """
    Account deletion endpoint, deletes Firebase Auth user and their profile data from Firestore.
    """
    try:
        # Önce session'ı temizle
        session_manager.clear_user_session(user_id)
        
        # Firestore'dan kullanıcı verilerini sil
        auth_service.delete_user_profile(user_id)
        auth_service.delete_user_chat_history(user_id)
        
        # Firebase Auth'tan kullanıcıyı sil
        admin_auth.delete_user(user_id)
        
        return AuthResponse(message="Hesap başarıyla silindi.")
            
    except admin_auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı!")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Hesap silinemedi: {str(e)}")

@router.put("/update-profile", response_model=AuthResponse)
async def update_profile(request: UpdateProfileRequest, user_id: str = Depends(verify_token)):
    """
    Update user profile information in Firestore and optionally update email/password in Firebase Auth.
    """
    try:
        profile_data = request.dict(exclude_unset=True)
        
        # Şifreyi Firestore'a gönderilecek verilerden çıkar
        profile_data.pop('password', None)
        
        # Email ve şifre güncelleme işlemleri
        if request.email or request.password:
            update_data = {}
            if request.email:
                update_data['email'] = request.email
            if request.password:
                update_data['password'] = request.password
            
            # Firebase Auth'ta güncelle
            admin_auth.update_user(user_id, **update_data)
        
        # Firestore'da profil bilgilerini güncelle (şifre hariç)
        auth_service.update_user_profile(user_id, profile_data)
        
        return AuthResponse(message="Profil başarıyla güncellendi.")
    except admin_auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı!")
    except admin_auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Bu email adresi zaten kullanımda!")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Profil güncellenemedi: {str(e)}")

@router.get("/profile", response_model=UserProfile)
async def get_profile(user_id: str = Depends(verify_token)):
    """
    Get user profile information from Firestore.
    """
    try:
        has_active_session = session_manager.has_user_session(user_id)
        
        # Firestore'dan profil bilgilerini al
        profile_data = auth_service.get_user_profile(user_id)
        
        profile_response_data = {
            "user_id": user_id,
            "has_active_session": has_active_session,
            "message": "Profil başarıyla alındı"
        }
        
        if profile_data:
            profile_response_data.update(profile_data)
        
        return UserProfile(**profile_response_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))