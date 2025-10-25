import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  profiles,
  exercises,
  workouts,
  sets,
  nutritionLogs,
  moodLogs,
  progressPhotos,
} from './schema';

// Profile types
export type Profile = InferSelectModel<typeof profiles>;
export type InsertProfile = InferInsertModel<typeof profiles>;
export type UpdateProfile = Partial<InsertProfile>;

// Exercise types
export type Exercise = InferSelectModel<typeof exercises>;
export type InsertExercise = InferInsertModel<typeof exercises>;
export type UpdateExercise = Partial<InsertExercise>;

// Workout types
export type Workout = InferSelectModel<typeof workouts>;
export type InsertWorkout = InferInsertModel<typeof workouts>;
export type UpdateWorkout = Partial<InsertWorkout>;

// Set types
export type Set = InferSelectModel<typeof sets>;
export type InsertSet = InferInsertModel<typeof sets>;
export type UpdateSet = Partial<InsertSet>;

// Nutrition Log types
export type NutritionLog = InferSelectModel<typeof nutritionLogs>;
export type InsertNutritionLog = InferInsertModel<typeof nutritionLogs>;
export type UpdateNutritionLog = Partial<InsertNutritionLog>;

// Mood Log types
export type MoodLog = InferSelectModel<typeof moodLogs>;
export type InsertMoodLog = InferInsertModel<typeof moodLogs>;
export type UpdateMoodLog = Partial<InsertMoodLog>;

// Progress Photo types
export type ProgressPhoto = InferSelectModel<typeof progressPhotos>;
export type InsertProgressPhoto = InferInsertModel<typeof progressPhotos>;
export type UpdateProgressPhoto = Partial<InsertProgressPhoto>;

// Extended types with relations
export type WorkoutWithSets = Workout & {
  sets: (Set & { exercise?: Exercise | null })[];
};

export type ExerciseWithStats = Exercise & {
  _count?: {
    sets: number;
  };
};

// Query filter types
export interface WorkoutFilters {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface ExerciseFilters {
  search?: string;
  muscleGroup?: string;
  equipment?: string;
  isPublic?: boolean;
  createdBy?: string;
  limit?: number;
  offset?: number;
}

export interface NutritionLogFilters {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  mealType?: string;
  limit?: number;
  offset?: number;
}

export interface MoodLogFilters {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface ProgressPhotoFilters {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
