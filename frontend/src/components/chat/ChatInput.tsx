import React, { useState } from 'react';
import { Plus, Mic, Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <footer className="p-4 bg-surface/80 dark:bg-gray-900 backdrop-blur-md border-t border-outline-variant">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1200px] mx-auto flex items-end gap-3"
      >
        <button
          type="button"
          className="p-3 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors flex-shrink-0"
        >
          <Plus size={20} />
        </button>

        <div className="flex-1 bg-surface-container rounded-2xl border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all flex items-center px-4 min-h-[56px] dark:bg-gray-800 ">
          <input
            className="w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-on-surface py-3 placeholder:text-on-surface-variant/50"
            placeholder="Ask anything about news..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors"
            >
              <Mic size={20} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:shadow-lg transition-all active:scale-95 flex-shrink-0 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} fill="currentColor" />
          )}
        </button>
      </form>
    </footer>
  );
};

export default ChatInput;
