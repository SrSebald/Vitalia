# Vitalia - Deployment Guide

## ✅ Configuration Status

Your project is now **fully configured** for Cloudflare Pages deployment!

### What's Configured:

- ✅ **Cloudflare Pages dependencies** installed
- ✅ **wrangler.toml** configuration file
- ✅ **next.config.ts** optimized for Cloudflare
- ✅ **Build scripts** added to package.json
- ✅ **GitHub Actions workflow** for automatic deployment
- ✅ **Configuration verification** script

## 🚀 Deployment Methods

### Method 1: GitHub Actions (Recommended for Windows)

This method automatically builds and deploys when you push to GitHub.

**Steps:**

1. **Add Secrets to GitHub:**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `CLOUDFLARE_API_TOKEN`
     - `CLOUDFLARE_ACCOUNT_ID`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `DIRECT_URL`

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Cloudflare Pages configuration"
   git push origin main
   ```

3. **Monitor Deployment:**
   - Check the "Actions" tab in your GitHub repository
   - The workflow will build and deploy automatically

### Method 2: Cloudflare Dashboard

Connect your repository directly in Cloudflare:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → Create application → Pages
3. Connect your GitHub repository
4. Configure:
   - **Build command:** `bun run pages:build`
   - **Build output:** `.vercel/output/static`
   - **Framework:** Next.js
5. Add environment variables
6. Save and Deploy

### Method 3: Manual Deploy (Requires WSL/Linux/macOS)

```bash
# Login to Cloudflare (first time only)
bun run cf:login

# Build the project
bun run pages:build

# Deploy to Cloudflare
bun run cf:deploy
```

## 📋 Available Scripts

```bash
# Cloudflare Pages
bun run pages:build      # Build for Cloudflare Pages
bun run pages:preview    # Preview locally (requires WSL/Unix)
bun run pages:deploy     # Build and deploy (requires WSL/Unix)
bun run cf:login         # Login to Cloudflare CLI
bun run cf:deploy        # Deploy to Cloudflare
bun run cf:check         # Verify Cloudflare configuration

# Development
bun run dev              # Start development server
bun run build            # Standard Next.js build
bun run start            # Start production server

# Database
bun run db:generate      # Generate Drizzle migrations
bun run db:migrate       # Run migrations
bun run db:push          # Push schema to database
bun run db:studio        # Open Drizzle Studio
bun run db:setup         # Setup database schema
```

## 🔧 Environment Variables

### Required for Cloudflare:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DIRECT_URL=your_database_connection_string
```

### Set in Cloudflare Dashboard:

1. Go to your Pages project
2. Settings → Environment variables
3. Add all required variables
4. Redeploy if needed

## 🧪 Testing Configuration

Verify everything is configured correctly:

```bash
bun run scripts/check-cloudflare-config.ts
```

Expected output:
```
✅ wrangler.toml: Configuration file exists
✅ Build output directory: Configured in wrangler.toml
✅ Node.js compatibility: nodejs_compat flag enabled
✅ next.config.ts: Next.js configuration exists
✅ Image optimization: Configured for Cloudflare
✅ Cloudflare scripts: All required scripts configured
✅ Cloudflare dependencies: @cloudflare/next-on-pages and wrangler installed
```

## 🐛 Troubleshooting

### "bash not found" error on Windows

This is expected. Use one of these solutions:
- **Recommended:** Use GitHub Actions (Method 1)
- **Alternative:** Use Cloudflare Dashboard (Method 2)
- **For local builds:** Install and use WSL

### Build fails with module errors

Make sure all dependencies are installed:
```bash
bun install
```

### Environment variables not working

- Check they're set in Cloudflare Dashboard
- Verify naming (especially `NEXT_PUBLIC_` prefix)
- Redeploy after adding variables

### Database connection fails

- Ensure `DIRECT_URL` points to your direct database connection
- For Supabase, use the "Direct connection" URL, not the pooled one
- Check if your database allows connections from Cloudflare IPs

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [GitHub Actions Setup](.github/CLOUDFLARE_SETUP.md)

## 🎉 Success Indicators

Your deployment is successful when:

- ✅ GitHub Actions workflow completes without errors
- ✅ Site is accessible at your Cloudflare Pages URL
- ✅ Authentication works (login/signup)
- ✅ Database operations function correctly
- ✅ No console errors in browser

## 🔐 Security Notes

- Never commit `.env` or `.env.local` files
- Use GitHub Secrets for sensitive data
- Rotate API tokens periodically
- Review Cloudflare security settings

---

Need help? Check `.github/CLOUDFLARE_SETUP.md` for detailed setup instructions.

