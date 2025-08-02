import { useState, useCallback } from 'react';

interface LLMConfig {
  apiUrl?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface UseLLMProps {
  config?: LLMConfig;
}

export function useLLM({ config }: UseLLMProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // If you have your own LLM API endpoint, replace this with your implementation
      if (config?.apiUrl) {
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
          },
          body: JSON.stringify({
            message,
            model: config.model || 'default',
            temperature: config.temperature || 0.7,
            max_tokens: config.maxTokens || 1000,
            // Add any other parameters your LLM API expects
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Adjust this based on your API response structure
        return data.response || data.message || data.content || 'No response received';
      }

      // Fallback: Simulate a smart response based on the message content
      return generateSmartResponse(message);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  return {
    sendMessage,
    isLoading,
    error,
  };
}

// Smart fallback responses for demonstration
function generateSmartResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('headache') || lowerMessage.includes('pain')) {
    return "I understand you're experiencing headaches and pain. This can be concerning. To better assist you, could you describe:\n\n• The type of pain (throbbing, sharp, dull)\n• Location and intensity\n• How long you've been experiencing this\n• Any triggers you've noticed\n\nPlease remember to consult with a healthcare professional for proper diagnosis and treatment.";
  }

  if (lowerMessage.includes('fatigue') || lowerMessage.includes('tired')) {
    return "Fatigue can have many causes. It could be related to:\n\n• Sleep quality and duration\n• Stress levels\n• Diet and hydration\n• Underlying health conditions\n• Medication side effects\n\nI'd recommend tracking your sleep patterns and discussing persistent fatigue with your healthcare provider.";
  }

  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return "I can help you with appointment-related questions. Are you looking to:\n\n• Schedule a new appointment\n• Reschedule an existing appointment\n• Check upcoming appointments\n• Prepare for an upcoming visit\n\nPlease let me know what specific help you need with your appointments.";
  }

  if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
    return "I can provide general information about medications. Are you interested in:\n\n• Understanding side effects\n• Medication interactions\n• Dosage information\n• Reminders and scheduling\n\nAlways consult your healthcare provider or pharmacist for specific medical advice about your medications.";
  }

  if (lowerMessage.includes('symptom')) {
    return "I'm here to help you understand symptoms, though I cannot provide medical diagnosis. Please describe:\n\n• What symptoms you're experiencing\n• When they started\n• Severity (1-10 scale)\n• What makes them better or worse\n\nFor serious or persistent symptoms, please contact your healthcare provider.";
  }

  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
    return "⚠️ If this is a medical emergency, please:\n\n• Call 911 (US) or your local emergency number\n• Go to the nearest emergency room\n• Contact your doctor immediately\n\nI'm an AI assistant and cannot provide emergency medical care. Your safety is the top priority.";
  }

  // General health assistant response
  return "I'm your AI health assistant, here to help with general health information and guidance. I can assist with:\n\n• Symptom information\n• Medication questions\n• Appointment scheduling\n• Health and wellness tips\n• Preparation for medical visits\n\nWhat would you like to know about today? Please remember that I provide general information and cannot replace professional medical advice.";
}

// Example of how to use with your own LLM service
export function createLLMConfig(apiUrl: string, apiKey?: string): LLMConfig {
  return {
    apiUrl,
    apiKey,
    model: 'your-model-name',
    temperature: 0.7,
    maxTokens: 1000,
  };
}
