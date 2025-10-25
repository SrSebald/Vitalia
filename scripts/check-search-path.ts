import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function checkSearchPath() {
  console.log('\n🔍 Checking schema configuration...\n');

  const searchPath = await sql`SHOW search_path`;
  console.log('Search path:', searchPath[0].search_path);

  const fn = await sql`
    SELECT 
      proname, 
      pronamespace::regnamespace as schema 
    FROM pg_proc 
    WHERE proname = 'get_current_user_id'
  `;
  
  console.log('\nFunction location:');
  console.log('  Name:', fn[0]?.proname || 'NOT FOUND');
  console.log('  Schema:', fn[0]?.schema || 'N/A');

  // Test if function can be called
  try {
    const result = await sql`SELECT get_current_user_id() as id`;
    console.log('\n✅ Function is callable (resolves correctly)');
    console.log('  Returns:', result[0].id);
  } catch (e) {
    console.log('\n❌ Function cannot be called');
    console.log('  Error:', e.message);
  }

  await sql.end();
}

checkSearchPath();

