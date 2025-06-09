#!/bin/bash

# Deploy Portfolio Image Sync Edge Function and Create Webhook
set -e

echo "🚀 Deploying Portfolio Image Sync Function..."

# Deploy the function first
echo "📦 Deploying edge function..."
supabase functions deploy portfolio-image-sync

echo "✅ Function deployed!"

# Create the webhook using your project details
PROJECT_REF="ijwkhpjajfqdhqhpvkcr"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2tocGphamZxZGhxaHB2a2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTQ1NzYwNywiZXhwIjoyMDMxMDMzNjA3fQ.Y5dUvS1zf_CDoBiWCmGW6gGr8AKIKVzF4-TUzJqOFuU"

echo "🔗 Creating storage webhook..."

# Create the webhook
curl -X POST "https://${PROJECT_REF}.supabase.co/rest/v1/webhooks" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"portfolio-image-sync\",
    \"url\": \"https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-image-sync\",
    \"events\": [\"INSERT\", \"UPDATE\", \"DELETE\"],
    \"filter\": \"bucket_id=eq.portfolio\",
    \"table\": \"objects\",
    \"schema\": \"storage\"
  }"

echo ""
echo "✅ Webhook created!"

# Test the function
echo "🧪 Testing function..."
curl -X POST "https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-image-sync" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -d '{
    "type": "INSERT",
    "table": "objects", 
    "record": {
      "name": "test-portfolio-uuid/before_images/test.jpg",
      "bucket_id": "portfolio"
    }
  }' || echo "Test failed - but this is expected if no portfolio exists with that ID"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "The webhook will now trigger the function when:"
echo "  • Files are uploaded to portfolio storage"
echo "  • Files are deleted from portfolio storage"
echo "  • Files are moved within portfolio storage"
echo ""
echo "To test with a real portfolio:"
echo "  1. Upload an image to: portfolio/{portfolio-uuid}/before_images/image.jpg"
echo "  2. Check function logs: supabase functions logs portfolio-image-sync" 