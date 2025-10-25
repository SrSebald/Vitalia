-- =====================================================
-- RLS POLICIES FOR EXERCISES TABLE
-- =====================================================
-- Public exercises are visible to all
-- Private exercises are only visible to their creator

-- SELECT: Users can see all public exercises + their own private exercises
CREATE POLICY "exercises_select_all" 
ON exercises 
FOR SELECT
USING (
  is_public = true 
  OR created_by IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- INSERT: Users can create exercises linked to their profile
CREATE POLICY "exercises_insert_own" 
ON exercises 
FOR INSERT
WITH CHECK (
  created_by IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
  OR created_by IS NULL
);

-- UPDATE: Users can only update their own exercises
CREATE POLICY "exercises_update_own" 
ON exercises 
FOR UPDATE
USING (
  created_by IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
)
WITH CHECK (
  created_by IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- DELETE: Users can only delete their own exercises
CREATE POLICY "exercises_delete_own" 
ON exercises 
FOR DELETE
USING (
  created_by IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

COMMIT;

