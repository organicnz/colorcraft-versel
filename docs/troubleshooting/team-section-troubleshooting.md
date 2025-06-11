# Team Section Troubleshooting Guide

## Issue: Team cards showing placeholder/fake data instead of real database data

### Quick Diagnosis

Run this command to test if your team data is accessible:

```bash
npm run test:team
```

This will show you:
- How many team members are in the database
- Which ones are featured (shown on homepage)
- If database permissions are working correctly

### Expected Behavior

When working correctly, you should see:
- Real team member names (Sarah Mitchell, James Wilson, Emma Rodriguez, etc.)
- Professional photos from the database
- Real bio information and specialties
- Years of experience badges

### Common Solutions

#### 1. Clear Cache and Restart Server

```bash
# Stop the dev server
pkill -f "next dev"

# Clear Next.js cache
rm -rf .next

# Restart fresh
npm run dev
```

#### 2. Verify Database Connection

```bash
# Test team data access
npm run test:team

# Should show 5+ featured team members
```

#### 3. Setup/Reset Team Table

If no team data exists:

```bash
# Create table and insert sample data
npm run setup:team
```

#### 4. Check Environment Variables

Ensure these are set in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Fallback Behavior

If database connection fails, the app will show fallback data:
- Sarah Mitchell (Lead Furniture Artist)
- James Wilson (Restoration Specialist)  
- Emma Rodriguez (Design Consultant)

This is **expected behavior** when:
- Team table doesn't exist
- Database permissions are incorrect
- Network issues prevent database access

### Production Deployment

For production builds:
1. Ensure team table exists in production database
2. Run migration: `npm run setup:team` (one time)
3. Verify with: `npm run test:team`
4. Deploy with proper environment variables

### Still Having Issues?

1. Check browser developer console for errors
2. Verify Supabase dashboard shows team table with data
3. Test direct database access with `npm run test:team`
4. Restart development server completely

The team section should show **real database data** within 30 seconds of a fresh server restart if everything is configured correctly. 