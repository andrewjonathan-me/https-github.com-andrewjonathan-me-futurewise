import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TruncatedContentProps {
  content: string;
  maxWords: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const TruncatedContent: React.FC<TruncatedContentProps> = ({ 
  content, 
  maxWords,
  isExpanded = false,
  onToggle
}) => {
  const words = content.split(' ');
  const shouldTruncate = words.length > maxWords;
  const displayContent = shouldTruncate && !isExpanded 
    ? words.slice(0, maxWords).join(' ') + '...'
    : content;

  return (
    <div className="relative">
      <div className="text-sm">{displayContent}</div>
      {shouldTruncate && onToggle && (
        <button
          onClick={onToggle}
          className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 mt-1"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Read More <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default TruncatedContent;