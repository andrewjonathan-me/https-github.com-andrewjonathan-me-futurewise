import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from './FileUpload';
import AttachmentPreview from './AttachmentPreview';
import { useLanguage } from "@/contexts/LanguageContext";

interface Attachment {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name?: string;
}

interface PostFormProps {
  onSubmit: (post: { title: string; content: string; category: string; attachments: Attachment[] }) => void;
  categories: string[];
}

const MAX_TITLE_CHARS = 30;

const PostForm: React.FC<PostFormProps> = ({ onSubmit, categories }) => {
  const [newPost, setNewPost] = useState({ 
    title: "", 
    content: "", 
    category: categories[0] || "General", 
    attachments: [] as Attachment[] 
  });
  const { toast } = useToast();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { t } = useLanguage();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > MAX_TITLE_CHARS) {
      toast({
        title: t("postForm.warning.title"),
        description: t("postForm.warning.titleLength").replace("{0}", MAX_TITLE_CHARS.toString()),
        variant: "destructive",
      });
      return;
    }
    setNewPost({ ...newPost, title: value });
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      const type = file.type.startsWith('image/') ? 'image' :
                  file.type.startsWith('video/') ? 'video' :
                  file.type.startsWith('audio/') ? 'audio' : 'document';
      
      const newAttachment: Attachment = { 
        type, 
        url,
        name: file.name 
      };
      
      setNewPost(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    // Reset the file input
    const fileType = newPost.attachments[index].type;
    if (fileInputRefs.current[fileType]) {
      fileInputRefs.current[fileType]!.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: t("postForm.warning.title"),
        description: t("postForm.warning.required"),
        variant: "destructive"
      });
      return;
    }
    
    if (newPost.title.length > MAX_TITLE_CHARS) {
      toast({
        title: t("postForm.warning.title"),
        description: t("postForm.warning.titleLength").replace("{0}", MAX_TITLE_CHARS.toString()),
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(newPost);
    setNewPost({ title: "", content: "", category: categories[0] || "General", attachments: [] });
    Object.values(fileInputRefs.current).forEach(input => {
      if (input) input.value = '';
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{t("forum.newPost")}</CardTitle>
        <CardDescription>
          {t("forum.description")}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              placeholder={t("postForm.input.title")}
              value={newPost.title}
              onChange={handleTitleChange}
              className="w-full"
              maxLength={MAX_TITLE_CHARS}
            />
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>{t("postForm.characters")}: {newPost.title.length}/{MAX_TITLE_CHARS}</span>
            </div>
          </div>
          <div className="relative">
            <Textarea
              placeholder={t("postForm.input.content")}
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="min-h-[100px] w-full"
            />
          </div>
          <div>
            <select
              className="w-full border rounded-md p-2 bg-background dark:bg-gray-800 dark:text-white dark:border-gray-700"
              value={newPost.category}
              onChange={(e) =>
                setNewPost({ ...newPost, category: e.target.value })
              }
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            <FileUpload onFileSelect={handleFileSelect} type="image" ref={el => fileInputRefs.current['image'] = el} />
            <FileUpload onFileSelect={handleFileSelect} type="video" ref={el => fileInputRefs.current['video'] = el} />
            <FileUpload onFileSelect={handleFileSelect} type="audio" ref={el => fileInputRefs.current['audio'] = el} />
            <FileUpload onFileSelect={handleFileSelect} type="document" ref={el => fileInputRefs.current['document'] = el} />
          </div>
          {newPost.attachments.length > 0 && (
            <div className="space-y-2">
              {newPost.attachments.map((attachment, index) => (
                <AttachmentPreview 
                  key={index} 
                  attachment={attachment}
                  onRemove={() => handleRemoveAttachment(index)}
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit">{t("postForm.button.submit")}</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PostForm;