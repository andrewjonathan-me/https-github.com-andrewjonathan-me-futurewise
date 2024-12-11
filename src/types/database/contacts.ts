export interface Contact {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  category: string;
  message: string;
  consent: boolean;
  created_at: string;
}