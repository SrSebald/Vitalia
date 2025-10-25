// Profile mutations
export {
  createProfile,
  updateProfile,
  updateProfileByAuthUserId,
  deleteProfile,
  deleteProfileByAuthUserId,
  updateFitnessGoals,
  updateActivityLevel,
  updatePhysicalMeasurements,
} from './profiles';

// Exercise mutations
export {
  createExercise,
  updateExercise,
  deleteExercise,
  toggleExerciseVisibility,
  updateExerciseName,
  updateExerciseDescription,
  updateExerciseMuscleGroup,
  updateExerciseEquipment,
  bulkCreateExercises,
  deleteExercisesByCreator,
} from './exercises';

// Workout mutations
export {
  createWorkout,
  updateWorkout,
  deleteWorkout,
  updateWorkoutName,
  updateWorkoutNotes,
  updateWorkoutDuration,
  updateWorkoutDate,
  deleteWorkoutsByUser,
} from './workouts';

// Set mutations
export {
  createSet,
  updateSet,
  deleteSet,
  createMultipleSets,
  updateSetOrder,
  updateSetReps,
  updateSetWeight,
  updateSetDistance,
  updateSetDuration,
  updateSetIntensity,
  deleteSetsByWorkout,
  reorderSets,
} from './sets';

// Nutrition log mutations
export {
  createNutritionLog,
  updateNutritionLog,
  deleteNutritionLog,
  updateNutritionLogFoodItem,
  updateNutritionLogServingSize,
  updateNutritionLogCalories,
  updateNutritionLogMacros,
  updateNutritionLogMealType,
  updateNutritionLogNotes,
  createMultipleNutritionLogs,
  deleteNutritionLogsByUser,
} from './nutrition-logs';

// Mood log mutations
export {
  createMoodLog,
  updateMoodLog,
  deleteMoodLog,
  updateMoodRating,
  updateMoodLogNotes,
  createMultipleMoodLogs,
  deleteMoodLogsByUser,
  logMoodForToday,
} from './mood-logs';

// Progress photo mutations
export {
  createProgressPhoto,
  updateProgressPhoto,
  deleteProgressPhoto,
  updateProgressPhotoCaption,
  updateProgressPhotoTakenDate,
  updateProgressPhotoImageUrl,
  createMultipleProgressPhotos,
  deleteProgressPhotosByUser,
  deleteProgressPhotosByDateRange,
} from './progress-photos';
