import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/forum";
import { categoryLanguageMap } from "@/translations/sections/forumCategories";

type SortOption = "newest" | "oldest" | "mostLiked" | "leastLiked";

interface UseForumPostsProps {
  category?: string;
  sortBy?: SortOption;
  pageSize?: number;
}

export const useForumPosts = ({
  category,
  sortBy = "newest",
  pageSize = 10 
}: UseForumPostsProps) => {
  const fetchPosts = async () => {
    console.log("Fetching posts with category:", category);
    
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        ),
        attachments: forum_attachments (*)
      `);

    // Apply category filter if specified
    if (category && category !== 'all') {
      // Convert category to proper case for database matching
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      
      // Find all possible category variations (English and Indonesian)
      const possibleCategories = Object.entries(categoryLanguageMap)
        .reduce((acc: string[], [key, value]) => {
          // Add both the key and value if they match our category
          if (key.toLowerCase() === formattedCategory.toLowerCase() || 
              value.toLowerCase() === formattedCategory.toLowerCase()) {
            acc.push(key);
            acc.push(value);
          }
          return acc;
        }, []);

      console.log("Possible categories for filtering:", possibleCategories);

      if (possibleCategories.length > 0) {
        query = query.in('category', possibleCategories);
      } else {
        // Fallback to exact match if no mapping found
        query = query.eq('category', formattedCategory);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        query = query.order('created_at', { ascending: false });
        break;
      case "oldest":
        query = query.order('created_at', { ascending: true });
        break;
      case "mostLiked":
        query = query.order('likes', { ascending: false });
        break;
      case "leastLiked":
        query = query.order('likes', { ascending: true });
        break;
    }

    // Apply pagination
    if (pageSize) {
      query = query.limit(pageSize);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }

    console.log("Fetched posts:", data);
    return data as Post[];
  };

  return useQuery({
    queryKey: ['forum-posts', category, sortBy, pageSize],
    queryFn: fetchPosts,
  });
};