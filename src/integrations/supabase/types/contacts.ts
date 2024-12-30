export interface ContactsTable {
  Row: {
    id: string;
    user_id: string | null;
    name: string;
    email: string;
    phone: string | null;
    category: string;
    message: string;
    consent: boolean;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id?: string | null;
    name: string;
    email: string;
    phone?: string | null;
    category: string;
    message: string;
    consent?: boolean;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string | null;
    name?: string;
    email?: string;
    phone?: string | null;
    category?: string;
    message?: string;
    consent?: boolean;
    created_at?: string;
  };
}