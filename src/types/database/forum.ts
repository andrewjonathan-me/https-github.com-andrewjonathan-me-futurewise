export interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
  likes: number | null;
  isLiked?: boolean;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
  attachments?: ForumAttachment[];
}

export interface ForumAttachment {
  id: string;
  post_id: string;
  type: string;
  url: string;
  name: string | null;
  created_at: string;
}

export interface ForumComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes: number | null;
  loves: number | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserReaction {
  id: string;
  user_id: string;
  comment_id: string | null;
  post_id: string | null;
  reaction_type: string;
  created_at: string;
}