// VIEW LAYER: Chat header with title and controls
import React from 'react';
import { Button } from '@/components/ui/button';
import { SettingsDialog } from './SettingsDialog';
import { useChat } from '@/contexts/ChatContext';
import { Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const ChatHeader: React.FC = () => {
  const { clearMessages, messages, currentProvider } = useChat();

  const handleClearChat = () => {
    if (messages.length === 0) return;
    
    clearMessages();
    toast.success('Chat cleared successfully');
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">L-GPT</h1>
              <p className="text-xs text-muted-foreground">
                Powered by {currentProvider === 'groq' ? 'Groq' : 'OpenAI'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearChat}
            disabled={messages.length === 0}
            className="h-10 w-10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <SettingsDialog />
        </div>
      </div>
    </header>
  );
};