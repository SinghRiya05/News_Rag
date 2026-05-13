import React from 'react';
import { Code, Globe, Beaker, Newspaper, ExternalLink } from 'lucide-react';

interface Source {
  title: string;
  link: string;
  category: string;
  publishedAt: string;
}

const SourceCard: React.FC<{ source: Source }> = ({ source }) => {
  const getIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'technology':
      case 'tech': return <Code size={14} />;
      case 'politics': return <Globe size={14} />;
      case 'science': return <Beaker size={14} />;
      default: return <Newspaper size={14} />;
    }
  };

  const getIconColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'tech': 
      case 'technology': return 'text-primary';
      case 'politics': return 'text-secondary';
      case 'science': return 'text-tertiary';
      default: return 'text-on-surface-variant';
    }
  };

  const getBadgeClass = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'tech':
      case 'technology': return 'text-primary-container bg-primary/10';
      case 'politics': return 'text-on-secondary-container bg-secondary/10';
      case 'science': return 'text-tertiary-container bg-tertiary/10';
      default: return 'text-on-surface-variant bg-surface-variant';
    }
  };

  return (
    <div 
      className="bg-surface-container rounded-lg p-3 border border-outline-variant hover:bg-surface-container-high transition-all cursor-pointer group relative"
      onClick={() => window.open(source.link, '_blank')}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`${getIconColor(source.category)}`}>
          {getIcon(source.category)}
        </span>
        <span className="text-sm font-bold text-on-surface truncate pr-4">{source.title}</span>
        <ExternalLink size={10} className="absolute top-3 right-3 opacity-0 group-hover:opacity-40 transition-opacity" />
      </div>
      <div className="flex justify-between items-center px-1">
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${getBadgeClass(source.category)}`}>
          {source.category || 'General'}
        </span>
        <span className="text-[10px] font-semibold text-on-surface-variant/60">
          {source.publishedAt ? new Date(source.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
        </span>
      </div>
    </div>
  );
};

export default SourceCard;
