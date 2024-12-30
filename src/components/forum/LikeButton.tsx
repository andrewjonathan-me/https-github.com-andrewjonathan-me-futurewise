import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLikeInteraction } from "@/hooks/forum/useLikeInteraction";

interface LikeButtonProps {
  postId: string;
  likes: number;
  isLiked: boolean;
  onLikeUpdate?: (newCount: number, isLiked: boolean) => void;
  onToggleLike?: (postId: string) => void;  // Added this prop
  disabled?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  likes,
  isLiked: initialIsLiked,
  onLikeUpdate,
  onToggleLike,
  disabled = false
}) => {
  const { isLiked, likeCount, handleLike } = useLikeInteraction({
    initialLikes: likes,
    initialIsLiked: initialIsLiked,
    postId,
    onLikeUpdate
  });

  const handleClick = () => {
    handleLike();
    onToggleLike?.(postId);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isLiked && "text-red-500 hover:text-red-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
      <span className="text-sm font-medium">{likeCount}</span>
    </Button>
  );
};

export default LikeButton;