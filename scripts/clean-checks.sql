-- Limpiar CHECK constraints que pueden estar causando problemas con drizzle-kit
-- Ejecuta esto en el SQL Editor de Supabase

-- Profiles
ALTER TABLE IF EXISTS profiles DROP CONSTRAINT IF EXISTS height_positive;
ALTER TABLE IF EXISTS profiles DROP CONSTRAINT IF EXISTS weight_positive;

-- Workouts
ALTER TABLE IF EXISTS workouts DROP CONSTRAINT IF EXISTS duration_positive;

-- Sets
ALTER TABLE IF EXISTS sets DROP CONSTRAINT IF EXISTS reps_positive;
ALTER TABLE IF EXISTS sets DROP CONSTRAINT IF EXISTS weight_positive;
ALTER TABLE IF EXISTS sets DROP CONSTRAINT IF EXISTS distance_positive;
ALTER TABLE IF EXISTS sets DROP CONSTRAINT IF EXISTS duration_positive;

-- Nutrition Logs
ALTER TABLE IF EXISTS nutrition_logs DROP CONSTRAINT IF EXISTS calories_positive;

-- Mood Logs
ALTER TABLE IF EXISTS mood_logs DROP CONSTRAINT IF EXISTS mood_rating_range;

-- Ahora drizzle-kit puede hacer push y recrear estos constraints correctamente

