// Profile queries
export {
  getProfileById,
  getProfileByUsername,
  getProfileByAuthUserId,
  isUsernameAvailable,
  getProfiles,
  searchProfiles,
} from './profiles';

// Exercise queries
export {
  getPublicExercises,
  getExercisesByUser,
  getExerciseById,
  getExercisesByMuscleGroup,
  getExercisesByEquipment,
  searchExercises,
  getPopularExercises,
  getMuscleGroups,
  getEquipmentTypes,
} from './exercises';

// Workout queries
export {
  getWorkoutsByUserId,
  getWorkoutById,
  getWorkoutWithSets,
  getWorkoutsByDateRange,
  getRecentWorkouts,
  getWorkoutStats,
  searchWorkouts,
  getWorkoutCountByMonth,
} from './workouts';

// Set queries
export {
  getSetsByWorkoutId,
  getSetsWithExercises,
  getSetById,
  getSetsByExerciseId,
} from './sets';

// Nutrition log queries
export {
  getNutritionLogsByUserId,
  getNutritionLogsByDateRange,
  getNutritionLogsByMealType,
  getNutritionLogById,
  getNutritionSummary,
  getDailyNutritionBreakdown,
  searchNutritionLogs,
} from './nutrition-logs';

// Mood log queries
export {
  getMoodLogsByUserId,
  getMoodLogsByDateRange,
  getMoodLogById,
  getRecentMoodLogs,
  getMoodStats,
  getMoodTrendsByWeek,
  getMoodLogsByRating,
} from './mood-logs';

// Progress photo queries
export {
  getProgressPhotosByUserId,
  getProgressPhotosByDateRange,
  getProgressPhotoById,
  getRecentProgressPhotos,
  getProgressPhotosByYear,
  getProgressPhotosByMonth,
  getProgressPhotoStats,
} from './progress-photos';
