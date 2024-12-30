import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PostForm from "@/components/forum/PostForm";
import { useForumActions } from "@/hooks/forum/useForumActions";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost } = useForumActions();
  const { t } = useLanguage();

  const handleCreatePost = async (post: { 
    title: string; 
    content: string; 
    category: string; 
    attachments: any[]; 
  }) => {
    try {
      await createPost.mutateAsync(post);
      navigate('/forum');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const categories = [
    { value: "general", label: t("forum.categories.general") },
    { value: "academic", label: t("forum.categories.academic") },
    { value: "career", label: t("forum.categories.career") },
    { value: "technology", label: t("forum.categories.technology") }
  ];

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold dark:text-white">{t("forum.createNewPost")}</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/forum')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("forum.returnToForum")}
          </Button>
        </div>
        
        <PostForm 
          onSubmit={handleCreatePost}
          categories={categories.map(cat => cat.label)}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CreatePost;