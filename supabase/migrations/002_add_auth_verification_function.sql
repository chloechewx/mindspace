/*
  # Add Auth User Verification Function
  
  Creates a helper function to verify if an auth.users record exists.
  This is used during signup to ensure the auth user is committed before creating profile.
*/

-- Create function to verify auth user exists
CREATE OR REPLACE FUNCTION public.verify_auth_user_exists(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE id = user_id
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.verify_auth_user_exists(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_auth_user_exists(uuid) TO anon;
