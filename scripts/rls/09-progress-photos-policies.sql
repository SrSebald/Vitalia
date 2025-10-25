-- =====================================================
-- RLS POLICIES FOR PROGRESS_PHOTOS TABLE
-- =====================================================
-- Users can only access their own progress photos

-- SELECT: Users can only view their own progress photos
CREATE POLICY "progress_photos_select_own" 
ON progress_photos 
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- INSERT: Users can only create their own progress photos
CREATE POLICY "progress_photos_insert_own" 
ON progress_photos 
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- UPDATE: Users can only update their own progress photos
CREATE POLICY "progress_photos_update_own" 
ON progress_photos 
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

-- DELETE: Users can only delete their own progress photos
CREATE POLICY "progress_photos_delete_own" 
ON progress_photos 
FOR DELETE
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

COMMIT;

