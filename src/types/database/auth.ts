export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}