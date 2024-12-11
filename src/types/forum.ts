export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };  // Changed from array to single object
  attachments?: Attachment[];
  // UI state
  isLiked?: boolean;
  likes?: number;
}

export interface Attachment {
  id: string;
  post_id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  likes: number;
  loves: number;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

export interface UserReaction {
  id: string;
  user_id: string;
  comment_id: string;
  reaction_type: string;
  created_at: string;
}
