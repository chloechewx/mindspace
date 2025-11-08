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
  private authStateCallback: ((user: AuthUser | null) => void) | null = null;

  async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      console.log('🚀 Starting signup process...');
      
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

      console.log('📧 Creating auth user for:', data.email);

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
        console.error('❌ Auth error:', authError);
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

      console.log('✅ Auth user created:', authData.user.id);

      await this.sleep(1000);

      const profile = await this.createProfileWithRetry(
        authData.user.id,
        data.email,
        data.name
      );

      if (!profile) {
        console.error('❌ Profile creation failed');
        return {
          user: null,
          error: 'Account created but profile setup failed. Please contact support.',
          success: false,
        };
      }

      console.log('✅ Signup completed successfully');

      const user: AuthUser = {
        id: authData.user.id,
        email: profile.email,
        name: profile.name,
        createdAt: new Date(profile.created_at),
      };

      // Trigger auth state callback immediately
      if (this.authStateCallback) {
        console.log('🔔 Triggering auth state callback after signup');
        this.authStateCallback(user);
      }

      return {
        user,
        error: null,
        success: true,
      };
    } catch (error: any) {
      console.error('💥 Signup error:', error);
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
      console.log(`🔄 Profile creation attempt ${attempt}/${maxRetries}`);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            name: name,
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            console.log('⚠️ Profile exists, fetching...');
            const { data: existing } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            return existing;
          }

          if (attempt < maxRetries) {
            console.log(`⏳ Waiting before retry...`);
            await this.sleep(1000 * attempt);
            continue;
          }

          throw error;
        }

        console.log('✅ Profile created');
        return data;
      } catch (err) {
        if (attempt === maxRetries) {
          console.error('❌ All retries failed');
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

      console.log('🔐 Signing in:', data.email);

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.error('❌ Sign in error:', authError);
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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('❌ Profile error:', profileError);
        return {
          user: null,
          error: 'Profile not found',
          success: false,
        };
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: profile.email,
        name: profile.name,
        createdAt: new Date(profile.created_at),
      };

      // Trigger auth state callback immediately
      if (this.authStateCallback) {
        console.log('🔔 Triggering auth state callback after sign in');
        this.authStateCallback(user);
      }

      return {
        user,
        error: null,
        success: true,
      };
    } catch (error: any) {
      console.error('💥 Sign in error:', error);
      return {
        user: null,
        error: error.message || 'An unexpected error occurred',
        success: false,
      };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      console.log('🔓 AuthService: Starting sign out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Supabase signOut error:', error);
        throw error;
      }
      
      console.log('✅ AuthService: Supabase sign out successful');
      
      // Trigger auth state callback
      if (this.authStateCallback) {
        console.log('🔔 Triggering auth state callback after sign out');
        this.authStateCallback(null);
      }
      
      try {
        localStorage.removeItem('mindspace-auth');
        sessionStorage.clear();
        console.log('✅ AuthService: Storage cleared');
      } catch (storageError) {
        console.warn('⚠️ Could not clear storage:', storageError);
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('💥 AuthService: Sign out error:', error);
      return { error: error.message };
    }
  }

  async getCurrentUser(): Promise<AuthResult> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        return {
          user: null,
          error: null,
          success: false,
        };
      }

      if (!session?.user) {
        console.log('ℹ️ No active session');
        return {
          user: null,
          error: null,
          success: false,
        };
      }

      console.log('✅ Session found for:', session.user.email);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        console.error('❌ Profile error:', profileError);
        return {
          user: null,
          error: 'Profile not found',
          success: false,
        };
      }

      const user: AuthUser = {
        id: session.user.id,
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
      console.error('💥 Get user error:', error);
      return {
        user: null,
        error: null,
        success: false,
      };
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    console.log('🎧 Setting up auth state change listener');
    this.authStateCallback = callback;

    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Supabase auth event:', event);
      
      if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out');
        callback(null);
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          console.log('👤 Fetching user profile after auth event');
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
