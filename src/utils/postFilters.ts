import { Post } from "@/types/forum";
import { categoryLanguageMap } from "@/translations/sections/forumCategories";

export const filterAndSortPosts = (
  posts: Post[],
  selectedCategory: string,
  sortOption: string
) => {
  let filteredPosts = [...posts];

  // Filter by category
  if (selectedCategory !== "all") {
    filteredPosts = filteredPosts.filter((post) => {
      // Check if the post category matches either the English or Indonesian version
      const englishCategory = categoryLanguageMap[post.category as keyof typeof categoryLanguageMap] || post.category;
      return post.category === selectedCategory || englishCategory === selectedCategory;
    });
  }

  // Sort posts
  switch (sortOption) {
    case "newest":
      return filteredPosts.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "oldest":
      return filteredPosts.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case "mostLiked":
      return filteredPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    case "leastLiked":
      return filteredPosts.sort((a, b) => (a.likes || 0) - (b.likes || 0));
    default:
      return filteredPosts;
  }
};