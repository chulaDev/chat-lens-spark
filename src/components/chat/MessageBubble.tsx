// VIEW LAYER: Individual message display component
import React from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Bot, User, Loader2 } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={cn(
      'flex w-full gap-3 px-4 py-6 transition-all duration-300',
      isUser ? 'bg-background' : 'bg-muted/30'
    )}>
      {/* Avatar */}
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
        isUser 
          ? 'bg-gradient-primary text-primary-foreground' 
          : 'bg-secondary text-secondary-foreground'
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {isUser ? 'You' : 'L-GPT'}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        <div className="prose prose-sm max-w-none text-foreground">
          {message.isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};