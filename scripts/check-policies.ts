import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function checkPolicies() {
  console.log('\n📋 Checking RLS Policies...\n');

  const policies = await sql`
    SELECT 
      tablename,
      policyname,
      qual
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'profiles'
    ORDER BY policyname
  `;

  console.log(`Found ${policies.length} policies for "profiles" table:\n`);

  policies.forEach(p => {
    console.log(`Policy: ${p.policyname}`);
    console.log(`  SQL: ${p.qual}`);
    console.log(`  Uses public.get_current_user_id(): ${p.qual?.includes('public.get_current_user_id') ? '✅' : '❌'}`);
    console.log('');
  });

  await sql.end();
}

checkPolicies();

