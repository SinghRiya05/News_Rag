import React from 'react';
import SourceCard from './SourceCard';
import { Sparkles, BarChart3 } from 'lucide-react';

interface Message {
  _id: string;
  userMessage: string;
  aiResponse: string;
  sources: any[];
  status: string;
  createdAt: string;
}

interface MessageItemProps {
  message: Message;
  onAnalyze: (response: string, id: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onAnalyze }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* User Message */}
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-primary text-on-primary p-4 rounded-2xl rounded-tr-none shadow-sm">
          <p className="text-base leading-relaxed">{message.userMessage}</p>
        </div>
      </div>

      {/* AI Response or Typing Indicator */}
      {(message.aiResponse || message.status === 'loading') && (
        <div className="flex justify-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-primary flex items-center justify-center border border-primary/10">
              <Sparkles size={20} fill="currentColor" />
            </div>
          </div>
          <div className="max-w-[90%] md:max-w-[85%] flex flex-col gap-6 md:gap-8">
            <div className="bg-surface-container p-4 md:p-6 rounded-2xl rounded-tl-none shadow-sm dark:bg-gray-800 border border-outline-variant/30 relative group/msg">
              {!message.aiResponse ? (
                <div className="flex items-center gap-1 px-1 h-6">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                </div>
              ) : (
                <>
                  <div className="prose dark:prose-invert max-w-none text-on-surface dark:text-gray-100">
                    {message.aiResponse.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0 text-sm md:text-base leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                  
                  {/* Analyze Button */}
                  <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-end">
                    <button 
                      onClick={() => onAnalyze(message.aiResponse, message._id)}
                      className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-primary hover:bg-primary-container px-3 py-2 md:py-1.5 rounded-lg transition-all active:scale-95 border border-primary/20 md:border-transparent"
                    >
                      <BarChart3 size={14} />
                      <span className="hidden sm:inline">Analyze with AI</span>
                      <span className="sm:hidden">Analyze</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Sources Section */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 md:mt-4 bg-surface/30 p-3 md:p-0 rounded-xl md:rounded-none">
                <h4 className="text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase mb-3 px-1 tracking-widest opacity-60">
                  Sources Used
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {message.sources.map((source, idx) => (
                    <SourceCard key={idx} source={source} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
