import React from 'react';
import { Plus, MessageSquare, History, Settings, Sparkles, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  sessions: any[];
  activeSessionId?: string;
  onSelectSession: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNewChat, sessions, activeSessionId, onSelectSession }) => {
  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`fixed left-0 top-0 h-screen w-sidebar flex flex-col p-4 gap-2 bg-surface-container-low dark:bg-gray-900 border-r border-outline-variant z-[60] transition-transform duration-300 transform md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black text-on-surface dark:text-inverse-on-surface leading-tight tracking-tight">NewsAI</h1>
              <p className="text-xs text-on-surface-variant font-medium">Enterprise Plan</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 hover:bg-surface-variant rounded-full text-on-surface-variant"
          >
            <X size={20} />
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="w-full bg-primary text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-6 active:scale-95 transition-all hover:bg-primary-hover shadow-lg shadow-primary/20"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="font-semibold">New Chat</span>
        </button>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          <div className="px-2 py-1 mb-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Recent Conversations</span>
          </div>

          {sessions.length === 0 && (
             <div className="p-4 text-center text-xs text-on-surface-variant/50 italic">
                No recent conversations
             </div>
          )}

          {sessions.map((session) => (
            <button
              key={session._id}
              onClick={() => onSelectSession(session._id)}
              className={`w-full text-left p-3 flex items-center gap-3 rounded-xl transition-all group ${activeSessionId === session._id
                ? 'bg-primary/10 text-primary border-l-4 border-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              <MessageSquare size={18} className={activeSessionId === session._id ? 'text-primary' : 'text-on-surface-variant'} />
              <span className="text-sm truncate flex-1">{session.lastMessage || 'New Chat'}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-outline-variant pt-4 flex flex-col gap-4">
          <button className="text-on-surface-variant hover:bg-surface-container-high p-3 flex items-center gap-3 rounded-xl transition-all w-full">
            <History size={18} />
            <span className="text-sm font-medium">Archive History</span>
          </button>
          
          <div className="flex items-center gap-3 p-2 bg-surface-container-high/50 rounded-xl">
            <img
              alt="User Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-primary/20"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">Alex Smith</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-black">Pro User</span>
            </div>
            <button className="ml-auto p-1.5 hover:bg-surface-variant rounded-full text-on-surface-variant">
              <Settings size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
