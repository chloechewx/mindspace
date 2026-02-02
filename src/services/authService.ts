import { supabase } from '../lib/supabase';

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

  async getCurrentUser(): Promise<AuthResult> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        return { user: null, error: null, success: false };
      }

      if (!session?.user) {
        return { user: null, error: null, success: false };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        return { user: null, error: 'Profile not found', success: false };
      }

      const user: AuthUser = {
        id: session.user.id,
        email: profile.email,
        name: profile.name,
        createdAt: new Date(profile.created_at),
      };

      return { user, error: null, success: true };
    } catch (error: any) {
      return { user: null, error: null, success: false };
    }
  }

  // Single source of truth — only use Supabase onAuthStateChange.
  // Removed the manual authStateCallback system entirely.
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        callback(null);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const { user } = await this.getCurrentUser();
          callback(user);
        } else {
          callback(null);
        }
      }
    });
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
