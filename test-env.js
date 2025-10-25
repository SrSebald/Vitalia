// test-env.js
require('dotenv').config({ path: '.env.local' });

console.log('DIRECT_URL:', process.env.DIRECT_URL ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

if (process.env.DIRECT_URL) {
  console.log('✅ Variables loaded successfully!');
} else {
  console.log('❌ DIRECT_URL not found');
}