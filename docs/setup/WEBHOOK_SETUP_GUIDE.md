# Portfolio Sync Setup Guide

## 🎯 Overview
This guide will help you set up automated portfolio synchronization using:
1. **Cron Job** - Runs every minute to sync all portfolios
2. **Database Webhooks** - Triggered when portfolio records change
3. **Storage Webhooks** - Triggered when images are uploaded/deleted

## 📋 Prerequisites
- ✅ Edge functions deployed
- ✅ Supabase Pro plan (for cron jobs)
- ✅ Admin access to Supabase dashboard

---

## 1. 🕐 Set Up Cron Job

### Option A: Via SQL Editor (Recommended)
1. **Open SQL Editor**: https://supabase.com/dashboard/project/tydgehnkaszuvcaywwdm/sql/new

2. **Run this SQL**:
```sql
-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cron job for portfolio sync (runs every minute)
SELECT cron.schedule(
    'portfolio-sync-job',                           -- Job name
    '* * * * *',                                   -- Every minute
    $$
    SELECT net.http_post(
        url := 'https://tydgehnkaszuvcaywwdm.supabase.co/functions/v1/portfolio-sync-cron',
        headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGdlaG5rYXN6dXZjYXl3d2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDg0OTcsImV4cCI6MjA1ODAyNDQ5N30.YpQdD8zSpel_JmAVS3oL_esnNRSUY5mNVhPomZWCYQI", "Content-Type": "application/json"}'::jsonb,
        body := '{}'::jsonb
    ) as request_id;
    $$
);

-- Verify the cron job was created
SELECT * FROM cron.job WHERE jobname = 'portfolio-sync-job';
```

3. **Test manually** (optional):
```sql
SELECT net.http_post(
    url := 'https://tydgehnkaszuvcaywwdm.supabase.co/functions/v1/portfolio-sync-cron',
    headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGdlaG5rYXN6dXZjYXl3d2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDg0OTcsImV4cCI6MjA1ODAyNDQ5N30.YpQdD8zSpel_JmAVS3oL_esnNRSUY5mNVhPomZWCYQI", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
);
```

---

## 2. 🔗 Set Up Database Webhooks

### For Portfolio Table Changes
1. **Go to Database Webhooks**: https://supabase.com/dashboard/project/tydgehnkaszuvcaywwdm/database/hooks

2. **Create New Webhook**:
   - **Name**: `portfolio-sync-webhook`
   - **Table**: `portfolio`
   - **Events**: Check `Insert`, `Update`, `Delete`
   - **HTTP Method**: `POST`
   - **URL**: `https://tydgehnkaszuvcaywwdm.supabase.co/functions/v1/portfolio-sync-webhook`
   - **HTTP Headers**: 
     ```json
     {
       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGdlaG5rYXN6dXZjYXl3d2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDg0OTcsImV4cCI6MjA1ODAyNDQ5N30.YpQdD8zSpel_JmAVS3oL_esnNRSUY5mNVhPomZWCYQI",
       "Content-Type": "application/json"
     }
     ```

---

## 3. 📁 Set Up Storage Webhooks

### For Portfolio Images Upload/Delete
1. **Go to Storage Settings**: https://supabase.com/dashboard/project/tydgehnkaszuvcaywwdm/storage/settings

2. **Create Storage Webhook**:
   - **Name**: `portfolio-image-sync-webhook`
   - **Bucket**: `portfolio`
   - **Events**: Check `INSERT`, `UPDATE`, `DELETE`
   - **URL**: `https://tydgehnkaszuvcaywwdm.supabase.co/functions/v1/portfolio-image-sync`
   - **HTTP Headers**:
     ```json
     {
       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGdlaG5rYXN6dXZjYXl3d2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDg0OTcsImV4cCI6MjA1ODAyNDQ5N30.YpQdD8zSpel_JmAVS3oL_esnNRSUY5mNVhPomZWCYQI",
       "Content-Type": "application/json"
     }
     ```

---

## 4. 🧪 Testing Your Setup

### Test Cron Job
```bash
# Call the function directly to test
curl -X POST https://tydgehnkaszuvcaywwdm.supabase.co/functions/v1/portfolio-sync-cron \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGdlaG5rYXN6dXZjYXl3d2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDg0OTcsImV4cCI6MjA1ODAyNDQ5N30.YpQdD8zSpel_JmAVS3oL_esnNRSUY5mNVhPomZWCYQI" \
  -H "Content-Type: application/json"
```

### Test Database Webhook
- Create, update, or delete a portfolio record
- Check the function logs in the Supabase dashboard

### Test Storage Webhook
- Upload or delete an image in the portfolio bucket
- Check the function logs in the Supabase dashboard

---

## 5. 📊 Monitoring

### View Function Logs
1. **Go to Functions**: https://supabase.com/dashboard/project/tydgehnkaszuvcaywwdm/functions
2. **Click on each function** to view logs and invocations
3. **Monitor for errors** and performance

### View Cron Job Status
```sql
-- Check cron job status
SELECT * FROM cron.job WHERE jobname = 'portfolio-sync-job';

-- View cron job run history
SELECT * FROM cron.job_run_details WHERE jobname = 'portfolio-sync-job' ORDER BY start_time DESC LIMIT 10;
```

---

## 🎉 Success!

Once all steps are completed, your portfolio synchronization will be fully automated:

- **✅ Images sync automatically** when uploaded/deleted
- **✅ Portfolio records trigger sync** when modified  
- **✅ Scheduled sync runs every 6 hours** as backup
- **✅ Real-time sync** keeps everything in perfect sync

## 🔧 Troubleshooting

### Common Issues:
1. **403 Forbidden**: Check your authorization headers
2. **Function not found**: Verify function deployment
3. **Cron not running**: Ensure you have Supabase Pro plan
4. **Webhook not firing**: Check table/bucket permissions

### Function URLs:
- **Cron**: `https://tydgehnkaszuvcaywwdm.supabase.co/functions/v1/portfolio-sync-cron`
- **DB Webhook**: `https://tydgehnkaszuvcaywwdm.supabase.co/functions/v1/portfolio-sync-webhook`  
- **Storage Webhook**: `https://tydgehnkaszuvcaywwdm.supabase.co/functions/v1/portfolio-image-sync` 