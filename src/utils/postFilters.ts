import { Post } from '../types/forum';

export const filterAndSortPosts = (
  posts: Post[],
  selectedCategory: string,
  sortOption: string
): Post[] => {
  console.log('Filtering posts with option:', sortOption);
  
  let filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return filteredPosts.sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "mostLiked":
        const bLikes = (b.likes || 0) + (b.isLiked ? 1 : 0);
        const aLikes = (a.likes || 0) + (a.isLiked ? 1 : 0);
        console.log(`Comparing likes: Post ${b.id}(${bLikes}) vs Post ${a.id}(${aLikes})`);
        return bLikes - aLikes;
      case "leastLiked":
        const bLikesAsc = (b.likes || 0) + (b.isLiked ? 1 : 0);
        const aLikesAsc = (a.likes || 0) + (a.isLiked ? 1 : 0);
        console.log(`Comparing likes (ascending): Post ${a.id}(${aLikesAsc}) vs Post ${b.id}(${bLikesAsc})`);
        return aLikesAsc - bLikesAsc;
      default:
        return 0;
    }
  });
};