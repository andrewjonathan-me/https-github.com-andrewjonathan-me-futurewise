export interface UserReactionsTable {
  Row: {
    id: string;
    user_id: string;
    comment_id: string;
    post_id: string | null;
    reaction_type: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    comment_id: string;
    post_id?: string | null;
    reaction_type: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    comment_id?: string;
    post_id?: string | null;
    reaction_type?: string;
    created_at?: string;
  };
}