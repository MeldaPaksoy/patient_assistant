import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import patientAssistantApi, { AuthResponse, UserProfile, SignupRequest } from '@/services/patientAssistantApi';

interface User {
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  allergies?: string[];
  diseases?: string[];
  medications?: string[];
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  past_surgeries?: string[];
  has_active_session?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (signupData: SignupRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = patientAssistantApi.getToken();
        if (token && patientAssistantApi.isAuthenticated()) {
          const profile = await patientAssistantApi.getProfile();
          setUser({
            user_id: profile.user_id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
            gender: profile.gender,
            allergies: profile.allergies,
            diseases: profile.diseases,
            medications: profile.medications,
            age: profile.age,
            height_cm: profile.height_cm,
            weight_kg: profile.weight_kg,
            past_surgeries: profile.past_surgeries,
            has_active_session: profile.has_active_session,
          });
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        patientAssistantApi.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: AuthResponse = await patientAssistantApi.login(email, password);
      
      // Get profile after successful login
      const profile = await patientAssistantApi.getProfile();
      setUser({
        user_id: profile.user_id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        gender: profile.gender,
        allergies: profile.allergies,
        diseases: profile.diseases,
        medications: profile.medications,
        age: profile.age,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        past_surgeries: profile.past_surgeries,
        has_active_session: profile.has_active_session,
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (signupData: SignupRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: AuthResponse = await patientAssistantApi.signup(signupData);
      
      // Get profile after successful signup
      const profile = await patientAssistantApi.getProfile();
      setUser({
        user_id: profile.user_id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        gender: profile.gender,
        allergies: profile.allergies,
        diseases: profile.diseases,
        medications: profile.medications,
        age: profile.age,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        past_surgeries: profile.past_surgeries,
        has_active_session: profile.has_active_session,
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    patientAssistantApi.clearToken();
  };

  const updateProfile = async (profileData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedProfile = await patientAssistantApi.updateProfile(profileData);
      setUser({
        user_id: updatedProfile.user_id,
        email: updatedProfile.email,
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,
        gender: updatedProfile.gender,
        allergies: updatedProfile.allergies,
        diseases: updatedProfile.diseases,
        medications: updatedProfile.medications,
        age: updatedProfile.age,
        height_cm: updatedProfile.height_cm,
        weight_kg: updatedProfile.weight_kg,
        past_surgeries: updatedProfile.past_surgeries,
        has_active_session: updatedProfile.has_active_session,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await patientAssistantApi.getProfile();
      setUser({
        user_id: profile.user_id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        gender: profile.gender,
        allergies: profile.allergies,
        diseases: profile.diseases,
        medications: profile.medications,
        age: profile.age,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        past_surgeries: profile.past_surgeries,
        has_active_session: profile.has_active_session,
      });
    } catch (err) {
      console.error('Profile refresh failed:', err);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await patientAssistantApi.changePassword(oldPassword, newPassword);
      
      // Şifre değiştirme başarılı olduğunda kullanıcıyı çıkış yap
      logout();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await patientAssistantApi.deleteAccount(password);
      
      // Clear user data and logout
      setUser(null);
      patientAssistantApi.clearToken();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Account deletion failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('patient_assistant_token');
    if (token) {
      patientAssistantApi.setToken(token);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    refreshProfile,
    changePassword,
    deleteAccount,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 