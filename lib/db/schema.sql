-- Gym, Nutrition & Wellness App schema for Supabase/PostgreSQL
-- This script creates tables, auxiliary indexes, trigger/function for automatic profile creation,
-- and enforces row level security with policies tailored for Supabase.

BEGIN;

-- ---------------------------------------------------------------------------
-- Shared extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ---------------------------------------------------------------------------
-- 1. profiles: one-to-one with auth.users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id                uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    full_name         text,
    username          citext UNIQUE,
    height_cm         numeric(5,2),
    weight_kg         numeric(5,2),
    date_of_birth     date,
    fitness_goals     text,
    activity_level    text,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT height_positive CHECK (height_cm IS NULL OR height_cm > 0),
    CONSTRAINT weight_positive CHECK (weight_kg IS NULL OR weight_kg > 0)
);

-- ---------------------------------------------------------------------------
-- 2. exercises: shared exercise library
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercises (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by    uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
    name          text NOT NULL,
    muscle_group  text,
    equipment     text,
    description   text,
    is_public     boolean NOT NULL DEFAULT true,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    UNIQUE (LOWER(name))
);

-- ---------------------------------------------------------------------------
-- 3. workouts: individual workout session
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workouts (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    name           text NOT NULL,
    workout_date   date NOT NULL DEFAULT current_date,
    duration_min   integer,
    notes          text,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT duration_positive CHECK (duration_min IS NULL OR duration_min > 0)
);

-- ---------------------------------------------------------------------------
-- 4. sets: exercise sets tracked within a workout
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sets (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id     uuid NOT NULL REFERENCES public.workouts (id) ON DELETE CASCADE,
    exercise_id    uuid REFERENCES public.exercises (id),
    set_order      integer,
    reps           integer,
    weight_kg      numeric(6,2),
    distance_m     numeric(8,2),
    duration_sec   integer,
    intensity      text,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT reps_positive CHECK (reps IS NULL OR reps > 0),
    CONSTRAINT weight_positive CHECK (weight_kg IS NULL OR weight_kg >= 0),
    CONSTRAINT distance_positive CHECK (distance_m IS NULL OR distance_m >= 0),
    CONSTRAINT duration_positive CHECK (duration_sec IS NULL OR duration_sec >= 0)
);

CREATE INDEX IF NOT EXISTS sets_workout_id_idx ON public.sets (workout_id);
CREATE INDEX IF NOT EXISTS sets_exercise_id_idx ON public.sets (exercise_id);

-- ---------------------------------------------------------------------------
-- 5. nutrition_logs: nutrition tracking
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    consumed_at    timestamptz NOT NULL DEFAULT now(),
    meal_type      text,
    food_item      text NOT NULL,
    serving_size   text,
    calories       integer,
    protein_g      numeric(6,2),
    carbs_g        numeric(6,2),
    fat_g          numeric(6,2),
    notes          text,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT calories_positive CHECK (calories IS NULL OR calories >= 0)
);

CREATE INDEX IF NOT EXISTS nutrition_logs_user_id_idx ON public.nutrition_logs (user_id);
CREATE INDEX IF NOT EXISTS nutrition_logs_consumed_at_idx ON public.nutrition_logs (consumed_at);

-- ---------------------------------------------------------------------------
-- 6. mood_logs: mood tracking (NEW)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mood_logs (
    id          bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id     uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    mood_rating integer NOT NULL,
    notes       text,
    logged_at   timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT mood_rating_range CHECK (mood_rating BETWEEN 1 AND 5)
);

CREATE INDEX IF NOT EXISTS mood_logs_user_id_idx ON public.mood_logs (user_id);

-- ---------------------------------------------------------------------------
-- 7. progress_photos: link to Supabase Storage assets
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.progress_photos (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    image_url      text NOT NULL, -- path or public URL in Supabase Storage
    caption        text,
    taken_on       date,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS progress_photos_user_id_idx ON public.progress_photos (user_id);

-- ---------------------------------------------------------------------------
-- 8. Function & Trigger: auto-create profile when a new auth user is created
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, auth
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, username, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NULLIF(lower(NEW.raw_user_meta_data->>'username'), ''),
        now(),
        now()
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 9. Enable Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles         FORCE ROW LEVEL SECURITY;

ALTER TABLE public.exercises        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises        FORCE ROW LEVEL SECURITY;

ALTER TABLE public.workouts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts         FORCE ROW LEVEL SECURITY;

ALTER TABLE public.sets             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sets             FORCE ROW LEVEL SECURITY;

ALTER TABLE public.nutrition_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs   FORCE ROW LEVEL SECURITY;

ALTER TABLE public.mood_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs        FORCE ROW LEVEL SECURITY;

ALTER TABLE public.progress_photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos  FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 10. RLS Policies
-- ---------------------------------------------------------------------------

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile"
    ON public.profiles
    FOR DELETE
    USING (auth.uid() = id);

-- exercises
DROP POLICY IF EXISTS "Anyone can read exercises" ON public.exercises;
CREATE POLICY "Anyone can read exercises"
    ON public.exercises
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their exercises" ON public.exercises;
CREATE POLICY "Users can insert their exercises"
    ON public.exercises
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own exercises" ON public.exercises;
CREATE POLICY "Users can update own exercises"
    ON public.exercises
    FOR UPDATE
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own exercises" ON public.exercises;
CREATE POLICY "Users can delete own exercises"
    ON public.exercises
    FOR DELETE
    USING (auth.uid() = created_by);

-- workouts
DROP POLICY IF EXISTS "Users can read own workouts" ON public.workouts;
CREATE POLICY "Users can read own workouts"
    ON public.workouts
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own workouts" ON public.workouts;
CREATE POLICY "Users can insert own workouts"
    ON public.workouts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own workouts" ON public.workouts;
CREATE POLICY "Users can update own workouts"
    ON public.workouts
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own workouts" ON public.workouts;
CREATE POLICY "Users can delete own workouts"
    ON public.workouts
    FOR DELETE
    USING (auth.uid() = user_id);

-- sets (enforce ownership through parent workout)
DROP POLICY IF EXISTS "Users can read sets in own workouts" ON public.sets;
CREATE POLICY "Users can read sets in own workouts"
    ON public.sets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.workouts w
            WHERE w.id = workout_id
              AND w.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert sets in own workouts" ON public.sets;
CREATE POLICY "Users can insert sets in own workouts"
    ON public.sets
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.workouts w
            WHERE w.id = workout_id
              AND w.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update sets in own workouts" ON public.sets;
CREATE POLICY "Users can update sets in own workouts"
    ON public.sets
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1
            FROM public.workouts w
            WHERE w.id = workout_id
              AND w.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.workouts w
            WHERE w.id = workout_id
              AND w.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete sets in own workouts" ON public.sets;
CREATE POLICY "Users can delete sets in own workouts"
    ON public.sets
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1
            FROM public.workouts w
            WHERE w.id = workout_id
              AND w.user_id = auth.uid()
        )
    );

-- nutrition_logs
DROP POLICY IF EXISTS "Users can read own nutrition logs" ON public.nutrition_logs;
CREATE POLICY "Users can read own nutrition logs"
    ON public.nutrition_logs
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own nutrition logs" ON public.nutrition_logs;
CREATE POLICY "Users can insert own nutrition logs"
    ON public.nutrition_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own nutrition logs" ON public.nutrition_logs;
CREATE POLICY "Users can update own nutrition logs"
    ON public.nutrition_logs
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own nutrition logs" ON public.nutrition_logs;
CREATE POLICY "Users can delete own nutrition logs"
    ON public.nutrition_logs
    FOR DELETE
    USING (auth.uid() = user_id);

-- mood_logs
DROP POLICY IF EXISTS "Users can read own mood logs" ON public.mood_logs;
CREATE POLICY "Users can read own mood logs"
    ON public.mood_logs
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own mood logs" ON public.mood_logs;
CREATE POLICY "Users can insert own mood logs"
    ON public.mood_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own mood logs" ON public.mood_logs;
CREATE POLICY "Users can update own mood logs"
    ON public.mood_logs
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own mood logs" ON public.mood_logs;
CREATE POLICY "Users can delete own mood logs"
    ON public.mood_logs
    FOR DELETE
    USING (auth.uid() = user_id);

-- progress_photos
DROP POLICY IF EXISTS "Users can read own progress photos" ON public.progress_photos;
CREATE POLICY "Users can read own progress photos"
    ON public.progress_photos
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress photos" ON public.progress_photos;
CREATE POLICY "Users can insert own progress photos"
    ON public.progress_photos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress photos" ON public.progress_photos;
CREATE POLICY "Users can update own progress photos"
    ON public.progress_photos
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own progress photos" ON public.progress_photos;
CREATE POLICY "Users can delete own progress photos"
    ON public.progress_photos
    FOR DELETE
    USING (auth.uid() = user_id);

COMMIT;

-- ---------------------------------------------------------------------------
-- 11. Supabase Storage policies (apply separately in the Storage Policies UI)
-- ---------------------------------------------------------------------------
/*
-- Example Storage policies for a bucket named 'progress-photos':

-- Allow users to upload files into their own folder (e.g., user_id/filename)
CREATE POLICY "Users can upload their photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'progress-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own photos
CREATE POLICY "Users can read their photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'progress-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'progress-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
*/
