# Setting Up Environment Variables in Vercel

Follow these steps to add your Supabase ANON key to your Vercel project:

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your "colorcraft" project
3. Click on "Settings" tab
4. Select "Environment Variables" from the left sidebar
5. Add a new environment variable:
   - NAME: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - VALUE: (Copy from your Supabase Dashboard → Project Settings → API → Project API keys → `anon public`)
6. Ensure "Production" environment is selected
7. Click "Save"
8. Redeploy your project (go to "Deployments" tab and click "Redeploy" on your latest deployment)

## Verifying Environment Variables

After adding the environment variable, you can verify it's working by:

1. Visiting your deployed site
2. Navigate to `/api/check-env` to see if the ANON key is now listed as "exists"
3. Try accessing the services or portfolio pages to see if they load properly 