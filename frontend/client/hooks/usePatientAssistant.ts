import { useState, useCallback } from 'react';
import patientAssistantApi from '@/services/patientAssistantApi';
import { useAuth } from '@/contexts/AuthContext';

interface UsePatientAssistantProps {
  enableStreaming?: boolean;
}

export function usePatientAssistant({ enableStreaming = false }: UsePatientAssistantProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    if (!isAuthenticated) {
      throw new Error('Authentication required. Please login first.');
    }

    setIsLoading(true);
    setError(null);

    try {
      if (enableStreaming) {
        // For streaming, we'll return a promise that resolves with the full response
        return new Promise((resolve, reject) => {
          let fullResponse = '';
          
          patientAssistantApi.sendMessageStream(
            message,
            (chunk) => {
              fullResponse += chunk;
            },
            (sessionId) => {
              resolve(fullResponse);
            }
          ).catch(reject);
        });
      } else {
        const response = await patientAssistantApi.sendMessage(message);
        return response.response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, enableStreaming]);

  const sendMessageStream = useCallback(async (
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: (sessionId: string) => void,
    onError?: (error: string) => void,
    onSessionStart?: (sessionId: string) => void
  ): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Authentication required. Please login first.');
    }

    setIsLoading(true);
    setError(null);

    try {
      await patientAssistantApi.sendMessageStream(message, onChunk, onComplete, onError, onSessionStart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    sendMessageStream,
    isLoading,
    error,
    clearError,
    isAuthenticated,
  };
} 