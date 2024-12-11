import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      console.log("Toggling like for post:", postId);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        console.error("No user found");
        throw new Error("User not authenticated");
      }

      try {
        // First check if a reaction already exists
        const { data: existingReactions, error: fetchError } = await supabase
          .from("user_reactions")
          .select()
          .eq("user_id", user.id)
          .eq("post_id", postId)
          .is("comment_id", null)
          .maybeSingle();

        console.log("Existing reactions:", existingReactions);

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error("Error fetching reactions:", fetchError);
          throw fetchError;
        }

        // Get current post data
        const { data: currentPost, error: postError } = await supabase
          .from("forum_posts")
          .select("likes")
          .eq("id", postId)
          .single();

        if (postError) {
          console.error("Error fetching post:", postError);
          throw postError;
        }

        const currentLikes = currentPost?.likes || 0;
        console.log("Current likes:", currentLikes);

        // Start a transaction-like sequence
        if (existingReactions) {
          // If reaction exists, delete it
          console.log("Deleting existing reaction");
          const { error: deleteError } = await supabase
            .from("user_reactions")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", postId)
            .is("comment_id", null);

          if (deleteError) {
            console.error("Error deleting reaction:", deleteError);
            throw deleteError;
          }

          // Decrement post likes
          const newLikeCount = Math.max(0, currentLikes - 1);
          console.log("New like count after unlike:", newLikeCount);
          const { error: updateError } = await supabase
            .from("forum_posts")
            .update({ likes: newLikeCount })
            .eq("id", postId);

          if (updateError) {
            console.error("Error updating post likes:", updateError);
            throw updateError;
          }

          return { postId, action: 'unliked', newCount: newLikeCount };
        } else {
          // If no reaction exists, create one
          console.log("Creating new reaction");
          const { error: insertError } = await supabase
            .from("user_reactions")
            .insert({
              user_id: user.id,
              post_id: postId,
              comment_id: null,
              reaction_type: "like"
            });

          if (insertError) {
            console.error("Error inserting reaction:", insertError);
            throw insertError;
          }

          // Increment post likes
          const newLikeCount = currentLikes + 1;
          console.log("New like count after like:", newLikeCount);
          const { error: updateError } = await supabase
            .from("forum_posts")
            .update({ likes: newLikeCount })
            .eq("id", postId);

          if (updateError) {
            console.error("Error updating post likes:", updateError);
            throw updateError;
          }

          return { postId, action: 'liked', newCount: newLikeCount };
        }
      } catch (error) {
        console.error("Unexpected error in toggle like:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      toast({
        title: data.action === 'liked' ? "Added like" : "Removed like",
        description: `Post has been ${data.action}. New count: ${data.newCount}`,
      });
    },
    onError: (error) => {
      console.error("Error in toggle like mutation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update reaction",
        variant: "destructive",
      });
    },
  });
};