import { create } from 'zustand';
import { authService, AuthUser } from '../services/authService.ts';

interface UserState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  initializeAuth: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}

// Removed Zustand persist middleware entirely.
// Auth state is now always derived from the Supabase session on app init
// via initializeAuth(). This prevents desync between localStorage and
// the actual Supabase session (e.g. expired token but isAuthenticated: true).
export const useUserStore = create<UserState>()(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInitialized: false,

    setUser: (user: AuthUser | null) => {
      set({
        user,
        isAuthenticated: !!user,
      });
    },

    initializeAuth: async () => {
      if (get().isInitialized) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const result = await authService.getCurrentUser();

        if (result.success && result.user) {
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }

        // Only source of auth state updates after init.
        // signUp/signIn methods set state directly for immediate UI response,
        // and this listener handles all subsequent events (token refresh, etc.)
        authService.onAuthStateChange((user) => {
          set({
            user,
            isAuthenticated: !!user,
          });
        });
      } catch (error: any) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error.message,
          isInitialized: true,
        });
      }
    },

    signUp: async (email: string, password: string, name: string) => {
      set({ isLoading: true, error: null });

      try {
        const result = await authService.signUp({ email, password, name });

        if (result.success && result.user) {
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } else {
          set({
            isLoading: false,
            error: result.error || 'Sign up failed',
          });
          return false;
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.message || 'An unexpected error occurred',
        });
        return false;
      }
    },

    signIn: async (email: string, password: string) => {
      set({ isLoading: true, error: null });

      try {
        const result = await authService.signIn({ email, password });

        if (result.success && result.user) {
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } else {
          set({
            isLoading: false,
            error: result.error || 'Sign in failed',
          });
          return false;
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.message || 'An unexpected error occurred',
        });
        return false;
      }
    },

    signOut: async () => {
      try {
        const result = await authService.signOut();

        if (result.error) {
          throw new Error(result.error);
        }

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        try {
          localStorage.removeItem('mindspace-user-storage');
          localStorage.removeItem('mindspace-auth');
        } catch (e) {
          // Best-effort storage cleanup
        }
      } catch (error: any) {
        // Even on error, force clear local state
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        try {
          localStorage.removeItem('mindspace-user-storage');
          localStorage.removeItem('mindspace-auth');
        } catch (e) {
          
        }

        throw error;
      }
    },

    clearError: () => {
      set({ error: null });
    },
  })
);
