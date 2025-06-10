# Deployment Guide - Bypassing Vercel Limitations

This guide explains how to use GitHub Actions to deploy your ColorCraft application when you've hit Vercel's free tier deployment limits (100 deployments per day).

## Available Deployment Options

We've set up multiple deployment workflows that run automatically via GitHub Actions:

### 1. 🚀 Railway (Recommended)
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

For any deployment option, add these secrets to your GitHub repository:

### Repository Secrets
Go to: Repository → Settings → Secrets and variables → Actions

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key

# Railway specific
RAILWAY_TOKEN=your_railway_token

# Netlify specific
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_netlify_site_id
```

## How to Deploy

### Automatic Deployments
1. Push code to the `main` branch
2. GitHub Actions will automatically trigger
3. Check the "Actions" tab in your repository for deployment status
4. Get the live URL from the deployment logs

### Manual Deployments
1. Go to repository → Actions
2. Select the workflow you want to run
3. Click "Run workflow"
4. Choose the branch and trigger deployment

## Workflow Features

### Railway Deployment
```yaml
✅ Full Next.js support
✅ API routes supported  
✅ Environment variables
✅ Custom domains
✅ Automatic SSL
✅ Database integration
```

### Netlify Deployment
```yaml
✅ Static site generation
✅ Edge functions
✅ Form handling
✅ A/B testing
✅ Custom domains
⚠️  Limited API route support
```

### GitHub Pages
```yaml
✅ Free hosting
✅ Custom domains
✅ Perfect for static sites
❌ No API routes
❌ No server-side rendering
```

## Troubleshooting

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

### API Route Issues
- Railway: ✅ Full support
- Netlify: ⚠️ Use Edge Functions
- GitHub Pages: ❌ Not supported (use static export)

## Cost Comparison

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Vercel | 100 deployments/day | $20/month |
| Railway | $5 credit/month | $5+/month usage-based |
| Netlify | 300 build minutes/month | $19/month |
| GitHub Pages | Unlimited | Free with GitHub |

## Advanced Configuration

### Custom Domains
1. **Railway**: Project Settings → Domains
2. **Netlify**: Site Settings → Domain Management  
3. **GitHub Pages**: Repository Settings → Pages

### Environment-Specific Builds
```yaml
# Different configs for different environments
- name: Build for Production
  run: npm run build
  env:
    NODE_ENV: production
    NEXT_PUBLIC_API_URL: https://api.yoursite.com
```

### Performance Optimization
- Enable build caching in workflows
- Use Node.js 18 or 20 for best performance
- Configure image optimization settings
- Enable compression in Next.js config

## Migration from Vercel

1. **Backup your Vercel environment variables**
2. **Choose your new platform** (Railway recommended)
3. **Set up GitHub Secrets** with your environment variables
4. **Push to main branch** to trigger first deployment
5. **Update your DNS** to point to the new platform
6. **Test thoroughly** before switching traffic

## Support

If you encounter issues:

1. Check GitHub Actions logs in the "Actions" tab
2. Verify all secrets are properly configured
3. Test the build locally first
4. Check platform-specific documentation:
   - [Railway Docs](https://docs.railway.app)
   - [Netlify Docs](https://docs.netlify.com)
   - [GitHub Pages Docs](https://docs.github.com/pages)

---

**Note**: This setup allows you to deploy unlimited times without hitting Vercel's free tier restrictions. Choose the platform that best fits your needs and budget. 