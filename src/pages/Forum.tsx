import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PostForm from "@/components/forum/PostForm";
import PostCard from "@/components/forum/PostCard";
import PaginationControls from "@/components/forum/Pagination";
import { useForumPosts } from "@/hooks/forum/useForumPosts";
import { useForumActions } from "@/hooks/forum/useForumActions";
import { filterAndSortPosts } from "@/utils/postFilters";
import { Post, Attachment } from "@/types/forum";

export default function Forum() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);

  const { data: posts, isLoading } = useForumPosts();
  const { createPost, addComment, toggleLike } = useForumActions();

  const categories = [
    "Umum",
    "Akademik",
    "Karir",
    "Teknologi",
    "Seni",
    "Olahraga"
  ];

  const handleSubmit = (newPost: { title: string; content: string; category: string; attachments: any[] }) => {
    createPost.mutate(newPost);
  };

  const handleComment = (postId: string, content: string, replyToId?: string) => {
    addComment.mutate({ postId, content, replyToId });
  };

  const handleToggleLike = (postId: string) => {
    toggleLike.mutate(postId);
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const POSTS_PER_PAGE = 5;
  const transformedPosts: Post[] = posts ? posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    created_at: post.created_at,
    updated_at: post.updated_at,
    user_id: post.user_id,
    profiles: post.profiles?.[0] || { username: null, avatar_url: null },
    attachments: post.attachments?.map(attachment => ({
      ...attachment,
      type: attachment.type as "image" | "video" | "audio" | "document"
    })) || [],
    isLiked: false,
    likes: 0
  })) : [];
  
  const sortedPosts = filterAndSortPosts(transformedPosts, selectedCategory, sortOption);
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const transformPostForCard = (post: Post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.profiles?.username || 'Anonymous',
    date: new Date(post.created_at).toLocaleDateString(),
    category: post.category,
    likes: post.likes || 0,
    comments: [], // TODO: Add comments integration
    attachments: post.attachments || [],
    isLiked: post.isLiked
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forum Diskusi</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Diskusikan berbagai topik seputar pendidikan dan karir
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <select
              className="border rounded-md p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="border rounded-md p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="mostLiked">Terbanyak Disukai</option>
              <option value="leastLiked">Tersedikit Disukai</option>
            </select>
          </div>

          <PostForm onSubmit={handleSubmit} categories={categories} />

          {isLoading ? (
            <div className="text-center py-8 dark:text-gray-300">Loading...</div>
          ) : (
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={transformPostForCard(post)}
                  onAddComment={handleComment}
                  onToggleLike={handleToggleLike}
                  isExpanded={expandedPosts.includes(post.id)}
                  onToggleExpand={togglePostExpansion}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
