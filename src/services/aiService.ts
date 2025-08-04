// MODEL LAYER: Handles API communication with AI providers
import { APIProvider } from '@/types/chat';

// OpenAI API integration
const openaiProvider: APIProvider = {
  name: 'OpenAI',
  sendMessage: async (message: string, apiKey: string): Promise<string> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response';
  },
};

// Groq API integration
const groqProvider: APIProvider = {
  name: 'Groq',
  sendMessage: async (message: string, apiKey: string): Promise<string> => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response';
  },
};

export const aiProviders = {
  openai: openaiProvider,
  groq: groqProvider,
};

export class AIService {
  private provider: APIProvider;
  private apiKey: string;

  constructor(providerName: keyof typeof aiProviders, apiKey: string) {
    this.provider = aiProviders[providerName];
    this.apiKey = apiKey;
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    try {
      return await this.provider.sendMessage(message, this.apiKey);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  getProviderName(): string {
    return this.provider.name;
  }
}