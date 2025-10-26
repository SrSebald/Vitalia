import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

interface ConfigCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

async function checkCloudflareConfig() {
  console.log('🔍 Checking Cloudflare Pages configuration...\n');

  const checks: ConfigCheck[] = [];
  const rootDir = process.cwd();

  // Check 1: wrangler.toml exists
  const wranglerPath = resolve(rootDir, 'wrangler.toml');
  if (existsSync(wranglerPath)) {
    checks.push({
      name: 'wrangler.toml',
      status: 'pass',
      message: 'Configuration file exists',
    });

    // Check wrangler.toml content
    const wranglerContent = readFileSync(wranglerPath, 'utf-8');
    if (wranglerContent.includes('pages_build_output_dir')) {
      checks.push({
        name: 'Build output directory',
        status: 'pass',
        message: 'Configured in wrangler.toml',
      });
    } else {
      checks.push({
        name: 'Build output directory',
        status: 'warning',
        message: 'Not configured in wrangler.toml',
      });
    }

    if (wranglerContent.includes('nodejs_compat')) {
      checks.push({
        name: 'Node.js compatibility',
        status: 'pass',
        message: 'nodejs_compat flag enabled',
      });
    } else {
      checks.push({
        name: 'Node.js compatibility',
        status: 'warning',
        message: 'nodejs_compat flag not found',
      });
    }
  } else {
    checks.push({
      name: 'wrangler.toml',
      status: 'fail',
      message: 'Configuration file not found',
    });
  }

  // Check 2: next.config.ts
  const nextConfigPath = resolve(rootDir, 'next.config.ts');
  if (existsSync(nextConfigPath)) {
    checks.push({
      name: 'next.config.ts',
      status: 'pass',
      message: 'Next.js configuration exists',
    });

    const nextConfigContent = readFileSync(nextConfigPath, 'utf-8');
    if (nextConfigContent.includes('unoptimized: true')) {
      checks.push({
        name: 'Image optimization',
        status: 'pass',
        message: 'Configured for Cloudflare',
      });
    } else {
      checks.push({
        name: 'Image optimization',
        status: 'warning',
        message: 'May need Cloudflare-specific configuration',
      });
    }
  } else {
    checks.push({
      name: 'next.config.ts',
      status: 'fail',
      message: 'Next.js configuration not found',
    });
  }

  // Check 3: package.json scripts
  const packageJsonPath = resolve(rootDir, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    const requiredScripts = [
      'pages:build',
      'pages:preview',
      'pages:deploy',
      'cf:login',
    ];

    const missingScripts = requiredScripts.filter(
      script => !packageJson.scripts?.[script]
    );

    if (missingScripts.length === 0) {
      checks.push({
        name: 'Cloudflare scripts',
        status: 'pass',
        message: 'All required scripts configured',
      });
    } else {
      checks.push({
        name: 'Cloudflare scripts',
        status: 'warning',
        message: `Missing scripts: ${missingScripts.join(', ')}`,
      });
    }

    // Check dependencies
    const hasCloudflareDeps = 
      packageJson.devDependencies?.['@cloudflare/next-on-pages'] &&
      packageJson.devDependencies?.['wrangler'];

    if (hasCloudflareDeps) {
      checks.push({
        name: 'Cloudflare dependencies',
        status: 'pass',
        message: '@cloudflare/next-on-pages and wrangler installed',
      });
    } else {
      checks.push({
        name: 'Cloudflare dependencies',
        status: 'fail',
        message: 'Required dependencies not found',
      });
    }
  }

  // Print results
  console.log('📋 Configuration Check Results:\n');
  
  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;

  checks.forEach(check => {
    const icon = 
      check.status === 'pass' ? '✅' :
      check.status === 'fail' ? '❌' :
      '⚠️';

    console.log(`${icon} ${check.name}: ${check.message}`);

    if (check.status === 'pass') passCount++;
    else if (check.status === 'fail') failCount++;
    else warningCount++;
  });

  console.log(`\n📊 Summary: ${passCount} passed, ${failCount} failed, ${warningCount} warnings`);

  // Print next steps
  if (failCount === 0) {
    console.log('\n🎉 Configuration looks good!');
    console.log('\n📝 Next steps:');
    console.log('1. Login to Cloudflare: bun run cf:login');
    console.log('2. Build for Cloudflare: bun run pages:build');
    console.log('3. Preview locally: bun run pages:preview');
    console.log('4. Deploy to Cloudflare: bun run cf:deploy');
  } else {
    console.log('\n⚠️  Please fix the failed checks before deploying.');
    process.exit(1);
  }
}

checkCloudflareConfig().catch(error => {
  console.error('❌ Error checking configuration:', error);
  process.exit(1);
});
