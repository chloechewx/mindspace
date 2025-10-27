/*
  # Fix Profile Creation Trigger Permissions
  
  This migration ensures the trigger can create profiles by:
  1. Recreating the trigger function with proper permissions
  2. Ensuring RLS policies allow the trigger to insert
  3. Adding better error handling and logging
*/

-- ============================================================================
-- 1. DROP AND RECREATE TRIGGER FUNCTION WITH PROPER PERMISSIONS
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER -- This allows bypassing RLS
SET search_path = public
AS $$
DECLARE
  v_name text;
BEGIN
  -- Get name from metadata or use email prefix
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Log the attempt
  RAISE LOG 'Creating profile for user % with email % and name %', NEW.id, NEW.email, v_name;
  
  -- Insert profile (this will bypass RLS due to SECURITY DEFINER)
  INSERT INTO public.profiles (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW();
  
  RAISE LOG 'Profile created successfully for user %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW; -- Don't fail the user creation
END;
$$;

-- ============================================================================
-- 2. GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- ============================================================================
-- 3. RECREATE TRIGGER
-- ============================================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. ADD FALLBACK RLS POLICY FOR MANUAL CREATION
-- ============================================================================

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON public.profiles;

-- Allow authenticated users to insert their own profile (fallback)
CREATE POLICY "Users can insert own profile during signup"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '=== Profile Creation Trigger Fixed ===';
  RAISE NOTICE 'Function: handle_new_user() with SECURITY DEFINER';
  RAISE NOTICE 'Trigger: on_auth_user_created on auth.users';
  RAISE NOTICE 'Permissions: Granted to authenticated and service_role';
  RAISE NOTICE 'Fallback: Manual insert policy added';
END $$;
