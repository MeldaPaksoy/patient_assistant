from typing import Dict, Any, Optional, List
from firebase_admin import firestore
from firebase_admin import auth as admin_auth
from app.auth.dependencies import get_firebase_admin_auth

class AuthService:
    """Service for handling Firebase user profile and chat history operations."""
    def __init__(self):
        self.db = None
        self._initialize_firestore()

    def _initialize_firestore(self):
        """Initializes Firestore client if admin app is available."""
        admin_app = get_firebase_admin_auth()
        if admin_app:
            try:
                self.db = firestore.client(app=admin_app)
                print("✅ Firestore client initialized.")
            except Exception as e:
                print(f"❌ Firestore client initialization failed: {e}")
        else:
            print("⚠️ Firebase Admin SDK not initialized, cannot access Firestore.")

    def get_user_from_firebase_auth(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Gets user information from Firebase Auth.
        """
        try:
            user_record = admin_auth.get_user(user_id)
            return {
                "email": user_record.email,
                "display_name": user_record.display_name,
                "email_verified": user_record.email_verified,
                "created_at": user_record.user_metadata.creation_timestamp,
                "last_sign_in": user_record.user_metadata.last_sign_in_timestamp
            }
        except admin_auth.UserNotFoundError:
            return None
        except Exception as e:
            print(f"❌ Error getting user from Firebase Auth: {e}")
            return None

    def create_user_profile(self, user_id: str, profile_data: Dict[str, Any]):
        """
        Saves extended user profile data to Firestore.
        """
        if not self.db:
            raise RuntimeError("Firestore client not initialized.")
        user_profile_ref = self.db.collection("user_profiles").document(user_id)
        user_profile_ref.set(profile_data)
        print(f"✅ User profile created for {user_id} in Firestore.")

    def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves user profile data from Firestore only.
        """
        if not self.db:
            print("⚠️ Firestore client not initialized, returning empty profile.")
            return None
        
        user_profile_ref = self.db.collection("user_profiles").document(user_id)
        doc = user_profile_ref.get()
        if doc.exists:
            return doc.to_dict()
        return None

    def update_user_profile(self, user_id: str, profile_data: Dict[str, Any]):
        """
        Updates user profile data in Firestore.
        """
        if not self.db:
            raise RuntimeError("Firestore client not initialized.")
        
        # Boş liste alanlarını koru
        existing_data = self.get_user_profile(user_id)
        if existing_data:
            for field in ['allergies', 'diseases', 'medications', 'past_surgeries']:
                if field not in profile_data or profile_data[field] is None:
                    if field in existing_data:
                        profile_data[field] = existing_data[field]
                    else:
                        profile_data[field] = []
        
        user_profile_ref = self.db.collection("user_profiles").document(user_id)
        user_profile_ref.update(profile_data)
        print(f"✅ User profile updated for {user_id} in Firestore.")

    def delete_user_profile(self, user_id: str):
        """
        Deletes user profile data from Firestore.
        """
        if not self.db:
            raise RuntimeError("Firestore client not initialized.")
        user_profile_ref = self.db.collection("user_profiles").document(user_id)
        user_profile_ref.delete()
        print(f"✅ User profile deleted for {user_id} from Firestore.")

    # --- YENİ SOHBET GEÇMİŞİ METOTLARI ---

    def save_chat_message(self, user_id: str, session_id: str, message_content: str, message_type: str):
        """Saves a single chat message to the Firestore database."""
        if not self.db:
            raise RuntimeError("Firestore client not initialized.")
        
        # Her mesajı benzersiz bir belge olarak kaydet
        chat_ref = self.db.collection("chat_history").document()
        chat_ref.set({
            "user_id": user_id,
            "session_id": session_id,
            "message_content": message_content,
            "message_type": message_type,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        print(f"✅ Chat message saved for user {user_id} in Firestore.")

    def get_user_chat_history_from_db(self, user_id: str) -> Dict[str, List[Dict]]:
        """
        Retrieves all chat messages for a given user from Firestore, grouped by session_id.
        """
        if not self.db:
            print("⚠️ Firestore client not initialized, returning empty history.")
            return {}
        
        chats_ref = self.db.collection("chat_history").where("user_id", "==", user_id).stream()
        history_by_session = {}
        for doc in chats_ref:
            doc_data = doc.to_dict()
            session_id = doc_data["session_id"]
            if session_id not in history_by_session:
                history_by_session[session_id] = []
            history_by_session[session_id].append({
                "message_content": doc_data["message_content"],
                "message_type": doc_data["message_type"],
                "timestamp": doc_data["timestamp"].isoformat() if doc_data.get("timestamp") else "N/A"
            })
        return history_by_session

    def delete_user_chat_history(self, user_id: str):
        """
        Deletes all chat messages for a specific user from Firestore.
        """
        if not self.db:
            raise RuntimeError("Firestore client not initialized.")
            
        chats_ref = self.db.collection("chat_history").where("user_id", "==", user_id).stream()
        for doc in chats_ref:
            doc.reference.delete()
        print(f"✅ All chat history deleted for user {user_id} from Firestore.")

    def delete_chat_session(self, user_id: str, session_id: str):
        """
        Deletes all chat messages for a specific session from Firestore.
        """
        if not self.db:
            raise RuntimeError("Firestore client not initialized.")
            
        chats_ref = self.db.collection("chat_history").where("user_id", "==", user_id).where("session_id", "==", session_id).stream()
        deleted_count = 0
        for doc in chats_ref:
            doc.reference.delete()
            deleted_count += 1
        print(f"✅ {deleted_count} messages deleted for session {session_id} of user {user_id} from Firestore.")
        return deleted_count

auth_service = AuthService()