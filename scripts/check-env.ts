import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

console.log('🔍 Checking environment configuration...');

// Check if .env.local exists
const envPath = resolve(process.cwd(), '.env.local');
console.log('📁 Environment file path:', envPath);
console.log('📄 File exists:', existsSync(envPath));

// Load environment variables
config({ path: envPath });

console.log('🔧 Environment variables loaded:');
console.log('DIRECT_URL:', process.env.DIRECT_URL ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

if (!process.env.DIRECT_URL) {
  console.log('\n❌ DIRECT_URL is not set. Please check your .env.local file.');
  console.log('📝 Make sure your .env.local file contains:');
  console.log('DIRECT_URL="postgresql://username:password@host:port/database"');
  process.exit(1);
}

console.log('\n✅ Environment configuration looks good!');
