import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'mindspace-auth',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'mindspace-web',
    },
  },
});

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          mood: number;
          title: string;
          content: string;
          gratitude: string;
          goals: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          mood: number;
          title: string;
          content: string;
          gratitude: string;
          goals: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          mood?: number;
          title?: string;
          content?: string;
          gratitude?: string;
          goals?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          therapist_id: string;
          therapist_name: string;
          date: string;
          time: string;
          type: string;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          therapist_id: string;
          therapist_name: string;
          date: string;
          time: string;
          type: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          therapist_id?: string;
          therapist_name?: string;
          date?: string;
          time?: string;
          type?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_bookings: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          event_name: string;
          event_date: string;
          event_time: string;
          location: string;
          organizer: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          event_name: string;
          event_date: string;
          event_time: string;
          location: string;
          organizer: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          event_name?: string;
          event_date?: string;
          event_time?: string;
          location?: string;
          organizer?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_members: {
        Row: {
          id: string;
          user_id: string;
          community_id: string;
          community_name: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          community_id: string;
          community_name: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          community_id?: string;
          community_name?: string;
          joined_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          clinic_id: string;
          clinic_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          clinic_id: string;
          clinic_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          clinic_id?: string;
          clinic_name?: string;
          created_at?: string;
        };
      };
    };
  };
}
