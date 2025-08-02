import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageCircle, LogIn, LogOut, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import patientAssistantApi from "@/services/patientAssistantApi";
import { tts, TTSStatus } from "@/lib/tts";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  supports_tts?: boolean;
}

interface TTSButtonProps {
  message: Message;
}

function TTSButton({ message }: TTSButtonProps) {
  const [ttsStatus, setTtsStatus] = useState<TTSStatus>('finished');

  const handleTTSClick = () => {
    if (!message.content || message.content.trim() === '') {
      console.warn('TTS: Mesaj içeriği boş');
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
      className="h-6 w-6 p-1 hover:bg-muted"
      disabled={ttsStatus === 'unsupported'}
      title={ttsStatus === 'playing' ? 'Durdur' : 'Sesli oku'}
    >
      {ttsStatus === 'playing' ? (
        <VolumeX className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}
    </Button>
  );
}

interface ChatBotProps {
  enableStreaming?: boolean;
}

export function ChatBot({ enableStreaming = false }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Merhaba! Ben sağlık asistanınızım. Size nasıl yardımcı olabilirim?",
      sender: 'assistant',
      timestamp: new Date(),
      supports_tts: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, logout, isAuthenticated, error } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Cleanup TTS when component unmounts
  useEffect(() => {
    return () => {
      tts.stop();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    const currentInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (enableStreaming) {
        // Handle streaming response
        setIsStreaming(true);
        setStreamingMessage('');

        await patientAssistantApi.sendMessageStream(
          currentInput,
          (chunk) => {
            setStreamingMessage(prev => prev + chunk);
          },
          (sessionId) => {
            // Use current streamingMessage state
            setStreamingMessage(currentMessage => {
              const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: currentMessage,
                sender: 'assistant',
                timestamp: new Date(),
                supports_tts: true
              };
              setMessages(prev => [...prev, assistantMessage]);
              return '';
            });
            setIsStreaming(false);
            setIsLoading(false);
          },
          (error) => {
            console.error('Streaming error:', error);
            setIsStreaming(false);
            setIsLoading(false);
          }
        );
      } else {
        // Handle normal response
        const response = await patientAssistantApi.sendMessage(currentInput);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.response,
          sender: 'assistant',
          timestamp: new Date(),
          supports_tts: response.supports_tts
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.",
        sender: 'assistant',
        timestamp: new Date(),
        supports_tts: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    logout();
    setMessages([
      {
        id: '1',
        content: "Merhaba! Ben sağlık asistanınızım. Size nasıl yardımcı olabilirim?",
        sender: 'assistant',
        timestamp: new Date(),
        supports_tts: true
      }
    ]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-background border border-border rounded-xl shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-lexend font-semibold text-sm text-foreground">Sağlık Asistanı</h3>
              <p className="font-lexend text-xs text-muted-foreground">
                {isAuthenticated ? `Hoş geldin, ${user?.email}` : 'Giriş yapın'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="p-1 hover:bg-accent rounded-md transition-colors"
                title="Çıkış yap"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-1 hover:bg-accent rounded-md transition-colors"
                title="Giriş yap"
              >
                <LogIn className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-accent rounded-md transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'assistant' && (
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-foreground" />
                </div>
              )}
              <div
                className={`max-w-[280px] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-foreground'
                }`}
              >
                <p className="font-lexend text-sm leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`font-lexend text-xs ${
                    message.sender === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <TTSButton message={message} />
                </div>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {/* Streaming message */}
          {isStreaming && streamingMessage && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-foreground" />
              </div>
              <div className="bg-accent text-foreground rounded-lg p-3">
                <p className="font-lexend text-sm leading-relaxed">{streamingMessage}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <TTSButton message={{ 
                    id: 'streaming',
                    content: streamingMessage,
                    sender: 'assistant',
                    timestamp: new Date(),
                    supports_tts: true
                  }} />
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && !isStreaming && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-foreground" />
              </div>
              <div className="bg-accent text-foreground rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-red-600" />
              </div>
              <div className="bg-red-50 text-red-700 rounded-lg p-3">
                <p className="font-lexend text-sm">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isAuthenticated ? "Sağlık sorularınızı sorun..." : "Giriş yapın..."}
              className="flex-1 font-lexend text-sm"
              disabled={isLoading || !isAuthenticated}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !isAuthenticated}
              className="px-3 bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="font-lexend text-xs text-muted-foreground mt-2 text-center">
            {isAuthenticated 
              ? "AI Asistan hatalar yapabilir. Önemli bilgileri doğrulayın."
              : "Sohbet için giriş yapmanız gerekiyor."
            }
          </p>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
