import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface FavoritesState {
  favorites: Set<string>;
  isLoading: boolean;
  error: string | null;
  loadFavorites: (userId: string) => Promise<void>;
  toggleFavorite: (clinicId: string, userId: string, clinicName: string) => Promise<void>;
  isFavorite: (clinicId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: new Set<string>(),
  isLoading: false,
  error: null,

  loadFavorites: async (userId: string) => {
    if (!userId) {
      console.error('❌ No user ID provided to loadFavorites');
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      console.log('📥 Loading favorites for user:', userId);
      
      const { data, error } = await supabase
        .from('favorites')
        .select('clinic_id')
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Supabase error loading favorites:', error);
        throw error;
      }

      console.log('✅ Loaded favorites:', data);
      const favoriteIds = new Set(data?.map(f => f.clinic_id) || []);
      set({ favorites: favoriteIds, isLoading: false });
      
      console.log('✅ Favorites set in store:', favoriteIds.size, 'items');
    } catch (error: any) {
      console.error('💥 Failed to load favorites:', error);
      set({ error: error.message, isLoading: false, favorites: new Set() });
    }
  },

  toggleFavorite: async (clinicId: string, userId: string, clinicName: string) => {
    if (!userId) {
      console.error('❌ No user ID provided to toggleFavorite');
      throw new Error('User must be logged in to favorite clinics');
    }

    if (!clinicId) {
      console.error('❌ No clinic ID provided to toggleFavorite');
      throw new Error('Clinic ID is required');
    }

    const { favorites } = get();
    const isFavorited = favorites.has(clinicId);

    console.log('🔄 Toggling favorite:', { 
      userId, 
      clinicId, 
      clinicName, 
      currentlyFavorited: isFavorited,
      action: isFavorited ? 'REMOVE' : 'ADD'
    });

    // Optimistic update
    const newFavorites = new Set(favorites);
    if (isFavorited) {
      newFavorites.delete(clinicId);
      console.log('🗑️ Optimistically removed from favorites');
    } else {
      newFavorites.add(clinicId);
      console.log('➕ Optimistically added to favorites');
    }
    set({ favorites: newFavorites, error: null });

    try {
      if (isFavorited) {
        // Remove from favorites
        console.log('🗑️ Removing from database...');
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('clinic_id', clinicId);

        if (error) {
          console.error('❌ Delete error:', error);
          throw error;
        }
        console.log('✅ Successfully removed from database');
      } else {
        // Add to favorites
        console.log('➕ Adding to database...');
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            clinic_id: clinicId,
            clinic_name: clinicName,
          });

        if (error) {
          // Check if it's a duplicate key error (already exists)
          if (error.code === '23505') {
            console.log('⚠️ Already favorited (duplicate key)');
            return;
          }
          console.error('❌ Insert error:', error);
          throw error;
        }
        console.log('✅ Successfully added to database');
      }
    } catch (error: any) {
      console.error('💥 Failed to toggle favorite:', error);
      // Revert optimistic update on error
      set({ favorites, error: error.message });
      throw error;
    }
  },

  isFavorite: (clinicId: string) => {
    const isFav = get().favorites.has(clinicId);
    return isFav;
  },

  clearFavorites: () => {
    console.log('🧹 Clearing all favorites');
    set({ favorites: new Set(), error: null });
  },
}));
