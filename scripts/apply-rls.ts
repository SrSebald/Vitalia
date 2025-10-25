/**
 * Script to apply Row Level Security (RLS) policies to the database
 * 
 * This script reads all SQL files from the rls directory and executes them
 * in order to set up comprehensive security policies for all tables.
 * 
 * Usage: bun run scripts/apply-rls.ts
 */

import postgres from 'postgres';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use DIRECT_URL for Supabase (better for scripts), fallback to DATABASE_URL
const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL or DIRECT_URL not found in environment variables');
  console.error('Please set DATABASE_URL or DIRECT_URL in your .env file');
  process.exit(1);
}

console.log(`🔗 Connecting to: ${DATABASE_URL.split('@')[1]?.split('/')[0] || 'database'}...\n`);

async function applyRLS() {
  console.log('🔐 Starting RLS (Row Level Security) setup...\n');

  const sql = postgres(DATABASE_URL, {
    ssl: 'require',
    connection: {
      application_name: 'vitalia_rls_setup'
    }
  });

  try {
    // Directory containing RLS SQL files
    const rlsDir = join(process.cwd(), 'scripts', 'rls');
    
    // Get all SQL files and sort them
    const sqlFiles = readdirSync(rlsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (sqlFiles.length === 0) {
      console.log('⚠️  No SQL files found in scripts/rls directory');
      return;
    }

    console.log(`Found ${sqlFiles.length} SQL policy files to execute:\n`);

    // Execute each SQL file in order
    for (const file of sqlFiles) {
      const filePath = join(rlsDir, file);
      const sqlContent = readFileSync(filePath, 'utf-8');
      
      console.log(`📄 Executing: ${file}`);
      
      try {
        await sql.unsafe(sqlContent);
        console.log(`   ✅ Success\n`);
      } catch (error) {
        console.error(`   ❌ Error in ${file}:`);
        console.error(`   ${error.message}\n`);
        throw error;
      }
    }

    console.log('🎉 RLS policies applied successfully!\n');
    console.log('🔒 Security Summary:');
    console.log('   • Row Level Security enabled on all tables');
    console.log('   • Users can only access their own data');
    console.log('   • Public exercises are visible to everyone');
    console.log('   • Private exercises are only visible to creators');
    console.log('   • Helper functions created for permission checks\n');

  } catch (error) {
    console.error('\n❌ Failed to apply RLS policies');
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the script
applyRLS()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });

