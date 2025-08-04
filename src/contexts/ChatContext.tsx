// PRESENTER LAYER: State management and business logic
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Message, ChatState } from '@/types/chat';
import { AIService } from '@/services/aiService';

interface ChatContextType extends ChatState {
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  setApiKey: (key: string) => void;
  setProvider: (provider: 'openai' | 'groq') => void;
  apiKey: string | null;
  currentProvider: string;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_LAST_MESSAGE'; payload: { text: string; isLoading: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case 'UPDATE_LAST_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg, index) =>
          index === state.messages.length - 1
            ? { ...msg, text: action.payload.text, isLoading: action.payload.isLoading }
            : msg
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [], error: null };
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [apiKey, setApiKeyState] = React.useState<string | null>(
    localStorage.getItem('ai-api-key')
  );
  const [currentProvider, setCurrentProviderState] = React.useState<'openai' | 'groq'>(
    (localStorage.getItem('ai-provider') as 'openai' | 'groq') || 'groq'
  );

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('ai-api-key', key);
  };

  const setProvider = (provider: 'openai' | 'groq') => {
    setCurrentProviderState(provider);
    localStorage.setItem('ai-provider', provider);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    if (!apiKey) {
      dispatch({ type: 'SET_ERROR', payload: 'Please set your API key first' });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    // Add loading AI message
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: '',
      timestamp: new Date(),
      isLoading: true,
    };
    dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const aiService = new AIService(currentProvider, apiKey);
      const response = await aiService.sendMessage(message);
      
      dispatch({ 
        type: 'UPDATE_LAST_MESSAGE', 
        payload: { text: response, isLoading: false } 
      });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to get AI response' 
      });
      // Remove the loading message on error
      dispatch({ 
        type: 'UPDATE_LAST_MESSAGE', 
        payload: { text: 'Sorry, I encountered an error. Please try again.', isLoading: false } 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  const value: ChatContextType = {
    ...state,
    sendMessage,
    clearMessages,
    setApiKey,
    setProvider,
    apiKey,
    currentProvider,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}