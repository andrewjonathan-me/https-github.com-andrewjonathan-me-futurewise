import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Reply, Trash2 } from "lucide-react";
import { useLikeInteraction } from "@/hooks/forum/useLikeInteraction";

interface CommentActionsProps {
  id: string;
  likes: number;
  isLiked: boolean;
  userId?: string;
  currentUserId: string | null;
  onLike?: (commentId: string) => void;  // Made optional
  onReply?: () => void;
  onDelete: (id: string) => void;
}

const CommentActions: React.FC<CommentActionsProps> = ({
  id,
  likes,
  isLiked,
  userId,
  currentUserId,
  onLike,
  onReply,
  onDelete,
}) => {
  const { isLiked: currentIsLiked, likeCount, handleLike } = useLikeInteraction({
    initialLikes: likes,
    initialIsLiked: isLiked,
    postId: id
  });

  const handleLikeClick = () => {
    handleLike();
    onLike?.(id);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${currentIsLiked ? "text-red-500" : ""}`}
        onClick={handleLikeClick}
      >
        <Heart className={`w-4 h-4 ${currentIsLiked ? "fill-current" : ""}`} />
        <span>{likeCount}</span>
      </Button>
      {onReply && (
        <Button variant="ghost" size="sm" onClick={onReply}>
          <Reply className="w-4 h-4" />
        </Button>
      )}
      {userId === currentUserId && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default CommentActions;