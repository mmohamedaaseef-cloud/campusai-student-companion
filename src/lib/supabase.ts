import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Profile = {
  id: string;
  full_name: string;
  college: string;
  department: string;
  year: string;
  created_at: string;
  updated_at: string;
};

export type Subject = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  subject_id: string | null;
  created_at: string;
  updated_at: string;
  subject?: Subject | null;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  subject_id: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  subject?: Subject | null;
};
