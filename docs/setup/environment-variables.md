# Environment Variables Setup

## Required Environment Variables

Add these to your `.env.local` file (create it if it doesn't exist):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Upstash Redis - Key-value store for caching and session management
UPSTASH_REDIS_REST_URL=https://polished-corgi-41970.upstash.io
UPSTASH_REDIS_REST_TOKEN=AaPyAAIjcDEyZGJhNjljMTFiYmY0ZjNlYjdmZWZlNDA5Mjk3MDc0MXAxMA

# Upstash QStash - Message queue for background job processing
QSTASH_TOKEN=eyJVc2VySUQiOiJhZWFhZWQxYS1lZmYwLTRhNGYtOWRjMS1mYWJjODY2NzMwN2QiLCJQYXNzd29yZCI6ImYxZTAyYWQ3MzdmOTRhMTNiZDczNTg5YmEyMzgzZmU2In0=

# Resend API for transactional emails (get from resend.com)
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_EMAIL_FROM=ColorCraft <hello@colorcraft.art>

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setting up Vercel Environment Variables

### Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   vercel link
   ```

4. **Add environment variables:**
   ```bash
   # Upstash Redis
   vercel env add UPSTASH_REDIS_REST_URL
   # Enter: https://polished-corgi-41970.upstash.io
   
   vercel env add UPSTASH_REDIS_REST_TOKEN
   # Enter: AaPyAAIjcDEyZGJhNjljMTFiYmY0ZjNlYjdmZWZlNDA5Mjk3MDc0MXAxMA
   
   # QStash
   vercel env add QSTASH_TOKEN
   # Enter: eyJVc2VySUQiOiJhZWFhZWQxYS1lZmYwLTRhNGYtOWRjMS1mYWJjODY2NzMwN2QiLCJQYXNzd29yZCI6ImYxZTAyYWQ3MzdmOTRhMTNiZDczNTg5YmEyMzgzZmU2In0=
   
   # Resend (get your API key from resend.com)
   vercel env add RESEND_API_KEY
   # Enter: your_resend_api_key
   
   vercel env add NEXT_PUBLIC_EMAIL_FROM
   # Enter: ColorCraft <hello@colorcraft.art>
   ```

### Using Vercel Dashboard

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:

| Variable | Value | Environment |
|----------|-------|-------------|
| `UPSTASH_REDIS_REST_URL` | `https://polished-corgi-41970.upstash.io` | Production, Preview, Development |
| `UPSTASH_REDIS_REST_TOKEN` | `AaPyAAIjcDEyZGJhNjljMTFiYmY0ZjNlYjdmZWZlNDA5Mjk3MDc0MXAxMA` | Production, Preview, Development |
| `QSTASH_TOKEN` | `eyJVc2VySUQiOiJhZWFhZWQxYS1lZmYwLTRhNGYtOWRjMS1mYWJjODY2NzMwN2QiLCJQYXNzd29yZCI6ImYxZTAyYWQ3MzdmOTRhMTNiZDczNTg5YmEyMzgzZmU2In0=` | Production, Preview, Development |
| `RESEND_API_KEY` | `your_resend_api_key` | Production, Preview, Development |
| `NEXT_PUBLIC_EMAIL_FROM` | `ColorCraft <hello@colorcraft.art>` | Production, Preview, Development |

## Testing Environment Variables

After setting up, test the configuration:

```bash
# Test locally
npm run build

# Deploy to preview and test
vercel --prod
```

## Security Notes

- **Never commit** `.env.local` to version control
- **Rotate credentials** regularly in production
- **Use different credentials** for development/staging/production environments
- **Monitor usage** in Upstash dashboard to prevent unexpected costs 