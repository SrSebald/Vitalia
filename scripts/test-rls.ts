/**
 * RLS Testing Script
 * Tests Row Level Security policies to ensure data isolation between users
 */

import postgres from 'postgres';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, {
  ssl: 'require',
  connection: {
    application_name: 'vitalia_rls_test'
  }
});

// Test data
const testUsers = [
  {
    id: randomUUID(),
    auth_user_id: randomUUID(),
    full_name: 'Test User 1',
    username: 'testuser1_' + Date.now()
  },
  {
    id: randomUUID(),
    auth_user_id: randomUUID(),
    full_name: 'Test User 2',
    username: 'testuser2_' + Date.now()
  }
];

async function setupTestData() {
  console.log('\n📝 Setting up test data...\n');

  // Disable RLS temporarily to insert test data
  await sql`ALTER TABLE profiles DISABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE workouts DISABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE exercises DISABLE ROW LEVEL SECURITY`;

  // Insert test profiles
  for (const user of testUsers) {
    await sql`
      INSERT INTO profiles (id, auth_user_id, full_name, username)
      VALUES (${user.id}, ${user.auth_user_id}, ${user.full_name}, ${user.username})
      ON CONFLICT (id) DO NOTHING
    `;
    console.log(`✅ Created profile: ${user.full_name} (${user.username})`);
  }

  // Insert test workouts for each user
  for (const user of testUsers) {
    const workoutId = randomUUID();
    await sql`
      INSERT INTO workouts (id, user_id, name, workout_date)
      VALUES (
        ${workoutId},
        ${user.id},
        ${'Workout for ' + user.full_name},
        CURRENT_DATE
      )
    `;
    console.log(`✅ Created workout for ${user.full_name}`);
  }

  // Insert test exercises with unique names
  const timestamp = Date.now();
  const publicExerciseId = randomUUID();
  const privateExerciseId = randomUUID();

  await sql`
    INSERT INTO exercises (id, created_by, name, is_public)
    VALUES 
      (${publicExerciseId}, ${testUsers[0].id}, ${'Public Push-ups ' + timestamp}, true),
      (${privateExerciseId}, ${testUsers[0].id}, ${'Private Squats ' + timestamp}, false)
  `;
  console.log(`✅ Created public and private exercises`);

  // Re-enable RLS
  await sql`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE workouts ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE exercises ENABLE ROW LEVEL SECURITY`;

  console.log('\n✅ Test data created successfully!\n');
}

async function testProfilesRLS() {
  console.log('🧪 Testing PROFILES RLS...\n');

  // Test 1: User can only see their own profile
  await sql.unsafe(`SET app.current_user_id = '${testUsers[0].auth_user_id}'`);
  const user1Profiles = await sql`SELECT * FROM profiles`;
  
  console.log(`   Test User 1 sees ${user1Profiles.length} profile(s)`);
  if (user1Profiles.length === 1 && user1Profiles[0].auth_user_id === testUsers[0].auth_user_id) {
    console.log('   ✅ PASS: User 1 only sees their own profile\n');
  } else {
    console.log('   ❌ FAIL: User 1 sees incorrect profiles\n');
  }

  // Test 2: User 2 can only see their own profile
  await sql.unsafe(`SET app.current_user_id = '${testUsers[1].auth_user_id}'`);
  const user2Profiles = await sql`SELECT * FROM profiles`;
  
  console.log(`   Test User 2 sees ${user2Profiles.length} profile(s)`);
  if (user2Profiles.length === 1 && user2Profiles[0].auth_user_id === testUsers[1].auth_user_id) {
    console.log('   ✅ PASS: User 2 only sees their own profile\n');
  } else {
    console.log('   ❌ FAIL: User 2 sees incorrect profiles\n');
  }

  await sql`RESET app.current_user_id`;
}

async function testWorkoutsRLS() {
  console.log('🧪 Testing WORKOUTS RLS...\n');

  // Test 1: User 1 can only see their own workouts
  await sql.unsafe(`SET app.current_user_id = '${testUsers[0].auth_user_id}'`);
  const user1Workouts = await sql`SELECT * FROM workouts`;
  
  console.log(`   Test User 1 sees ${user1Workouts.length} workout(s)`);
  if (user1Workouts.length === 1 && user1Workouts[0].user_id === testUsers[0].id) {
    console.log('   ✅ PASS: User 1 only sees their own workouts\n');
  } else {
    console.log('   ❌ FAIL: User 1 sees incorrect workouts\n');
  }

  // Test 2: User 2 can only see their own workouts
  await sql.unsafe(`SET app.current_user_id = '${testUsers[1].auth_user_id}'`);
  const user2Workouts = await sql`SELECT * FROM workouts`;
  
  console.log(`   Test User 2 sees ${user2Workouts.length} workout(s)`);
  if (user2Workouts.length === 1 && user2Workouts[0].user_id === testUsers[1].id) {
    console.log('   ✅ PASS: User 2 only sees their own workouts\n');
  } else {
    console.log('   ❌ FAIL: User 2 sees incorrect workouts\n');
  }

  await sql`RESET app.current_user_id`;
}

async function testExercisesRLS() {
  console.log('🧪 Testing EXERCISES RLS...\n');

  // Test 1: User 1 sees public exercises + their own private ones
  await sql.unsafe(`SET app.current_user_id = '${testUsers[0].auth_user_id}'`);
  const user1Exercises = await sql`SELECT * FROM exercises`;
  
  console.log(`   Test User 1 sees ${user1Exercises.length} exercise(s)`);
  const hasPublic = user1Exercises.some(e => e.is_public);
  const hasPrivate = user1Exercises.some(e => !e.is_public);
  
  if (user1Exercises.length === 2 && hasPublic && hasPrivate) {
    console.log('   ✅ PASS: User 1 sees public + their private exercises\n');
  } else {
    console.log('   ❌ FAIL: User 1 sees incorrect exercises\n');
  }

  // Test 2: User 2 only sees public exercises (not User 1's private ones)
  await sql.unsafe(`SET app.current_user_id = '${testUsers[1].auth_user_id}'`);
  const user2Exercises = await sql`SELECT * FROM exercises`;
  
  console.log(`   Test User 2 sees ${user2Exercises.length} exercise(s)`);
  const onlyPublic = user2Exercises.every(e => e.is_public);
  
  if (user2Exercises.length === 1 && onlyPublic) {
    console.log('   ✅ PASS: User 2 only sees public exercises\n');
  } else {
    console.log('   ❌ FAIL: User 2 sees incorrect exercises\n');
  }

  await sql`RESET app.current_user_id`;
}

async function testInsertRestrictions() {
  console.log('🧪 Testing INSERT Restrictions...\n');

  // Test: User 2 cannot insert workout for User 1
  await sql.unsafe(`SET app.current_user_id = '${testUsers[1].auth_user_id}'`);
  
  try {
    await sql`
      INSERT INTO workouts (id, user_id, name, workout_date)
      VALUES (
        ${randomUUID()},
        ${testUsers[0].id},
        'Malicious workout',
        CURRENT_DATE
      )
    `;
    console.log('   ❌ FAIL: User 2 was able to insert workout for User 1\n');
  } catch (error) {
    if (error.message.includes('new row violates row-level security policy')) {
      console.log('   ✅ PASS: User 2 cannot insert workout for User 1\n');
    } else {
      console.log(`   ❌ FAIL: Unexpected error: ${error.message}\n`);
    }
  }

  await sql`RESET app.current_user_id`;
}

async function testUpdateRestrictions() {
  console.log('🧪 Testing UPDATE Restrictions...\n');

  // Get User 1's workout ID
  await sql`ALTER TABLE workouts DISABLE ROW LEVEL SECURITY`;
  const user1Workout = await sql`
    SELECT id FROM workouts WHERE user_id = ${testUsers[0].id} LIMIT 1
  `;
  await sql`ALTER TABLE workouts ENABLE ROW LEVEL SECURITY`;

  if (user1Workout.length === 0) {
    console.log('   ⚠️  SKIP: No workout found for testing\n');
    return;
  }

  const workoutId = user1Workout[0].id;

  // Test: User 2 cannot update User 1's workout
  await sql.unsafe(`SET app.current_user_id = '${testUsers[1].auth_user_id}'`);
  
  try {
    const result = await sql`
      UPDATE workouts 
      SET name = 'Hacked workout'
      WHERE id = ${workoutId}
      RETURNING *
    `;
    
    if (result.length === 0) {
      console.log('   ✅ PASS: User 2 cannot update User 1\'s workout\n');
    } else {
      console.log('   ❌ FAIL: User 2 was able to update User 1\'s workout\n');
    }
  } catch (error) {
    console.log('   ✅ PASS: User 2 cannot update User 1\'s workout\n');
  }

  await sql`RESET app.current_user_id`;
}

async function testDeleteRestrictions() {
  console.log('🧪 Testing DELETE Restrictions...\n');

  // Get User 1's workout ID
  await sql`ALTER TABLE workouts DISABLE ROW LEVEL SECURITY`;
  const user1Workout = await sql`
    SELECT id FROM workouts WHERE user_id = ${testUsers[0].id} LIMIT 1
  `;
  await sql`ALTER TABLE workouts ENABLE ROW LEVEL SECURITY`;

  if (user1Workout.length === 0) {
    console.log('   ⚠️  SKIP: No workout found for testing\n');
    return;
  }

  const workoutId = user1Workout[0].id;

  // Test: User 2 cannot delete User 1's workout
  await sql.unsafe(`SET app.current_user_id = '${testUsers[1].auth_user_id}'`);
  
  try {
    const result = await sql`
      DELETE FROM workouts 
      WHERE id = ${workoutId}
      RETURNING *
    `;
    
    if (result.length === 0) {
      console.log('   ✅ PASS: User 2 cannot delete User 1\'s workout\n');
    } else {
      console.log('   ❌ FAIL: User 2 was able to delete User 1\'s workout\n');
    }
  } catch (error) {
    console.log('   ✅ PASS: User 2 cannot delete User 1\'s workout\n');
  }

  await sql`RESET app.current_user_id`;
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...\n');

  // Disable RLS to cleanup
  await sql`ALTER TABLE profiles DISABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE workouts DISABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE exercises DISABLE ROW LEVEL SECURITY`;

  // Delete test data
  for (const user of testUsers) {
    await sql`DELETE FROM profiles WHERE id = ${user.id}`;
  }

  // Re-enable RLS
  await sql`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE workouts ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE exercises ENABLE ROW LEVEL SECURITY`;

  console.log('✅ Test data cleaned up\n');
}

async function runTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   RLS TESTING SUITE - Vitalia DB      ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    await setupTestData();
    await testProfilesRLS();
    await testWorkoutsRLS();
    await testExercisesRLS();
    await testInsertRestrictions();
    await testUpdateRestrictions();
    await testDeleteRestrictions();
    await cleanupTestData();

    console.log('╔════════════════════════════════════════╗');
    console.log('║        ✅ ALL TESTS COMPLETED          ║');
    console.log('╚════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    console.log('\n🧹 Attempting cleanup...');
    await cleanupTestData();
  } finally {
    await sql.end();
  }
}

// Run tests
runTests();


