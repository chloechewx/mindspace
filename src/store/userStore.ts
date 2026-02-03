import { create } from 'zustand';
import { authService, AuthUser } from '../services/authService.ts';
import type { AuthChangeEvent, Session, Subscription } from '@supabase/supabase-js';

const AUTH_INIT_TIMEOUT_MS = 5000;
const PROFILE_FETCH_TIMEOUT_MS = 4000;

interface UserState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  initializeAuth: () => () => void;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

// Auth state is always derived from the Supabase session on app init
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
      set({ user, isAuthenticated: !!user });
    },

    /**
     * Sets up the Supabase auth listener and returns a cleanup function.
     *
     * Uses INITIAL_SESSION event as the single source of truth for
     * session readiness. The session param from the callback is used
     * directly — getSession() is never called inside the listener.
     */
    initializeAuth: () => {
      if (get().isInitialized) {
        return () => {};
      }

      set({ isLoading: true, error: null });

      let initialSessionHandled = false;
      let subscription: Subscription | null = null;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const markInitialized = (user: AuthUser | null) => {
        if (initialSessionHandled) return;
        initialSessionHandled = true;
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          isInitialized: true,
        });
      };

      const updateUser = (user: AuthUser | null) => {
        set({ user, isAuthenticated: !!user });
      };

      const fetchProfileSafe = async (userId: string): Promise<AuthUser | null> => {
        return withTimeout(authService.fetchProfile(userId), PROFILE_FETCH_TIMEOUT_MS);
      };

      subscription = authService.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {

          if (event === 'INITIAL_SESSION') {
            if (session?.user) {
              const profile = await fetchProfileSafe(session.user.id);
              if (profile) {
                markInitialized(profile);
              } else {
                // Profile fetch failed/timed out — use session metadata as fallback
                const fallbackUser: AuthUser = {
                  id: session.user.id,
                  email: session.user.email ?? '',
                  name: session.user.user_metadata?.name ?? session.user.email?.split('@')[0] ?? 'User',
                  createdAt: new Date(session.user.created_at),
                };
                markInitialized(fallbackUser);
              }
            } else {
              markInitialized(null);
            }
            return;
          }

          // Only process post-init events after initialization
          if (!initialSessionHandled) return;

          if (event === 'SIGNED_OUT') {
            updateUser(null);
            return;
          }

          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            if (session?.user) {
              const profile = await fetchProfileSafe(session.user.id);
              if (profile) {
                updateUser(profile);
              }
            }
            return;
          }

          // TOKEN_REFRESHED: no action needed.
          // The token is already updated in the Supabase client internally.
          // Profile data hasn't changed, so no DB query needed.
        }
      );

      // Fallback: if INITIAL_SESSION never fires (corrupt localStorage, SDK issue),
      // clear storage and load as unauthenticated.
      timeoutId = setTimeout(() => {
        if (!initialSessionHandled) {
          try {
            localStorage.removeItem('mindspace-auth');
          } catch { /* best-effort */ }
          markInitialized(null);
        }
      }, AUTH_INIT_TIMEOUT_MS);

      // Return cleanup function for useEffect
      return () => {
        if (subscription) {
          subscription.unsubscribe();
          subscription = null;
        }
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };
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
          // Best-effort storage cleanup
        }

        throw error;
      }
    },

    clearError: () => {
      set({ error: null });
    },
  })
);
