// VIEW LAYER: Settings configuration component
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { toast } from 'sonner';

export const SettingsDialog: React.FC = () => {
  const { apiKey, currentProvider, setApiKey, setProvider } = useChat();
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!localApiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setApiKey(localApiKey.trim());
    toast.success('Settings saved successfully!');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>L-GPT Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={currentProvider} onValueChange={(value: 'openai' | 'groq') => setProvider(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="groq">Groq (Fast & Free)</SelectItem>
                <SelectItem value="openai">OpenAI (GPT-3.5)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {currentProvider === 'groq' 
                ? 'Groq offers fast, free AI inference with Llama models'
                : 'OpenAI provides GPT-3.5-turbo model access'
              }
            </p>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apikey">
              {currentProvider === 'groq' ? 'Groq API Key' : 'OpenAI API Key'}
            </Label>
            <div className="relative">
              <Input
                id="apikey"
                type={showApiKey ? 'text' : 'password'}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder={`Enter your ${currentProvider === 'groq' ? 'Groq' : 'OpenAI'} API key`}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from{' '}
              <a 
                href={currentProvider === 'groq' 
                  ? 'https://console.groq.com/keys' 
                  : 'https://platform.openai.com/api-keys'
                } 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {currentProvider === 'groq' ? 'Groq Console' : 'OpenAI Platform'}
              </a>
            </p>
          </div>

          {/* Security Notice */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              🔒 Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};