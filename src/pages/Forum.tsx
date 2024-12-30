import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useForumPosts } from "@/hooks/forum/useForumPosts";
import { useLanguage } from "@/contexts/LanguageContext";
import PostCard from "@/components/forum/PostCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForumActions } from "@/hooks/forum/useForumActions";
import { categoryLanguageMap } from "@/translations/sections/forumCategories";

const Forum = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { addComment, toggleLike } = useForumActions();
  
  const { data: posts, isLoading, error } = useForumPosts({
    category: selectedCategory,
    sortBy: sortBy as any
  });

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleToggleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleAddComment = (postId: string, content: string, replyToId?: string) => {
    addComment.mutate({ postId, content, replyToId });
  };

  const handleToggleLike = (postId: string) => {
    toggleLike.mutate(postId);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-3xl font-bold dark:text-white">{t("forum.title")}</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/create-post')}
              className="flex items-center justify-center gap-2 h-12 text-base px-6 w-full sm:w-auto"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              {t("forum.createNewPost")}
            </Button>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-12 text-base w-full sm:w-[200px] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <SelectValue placeholder={t("forum.filter.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {t("forum.filter.all")}
                  </SelectItem>
                  <SelectItem value="general" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {t("forum.categories.general")}
                  </SelectItem>
                  <SelectItem value="academic" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {t("forum.categories.academic")}
                  </SelectItem>
                  <SelectItem value="career" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {t("forum.categories.career")}
                  </SelectItem>
                  <SelectItem value="technology" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {t("forum.categories.technology")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="h-12 text-base w-full sm:w-[200px] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <SelectValue placeholder={t("forum.sort.newest")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {t("forum.sort.newest")}
                  </SelectItem>
                  <SelectItem value="oldest" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {t("forum.sort.oldest")}
                  </SelectItem>
                  <SelectItem value="mostLiked" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {t("forum.sort.mostLiked")}
                  </SelectItem>
                  <SelectItem value="leastLiked" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {t("forum.sort.leastLiked")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center dark:text-red-400">
            {t("error.loading")}
          </div>
        ) : (
          <div className="space-y-6">
            {posts?.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  author: post.profiles?.username || 'Anonymous',
                  date: new Date(post.created_at).toLocaleDateString(),
                  comments: [],
                  attachments: post.attachments || [],
                  likes: post.likes || 0,
                  isLiked: post.isLiked || false,
                }}
                onAddComment={handleAddComment}
                onToggleLike={handleToggleLike}
                isExpanded={expandedPostId === post.id}
                onToggleExpand={() => handleToggleExpand(post.id)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Forum;