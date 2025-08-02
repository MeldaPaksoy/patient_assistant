import os
from dotenv import load_dotenv
import warnings

warnings.filterwarnings("ignore")

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(dotenv_path=env_path)

class Settings:
    """Application settings"""
    
    # FastAPI Settings
    TITLE = "Patient Assistant API"
    DESCRIPTION = "Sağlık asistanı chatbot API'si with Firebase Authentication"
    VERSION = "1.0.0"
    
    # Firebase Configuration
    API_KEY = os.getenv("API_KEY")
    MESSAGING_SENDER_ID = os.getenv("MESSAGING_SENDER_ID")
    APP_ID = os.getenv("APP_ID")
    SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    
    # Pinecone Configuration
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "commit-index")
    
    # Model Configuration
    MODEL_ID = "google/medgemma-4b-it"
    
    # Generation Parameters
    MAX_NEW_TOKENS = 512  # Increased for complete responses
    TEMPERATURE = 0.3  # Balanced between creativity and consistency
    TOP_P = 0.8  # Reasonable focused selection
    TOP_K = 40  # Reasonable token selection
    REPETITION_PENALTY = 1.1  # Moderate repetition penalty
    
    # Memory Configuration
    MEMORY_WINDOW_SIZE = 8
    MAX_LENGTH = 4096
    
    @property
    def firebase_config(self):
        """Firebase configuration dictionary"""
        return {
            "apiKey": self.API_KEY,
            "authDomain": "patient-assistant-auth.firebaseapp.com",
            "projectId": "patient-assistant-auth",
            "storageBucket": "patient-assistant-auth.firebasestorage.app",
            "messagingSenderId": self.MESSAGING_SENDER_ID,
            "appId": self.APP_ID,
            "databaseURL": ""
        }
    
    @property
    def is_firebase_configured(self):
        """Check if Firebase is properly configured"""
        return all([self.API_KEY, self.MESSAGING_SENDER_ID, self.APP_ID])

settings = Settings()