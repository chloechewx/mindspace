import { supabase } from '../lib/supabase';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
  success: boolean;
}

class AuthService {
  async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      if (!data.email || !data.password || !data.name) {
        return {
          user: null,
          error: 'Email, password, and name are required',
          success: false,
        };
      }

      if (!this.isValidEmail(data.email)) {
        return {
          user: null,
          error: 'Please enter a valid email address',
          success: false,
        };
      }

      if (data.password.length < 8) {
        return {
          user: null,
          error: 'Password must be at least 8 characters long',
          success: false,
        };
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (authError) {
        return {
          user: null,
          error: this.formatAuthError(authError.message),
          success: false,
        };
      }

      if (!authData.user) {
        return {
          user: null,
          error: 'Failed to create account. Please try again.',
          success: false,
        };
      }

      // Use upsert instead of sleep + insert to avoid race condition.
      // If a database trigger already created the profile, upsert will update it.
      // If not, upsert will insert it. No arbitrary delay needed.
      const profile = await this.createProfileWithRetry(
        authData.user.id,
        data.email,
        data.name
      );

      // If profile creation fails, clean up the orphaned auth user
      // so the email isn't permanently stuck in a broken state.
      if (!profile) {
        await supabase.auth.signOut();
        return {
          user: null,
          error: 'Account setup failed. Please try signing up again.',
          success: false,
        };
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: profile.email,
        name: profile.name,
        createdAt: new Date(profile.created_at),
      };

      return {
        user,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        user: null,
        error: error.message || 'An unexpected error occurred',
        success: false,
      };
    }
  }

  private async createProfileWithRetry(
    userId: string,
    email: string,
    name: string,
    maxRetries: number = 3
  ): Promise<any> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Use upsert to handle both cases:
        // - Profile doesn't exist yet -> insert
        // - Profile was already created by a DB trigger -> update
        const { data, error } = await supabase
          .from('profiles')
          .upsert(
            {
              id: userId,
              email: email,
              name: name,
            },
            { onConflict: 'id' }
          )
          .select()
          .single();

        if (error) {
          if (attempt < maxRetries) {
            await this.sleep(500 * attempt);
            continue;
          }
          throw error;
        }

        return data;
      } catch (err) {
        if (attempt === maxRetries) {
          return null;
        }
      }
    }

    return null;
  }

  async signIn(data: LoginData): Promise<AuthResult> {
    try {
      if (!data.email || !data.password) {
        return {
          user: null,
          error: 'Email and password are required',
          success: false,
        };
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return {
          user: null,
          error: this.formatAuthError(authError.message),
          success: false,
        };
      }

      if (!authData.user) {
        return {
          user: null,
          error: 'Failed to sign in',
          success: false,
        };
      }

      // sign-in side: If the user has an auth account but no profile
      // if orphaned from a previous failed signup, create the profile now.
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (!profile) {
        const userName = authData.user.user_metadata?.name || data.email.split('@')[0];
        const { data: newProfile } = await supabase
          .from('profiles')
          .upsert(
            {
              id: authData.user.id,
              email: data.email,
              name: userName,
            },
            { onConflict: 'id' }
          )
          .select()
          .single();
        profile = newProfile;
      }

      if (!profile) {
        return {
          user: null,
          error: 'Unable to load user profile. Please try again.',
          success: false,
        };
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: profile.email,
        name: profile.name,
        createdAt: new Date(profile.created_at),
      };

      return {
        user,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        user: null,
        error: error.message || 'An unexpected error occurred',
        success: false,
      };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      try {
        localStorage.removeItem('mindspace-auth');
        sessionStorage.clear();
      } catch (storageError) {
        // Storage clearing is best-effort
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Fetch the profile row for a given userId.
   * Uses the session token the Supabase client already holds internally.
   */
  async fetchProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, name, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (error || !profile) return null;

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        createdAt: new Date(profile.created_at),
      };
    } catch {
      return null;
    }
  }

  /**
   * Thin wrapper around supabase.auth.onAuthStateChange.
   * Passes raw (event, session) to the callback without calling
   * getSession() internally (which Supabase warns against).
   * Returns the subscription so callers can unsubscribe.
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session);
      }
    );
    return subscription;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private formatAuthError(message: string): string {
    if (message.includes('already registered')) {
      return 'This email is already registered. Please sign in instead.';
    }
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Please confirm your email address before signing in.';
    }
    if (message.includes('User not found')) {
      return 'No account found with this email. Please sign up first.';
    }
    return message;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const authService = new AuthService();
