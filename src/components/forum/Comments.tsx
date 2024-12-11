import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TruncatedContent from './TruncatedContent';
import { supabase } from "@/integrations/supabase/client";
import CommentActions from './CommentActions';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Reply {
  id: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  user_id?: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  replies: Reply[];
  user_id?: string;
}

interface CommentsProps {
  comments: Comment[];
  postId: string;
  onAddComment: (postId: string, content: string, replyToId?: string) => void;
}

const Comments: React.FC<CommentsProps> = ({
  comments,
  postId,
  onAddComment,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Use useEffect to handle the async currentUserId
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchCurrentUser();
  }, []);

  const handleLikeComment = (commentId: string) => {
    const isLiked = likedComments.includes(commentId);
    setLikedComments(prev => 
      isLiked 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
    
    toast({
      title: isLiked ? "Removed like" : "Added like",
      description: "Your reaction has been updated",
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      console.log("Deleting comment:", commentId);
      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error("Error deleting comment:", error);
        toast({
          title: "Error",
          description: "Failed to delete comment",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });

      window.location.reload();
    } catch (error) {
      console.error("Error in handleDeleteComment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent[commentId]?.trim()) {
      onAddComment(postId, replyContent[commentId], commentId);
      setReplyContent(prev => ({ ...prev, [commentId]: "" }));
      setReplyingTo(null);
    }
  };

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  return (
    <div className="mt-4">
      {comments.length > 0 && (
        <Button
          variant="ghost"
          className="flex items-center gap-2 mb-2 dark:text-gray-300"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <MessageCircle className="w-4 h-4" />
          {isExpanded ? "Hide Comments" : `View ${comments.length} Comments`}
        </Button>
      )}

      {isExpanded && (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <TruncatedContent 
                content={comment.content} 
                maxWords={20} 
                isExpanded={expandedComments.includes(comment.id)}
                onToggle={() => toggleCommentExpansion(comment.id)}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {comment.author} - {comment.date}
                </div>
                <CommentActions
                  id={comment.id}
                  likes={comment.likes}
                  isLiked={likedComments.includes(comment.id)}
                  userId={comment.user_id}
                  currentUserId={currentUserId}
                  onLike={handleLikeComment}
                  onReply={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  onDelete={handleDeleteComment}
                />
              </div>

              {replyingTo === comment.id && (
                <div className="mt-2 flex gap-2">
                  <input
                    placeholder="Write a reply..."
                    value={replyContent[comment.id] || ""}
                    onChange={(e) => setReplyContent(prev => ({
                      ...prev,
                      [comment.id]: e.target.value
                    }))}
                    className="flex-1 rounded-md border p-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <Button size="sm" onClick={() => handleReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              )}

              {comment.replies?.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                      <TruncatedContent content={reply.content} maxWords={20} />
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {reply.author} - {reply.date}
                        </div>
                        <CommentActions
                          id={reply.id}
                          likes={reply.likes}
                          isLiked={likedComments.includes(reply.id)}
                          userId={reply.user_id}
                          currentUserId={currentUserId}
                          onLike={handleLikeComment}
                          onDelete={handleDeleteComment}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;