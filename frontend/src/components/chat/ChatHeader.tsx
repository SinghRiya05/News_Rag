import React from 'react';
import { Menu, Sun, Moon, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, isDark, onToggleTheme, onToggleSidebar }) => {
  return (
    <header className="bg-surface/80 dark:bg-gray-900 backdrop-blur-md sticky top-0 z-40 border-b border-outline-variant flex items-center justify-between px-4 h-16 w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg md:text-xl text-primary font-bold tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="p-2.5 hover:bg-surface-variant rounded-full transition-all active:scale-95 duration-200 text-on-surface-variant"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2.5 hover:bg-surface-variant rounded-full transition-all active:scale-95 duration-200 text-on-surface-variant">
          <MoreVertical size={20} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
