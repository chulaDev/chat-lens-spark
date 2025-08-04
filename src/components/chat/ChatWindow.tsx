// VIEW LAYER: Main chat interface component
import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { useChat } from '@/contexts/ChatContext';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ChatWindow: React.FC = () => {
  const { messages } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl font-bold text-primary-foreground">L</span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Welcome to L-GPT</h2>
          <p className="text-muted-foreground">
            Your personal AI assistant. Start a conversation by typing a message below.
          </p>
          <div className="grid grid-cols-1 gap-2 mt-6">
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              💡 Ask me anything - from coding help to creative writing
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              🔧 I can help with problem-solving and explanations
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              📚 I can assist with research and learning
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};