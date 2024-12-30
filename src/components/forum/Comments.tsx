import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import CommentItem from './CommentItem';
import { supabase } from "@/integrations/supabase/client";

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
  comments = [], // Provide default empty array
  postId,
  onAddComment,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchCurrentUser();
  }, []);

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
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
            <React.Fragment key={comment.id}>
              <CommentItem
                comment={comment}
                isExpanded={expandedComments.includes(comment.id)}
                onToggleExpand={() => toggleCommentExpansion(comment.id)}
                currentUserId={currentUserId}
                isLiked={likedComments.includes(comment.id)}
                onLike={handleLikeComment}
                onReply={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                onDelete={async (id) => {
                  const { error } = await supabase
                    .from('forum_comments')
                    .delete()
                    .eq('id', id);
                  if (!error) {
                    window.location.reload();
                  }
                }}
                replyingTo={replyingTo}
                replyContent={replyContent[comment.id] || ""}
                onReplyContentChange={(content) => setReplyContent(prev => ({
                  ...prev,
                  [comment.id]: content
                }))}
                onSubmitReply={() => handleReply(comment.id)}
              />

              {comment.replies?.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      isExpanded={expandedComments.includes(reply.id)}
                      onToggleExpand={() => toggleCommentExpansion(reply.id)}
                      currentUserId={currentUserId}
                      isLiked={likedComments.includes(reply.id)}
                      onLike={handleLikeComment}
                      onReply={() => {}}
                      onDelete={async (id) => {
                        const { error } = await supabase
                          .from('forum_comments')
                          .delete()
                          .eq('id', id);
                        if (!error) {
                          window.location.reload();
                        }
                      }}
                      replyingTo={null}
                      replyContent=""
                      onReplyContentChange={() => {}}
                      onSubmitReply={() => {}}
                    />
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;