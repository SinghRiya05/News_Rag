import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Zap, X, BarChart3, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api.service';

interface AnalysisMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnalysisSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  originalResponse: string;
  messageId: string;
}

const AnalysisSidebar: React.FC<AnalysisSidebarProps> = ({ isOpen, onClose, originalResponse, messageId }) => {
  const [messages, setMessages] = useState<AnalysisMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageId) {
      const saved = localStorage.getItem(`analysis_${messageId}`);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([]);
        if (isOpen) handleInitialAnalysis();
      }
    }
  }, [messageId]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && !isLoading && messageId) {
      handleInitialAnalysis();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messageId && messages.length > 0) {
      localStorage.setItem(`analysis_${messageId}`, JSON.stringify(messages));
    }
  }, [messages, messageId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleInitialAnalysis = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.analyzeResponse(
        originalResponse,
        "Analyze this response in detail",
        []
      );

      if (data.success) {
        setMessages([{ role: 'assistant', content: data.data }]);
      }
    } catch (error) {
      console.error('Initial analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: AnalysisMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const history = messages;
    setInput('');
    setIsLoading(true);

    try {
      const data = await apiService.analyzeResponse(
        originalResponse,
        currentInput,
        history.slice(-5)
      );

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.data }]);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] transition-opacity duration-300" onClick={onClose} />

      <aside className="fixed right-0 top-0 h-screen w-full md:w-[460px] bg-surface border-l border-outline-variant z-[70] flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface/80 backdrop-blur-xl sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={20} className="text-primary fill-primary/20" />
              <h2 className="text-xl font-bold text-on-surface tracking-tight">AI Insights</h2>
            </div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider opacity-60">Deep Analysis</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-xl transition-all active:scale-90 text-on-surface-variant">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar bg-background/50">
          {messages.length === 0 && isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-ring"></div>
                <div className="relative w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary animate-shimmer">
                  <Sparkles size={40} fill="currentColor" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 animate-pulse">Analyzing...</h3>
              <p className="text-sm text-on-surface-variant max-w-[240px]">Processing the response to uncover deeper insights and context.</p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                      ? 'bg-primary text-on-primary rounded-tr-none'
                      : 'bg-surface border border-outline-variant/30 rounded-tl-none'
                    }`}>
                    <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'text-on-primary prose-invert' : 'text-on-surface dark:prose-invert'}`}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                  <span className="text-[10px] mt-1 text-on-surface-variant/60 font-bold uppercase tracking-tighter px-1">
                    {msg.role === 'user' ? 'You' : 'AI Analysis'}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-primary animate-pulse py-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Generating Analysis...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-surface/80 backdrop-blur-xl border-t border-outline-variant">
          <form onSubmit={handleSend} className="relative">
            <input
              className="w-full bg-surface-container-high border border-outline-variant rounded-2xl pl-5 pr-14 py-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
              placeholder="Ask for more details or context..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-on-primary rounded-xl flex items-center justify-center hover:bg-primary-hover disabled:opacity-30 transition-all active:scale-90 shadow-lg shadow-primary/20"
            >
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};

export default AnalysisSidebar;
