#!/bin/bash

# Test Portfolio Image Sync Function
echo "🧪 Testing Portfolio Image Sync Function..."

PROJECT_REF="ijwkhpjajfqdhqhpvkcr"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2tocGphamZxZGhxaHB2a2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTQ1NzYwNywiZXhwIjoyMDMxMDMzNjA3fQ.Y5dUvS1zf_CDoBiWCmGW6gGr8AKIKVzF4-TUzJqOFuU"

# Get a real portfolio ID from your database
echo "📋 Getting a portfolio ID from your database..."
PORTFOLIO_ID=$(curl -s "https://${PROJECT_REF}.supabase.co/rest/v1/portfolio?select=id&limit=1" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" | jq -r '.[0].id // "no-portfolio-found"')

if [ "$PORTFOLIO_ID" = "no-portfolio-found" ]; then
  echo "❌ No portfolio found in database. Create a portfolio first."
  exit 1
fi

echo "✅ Using portfolio ID: $PORTFOLIO_ID"

# Test the function with a mock storage event
echo "🔥 Sending mock storage event to edge function..."
curl -X POST "https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-image-sync" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -d "{
    \"type\": \"INSERT\",
    \"table\": \"objects\",
    \"record\": {
      \"name\": \"${PORTFOLIO_ID}/before_images/test-image.jpg\",
      \"bucket_id\": \"portfolio\"
    }
  }"

echo ""
echo "✅ Test completed!"
echo ""
echo "Check the function logs with:"
echo "  supabase functions logs portfolio-image-sync" 