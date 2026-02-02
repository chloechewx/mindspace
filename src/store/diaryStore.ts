import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { geminiService } from '../services/geminiService';

export interface JournalEntry {
  id: string;
  date: Date;
  mood: number;
  gratitude: string;
  intentions: string;
  thoughts: string;
  insights?: string;
}

interface DiaryState {
  entries: JournalEntry[];
  insights: string;
  weeklyReflection: string;
  isLoading: boolean;
  isGeneratingInsights: boolean;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => Promise<void>;
  loadEntries: () => Promise<void>;
  generateInsights: (entryId: string) => Promise<void>;
  generateWeeklyReflection: () => Promise<void>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  insights: '',
  weeklyReflection: '',
  isLoading: false,
  isGeneratingInsights: false,

  addEntry: async (entry) => {
    set({ isLoading: true });

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Insert entry into database
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          mood: entry.mood,
          gratitude: entry.gratitude || '',
          intentions: entry.intentions || '',
          thoughts: entry.thoughts || '',
        })
        .select()
        .single();

      if (error) throw error;

      // Generate AI insights
      set({ isGeneratingInsights: true });
      const insights = await geminiService.generateInsights(
        entry.mood,
        entry.gratitude,
        entry.intentions,
        entry.thoughts
      );

      // Update entry with insights
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ insights })
        .eq('id', data.id);

      if (updateError) {
      }

      // Add to local state
      const newEntry: JournalEntry = {
        id: data.id,
        date: new Date(data.created_at),
        mood: data.mood,
        gratitude: data.gratitude || '',
        intentions: data.intentions || '',
        thoughts: data.thoughts || '',
        insights,
      };

      set((state) => ({
        entries: [newEntry, ...state.entries],
        insights,
        isGeneratingInsights: false,
      }));
    } catch (error) {
      set({ isGeneratingInsights: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadEntries: async () => {
    set({ isLoading: true });

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        set({ entries: [], isLoading: false });
        return;
      }

      // Load entries from database
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const entries: JournalEntry[] = (data || []).map((entry) => ({
        id: entry.id,
        date: new Date(entry.created_at),
        mood: entry.mood,
        gratitude: entry.gratitude || '',
        intentions: entry.intentions || '',
        thoughts: entry.thoughts || '',
        insights: entry.insights || '',
      }));

      set({ entries });
    } catch (error) {
      set({ entries: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  generateInsights: async (entryId: string) => {
    set({ isGeneratingInsights: true });

    try {
      const { entries } = get();
      const entry = entries.find(e => e.id === entryId);

      if (!entry) {
        throw new Error('Entry not found');
      }

      const insights = await geminiService.generateInsights(
        entry.mood,
        entry.gratitude,
        entry.intentions,
        entry.thoughts
      );

      // Update in database
      const { error } = await supabase
        .from('journal_entries')
        .update({ insights })
        .eq('id', entryId);

      if (error) throw error;

      // Update local state
      set((state) => ({
        entries: state.entries.map(e =>
          e.id === entryId ? { ...e, insights } : e
        ),
        insights,
      }));
    } catch (error) {
      throw error;
    } finally {
      set({ isGeneratingInsights: false });
    }
  },

  generateWeeklyReflection: async () => {
    set({ isGeneratingInsights: true });

    try {
      const { entries } = get();

      // Get last 7 days of entries
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentEntries = entries
        .filter(e => e.date >= sevenDaysAgo)
        .slice(0, 7);

      const weeklyReflection = await geminiService.generateWeeklyReflection(recentEntries);

      set({ weeklyReflection });
    } catch (error) {
      throw error;
    } finally {
      set({ isGeneratingInsights: false });
    }
  },
}));
