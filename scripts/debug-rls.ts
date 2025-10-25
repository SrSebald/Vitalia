import postgres from 'postgres';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function debugRLS() {
  console.log('\n🔍 DEBUG: RLS Test\n');

  const testAuthUserId = randomUUID();
  const testProfileId = randomUUID();

  // 1. Insert test profile with RLS disabled
  console.log('1️⃣  Creating test profile...');
  await sql`ALTER TABLE profiles DISABLE ROW LEVEL SECURITY`;
  await sql`
    INSERT INTO profiles (id, auth_user_id, full_name, username)
    VALUES (${testProfileId}, ${testAuthUserId}, 'Debug User', ${'debug_' + Date.now()})
  `;
  await sql`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`;
  console.log('   ✅ Profile created');

  // 2. Count total profiles WITHOUT setting user context
  const allProfiles = await sql`SELECT COUNT(*)::int as count FROM profiles`;
  console.log(`\n2️⃣  Total profiles in DB (no RLS context): ${allProfiles[0].count}`);

  // 3. Set user context
  console.log(`\n3️⃣  Setting user context to: ${testAuthUserId}`);
  await sql.unsafe(`SET app.current_user_id = '${testAuthUserId}'`);

  // 4. Verify function returns correct value
  const fnResult = await sql`SELECT get_current_user_id() as id`;
  console.log(`   Function returns: ${fnResult[0].id}`);
  console.log(`   Match: ${fnResult[0].id === testAuthUserId ? '✅' : '❌'}`);

  // 5. Try to select profiles WITH RLS
  const myProfiles = await sql`SELECT * FROM profiles`;
  console.log(`\n4️⃣  Profiles visible WITH RLS context: ${myProfiles.length}`);
  
  if (myProfiles.length === 1) {
    console.log('   ✅ SUCCESS: RLS is working! Only 1 profile visible');
  } else if (myProfiles.length === allProfiles[0].count) {
    console.log(`   ❌ FAIL: RLS NOT working! Seeing all ${allProfiles[0].count} profiles`);
    console.log('   \n   Possible reasons:');
    console.log('   • Policies not created correctly');
    console.log('   • Function not being called by policies');
    console.log('   • Connection has BYPASSRLS privilege');
  } else {
    console.log(`   ⚠️  PARTIAL: Seeing ${myProfiles.length} of ${allProfiles[0].count} profiles`);
  }

  // 6. Check if we have BYPASSRLS
  const hasOBYPASSRLS = await sql`
    SELECT 
      rolname, 
      rolbypassrls 
    FROM pg_roles 
    WHERE rolname = current_user
  `;
  console.log(`\n5️⃣  Bypass RLS privilege: ${hasOBYPASSRLS[0]?.rolbypassrls ? '❌ YES (This is the problem!)' : '✅ NO'}`);

  // Cleanup
  await sql`RESET app.current_user_id`;
  await sql`ALTER TABLE profiles DISABLE ROW LEVEL SECURITY`;
  await sql`DELETE FROM profiles WHERE id = ${testProfileId}`;
  await sql`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`;

  await sql.end();
}

debugRLS();

