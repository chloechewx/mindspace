/*
  # Fix Profiles Table RLS Policy

  ## Problem
  The current RLS policy on the profiles table only allows SELECT and UPDATE operations.
  When a new user signs up, the authService tries to INSERT a profile row, but there's
  no INSERT policy, causing the "new row violates row-level security policy" error.

  ## Solution
  Add an INSERT policy that allows authenticated users to create their own profile
  during the signup process. The policy checks that the user_id matches auth.uid().

  ## Security Implications
  - Users can only insert a profile for themselves (id must match auth.uid())
  - Users cannot create profiles for other users
  - The policy maintains data isolation between users
  - All other operations (SELECT, UPDATE, DELETE) remain restricted to own data

  ## Changes
  1. Add INSERT policy for profiles table
  2. Add DELETE policy for profiles table (for account deletion)
  3. Ensure all policies use auth.uid() for proper user isolation
*/

-- Drop existing policies to recreate them with correct permissions
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create comprehensive RLS policies for profiles table

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile (for account deletion)
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Create a function to automatically create a profile when a user signs up
-- This is a backup mechanism in case the application doesn't create the profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
