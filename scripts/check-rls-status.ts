/**
 * Script to check RLS status in the database
 */
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Try DIRECT_URL first (Supabase pooler), fallback to DATABASE_URL
const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL or DIRECT_URL not found');
  process.exit(1);
}

console.log(`🔗 Connecting to: ${DATABASE_URL.split('@')[1]?.split('/')[0] || 'database'}...\n`);

async function checkRLS() {
  console.log('🔍 Checking RLS status in database...\n');
  
  const sql = postgres(DATABASE_URL, {
    ssl: 'require',
    connection: {
      application_name: 'vitalia_rls_check'
    }
  });

  try {
    // Check if RLS is enabled
    console.log('📊 Table RLS Status:');
    console.log('─'.repeat(50));
    
    const rlsStatus = await sql`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    rlsStatus.forEach(row => {
      const status = row.rowsecurity ? '✅ ENABLED' : '❌ DISABLED';
      console.log(`${row.tablename.padEnd(20)} ${status}`);
    });

    // Count policies
    console.log('\n📋 Policies Count:');
    console.log('─'.repeat(50));
    
    const policies = await sql`
      SELECT tablename, COUNT(*)::int as policy_count
      FROM pg_policies
      WHERE schemaname = 'public'
      GROUP BY tablename
      ORDER BY tablename
    `;

    if (policies.length === 0) {
      console.log('⚠️  NO POLICIES FOUND - RLS needs to be applied!');
    } else {
      policies.forEach(row => {
        console.log(`${row.tablename.padEnd(20)} ${row.policy_count} policies`);
      });
    }

    // Summary
    const enabledCount = rlsStatus.filter(r => r.rowsecurity).length;
    const totalTables = rlsStatus.length;
    const totalPolicies = policies.reduce((sum, p) => sum + p.policy_count, 0);

    console.log('\n📈 Summary:');
    console.log('─'.repeat(50));
    console.log(`Tables with RLS enabled: ${enabledCount}/${totalTables}`);
    console.log(`Total policies: ${totalPolicies}`);
    
    if (enabledCount === 0 && totalPolicies === 0) {
      console.log('\n⚠️  RLS is NOT configured yet!');
      console.log('   Run the SQL script from Supabase Dashboard to apply policies.');
    } else if (enabledCount > 0 && totalPolicies === 0) {
      console.log('\n⚠️  RLS is enabled but no policies exist!');
      console.log('   This means ALL queries will be blocked.');
    } else if (enabledCount === totalTables && totalPolicies > 0) {
      console.log('\n✅ RLS is properly configured!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

checkRLS();

