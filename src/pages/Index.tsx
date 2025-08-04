// MAIN VIEW: L-GPT Chat Application
import React from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/contexts/ChatContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Inner component that uses chat context
const ChatInterface = () => {
  const { sendMessage, isLoading, error, apiKey } = useChat();

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      <ChatHeader />
      
      {/* Error Display */}
      {error && (
        <div className="container max-w-4xl mx-auto px-4 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* No API Key Warning */}
      {!apiKey && (
        <div className="container max-w-4xl mx-auto px-4 pt-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please configure your API key in settings to start chatting with L-GPT.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <ChatWindow />
      
      <ChatInput 
        onSendMessage={sendMessage} 
        isLoading={isLoading}
        disabled={!apiKey}
      />
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
};

export default Index;
