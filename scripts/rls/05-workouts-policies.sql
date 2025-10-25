-- =====================================================
-- RLS POLICIES FOR WORKOUTS TABLE
-- =====================================================
-- Users can only access their own workouts

-- SELECT: Users can only view their own workouts
CREATE POLICY "workouts_select_own" 
ON workouts 
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
  )
);

-- INSERT: Users can only create workouts for themselves
CREATE POLICY "workouts_insert_own" 
ON workouts 
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
  )
);

-- UPDATE: Users can only update their own workouts
CREATE POLICY "workouts_update_own" 
ON workouts 
FOR UPDATE
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
  )
)
WITH CHECK (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
  )
);

-- DELETE: Users can only delete their own workouts
CREATE POLICY "workouts_delete_own" 
ON workouts 
FOR DELETE
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
  )
);

COMMIT;


