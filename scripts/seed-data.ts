import 'dotenv/config';
import { 
  createProfile,
  createExercise,
  createWorkout,
  createSet,
  createNutritionLog,
  createMoodLog,
  createProgressPhoto
} from '../lib/db';

async function seedDatabase() {
  console.log('🌱 Seeding database with development data...\n');

  try {
    // 1. Create test users
    console.log('👥 Creating test users...');
    
    const users = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        authUserId: '660e8400-e29b-41d4-a716-446655440101',
        fullName: 'Alex Johnson',
        username: 'alex_fitness_dev',
        heightCm: 180.0,
        weightKg: 75.0,
        fitnessGoals: 'Build muscle and improve strength',
        activityLevel: 'high'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        authUserId: '660e8400-e29b-41d4-a716-446655440102',
        fullName: 'Maria Garcia',
        username: 'maria_wellness_dev',
        heightCm: 165.0,
        weightKg: 60.0,
        fitnessGoals: 'Weight loss and cardio fitness',
        activityLevel: 'moderate'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        authUserId: '660e8400-e29b-41d4-a716-446655440103',
        fullName: 'Carlos Rodriguez',
        username: 'carlos_trainer_dev',
        heightCm: 175.0,
        weightKg: 80.0,
        fitnessGoals: 'Maintain fitness and help others',
        activityLevel: 'high'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await createProfile(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.fullName} (@${user.username})`);
    }

    // 2. Create exercises
    console.log('\n💪 Creating exercises...');
    
    const exercises = [
      {
        name: 'Standard Push-ups',
        muscleGroup: 'chest',
        equipment: 'bodyweight',
        description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
        isPublic: true,
        createdBy: createdUsers[0].id
      },
      {
        name: 'Bodyweight Squats',
        muscleGroup: 'legs',
        equipment: 'bodyweight',
        description: 'Fundamental lower body exercise for legs and glutes',
        isPublic: true,
        createdBy: createdUsers[0].id
      },
      {
        name: 'Wide Grip Pull-ups',
        muscleGroup: 'back',
        equipment: 'pull-up bar',
        description: 'Upper body pulling exercise for back and biceps',
        isPublic: true,
        createdBy: createdUsers[2].id
      },
      {
        name: 'Conventional Deadlifts',
        muscleGroup: 'back',
        equipment: 'barbell',
        description: 'Compound exercise for posterior chain development',
        isPublic: true,
        createdBy: createdUsers[2].id
      },
      {
        name: 'Flat Bench Press',
        muscleGroup: 'chest',
        equipment: 'barbell',
        description: 'Upper body pushing exercise for chest and triceps',
        isPublic: true,
        createdBy: createdUsers[0].id
      },
      {
        name: 'Outdoor Running',
        muscleGroup: 'cardio',
        equipment: 'none',
        description: 'Cardiovascular exercise for endurance and fat burning',
        isPublic: true,
        createdBy: createdUsers[1].id
      }
    ];

    const createdExercises = [];
    for (const exerciseData of exercises) {
      const exercise = await createExercise(exerciseData);
      createdExercises.push(exercise);
      console.log(`✅ Created exercise: ${exercise.name}`);
    }

    // 3. Create workouts for each user
    console.log('\n🏋️ Creating workouts...');
    
    const workouts = [
      // Alex's workouts
      {
        userId: createdUsers[0].id,
        name: 'Upper Body Strength',
        workoutDate: '2025-10-20',
        durationMin: 60,
        notes: 'Focused on chest and back development'
      },
      {
        userId: createdUsers[0].id,
        name: 'Leg Day',
        workoutDate: '2025-10-22',
        durationMin: 45,
        notes: 'Squats and deadlifts session'
      },
      // Maria's workouts
      {
        userId: createdUsers[1].id,
        name: 'Morning Cardio',
        workoutDate: '2025-10-21',
        durationMin: 30,
        notes: 'Running session in the park'
      },
      {
        userId: createdUsers[1].id,
        name: 'Strength Training',
        workoutDate: '2025-10-23',
        durationMin: 40,
        notes: 'Bodyweight exercises'
      },
      // Carlos's workouts
      {
        userId: createdUsers[2].id,
        name: 'Full Body Workout',
        workoutDate: '2025-10-20',
        durationMin: 75,
        notes: 'Complete training session'
      }
    ];

    const createdWorkouts = [];
    for (const workoutData of workouts) {
      const workout = await createWorkout(workoutData);
      createdWorkouts.push(workout);
      console.log(`✅ Created workout: ${workout.name} for ${createdUsers.find(u => u.id === workout.userId)?.fullName}`);
    }

    // 4. Create sets for workouts
    console.log('\n📊 Creating exercise sets...');
    
    const sets = [
      // Alex's Upper Body Strength workout
      {
        workoutId: createdWorkouts[0].id,
        exerciseId: createdExercises[0].id, // Standard Push-ups
        setOrder: 1,
        reps: 20,
        weightKg: 0,
        intensity: 'moderate'
      },
      {
        workoutId: createdWorkouts[0].id,
        exerciseId: createdExercises[2].id, // Wide Grip Pull-ups
        setOrder: 2,
        reps: 8,
        weightKg: 0,
        intensity: 'high'
      },
      {
        workoutId: createdWorkouts[0].id,
        exerciseId: createdExercises[4].id, // Flat Bench Press
        setOrder: 3,
        reps: 10,
        weightKg: 60.0,
        intensity: 'moderate'
      },
      // Alex's Leg Day workout
      {
        workoutId: createdWorkouts[1].id,
        exerciseId: createdExercises[1].id, // Bodyweight Squats
        setOrder: 1,
        reps: 15,
        weightKg: 0,
        intensity: 'moderate'
      },
      {
        workoutId: createdWorkouts[1].id,
        exerciseId: createdExercises[3].id, // Conventional Deadlifts
        setOrder: 2,
        reps: 8,
        weightKg: 80.0,
        intensity: 'high'
      },
      // Maria's workouts
      {
        workoutId: createdWorkouts[2].id,
        exerciseId: createdExercises[5].id, // Outdoor Running
        setOrder: 1,
        reps: 1,
        distanceM: 5000.0,
        durationSec: 1800,
        intensity: 'moderate'
      },
      {
        workoutId: createdWorkouts[3].id,
        exerciseId: createdExercises[0].id, // Standard Push-ups
        setOrder: 1,
        reps: 15,
        weightKg: 0,
        intensity: 'moderate'
      },
      {
        workoutId: createdWorkouts[3].id,
        exerciseId: createdExercises[1].id, // Bodyweight Squats
        setOrder: 2,
        reps: 20,
        weightKg: 0,
        intensity: 'moderate'
      }
    ];

    for (const setData of sets) {
      const set = await createSet(setData);
      console.log(`✅ Created set: ${set.reps} reps of exercise in workout`);
    }

    // 5. Create nutrition logs
    console.log('\n🍎 Creating nutrition logs...');
    
    const nutritionLogs = [
      {
        userId: createdUsers[0].id,
        foodItem: 'Grilled Chicken Breast',
        servingSize: '150g',
        calories: 247,
        proteinG: 46.5,
        carbsG: 0.0,
        fatG: 5.4,
        mealType: 'lunch',
        consumedAt: new Date('2025-10-20T12:00:00Z')
      },
      {
        userId: createdUsers[0].id,
        foodItem: 'Brown Rice',
        servingSize: '100g',
        calories: 111,
        proteinG: 2.6,
        carbsG: 23.0,
        fatG: 0.9,
        mealType: 'lunch',
        consumedAt: new Date('2025-10-20T12:00:00Z')
      },
      {
        userId: createdUsers[1].id,
        foodItem: 'Greek Yogurt',
        servingSize: '200g',
        calories: 130,
        proteinG: 20.0,
        carbsG: 9.0,
        fatG: 0.0,
        mealType: 'breakfast',
        consumedAt: new Date('2025-10-21T08:00:00Z')
      },
      {
        userId: createdUsers[1].id,
        foodItem: 'Salmon Fillet',
        servingSize: '120g',
        calories: 208,
        proteinG: 25.0,
        carbsG: 0.0,
        fatG: 12.0,
        mealType: 'dinner',
        consumedAt: new Date('2025-10-21T19:00:00Z')
      },
      {
        userId: createdUsers[2].id,
        foodItem: 'Protein Shake',
        servingSize: '1 scoop',
        calories: 120,
        proteinG: 25.0,
        carbsG: 3.0,
        fatG: 1.0,
        mealType: 'snack',
        consumedAt: new Date('2025-10-20T15:00:00Z')
      }
    ];

    for (const nutritionData of nutritionLogs) {
      const nutrition = await createNutritionLog(nutritionData);
      console.log(`✅ Created nutrition log: ${nutrition.foodItem} (${nutrition.calories} cal)`);
    }

    // 6. Create mood logs
    console.log('\n😊 Creating mood logs...');
    
    const moodLogs = [
      {
        userId: createdUsers[0].id,
        moodRating: 5,
        notes: 'Feeling amazing after a great workout!',
        loggedAt: new Date('2025-10-20T18:00:00Z')
      },
      {
        userId: createdUsers[0].id,
        moodRating: 4,
        notes: 'Good energy today, ready for leg day',
        loggedAt: new Date('2025-10-22T09:00:00Z')
      },
      {
        userId: createdUsers[1].id,
        moodRating: 4,
        notes: 'Morning run was refreshing',
        loggedAt: new Date('2025-10-21T10:00:00Z')
      },
      {
        userId: createdUsers[1].id,
        moodRating: 3,
        notes: 'Feeling a bit tired today',
        loggedAt: new Date('2025-10-23T20:00:00Z')
      },
      {
        userId: createdUsers[2].id,
        moodRating: 5,
        notes: 'Helped a client achieve their goals today!',
        loggedAt: new Date('2025-10-20T17:00:00Z')
      }
    ];

    for (const moodData of moodLogs) {
      const mood = await createMoodLog(moodData);
      console.log(`✅ Created mood log: Rating ${mood.moodRating} - ${mood.notes}`);
    }

    // 7. Create progress photos
    console.log('\n📸 Creating progress photos...');
    
    const progressPhotos = [
      {
        userId: createdUsers[0].id,
        imageUrl: 'https://example.com/progress/alex-before.jpg',
        caption: 'Before starting my fitness journey',
        takenOn: '2025-09-01'
      },
      {
        userId: createdUsers[0].id,
        imageUrl: 'https://example.com/progress/alex-progress.jpg',
        caption: '6 weeks of consistent training',
        takenOn: '2025-10-15'
      },
      {
        userId: createdUsers[1].id,
        imageUrl: 'https://example.com/progress/maria-start.jpg',
        caption: 'Starting my weight loss journey',
        takenOn: '2025-09-15'
      },
      {
        userId: createdUsers[2].id,
        imageUrl: 'https://example.com/progress/carlos-trainer.jpg',
        caption: 'Professional trainer certification photo',
        takenOn: '2025-10-01'
      }
    ];

    for (const photoData of progressPhotos) {
      const photo = await createProgressPhoto(photoData);
      console.log(`✅ Created progress photo: ${photo.caption}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Exercises: ${createdExercises.length}`);
    console.log(`- Workouts: ${createdWorkouts.length}`);
    console.log(`- Sets: ${sets.length}`);
    console.log(`- Nutrition Logs: ${nutritionLogs.length}`);
    console.log(`- Mood Logs: ${moodLogs.length}`);
    console.log(`- Progress Photos: ${progressPhotos.length}`);

  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('\n✅ Database seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });
