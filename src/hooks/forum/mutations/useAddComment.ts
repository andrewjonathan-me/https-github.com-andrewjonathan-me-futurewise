import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      postId, 
      content, 
      replyToId 
    }: { 
      postId: string; 
      content: string; 
      replyToId?: string;
    }) => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
          console.error("No user found");
          throw new Error("User not authenticated");
        }

        console.log("Adding comment...", { postId, content, replyToId });

        if (!content.trim()) {
          throw new Error("Comment content cannot be empty");
        }

        // Insert the comment
        const { data: comment, error: commentError } = await supabase
          .from("forum_comments")
          .insert({
            post_id: postId,
            user_id: user.id,
            content: content.trim(),
            parent_id: replyToId || null,
            likes: 0,
            loves: 0
          })
          .select()
          .single();

        if (commentError) {
          console.error("Error creating comment:", commentError);
          throw commentError;
        }

        console.log("Comment created successfully:", comment);
        return comment;
      } catch (error) {
        console.error("Error in addComment mutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error) => {
      console.error("Error in addComment mutation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add comment",
        variant: "destructive",
      });
    },
  });
};