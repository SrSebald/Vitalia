-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- =====================================================
-- This script enables RLS on all application tables
-- RLS ensures users can only access their own data

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for re-running this script)
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;

DROP POLICY IF EXISTS "exercises_select_all" ON exercises;
DROP POLICY IF EXISTS "exercises_insert_own" ON exercises;
DROP POLICY IF EXISTS "exercises_update_own" ON exercises;
DROP POLICY IF EXISTS "exercises_delete_own" ON exercises;

DROP POLICY IF EXISTS "workouts_select_own" ON workouts;
DROP POLICY IF EXISTS "workouts_insert_own" ON workouts;
DROP POLICY IF EXISTS "workouts_update_own" ON workouts;
DROP POLICY IF EXISTS "workouts_delete_own" ON workouts;

DROP POLICY IF EXISTS "sets_select_own" ON sets;
DROP POLICY IF EXISTS "sets_insert_own" ON sets;
DROP POLICY IF EXISTS "sets_update_own" ON sets;
DROP POLICY IF EXISTS "sets_delete_own" ON sets;

DROP POLICY IF EXISTS "nutrition_logs_select_own" ON nutrition_logs;
DROP POLICY IF EXISTS "nutrition_logs_insert_own" ON nutrition_logs;
DROP POLICY IF EXISTS "nutrition_logs_update_own" ON nutrition_logs;
DROP POLICY IF EXISTS "nutrition_logs_delete_own" ON nutrition_logs;

DROP POLICY IF EXISTS "mood_logs_select_own" ON mood_logs;
DROP POLICY IF EXISTS "mood_logs_insert_own" ON mood_logs;
DROP POLICY IF EXISTS "mood_logs_update_own" ON mood_logs;
DROP POLICY IF EXISTS "mood_logs_delete_own" ON mood_logs;

DROP POLICY IF EXISTS "progress_photos_select_own" ON progress_photos;
DROP POLICY IF EXISTS "progress_photos_insert_own" ON progress_photos;
DROP POLICY IF EXISTS "progress_photos_update_own" ON progress_photos;
DROP POLICY IF EXISTS "progress_photos_delete_own" ON progress_photos;

COMMIT;

