-- Update existing cron job to run every minute instead of every 6 hours

-- First, remove the existing cron job if it exists
SELECT cron.unschedule('portfolio-sync-job');

-- Create the new cron job for portfolio sync (runs every minute)
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

-- Check if the cron job was updated successfully
SELECT * FROM cron.job WHERE jobname = 'portfolio-sync-job';

-- View recent cron job runs to verify it's working
SELECT * FROM cron.job_run_details WHERE jobname = 'portfolio-sync-job' ORDER BY start_time DESC LIMIT 5; 