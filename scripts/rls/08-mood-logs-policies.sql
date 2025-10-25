-- =====================================================
-- RLS POLICIES FOR MOOD_LOGS TABLE
-- =====================================================
-- Users can only access their own mood logs

-- SELECT: Users can only view their own mood logs
CREATE POLICY "mood_logs_select_own" 
ON mood_logs 
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- INSERT: Users can only create their own mood logs
CREATE POLICY "mood_logs_insert_own" 
ON mood_logs 
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- UPDATE: Users can only update their own mood logs
CREATE POLICY "mood_logs_update_own" 
ON mood_logs 
FOR UPDATE
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
)
WITH CHECK (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- DELETE: Users can only delete their own mood logs
CREATE POLICY "mood_logs_delete_own" 
ON mood_logs 
FOR DELETE
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

COMMIT;

