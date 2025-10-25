-- =====================================================
-- RLS POLICIES FOR PROFILES TABLE
-- =====================================================
-- Users can only view and modify their own profile

-- SELECT: Users can view their own profile
CREATE POLICY "profiles_select_own" 
ON profiles 
FOR SELECT
USING (auth_user_id = public.get_current_user_id());

-- INSERT: Users can create their own profile
CREATE POLICY "profiles_insert_own" 
ON profiles 
FOR INSERT
WITH CHECK (auth_user_id = public.get_current_user_id());

-- UPDATE: Users can only update their own profile
CREATE POLICY "profiles_update_own" 
ON profiles 
FOR UPDATE
USING (auth_user_id = public.get_current_user_id())
WITH CHECK (auth_user_id = public.get_current_user_id());

-- DELETE: Users can delete their own profile
CREATE POLICY "profiles_delete_own" 
ON profiles 
FOR DELETE
USING (auth_user_id = public.get_current_user_id());

-- Create index for performance
CREATE INDEX IF NOT EXISTS profiles_auth_user_id_idx ON profiles(auth_user_id);

COMMIT;


