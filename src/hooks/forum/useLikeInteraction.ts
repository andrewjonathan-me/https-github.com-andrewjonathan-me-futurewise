import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseLikeInteractionProps {
  initialLikes: number;
  initialIsLiked: boolean;
  postId: string;
  onLikeUpdate?: (newCount: number, isLiked: boolean) => void;
}

export const useLikeInteraction = ({
  initialLikes,
  initialIsLiked,
  postId,
  onLikeUpdate
}: UseLikeInteractionProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const { toast } = useToast();

  const handleLike = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to like posts",
          variant: "destructive",
        });
        return;
      }

      const newIsLiked = !isLiked;
      const optimisticLikeCount = likeCount + (newIsLiked ? 1 : -1);

      // Optimistic update
      setIsLiked(newIsLiked);
      setLikeCount(optimisticLikeCount);

      // Check if reaction already exists
      const { data: existingReaction } = await supabase
        .from('user_reactions')
        .select()
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle();

      if (newIsLiked) {
        // Only insert if no reaction exists
        if (!existingReaction) {
          const { error: insertError } = await supabase
            .from('user_reactions')
            .insert({
              user_id: user.id,
              post_id: postId,
              reaction_type: 'like'
            });

          if (insertError) throw insertError;
        }

        // Update post likes count
        const { error: updateError } = await supabase
          .from('forum_posts')
          .update({ likes: optimisticLikeCount })
          .eq('id', postId);

        if (updateError) throw updateError;
      } else {
        // Remove like if reaction exists
        if (existingReaction) {
          const { error: deleteError } = await supabase
            .from('user_reactions')
            .delete()
            .eq('user_id', user.id)
            .eq('post_id', postId);

          if (deleteError) throw deleteError;
        }

        // Update post likes count
        const { error: updateError } = await supabase
          .from('forum_posts')
          .update({ likes: optimisticLikeCount })
          .eq('id', postId);

        if (updateError) throw updateError;
      }

      // Notify parent components of the update
      onLikeUpdate?.(optimisticLikeCount, newIsLiked);

      toast({
        title: newIsLiked ? "Post liked" : "Post unliked",
        description: "Your reaction has been updated",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setIsLiked(!isLiked);
      setLikeCount(likeCount);
      
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isLiked,
    likeCount,
    handleLike
  };
};