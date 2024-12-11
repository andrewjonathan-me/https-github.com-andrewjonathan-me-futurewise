import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      title, 
      content, 
      category, 
      attachments 
    }: { 
      title: string; 
      content: string; 
      category: string; 
      attachments: any[];
    }) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      console.log("Creating new post...", { title, content, category, attachments });

      const { data: post, error: postError } = await supabase
        .from("forum_posts")
        .insert({
          title,
          content,
          category,
          user_id: user.id,
          likes: 0,
        })
        .select()
        .single();

      if (postError) {
        console.error("Error creating post:", postError);
        throw postError;
      }

      if (attachments.length > 0) {
        const attachmentPromises = attachments.map(async (attachment) => {
          const { error: attachmentError } = await supabase
            .from("forum_attachments")
            .insert({
              post_id: post.id,
              type: attachment.type,
              url: attachment.url,
              name: attachment.name,
            });

          if (attachmentError) {
            console.error("Error creating attachment:", attachmentError);
            throw attachmentError;
          }
        });

        await Promise.all(attachmentPromises);
      }

      return post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    },
    onError: (error) => {
      console.error("Error in createPost mutation:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    },
  });
};