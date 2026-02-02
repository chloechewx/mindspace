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
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('clinic_id')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      const favoriteIds = new Set(data?.map(f => f.clinic_id) || []);
      set({ favorites: favoriteIds, isLoading: false });

    } catch (error: any) {
      set({ error: error.message, isLoading: false, favorites: new Set() });
    }
  },

  toggleFavorite: async (clinicId: string, userId: string, clinicName: string) => {
    if (!userId) {
      throw new Error('User must be logged in to favorite clinics');
    }

    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    const { favorites } = get();
    const isFavorited = favorites.has(clinicId);

    // Optimistic update
    const newFavorites = new Set(favorites);
    if (isFavorited) {
      newFavorites.delete(clinicId);
    } else {
      newFavorites.add(clinicId);
    }
    set({ favorites: newFavorites, error: null });

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('clinic_id', clinicId);

        if (error) {
          throw error;
        }
      } else {
        // Add to favorites
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
            return;
          }
          throw error;
        }
      }
    } catch (error: any) {
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
    set({ favorites: new Set(), error: null });
  },
}));
