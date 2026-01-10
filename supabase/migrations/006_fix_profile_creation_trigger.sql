/*
  # Fix Profile Creation Trigger
  
  This migration fixes the automatic profile creation by:
  1. Granting proper permissions to the trigger function
  2. Ensuring the trigger can bypass RLS policies
  3. Adding better error logging
  4. Creating a service role policy for the trigger
*/

-- ============================================================================
-- 1. DROP EXISTING TRIGGER AND FUNCTION
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================================================
-- 2. CREATE IMPROVED TRIGGER FUNCTION WITH PROPER PERMISSIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
SET search_path = public, auth
AS $$
DECLARE
  v_name text;
BEGIN
  -- Extract name from metadata, default to 'User' if not provided
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'User'
  );
  
  -- Log the attempt
  RAISE LOG 'Creating profile for user: % with email: % and name: %', NEW.id, NEW.email, v_name;
  
  -- Insert profile with explicit column specification
  INSERT INTO public.profiles (
    id,
    email,
    name,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    v_name,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name),
    updated_at = NOW();
  
  -- Log success
  RAISE LOG 'Profile created successfully for user: %', NEW.id;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log detailed error
    RAISE WARNING 'Failed to create profile for user %: % (SQLSTATE: %)', 
      NEW.id, SQLERRM, SQLSTATE;
    -- Don't fail the user creation, just log the error
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 3. GRANT NECESSARY PERMISSIONS
-- ============================================================================

-- Grant permissions on profiles table to service role
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO postgres;

-- Ensure the function can be executed
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

-- ============================================================================
-- 4. ADD SERVICE ROLE POLICY FOR TRIGGER
-- ============================================================================

-- Drop existing service role policy if it exists
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

-- Create policy that allows service role to insert profiles
CREATE POLICY "Service role can insert profiles"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Also allow authenticated role to insert their own profile (backup)
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON public.profiles;

CREATE POLICY "Users can insert own profile during signup"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 5. RECREATE TRIGGER
-- ============================================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. TEST THE TRIGGER (Optional - for verification)
-- ============================================================================

-- You can test this by creating a test user:
-- SELECT auth.uid(); -- Should return null if not authenticated
-- Then sign up through your app and check if profile is created

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '=== Profile Creation Trigger Fixed ===';
  RAISE NOTICE 'Trigger: on_auth_user_created';
  RAISE NOTICE 'Function: handle_new_user() with SECURITY DEFINER';
  RAISE NOTICE 'Permissions: Granted to service_role and postgres';
  RAISE NOTICE 'RLS Policy: Service role can insert profiles';
  RAISE NOTICE '';
  RAISE NOTICE 'The trigger will now automatically create profiles when users sign up.';
  RAISE NOTICE 'Check Supabase logs if issues persist.';
END $$;
