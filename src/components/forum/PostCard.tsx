import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tag } from "lucide-react";
import Comments from './Comments';
import AttachmentPreview from './AttachmentPreview';
import TruncatedContent from './TruncatedContent';
import { useLanguage } from "@/contexts/LanguageContext";
import { categoryLanguageMap } from "@/translations/sections/forumCategories";
import LikeButton from './LikeButton';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    category: string;
    comments: any[];
    attachments: any[];
    isLiked?: boolean;
    likes: number;
  };
  onAddComment: (postId: string, content: string, replyToId?: string) => void;
  onToggleLike: (postId: string) => void;
  isExpanded: boolean;
  onToggleExpand: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onAddComment,
  onToggleLike,
  isExpanded,
  onToggleExpand,
}) => {
  const { t, language } = useLanguage();
  const currentUserId = useCurrentUser();

  // Get the translated category based on the current language
  const translatedCategory = language === 'en' ? 
    post.category : // If English, use the original category
    Object.entries(categoryLanguageMap).find(
      ([_, englishValue]) => englishValue === post.category
    )?.[0] || post.category; // If Indonesian, find the matching Indonesian key

  return (
    <Card className="hover:shadow-md transition-shadow dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl dark:text-white">{post.title}</CardTitle>
          <div className="flex items-center gap-4">
            <LikeButton
              postId={post.id}
              likes={post.likes}
              isLiked={post.isLiked || false}
              onToggleLike={onToggleLike}
              disabled={!currentUserId}
            />
            <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-gray-200">
              <Tag className="w-4 h-4 inline mr-1" />
              {t("tag.category")}: {translatedCategory}
            </span>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2 dark:text-gray-400">
          <span>{post.author}</span>
          <span>{post.date}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start">
          <TruncatedContent 
            content={post.content} 
            maxWords={20}
            isExpanded={isExpanded}
            onToggle={() => onToggleExpand(post.id)}
            readMoreText={t("postCard.readMore")}
            showLessText={t("postCard.showLess")}
          />
        </div>
        
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {post.attachments.map((attachment, index) => (
              <AttachmentPreview 
                key={index} 
                attachment={attachment} 
                isPreview={true}
              />
            ))}
          </div>
        )}

        <Comments
          comments={post.comments}
          postId={post.id}
          onAddComment={onAddComment}
        />
      </CardContent>
    </Card>
  );
};

export default PostCard;