import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Supabase's auth.users table reference (exists in auth schema)
// We don't include it in migrations since it's managed by Supabase
// const auth = pgSchema('auth');
// export const authUsers = auth.table('users', {
//   id: uuid('id').primaryKey(),
// });

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey(),
    // References Supabase's auth.users(id) - the FK will be created via SQL
    authUserId: uuid('auth_user_id').notNull(),
    fullName: text('full_name'),
    username: text('username'),
    heightCm: numeric('height_cm', { precision: 5, scale: 2 }),
    weightKg: numeric('weight_kg', { precision: 5, scale: 2 }),
    dateOfBirth: date('date_of_birth'),
    fitnessGoals: text('fitness_goals'),
    activityLevel: text('activity_level'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    usernameUnique: uniqueIndex('profiles_username_key').on(table.username),
    heightPositive: check('height_positive', sql`${table.heightCm} IS NULL OR ${table.heightCm} > 0`),
    weightPositive: check('weight_positive', sql`${table.weightKg} IS NULL OR ${table.weightKg} > 0`),
  }),
);

export const exercises = pgTable(
  'exercises',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdBy: uuid('created_by').references(() => profiles.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    muscleGroup: text('muscle_group'),
    equipment: text('equipment'),
    description: text('description'),
    isPublic: boolean('is_public').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueName: uniqueIndex('exercises_name_key').on(table.name),
  }),
);

export const workouts = pgTable(
  'workouts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    workoutDate: date('workout_date').notNull().default(sql`current_date`),
    durationMin: integer('duration_min'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    durationPositive: check('duration_positive', sql`${table.durationMin} IS NULL OR ${table.durationMin} > 0`),
  }),
);

export const sets = pgTable(
  'sets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workoutId: uuid('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: uuid('exercise_id').references(() => exercises.id),
    setOrder: integer('set_order'),
    reps: integer('reps'),
    weightKg: numeric('weight_kg', { precision: 6, scale: 2 }),
    distanceM: numeric('distance_m', { precision: 8, scale: 2 }),
    durationSec: integer('duration_sec'),
    intensity: text('intensity'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    workoutIdx: index('sets_workout_id_idx').on(table.workoutId),
    exerciseIdx: index('sets_exercise_id_idx').on(table.exerciseId),
    repsPositive: check('reps_positive', sql`${table.reps} IS NULL OR ${table.reps} > 0`),
    weightPositive: check('weight_positive', sql`${table.weightKg} IS NULL OR ${table.weightKg} >= 0`),
    distancePositive: check('distance_positive', sql`${table.distanceM} IS NULL OR ${table.distanceM} >= 0`),
    durationPositive: check('duration_positive', sql`${table.durationSec} IS NULL OR ${table.durationSec} >= 0`),
  }),
);

export const nutritionLogs = pgTable(
  'nutrition_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    consumedAt: timestamp('consumed_at', { withTimezone: true }).defaultNow().notNull(),
    mealType: text('meal_type'),
    foodItem: text('food_item').notNull(),
    servingSize: text('serving_size'),
    calories: integer('calories'),
    proteinG: numeric('protein_g', { precision: 6, scale: 2 }),
    carbsG: numeric('carbs_g', { precision: 6, scale: 2 }),
    fatG: numeric('fat_g', { precision: 6, scale: 2 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('nutrition_logs_user_id_idx').on(table.userId),
    consumedAtIdx: index('nutrition_logs_consumed_at_idx').on(table.consumedAt),
    caloriesPositive: check('calories_positive', sql`${table.calories} IS NULL OR ${table.calories} >= 0`),
  }),
);

export const moodLogs = pgTable(
  'mood_logs',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    moodRating: integer('mood_rating').notNull(),
    notes: text('notes'),
    loggedAt: timestamp('logged_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('mood_logs_user_id_idx').on(table.userId),
    ratingRange: check('mood_rating_range', sql`${table.moodRating} BETWEEN 1 AND 5`),
  }),
);

export const progressPhotos = pgTable(
  'progress_photos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    imageUrl: text('image_url').notNull(),
    caption: text('caption'),
    takenOn: date('taken_on'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('progress_photos_user_id_idx').on(table.userId),
  }),
);
