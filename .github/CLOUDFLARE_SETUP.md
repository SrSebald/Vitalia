# Cloudflare Pages Setup Guide

## 🚀 Deployment Options

### Option 1: Automatic Deploy via GitHub Actions (Recommended)

This is the easiest way to deploy from Windows.

#### Prerequisites
1. GitHub repository with this project
2. Cloudflare account

#### Setup Steps

1. **Get Cloudflare Credentials:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Click on your profile → API Tokens
   - Create Token → "Edit Cloudflare Workers" template
   - Copy the API Token
   - Get your Account ID from any Cloudflare Pages project or the URL

2. **Add GitHub Secrets:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
     - `DIRECT_URL`: Your database connection string

3. **Deploy:**
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy
   - Check the Actions tab for progress

### Option 2: Cloudflare Dashboard Deploy

1. **Connect Repository:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Workers & Pages → Create application → Pages
   - Connect to Git → Select your repository

2. **Configure Build Settings:**
   ```
   Framework preset: Next.js
   Build command: bun run pages:build
   Build output directory: .vercel/output/static
   ```

3. **Add Environment Variables:**
   - Add all your environment variables in the Cloudflare dashboard
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - DIRECT_URL

4. **Deploy:**
   - Click "Save and Deploy"
   - Every push to main will trigger a new deployment

### Option 3: WSL (Windows Subsystem for Linux)

If you want to build and deploy from Windows locally:

1. **Install WSL:**
   ```powershell
   wsl --install
   ```

2. **Inside WSL:**
   ```bash
   cd /mnt/c/Users/werne/Documents/GitHub/Vitalia
   bun install
   bun run pages:build
   bun run cf:login
   bun run cf:deploy
   ```

## 🔧 Manual Deploy Commands

Once you're in a Unix environment (GitHub Actions, WSL, Linux, macOS):

```bash
# Login to Cloudflare (first time only)
bun run cf:login

# Build for Cloudflare Pages
bun run pages:build

# Preview locally
bun run pages:preview

# Deploy to production
bun run cf:deploy
```

## 📝 Configuration Files

- `wrangler.toml`: Cloudflare configuration
- `next.config.ts`: Next.js configuration optimized for Cloudflare
- `.github/workflows/deploy-cloudflare.yml`: GitHub Actions workflow

## ⚙️ Environment Variables

Make sure these are set in Cloudflare:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DIRECT_URL`
- `DATABASE_URL` (if different from DIRECT_URL)

## 🧪 Testing

Check configuration:
```bash
bun run scripts/check-cloudflare-config.ts
```

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)

