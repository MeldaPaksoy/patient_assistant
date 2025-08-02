from pydantic import BaseModel, EmailStr
from typing import Optional, List

class SignupRequest(BaseModel):
    """User signup request model with additional profile fields.""" #
    email: EmailStr
    password: str
    first_name: Optional[str] = None #
    last_name: Optional[str] = None #
    gender: Optional[str] = None  # Cinsiyet bilgisi
    allergies: Optional[List[str]] = [] #
    diseases: Optional[List[str]] = [] #
    medications: Optional[List[str]] = [] #
    age: Optional[int] = None #
    height_cm: Optional[float] = None #
    weight_kg: Optional[float] = None #
    past_surgeries: Optional[List[str]] = [] #

class LoginRequest(BaseModel):
    """User login request model"""
    email: EmailStr
    password: str

class ResetPasswordRequest(BaseModel):
    """Password reset request model"""
    email: EmailStr

class AuthResponse(BaseModel):
    """Authentication response model"""
    message: str
    user_id: Optional[str] = None
    token: Optional[str] = None

class UserProfile(BaseModel):
    """User profile model with all fields stored in Firestore (except password)."""
    user_id: str
    has_active_session: bool
    message: str
    # Profile Fields (all stored in Firestore except password)
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None  # Cinsiyet bilgisi
    allergies: Optional[List[str]] = []
    diseases: Optional[List[str]] = []
    medications: Optional[List[str]] = []
    age: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    past_surgeries: Optional[List[str]] = []

class ChangePasswordRequest(BaseModel):
    """Password change request model"""
    old_password: str
    new_password: str

class DeleteAccountRequest(BaseModel):
    """Account deletion request model"""
    password: str

class UpdateProfileRequest(BaseModel):
    """User profile update request model - only updatable fields."""
    email: Optional[EmailStr] = None  # Email değişebilir
    password: Optional[str] = None    # Şifre değişebilir
    height_cm: Optional[float] = None  # Boy değişebilir
    weight_kg: Optional[float] = None  # Kilo değişebilir
    allergies: Optional[List[str]] = None
    diseases: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    past_surgeries: Optional[List[str]] = None