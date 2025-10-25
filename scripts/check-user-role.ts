import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function checkUserRole() {
  console.log('\n🔍 Checking database user role...\n');

  const userInfo = await sql`
    SELECT 
      current_user,
      usesuper,
      usecreatedb
    FROM pg_user 
    WHERE usename = current_user
  `;

  console.log('User:', userInfo[0].current_user);
  console.log('Is Superuser:', userInfo[0].usesuper ? '✅ YES (RLS will be bypassed!)' : '❌ NO');
  console.log('Can create DB:', userInfo[0].usecreatedb ? 'YES' : 'NO');

  if (userInfo[0].usesuper) {
    console.log('\n⚠️  WARNING: You are connected as a superuser!');
    console.log('   Superusers bypass Row Level Security by default.');
    console.log('   RLS policies will not be enforced for this connection.');
    console.log('\n💡 For RLS testing, you should:');
    console.log('   1. Create a non-superuser role');
    console.log('   2. Connect with that role');
    console.log('   3. Or use Supabase client which handles this automatically');
  } else {
    console.log('\n✅ Good! Non-superuser connection. RLS will be enforced.');
  }

  await sql.end();
}

checkUserRole();

