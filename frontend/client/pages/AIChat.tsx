import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, LogIn, LogOut, Volume2, VolumeX, Plus, MessageSquare, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePatientAssistant } from "@/hooks/usePatientAssistant";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { tts, TTSStatus } from "@/lib/tts";
import patientAssistantApi from "@/services/patientAssistantApi";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  supports_tts?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  backendSessionId?: string; // Backend'den gelen gerçek session ID
}

interface TTSButtonProps {
  message: Message;
}

function TTSButton({ message }: TTSButtonProps) {
  const [ttsStatus, setTtsStatus] = useState<TTSStatus>('finished');

  const handleTTSClick = () => {
    if (!message.content || message.content.trim() === '') {
      console.warn('TTS: Message content is empty');
      return;
    }

    if (ttsStatus === 'playing') {
      tts.stop();
      setTtsStatus('finished');
    } else {
      tts.speak(message.content, setTtsStatus);
    }
  };

  if (!message.supports_tts || message.sender !== 'assistant' || !message.content || message.content.trim() === '') {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleTTSClick}
      className="h-6 w-6 p-1 hover:bg-muted transition-all"
      disabled={ttsStatus === 'unsupported'}
      title={ttsStatus === 'playing' ? 'Stop' : 'Play Audio'}
    >
      {ttsStatus === 'playing' ? (
        <VolumeX className="w-3 h-3" />
      ) : (
        <Volume2 className="w-3 h-3" />
      )}
    </Button>
  );
}

export default function AIChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [streamingMessages, setStreamingMessages] = useState<Record<string, string>>({});
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingSessionId, setStreamingSessionId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessageStream, isLoading, error, isAuthenticated } = usePatientAssistant();
  const { user, logout } = useAuth();

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const currentMessages = currentSession?.messages || [];
  const currentStreamingMessage = currentSessionId ? streamingMessages[currentSessionId] || "" : "";

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, currentStreamingMessage]);

  useEffect(() => {
    // Load sessions from localStorage when component mounts
    if (isAuthenticated && user) {
      const savedSessions = localStorage.getItem(`chat-sessions-${user.user_id}`);
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(sessionsWithDates);
        
        // Set the most recent session as current
        if (sessionsWithDates.length > 0) {
          const mostRecent = sessionsWithDates.sort((a: ChatSession, b: ChatSession) => 
            b.updatedAt.getTime() - a.updatedAt.getTime()
          )[0];
          setCurrentSessionId(mostRecent.id);
        }
      } else {
        // Create initial session with Turkish welcome message
        createNewSession();
      }
    }
  }, [isAuthenticated, user]);

  // Cleanup TTS when component unmounts
  useEffect(() => {
    return () => {
      tts.stop();
    };
  }, []);

  const saveSessionsToStorage = (updatedSessions: ChatSession[]) => {
    if (user) {
      localStorage.setItem(`chat-sessions-${user.user_id}`, JSON.stringify(updatedSessions));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateSessionTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6);
    return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
  };

  const createNewSession = () => {
    const newSessionId = Date.now().toString();
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: "Merhaba! Ben sizin sağlık asistanınızım. Size nasıl yardımcı olabilirim? Sağlık durumunuz, ilaçlarınız veya herhangi bir sağlık sorunuz hakkında konuşabiliriz.",
      sender: 'assistant',
      timestamp: new Date(),
      supports_tts: true
    };

    const newSession: ChatSession = {
      id: newSessionId,
      title: "Yeni Sohbet",
      messages: [welcomeMessage],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setCurrentSessionId(newSessionId);
    saveSessionsToStorage(updatedSessions);
  };

  const deleteSession = async (sessionId: string) => {
    // Session objesini bul
    const sessionToDelete = sessions.find(s => s.id === sessionId);
    
    try {
      // Eğer backend session ID varsa onu kullan, yoksa frontend session ID'yi kullan
      const backendSessionId = sessionToDelete?.backendSessionId || sessionId;
      
      // API'dan session'ı sil
      await patientAssistantApi.deleteSession(backendSessionId);
      console.log('Session silindi - Frontend ID:', sessionId, 'Backend ID:', backendSessionId);
    } catch (error) {
      console.error('Session silinirken hata:', error);
      // Hata durumunda bile local state'i güncelle
    }

    // Local state'i güncelle
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
    
    if (currentSessionId === sessionId) {
      if (updatedSessions.length > 0) {
        setCurrentSessionId(updatedSessions[0].id);
      } else {
        setCurrentSessionId(null);
        createNewSession();
      }
    }
  };

  const updateSessionTitle = (sessionId: string, newTitle: string) => {
    const updatedSessions = sessions.map(session => 
      session.id === sessionId 
        ? { ...session, title: newTitle, updatedAt: new Date() }
        : session
    );
    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
    setEditingSessionId(null);
    setEditingTitle("");
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isStreaming) return;
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    let sessionToUpdate = currentSession;
    let isNewSession = false;

    // If no current session, create one
    if (!sessionToUpdate) {
      createNewSession();
      sessionToUpdate = sessions[0];
      isNewSession = true;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    // Update session with user message
    const updatedSessions = sessions.map(session => 
      session.id === sessionToUpdate!.id 
        ? { 
            ...session, 
            messages: [...session.messages, userMessage],
            updatedAt: new Date(),
            // Update title if this is the first user message
            title: session.messages.filter(m => m.sender === 'user').length === 0 
              ? generateSessionTitle(inputMessage) 
              : session.title
          }
        : session
    );

    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
    setInputMessage("");
    setIsStreaming(true);
    setStreamingSessionId(sessionToUpdate!.id);
    setStreamingMessages(prev => ({ ...prev, [sessionToUpdate!.id]: "" }));

    try {      
      await sendMessageStream(
        inputMessage,
        (chunk: string) => {
          setStreamingMessages(prev => ({
            ...prev,
            [sessionToUpdate!.id]: (prev[sessionToUpdate!.id] || "") + chunk
          }));
        },
        (sessionId: string) => {
          // When streaming is complete, add the assistant message using the final streaming message
          setStreamingMessages(prevStreaming => {
            const finalStreamMessage = prevStreaming[sessionToUpdate!.id] || "";
            
            // Only add the message if there's actual content
            if (finalStreamMessage.trim()) {
              const assistantMessage: Message = {
                id: Date.now().toString(),
                content: finalStreamMessage,
                sender: 'assistant',
                timestamp: new Date(),
                supports_tts: true
              };

              setSessions(prevSessions => {
                const finalSessions = prevSessions.map(session => 
                  session.id === sessionToUpdate!.id 
                    ? { 
                        ...session, 
                        messages: [...session.messages, assistantMessage],
                        updatedAt: new Date(),
                        // Backend'den gelen gerçek session ID'yi sakla
                        backendSessionId: sessionId
                      }
                    : session
                );
                saveSessionsToStorage(finalSessions);
                return finalSessions;
              });
            }

            // Clear the streaming message for this session after a small delay to ensure smooth UI
            setTimeout(() => {
              setStreamingMessages(current => {
                const newStreamingMessages = { ...current };
                delete newStreamingMessages[sessionToUpdate!.id];
                return newStreamingMessages;
              });
            }, 100);

            return prevStreaming;
          });
          
          setIsStreaming(false);
          setStreamingSessionId(null);
        },
        (errorMessage: string) => {
          // Handle streaming errors
          console.error('Streaming error:', errorMessage);
          
          // Show error message to user
          const errorMsg: Message = {
            id: Date.now().toString(),
            content: `Error: ${errorMessage}`,
            sender: 'assistant',
            timestamp: new Date(),
            supports_tts: false
          };

          setSessions(prevSessions => {
            const finalSessions = prevSessions.map(session => 
              session.id === sessionToUpdate!.id 
                ? { 
                    ...session, 
                    messages: [...session.messages, errorMsg],
                    updatedAt: new Date()
                  }
                : session
            );
            saveSessionsToStorage(finalSessions);
            return finalSessions;
          });

          // Clear streaming state
          setStreamingMessages(prev => {
            const newStreamingMessages = { ...prev };
            delete newStreamingMessages[sessionToUpdate!.id];
            return newStreamingMessages;
          });
          setIsStreaming(false);
          setStreamingSessionId(null);
        },
        (sessionId: string) => {
          // Session başladığında backend session ID'yi kaydet
          console.log('Backend session ID alındı:', sessionId);
          setSessions(prevSessions => {
            const updatedSessions = prevSessions.map(session => 
              session.id === sessionToUpdate!.id 
                ? { ...session, backendSessionId: sessionId }
                : session
            );
            saveSessionsToStorage(updatedSessions);
            return updatedSessions;
          });
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setStreamingMessages(prev => {
        const newStreamingMessages = { ...prev };
        delete newStreamingMessages[sessionToUpdate!.id];
        return newStreamingMessages;
      });
      setIsStreaming(false);
      setStreamingSessionId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7FAFC]">
        <div className="text-center max-w-md mx-auto p-8">
          <Bot className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Assistant</h1>
          <p className="text-gray-600 mb-6">
            Please log in to start chatting with your personal health assistant.
          </p>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login to Continue
          </Button>
        </div>
        
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex h-[calc(100vh-4rem)] bg-white max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-gray-50 border-r border-gray-200 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Chat Sessions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              ×
            </Button>
          </div>
          <Button
            onClick={createNewSession}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group relative p-3 m-2 rounded-lg cursor-pointer transition-colors ${
                currentSessionId === session.id 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setCurrentSessionId(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {editingSessionId === session.id ? (
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => updateSessionTitle(session.id, editingTitle)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateSessionTitle(session.id, editingTitle);
                        }
                      }}
                      className="h-6 p-1 text-sm"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {session.title}
                    </h3>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {session.updatedAt.toLocaleDateString('tr-TR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSessionId(session.id);
                      setEditingTitle(session.title);
                    }}
                    className="h-6 w-6 p-1"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="h-6 w-6 p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            )}
            <Bot className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Health Assistant</h1>
              <p className="text-sm text-gray-500">Your personal healthcare companion</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`group flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'assistant' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-1 px-2">
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString('tr-TR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {message.sender === 'assistant' && <TTSButton message={message} />}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming Message */}
          {isStreaming && streamingSessionId === currentSessionId && currentStreamingMessage && (
            <div className="group flex gap-3 justify-start">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="max-w-[70%]">
                <div className="p-3 rounded-2xl bg-gray-100 text-gray-900">
                  <p className="text-sm whitespace-pre-wrap">{currentStreamingMessage}</p>
                  <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="inline-block bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Sağlığınız hakkında bir soru sorun..."
              className="flex-1"
              disabled={isLoading || isStreaming}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isStreaming}
              className="px-6"
            >
              {isLoading || isStreaming ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
