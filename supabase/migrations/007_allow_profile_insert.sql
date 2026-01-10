/*
  # Allow Profile Insert for Authenticated Users
  
  This migration fixes the RLS policy to allow authenticated users to insert their own profile.
  This is needed for the manual fallback when the trigger is slow.
  
  1. Changes
    - Add INSERT policy for authenticated users to create their own profile
    - Ensures users can only insert a profile with their own user ID
  
  2. Security
    - Users can only insert profiles where id = auth.uid()
    - Prevents users from creating profiles for other users
    - Works alongside existing SELECT and UPDATE policies
*/

-- Drop existing policy if it exists (in case of re-run)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create policy that allows authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verify all policies are in place
DO $$
BEGIN
  RAISE NOTICE '=== Profile RLS Policies Updated ===';
  RAISE NOTICE 'INSERT: Users can insert own profile (auth.uid() = id)';
  RAISE NOTICE 'SELECT: Users can read own profile';
  RAISE NOTICE 'UPDATE: Users can update own profile';
  RAISE NOTICE '';
  RAISE NOTICE 'Manual profile creation fallback will now work!';
END $$;
