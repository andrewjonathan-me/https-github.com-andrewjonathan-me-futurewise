import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ForumPost } from "@/types/database/forum";

export const useForumPosts = () => {
  return useQuery({
    queryKey: ["forum-posts"],
    queryFn: async () => {
      console.log("Fetching forum posts...");
      const user = (await supabase.auth.getUser()).data.user;

      const { data: posts, error } = await supabase
        .from("forum_posts")
        .select(`
          *,
          profiles (username, avatar_url),
          attachments:forum_attachments (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to load forum posts",
          variant: "destructive",
        });
        throw error;
      }

      // If user is logged in, fetch their reactions
      if (user) {
        const { data: userReactions, error: reactionsError } = await supabase
          .from("user_reactions")
          .select("post_id")
          .eq("user_id", user.id)
          .is("comment_id", null);

        if (reactionsError) {
          console.error("Error fetching user reactions:", reactionsError);
        } else {
          // Add isLiked flag to posts
          const likedPostIds = new Set(userReactions?.map(r => r.post_id) || []);
          posts?.forEach((post: ForumPost) => {
            post.isLiked = likedPostIds.has(post.id);
          });
        }
      }

      console.log("Fetched posts:", posts);
      return posts as ForumPost[];
    },
  });
};