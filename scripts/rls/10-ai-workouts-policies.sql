-- =====================================================
-- RLS POLICIES FOR AI_GENERATED_WORKOUTS TABLE
-- =====================================================
-- Users can only access their own AI-generated workouts

-- Enable RLS
ALTER TABLE ai_generated_workouts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "ai_generated_workouts_select_own" ON ai_generated_workouts;
DROP POLICY IF EXISTS "ai_generated_workouts_insert_own" ON ai_generated_workouts;
DROP POLICY IF EXISTS "ai_generated_workouts_update_own" ON ai_generated_workouts;
DROP POLICY IF EXISTS "ai_generated_workouts_delete_own" ON ai_generated_workouts;

-- SELECT: Users can only view their own AI-generated workouts
CREATE POLICY "ai_generated_workouts_select_own" 
ON ai_generated_workouts 
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- INSERT: Users can only create their own AI-generated workouts
CREATE POLICY "ai_generated_workouts_insert_own" 
ON ai_generated_workouts 
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- UPDATE: Users can only update their own AI-generated workouts
CREATE POLICY "ai_generated_workouts_update_own" 
ON ai_generated_workouts 
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

-- DELETE: Users can only delete their own AI-generated workouts
CREATE POLICY "ai_generated_workouts_delete_own" 
ON ai_generated_workouts 
FOR DELETE
USING (
  user_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

COMMIT;

