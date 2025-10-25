-- =====================================================
-- RLS POLICIES FOR SETS TABLE
-- =====================================================
-- Users can only access sets from their own workouts

-- SELECT: Users can view sets from their own workouts
CREATE POLICY "sets_select_own" 
ON sets 
FOR SELECT
USING (
  workout_id IN (
    SELECT id FROM workouts 
    WHERE user_id IN (
      SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
    )
  )
);

-- INSERT: Users can only insert sets into their own workouts
CREATE POLICY "sets_insert_own" 
ON sets 
FOR INSERT
WITH CHECK (
  workout_id IN (
    SELECT id FROM workouts 
    WHERE user_id IN (
      SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
    )
  )
);

-- UPDATE: Users can only update sets from their own workouts
CREATE POLICY "sets_update_own" 
ON sets 
FOR UPDATE
USING (
  workout_id IN (
    SELECT id FROM workouts 
    WHERE user_id IN (
      SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
    )
  )
)
WITH CHECK (
  workout_id IN (
    SELECT id FROM workouts 
    WHERE user_id IN (
      SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
    )
  )
);

-- DELETE: Users can only delete sets from their own workouts
CREATE POLICY "sets_delete_own" 
ON sets 
FOR DELETE
USING (
  workout_id IN (
    SELECT id FROM workouts 
    WHERE user_id IN (
      SELECT id FROM profiles WHERE auth_user_id = public.get_current_user_id()
    )
  )
);

COMMIT;


