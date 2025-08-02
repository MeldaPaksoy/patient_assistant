// Patient Assistant API Service
const API_BASE_URL = 'http://localhost:8000'; // Patient Assistant API URL

export interface AuthResponse {
  message: string;
  user_id?: string;
  token?: string;
}

export interface UserProfile {
  user_id: string;
  has_active_session: boolean;
  message: string;
  // Profile Fields
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
}

export interface SignupRequest {
  email: string;
  password: string;
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
}

export interface UpdateProfileRequest {
  email?: string;
  password?: string;
  height_cm?: number;
  weight_kg?: number;
  allergies?: string[];
  diseases?: string[];
  medications?: string[];
  past_surgeries?: string[];
}

export interface ChatRequest {
  message: string;
  stream?: boolean;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  supports_tts: boolean;
}

export interface SessionInfo {
  session_id: string;
  message_count: number;
  window_size: number;
  user_id: string;
}

export interface ChatMessage {
  message_content: string;
  message_type: string; // 'user' or 'ai'
  timestamp: string;
}

export interface ChatSessionHistory {
  session_id: string;
  messages: ChatMessage[];
}

export interface UserChatHistory {
  user_id: string;
  sessions: ChatSessionHistory[];
}

class PatientAssistantApiService {
  private token: string | null = null;
  private sessionId: string | null = null;

  constructor() {
    // Initialize token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('patient_assistant_token');
    }
  }

  // Authentication methods
  async signup(signupData: SignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    const data: AuthResponse = await response.json();
    if (data.token && typeof window !== 'undefined') {
      this.token = data.token;
      localStorage.setItem('patient_assistant_token', data.token);
    }
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    if (data.token && typeof window !== 'undefined') {
      this.token = data.token;
      localStorage.setItem('patient_assistant_token', data.token);
    }
    return data;
  }

  async getProfile(): Promise<UserProfile> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get profile');
    }

    return await response.json();
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update profile');
    }

    return await response.json();
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to reset password');
    }

    return await response.json();
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to change password');
    }

    return await response.json();
  }

  async deleteAccount(password: string): Promise<{ message: string }> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        password: password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete account');
    }

    const result = await response.json();
    this.clearToken();
    return result;
  }

  async deleteAccountOld(): Promise<{ message: string }> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/delete-account-old`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete account');
    }

    const result = await response.json();
    this.clearToken();
    return result;
  }

  // Chat methods
  async sendMessage(message: string): Promise<ChatResponse> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        message,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send message');
    }

    const data: ChatResponse = await response.json();
    this.sessionId = data.session_id;
    return data;
  }

  async sendMessageStream(
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: (sessionId: string) => void,
    onError?: (error: string) => void,
    onSessionStart?: (sessionId: string) => void // Yeni callback
  ): Promise<void> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    // AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 120000); // 2 minutes timeout

    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          message,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader');
      }

      const decoder = new TextDecoder();
      let sessionId = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.session_id && !sessionId) {
                  sessionId = data.session_id;
                  onSessionStart?.(sessionId); // Session başladığında callback çağır
                }
                
                if (data.token) {
                  onChunk(data.token);
                }
                
                if (data.done) {
                  onComplete(sessionId);
                  return;
                }
                
                if (data.error) {
                  onError?.(data.error);
                  return;
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          onError?.('Response timeout. The AI response may be too long.');
        } else {
          onError?.(error instanceof Error ? error.message : 'Stream error');
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        onError?.('Request timeout. Please try again.');
      } else {
        onError?.(error instanceof Error ? error.message : 'Connection error');
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getSessionInfo(): Promise<SessionInfo> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/chat/session`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get session info');
    }

    return await response.json();
  }

  async clearSession(): Promise<{ message: string }> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/chat/session`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to clear session');
    }

    const result = await response.json();
    this.sessionId = null;
    return result;
  }

  async getChatHistory(): Promise<UserChatHistory> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/chat/history`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get chat history');
    }

    return await response.json();
  }

  // Delete a specific session from Firestore
  async deleteSession(sessionId: string): Promise<{ message: string }> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete session');
    }

    return await response.json();
  }

  // Utility methods
  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('patient_assistant_token', token);
    }
  }

  clearToken(): void {
    this.token = null;
    this.sessionId = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('patient_assistant_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentSessionId(): string | null {
    return this.sessionId;
  }
}

// Export singleton instance
const patientAssistantApi = new PatientAssistantApiService();
export default patientAssistantApi;
