import React from 'react';
import TruncatedContent from './TruncatedContent';
import CommentActions from './CommentActions';
import ReplyForm from './ReplyForm';

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    author: string;
    date: string;
    likes: number;
    user_id?: string;
  };
  isExpanded: boolean;
  onToggleExpand: () => void;
  currentUserId: string | null;
  isLiked: boolean;
  onLike: (commentId: string) => void;
  onReply: () => void;
  onDelete: (commentId: string) => Promise<void>;
  replyingTo: string | null;
  replyContent: string;
  onReplyContentChange: (content: string) => void;
  onSubmitReply: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isExpanded,
  onToggleExpand,
  currentUserId,
  isLiked,
  onLike,
  onReply,
  onDelete,
  replyingTo,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
      <TruncatedContent 
        content={comment.content} 
        maxWords={20} 
        isExpanded={isExpanded}
        onToggle={onToggleExpand}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {comment.author} - {comment.date}
        </div>
        <CommentActions
          id={comment.id}
          likes={comment.likes}
          isLiked={isLiked}
          userId={comment.user_id}
          currentUserId={currentUserId}
          onLike={onLike}
          onReply={onReply}
          onDelete={onDelete}
        />
      </div>

      {replyingTo === comment.id && (
        <ReplyForm
          content={replyContent}
          onChange={onReplyContentChange}
          onSubmit={onSubmitReply}
        />
      )}
    </div>
  );
};

export default CommentItem;