-- Setup webhook for portfolio image synchronization
-- This webhook will trigger our edge function whenever files are uploaded/deleted in the portfolio bucket

-- Note: The webhook URL will need to be configured in the Supabase dashboard or via the CLI
-- The URL format will be: https://{project-ref}.supabase.co/functions/v1/portfolio-image-sync

-- Create a function to validate storage webhook events (optional security)
CREATE OR REPLACE FUNCTION validate_portfolio_storage_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the storage event for debugging
  RAISE NOTICE 'Storage event: % on bucket % for file %', 
    TG_OP, 
    COALESCE(NEW.bucket_id, OLD.bucket_id),
    COALESCE(NEW.name, OLD.name);
  
  -- Always allow the operation to continue
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add some helpful comments for the edge function setup
COMMENT ON FUNCTION validate_portfolio_storage_event() IS 'Optional function to log storage events for portfolio webhook debugging';

-- Instructions for setting up the webhook (to be run manually or via CLI):
/*
To complete the setup, you need to create a webhook that calls the edge function.
This can be done via the Supabase CLI or dashboard:

1. Via CLI (recommended):
   supabase functions deploy portfolio-image-sync
   
   supabase secrets set --env-file .env.local
   
   # Create webhook for storage events
   curl -X POST 'https://{project-ref}.supabase.co/rest/v1/webhooks' \
     -H "apikey: {service-role-key}" \
     -H "Authorization: Bearer {service-role-key}" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "portfolio-image-sync",
       "url": "https://{project-ref}.supabase.co/functions/v1/portfolio-image-sync",
       "events": ["INSERT", "UPDATE", "DELETE"],
       "filter": "bucket_id=eq.portfolio",
       "table": "objects",
       "schema": "storage"
     }'

2. Via Dashboard:
   - Go to Database > Webhooks
   - Create new webhook
   - Name: portfolio-image-sync
   - URL: https://{project-ref}.supabase.co/functions/v1/portfolio-image-sync
   - Events: INSERT, UPDATE, DELETE
   - Table: storage.objects
   - Filter: bucket_id=eq.portfolio

The edge function will automatically:
- Detect when files are uploaded to portfolio/{uuid}/before_images/ or portfolio/{uuid}/after_images/
- Scan the entire directory for all images
- Update the portfolio table with current image arrays
- Handle errors gracefully with detailed logging
*/ 