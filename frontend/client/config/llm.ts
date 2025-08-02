// LLM Configuration for Patient Assistant
// Update these settings to connect your own LLM

export const LLM_CONFIG = {
  // Set your LLM API endpoint here
  apiUrl: process.env.VITE_LLM_API_URL || '', // e.g., 'https://your-api.com/v1/chat'
  
  // Set your API key (use environment variables for security)
  apiKey: process.env.VITE_LLM_API_KEY || '',
  
  // Set your model name
  model: process.env.VITE_LLM_MODEL || 'your-model-name',
  
  // Temperature for response creativity (0-1)
  temperature: 0.7,
  
  // Maximum tokens for response length
  maxTokens: 1000,
  
  // Additional headers if needed
  headers: {
    'Content-Type': 'application/json',
    // Add any custom headers your API requires
  }
};

// Health-focused system prompt for your LLM
export const HEALTH_SYSTEM_PROMPT = `You are a helpful AI health assistant for Patient Assistant, a health management application. Your role is to:

1. Provide general health information and guidance
2. Help users understand symptoms (without diagnosing)
3. Assist with appointment scheduling and medication reminders
4. Offer wellness tips and health education
5. Direct users to seek professional medical care when appropriate

Important guidelines:
- Never provide medical diagnoses or treatment recommendations
- Always remind users to consult healthcare professionals for medical advice
- Be empathetic and supportive
- Use clear, non-technical language
- Ask clarifying questions to better understand user needs
- Emphasize safety and encourage emergency care when necessary

Keep responses helpful, accurate, and within your scope as a health information assistant.`;

// Example integration patterns for different LLM providers
export const INTEGRATION_EXAMPLES = {
  // OpenAI-compatible API
  openai: {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    requestFormat: {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: HEALTH_SYSTEM_PROMPT },
        { role: 'user', content: 'USER_MESSAGE_HERE' }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }
  },
  
  // Anthropic Claude
  anthropic: {
    apiUrl: 'https://api.anthropic.com/v1/messages',
    requestFormat: {
      model: 'claude-3-sonnet-20240229',
      system: HEALTH_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: 'USER_MESSAGE_HERE' }
      ],
      max_tokens: 1000
    }
  },
  
  // Custom self-hosted LLM
  custom: {
    apiUrl: 'https://your-llm-server.com/api/chat',
    requestFormat: {
      prompt: 'USER_MESSAGE_HERE',
      system: HEALTH_SYSTEM_PROMPT,
      temperature: 0.7,
      max_length: 1000
    }
  }
};
