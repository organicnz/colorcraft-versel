# Deployment Guide - Bypassing Vercel Limitations

This guide explains how to use GitHub Actions to deploy your ColorCraft application when you've hit Vercel's free tier deployment limits (100 deployments per day).

## 🎯 **Recommended Solution: Vercel via GitHub Actions** 

### 🚀 Stay on Vercel but Bypass Limits
**Files**: `.github/workflows/vercel-deploy.yml` & `.github/workflows/vercel-preview.yml`

**Why this is the best option:**
- ✅ Keep all Vercel benefits (edge functions, serverless, performance)
- ✅ Bypass the 100 deployments/day limit completely
- ✅ Unlimited deployments via GitHub Actions
- ✅ Same Vercel infrastructure and features
- ✅ Preview deployments with PR comments
- ✅ Zero migration needed

**Setup Steps**:
1. Get your Vercel token: [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Add `VERCEL_TOKEN` to GitHub Secrets
3. Add your environment variables to GitHub Secrets
4. Push to main branch → automatic deployment!

**How it works:**
- GitHub Actions builds your project
- Uses Vercel CLI to deploy programmatically
- Completely bypasses Vercel's dashboard limits
- Same performance, same features, unlimited deployments

---

## Alternative Deployment Options

If you prefer to migrate away from Vercel entirely, here are other options:

### 1. 🚀 Railway
**File**: `.github/workflows/railway-deploy.yml`

Railway is the best alternative to Vercel with similar features:
- Full Next.js support including API routes
- Automatic deployments from GitHub
- Custom domains
- Environment variables management
- Built-in PostgreSQL if needed

**Setup Steps**:
1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add `RAILWAY_TOKEN` to GitHub Secrets
4. Push to main branch to trigger deployment

### 2. 🌐 Netlify
**File**: `.github/workflows/netlify-deploy.yml`

Good for static sites and JAMstack applications:
- Great for static exports
- Edge functions for API routes
- Form handling
- A/B testing

**Setup Steps**:
1. Create account at [netlify.com](https://netlify.com)
2. Add GitHub Secrets:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
3. Push to main branch to trigger deployment

### 3. 📄 GitHub Pages
**File**: `.github/workflows/deploy.yml`

Free hosting directly from GitHub:
- Perfect for static sites
- Custom domains supported
- Limited to static content only (no API routes)

**Setup Steps**:
1. Go to repository Settings → Pages
2. Set source to "GitHub Actions"
3. Add environment secrets
4. Push to main branch

### 4. 🧪 Build Testing
**File**: `.github/workflows/build-test.yml`

Automated testing and build verification:
- Tests builds on Node.js 18 & 20
- Lint checking
- Type checking
- Build artifact generation

## Environment Variables Setup

### Required Secrets for Vercel via GitHub Actions
Go to: Repository → Settings → Secrets and variables → Actions

```bash
# Core application secrets
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key

# Vercel deployment token (REQUIRED)
VERCEL_TOKEN=your_vercel_token
```

### Optional Secrets for Alternative Platforms
```bash
# Railway specific
RAILWAY_TOKEN=your_railway_token

# Netlify specific
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_netlify_site_id
```

## How to Deploy

### Vercel via GitHub Actions (Recommended)
1. **First time setup:**
   - Get Vercel token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Add `VERCEL_TOKEN` to GitHub Secrets
   - Link your Vercel project: `vercel link` (run locally once)

2. **Automatic deployments:**
   - Push to `main` branch → Production deployment
   - Create PR → Preview deployment with comment
   - Check Actions tab for deployment status

3. **Manual deployments:**
   - Go to Actions → "Deploy to Vercel via GitHub Actions"
   - Click "Run workflow"

### Features Comparison

#### Vercel via GitHub Actions (Recommended)
```yaml
✅ All Vercel features (edge functions, serverless, analytics)
✅ Unlimited deployments (bypasses 100/day limit)
✅ Preview deployments on PRs
✅ Custom domains and SSL
✅ Same performance as native Vercel
✅ No migration required
✅ Automatic PR comments with preview URLs
```

#### Alternative Platforms
```yaml
Railway:  ✅ Full Next.js  ✅ Database  💰 $5/month
Netlify:  ✅ Static sites  ⚠️ Limited SSR  💰 Free tier
GitHub:   ✅ Free hosting  ❌ No API routes  💰 Free
```

## Troubleshooting

### Vercel Token Issues
```bash
❌ Error: Invalid token
✅ Solution: Generate new token at vercel.com/account/tokens
✅ Ensure token has correct permissions
```

### Build Failures
1. Check the Actions tab for error logs
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check Next.js configuration in `next.config.js`

### Missing Environment Variables
```bash
# Add to GitHub Secrets
❌ Missing or invalid environment variables: RESEND_API_KEY
✅ Add RESEND_API_KEY to repository secrets
```

## Migration from Native Vercel

**No migration needed!** You're staying on Vercel, just changing how you deploy:

1. **Get your Vercel token** from [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. **Add to GitHub Secrets** as `VERCEL_TOKEN`
3. **Link your project** (run `vercel link` locally once)
4. **Push to main** → Unlimited deployments!

Your existing Vercel project, domains, and settings remain unchanged.

## Cost Comparison

| Method | Deployments | Cost | Features |
|--------|-------------|------|----------|
| **Vercel Direct** | 100/day limit | Free/Pro | All features |
| **Vercel + GitHub Actions** | ♾️ Unlimited | Free | All features |
| Railway | Unlimited | $5/month | Full Next.js |
| Netlify | 300 builds/month | Free/Pro | Limited SSR |
| GitHub Pages | Unlimited | Free | Static only |

## Advanced Configuration

### Custom Deployment Environments
```yaml
# Deploy to different Vercel projects
- name: Deploy to Staging
  run: vercel deploy --token=${{ secrets.VERCEL_TOKEN }}
  
- name: Deploy to Production  
  run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Conditional Deployments
```yaml
# Only deploy on specific file changes
- name: Check for changes
  uses: dorny/paths-filter@v2
  with:
    filters: |
      src:
        - 'src/**'
        - 'public/**'
        - 'package.json'
```

---

## 🎯 **Quick Start: Vercel Bypass Setup**

1. **Get Vercel Token**: [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. **Add to GitHub**: Repository → Settings → Secrets → `VERCEL_TOKEN`
3. **Link Project**: Run `vercel link` locally (one time)
4. **Push Code**: Automatic unlimited deployments!

**Result**: Keep all Vercel benefits with unlimited deployments! 🚀

---

**Note**: The Vercel bypass method is the recommended approach - you get unlimited deployments while keeping all the performance and features you love about Vercel. 