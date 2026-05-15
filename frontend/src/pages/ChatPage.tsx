import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatHeader from '../components/chat/ChatHeader';
import MessageItem from '../components/chat/MessageItem';
import ChatInput from '../components/chat/ChatInput';
import AnalysisSidebar from '../components/chat/AnalysisSidebar';
import { Sparkles } from 'lucide-react';
import { apiService } from '../services/api.service';

const ChatPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [analysisContent, setAnalysisContent] = useState('');
  const [analysisMessageId, setAnalysisMessageId] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await apiService.getSessions();
        if (data.success) {
          setSessions(data.data);
          
          // Set latest session as active if none selected
          if (data.data.length > 0 && !activeSessionId) {
            setActiveSessionId(data.data[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      }
    };
    fetchSessions();
  }, [activeSessionId]);

  // Fetch messages for active session
  useEffect(() => {
    if (activeSessionId) {
      const fetchMessages = async () => {
        try {
          const data = await apiService.getSessionMessages(activeSessionId);
          if (data.success) {
            setMessages(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };
      fetchMessages();
    }
  }, [activeSessionId]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Generate session ID if not exists
    const sessionId = activeSessionId || `session_${Date.now()}`;
    if (!activeSessionId) setActiveSessionId(sessionId);

    // Add optimistic user message
    const optimisticMsg = {
      _id: Date.now().toString(),
      userMessage,
      aiResponse: '',
      status: 'loading',
      sources: []
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setIsLoading(true);

    try {
      const data = await apiService.sendMessage(sessionId, userMessage);

      if (data.success) {
        // Replace optimistic message with actual data
        setMessages((prev) => 
          prev.map((msg) => 
            msg._id === optimisticMsg._id ? data.data : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newId = `session_${Date.now()}`;
    setActiveSessionId(newId);
    setMessages([]);
  };

  const handleOpenAnalysis = (content: string, id: string) => {
    setAnalysisContent(content);
    setAnalysisMessageId(id);
    setIsAnalysisOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={() => {
          handleNewChat();
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
      />

      <main className="flex-1 flex flex-col relative h-screen md:ml-sidebar transition-all">
        <ChatHeader 
          title="News Navigator" 
          isDark={isDark} 
          onToggleTheme={toggleTheme} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-[900px] mx-auto w-full">
            {messages.length === 0 && !isLoading && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-50 px-4">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 animate-shimmer">
                  <Sparkles size={40} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-on-surface mb-2 tracking-tight">Your AI News Partner</h3>
                <p className="text-sm text-on-surface-variant max-w-sm font-medium">
                  Ask me anything about current events, technology trends, or world politics.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <MessageItem 
                key={msg._id} 
                message={msg} 
                onAnalyze={handleOpenAnalysis}
              />
            ))}

            <div ref={chatEndRef} />
          </div>
        </div>

        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </main>

      <AnalysisSidebar 
        key={analysisMessageId}
        isOpen={isAnalysisOpen} 
        onClose={() => setIsAnalysisOpen(false)}
        originalResponse={analysisContent}
        messageId={analysisMessageId}
      />
    </div>
  );
};

export default ChatPage;
