import postgres from 'postgres';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function testAuthFunction() {
  console.log('\n🧪 Testing auth function...\n');

  const testUserId = randomUUID();

  // Set user ID
  await sql.unsafe(`SET app.current_user_id = '${testUserId}'`);
  
  // Test if function returns the correct value
  const result = await sql`SELECT public.get_current_user_id() as user_id`;
  
  console.log('Set user_id to:', testUserId);
  console.log('Function returned:', result[0].user_id);
  console.log('Match:', result[0].user_id === testUserId ? '✅ YES' : '❌ NO');

  // Reset
  await sql`RESET app.current_user_id`;
  
  const result2 = await sql`SELECT public.get_current_user_id() as user_id`;
  console.log('\nAfter RESET, function returned:', result2[0].user_id);

  await sql.end();
}

testAuthFunction();

