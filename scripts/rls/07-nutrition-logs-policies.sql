-- =====================================================
-- RLS POLICIES FOR NUTRITION_LOGS TABLE
-- =====================================================
-- Users can only access their own nutrition logs

-- SELECT: Users can only view their own nutrition logs
CREATE POLICY "nutrition_logs_select_own" 
ON nutrition_logs 
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- INSERT: Users can only create their own nutrition logs
CREATE POLICY "nutrition_logs_insert_own" 
ON nutrition_logs 
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- UPDATE: Users can only update their own nutrition logs
CREATE POLICY "nutrition_logs_update_own" 
ON nutrition_logs 
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

-- DELETE: Users can only delete their own nutrition logs
CREATE POLICY "nutrition_logs_delete_own" 
ON nutrition_logs 
FOR DELETE
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

COMMIT;

