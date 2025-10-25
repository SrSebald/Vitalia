-- =====================================================
-- AUTHENTICATION HELPER FUNCTION
-- =====================================================
-- This function works with both Supabase auth.uid() and manual session setting
-- Useful for testing and when not using Supabase JWT

CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    -- Try Supabase auth first
    auth.uid(),
    -- Fallback to manual session variable (for testing)
    nullif(current_setting('app.current_user_id', true), '')::uuid
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_id() TO authenticated, anon, public;

COMMIT;

