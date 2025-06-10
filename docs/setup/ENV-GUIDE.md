# Environment Variable Setup Guide

This guide will help you set up the required environment variables for the ColorCraft application, both locally and in your Vercel deployments.

## Required Environment Variables

The application requires the following environment variables to function properly:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public API key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

## Local Development Setup

1. Create a `.env.local` file in the root directory of your project
2. Add the required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Run `npm run verify-env` to check if your variables are set correctly

## Vercel Deployment Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add each of the required environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `SUPABASE_SERVICE_ROLE_KEY`
4. Make sure to enable each variable for all environments (**Production**, **Preview**, and **Development**)
5. Click **Save** and redeploy your application

## Finding Your Supabase Keys

1. Go to your [Supabase Project Dashboard](https://app.supabase.io)
2. Navigate to **Project Settings** > **API**
3. You'll find:
   - `Project URL`: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public`: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role`: This is your `SUPABASE_SERVICE_ROLE_KEY`

## Troubleshooting

If you're experiencing issues with Supabase connections:

1. Check if your environment variables are set correctly:
   - Run `npm run verify-env` locally
   - Visit `/api/check-env` on your deployed app
   
2. Verify your keys are correct:
   - Make sure you're using the `anon public` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Do NOT use the `service_role` key for public client-side operations
   
3. Check if your Supabase project is active:
   - Ensure your Supabase project isn't paused due to billing issues
   
4. Rotate keys if necessary:
   - If you suspect your keys are compromised, you can regenerate them in the Supabase dashboard

## Debugging Tools

The application includes several debugging tools:

- `/debug` page: A visual interface for checking connection issues
- `npm run check-env`: CLI tool for checking environment variables
- `npm run test-db`: Tests connection to specific database tables
- `npm run verify-env`: Verifies all required environment variables are set

## Security Notes

- `NEXT_PUBLIC_` variables are exposed to the browser and should not contain sensitive information
- The `SUPABASE_SERVICE_ROLE_KEY` has full access to your database, including bypassing RLS policies. Keep it secure and never expose it to the client-side.
- Use Row Level Security (RLS) policies to secure your database even if keys are exposed 