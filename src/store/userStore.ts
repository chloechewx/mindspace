import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      setUser: (user: AuthUser | null) => {
        console.log('👤 Setting user in store:', user ? user.email : 'null');
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      initializeAuth: async () => {
        if (get().isInitialized) {
          console.log('⚠️ Auth already initialized, skipping...');
          return;
        }

        console.log('🔐 Initializing auth...');
        set({ isLoading: true, error: null });

        try {
          const result = await authService.getCurrentUser();
          
          if (result.success && result.user) {
            console.log('✅ User session restored:', result.user.email);
            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            console.log('ℹ️ No active session found');
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            });
          }

          // Set up auth state change listener
          authService.onAuthStateChange((user) => {
            console.log('🔔 Auth state changed:', user ? user.email : 'logged out');
            
            // Update store immediately
            set({
              user,
              isAuthenticated: !!user,
            });
          });
        } catch (error: any) {
          console.error('❌ Auth initialization error:', error);
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
            console.log('✅ Sign up successful, updating state immediately');
            
            // Update state immediately
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
            console.log('✅ Sign in successful, updating state immediately');
            
            // Update state immediately
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
        console.log('🚪 Sign out initiated from store...');
        
        try {
          console.log('🔓 Calling Supabase signOut...');
          const result = await authService.signOut();
          
          if (result.error) {
            console.error('❌ Supabase sign out error:', result.error);
            throw new Error(result.error);
          }

          console.log('✅ Supabase session cleared');

          // Clear Zustand state immediately
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          console.log('✅ Zustand state cleared');

          // Clear localStorage manually
          try {
            localStorage.removeItem('mindspace-user-storage');
            localStorage.removeItem('mindspace-auth');
            console.log('✅ localStorage cleared');
          } catch (e) {
            console.warn('⚠️ Could not clear localStorage:', e);
          }

          console.log('✅ Sign out complete');
        } catch (error: any) {
          console.error('💥 Sign out error:', error);
          
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
            console.warn('⚠️ Could not clear localStorage:', e);
          }
          
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'mindspace-user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
