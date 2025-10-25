-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================
-- For Supabase, auth.uid() is already available
-- We just need to create public helper functions if needed

-- Note: Supabase provides auth.uid() which returns the authenticated user's ID
-- This function is already available in Supabase and doesn't need to be created

-- Function to check if user owns a workout (optional helper)
CREATE OR REPLACE FUNCTION public.owns_workout(workout_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workouts 
    WHERE id = workout_id 
    AND user_id IN (
      SELECT id FROM profiles WHERE auth_user_id = auth.uid()
    )
  );
$$;

-- Function to check if user owns a profile (optional helper)
CREATE OR REPLACE FUNCTION public.owns_profile(profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = profile_id 
    AND auth_user_id = auth.uid()
  );
$$;

-- Create a simple wrapper for compatibility (optional)
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.owns_workout(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.owns_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_id() TO authenticated;

COMMIT;

