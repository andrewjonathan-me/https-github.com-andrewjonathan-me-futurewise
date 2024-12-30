export interface ForumPostsTable {
  Row: {
    id: string;
    user_id: string;
    title: string;
    content: string;
    category: string;
    likes: number | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    title: string;
    content: string;
    category: string;
    likes?: number | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    title?: string;
    content?: string;
    category?: string;
    likes?: number | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ForumCommentsTable {
  Row: {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    likes: number | null;
    loves: number | null;
    parent_id: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    post_id: string;
    user_id: string;
    content: string;
    likes?: number | null;
    loves?: number | null;
    parent_id?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    post_id?: string;
    user_id?: string;
    content?: string;
    likes?: number | null;
    loves?: number | null;
    parent_id?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ForumAttachmentsTable {
  Row: {
    id: string;
    post_id: string;
    type: string;
    url: string;
    name: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    post_id: string;
    type: string;
    url: string;
    name?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    post_id?: string;
    type?: string;
    url?: string;
    name?: string | null;
    created_at?: string;
  };
}