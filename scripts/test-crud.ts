import 'dotenv/config';
import { 
  // Profile operations
  createProfile,
  getProfileById,
  updateProfile,
  // Exercise operations
  createExercise,
  getPublicExercises,
  getExerciseById,
  // Workout operations
  createWorkout,
  getWorkoutsByUserId,
  getWorkoutWithSets,
  // Set operations
  createSet,
  getSetsByWorkoutId,
  // Nutrition log operations
  createNutritionLog,
  getNutritionLogsByUserId,
  // Mood log operations
  createMoodLog,
  getMoodLogsByUserId,
  // Progress photo operations
  createProgressPhoto,
  getProgressPhotosByUserId
} from '../lib/db';

async function testCRUDOperations() {
  console.log('🧪 Testing CRUD operations...\n');

  try {
    // Test 1: Create a test profile
    console.log('1️⃣ Testing Profile CRUD...');
    const timestamp = Date.now();
    const testProfile = await createProfile({
      id: `550e8400-e29b-41d4-a716-${timestamp.toString().slice(-12)}`,
      authUserId: `550e8400-e29b-41d4-a716-${(timestamp + 1).toString().slice(-12)}`,
      fullName: 'Test User',
      username: `testuser${timestamp}`,
      heightCm: 175.5,
      weightKg: 70.0,
      fitnessGoals: 'Build muscle and improve endurance',
      activityLevel: 'moderate'
    });
    console.log('✅ Profile created:', testProfile.id);

    // Test 2: Get profile
    const retrievedProfile = await getProfileById(testProfile.id);
    console.log('✅ Profile retrieved:', retrievedProfile?.fullName);

    // Test 3: Update profile
    const updatedProfile = await updateProfile(testProfile.id, {
      fitnessGoals: 'Updated fitness goals'
    });
    console.log('✅ Profile updated:', updatedProfile.fitnessGoals);

    // Test 4: Create an exercise
    console.log('\n2️⃣ Testing Exercise CRUD...');
    const testExercise = await createExercise({
      name: `Push-ups ${timestamp}`,
      muscleGroup: 'chest',
      equipment: 'bodyweight',
      description: 'Classic bodyweight exercise for chest and arms',
      isPublic: true,
      createdBy: testProfile.id
    });
    console.log('✅ Exercise created:', testExercise.name);

    // Test 5: Get public exercises
    const publicExercises = await getPublicExercises({ limit: 5 });
    console.log('✅ Public exercises found:', publicExercises.length);

    // Test 6: Create a workout
    console.log('\n3️⃣ Testing Workout CRUD...');
    const testWorkout = await createWorkout({
      userId: testProfile.id,
      name: 'Morning Workout',
      workoutDate: '2025-10-25',
      durationMin: 45,
      notes: 'Great workout session'
    });
    console.log('✅ Workout created:', testWorkout.name);

    // Test 7: Get workouts by user
    const userWorkouts = await getWorkoutsByUserId({
      userId: testProfile.id,
      limit: 10
    });
    console.log('✅ User workouts found:', userWorkouts.length);

    // Test 8: Create a set
    console.log('\n4️⃣ Testing Set CRUD...');
    const testSet = await createSet({
      workoutId: testWorkout.id,
      exerciseId: testExercise.id,
      setOrder: 1,
      reps: 15,
      weightKg: 0,
      intensity: 'moderate'
    });
    console.log('✅ Set created:', testSet.id);

    // Test 9: Get sets by workout
    const workoutSets = await getSetsByWorkoutId(testWorkout.id);
    console.log('✅ Workout sets found:', workoutSets.length);

    // Test 10: Create nutrition log
    console.log('\n5️⃣ Testing Nutrition Log CRUD...');
    const testNutritionLog = await createNutritionLog({
      userId: testProfile.id,
      foodItem: 'Chicken Breast',
      servingSize: '100g',
      calories: 165,
      proteinG: 31.0,
      carbsG: 0.0,
      fatG: 3.6,
      mealType: 'lunch'
    });
    console.log('✅ Nutrition log created:', testNutritionLog.foodItem);

    // Test 11: Get nutrition logs
    const nutritionLogs = await getNutritionLogsByUserId({
      userId: testProfile.id,
      limit: 10
    });
    console.log('✅ Nutrition logs found:', nutritionLogs.length);

    // Test 12: Create mood log
    console.log('\n6️⃣ Testing Mood Log CRUD...');
    const testMoodLog = await createMoodLog({
      userId: testProfile.id,
      moodRating: 4,
      notes: 'Feeling great after workout!'
    });
    console.log('✅ Mood log created:', testMoodLog.moodRating);

    // Test 13: Get mood logs
    const moodLogs = await getMoodLogsByUserId({
      userId: testProfile.id,
      limit: 10
    });
    console.log('✅ Mood logs found:', moodLogs.length);

    // Test 14: Create progress photo
    console.log('\n7️⃣ Testing Progress Photo CRUD...');
    const testPhoto = await createProgressPhoto({
      userId: testProfile.id,
      imageUrl: 'https://example.com/progress-photo.jpg',
      caption: 'Progress after 1 month',
      takenOn: '2025-10-25'
    });
    console.log('✅ Progress photo created:', testPhoto.id);

    // Test 15: Get progress photos
    const progressPhotos = await getProgressPhotosByUserId({
      userId: testProfile.id,
      limit: 10
    });
    console.log('✅ Progress photos found:', progressPhotos.length);

    console.log('\n🎉 All CRUD operations completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Profile: ${testProfile.id}`);
    console.log(`- Exercise: ${testExercise.name}`);
    console.log(`- Workout: ${testWorkout.name}`);
    console.log(`- Set: ${testSet.id}`);
    console.log(`- Nutrition Log: ${testNutritionLog.foodItem}`);
    console.log(`- Mood Log: Rating ${testMoodLog.moodRating}`);
    console.log(`- Progress Photo: ${testPhoto.id}`);

  } catch (error) {
    console.error('❌ Error during CRUD testing:', error);
    throw error;
  }
}

// Run the test
testCRUDOperations()
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  });
