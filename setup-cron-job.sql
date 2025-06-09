-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cron job for portfolio sync (runs every minute)
-- This will call the portfolio-sync-cron edge function
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

-- Check if the cron job was created successfully
SELECT * FROM cron.job WHERE jobname = 'portfolio-sync-job';

-- Optional: Test the function manually (you can run this to test)
-- SELECT net.http_post(
--     url := 'https://tydgehnkaszuvcaywwdm.supabase.co/functions/v1/portfolio-sync-cron',
--     headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGdlaG5rYXN6dXZjYXl3d2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDg0OTcsImV4cCI6MjA1ODAyNDQ5N30.YpQdD8zSpel_JmAVS3oL_esnNRSUY5mNVhPomZWCYQI", "Content-Type": "application/json"}'::jsonb,
--     body := '{}'::jsonb
-- ); 