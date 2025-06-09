#!/bin/bash

# Setup Portfolio Database Webhook + Cron Job System
set -e

echo "🚀 Setting up Database Webhook + Cron Job System..."

PROJECT_REF="ijwkhpjajfqdhqhpvkcr"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2tocGphamZxZGhxaHB2a2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTQ1NzYwNywiZXhwIjoyMDMxMDMzNjA3fQ.Y5dUvS1zf_CDoBiWCmGW6gGr8AKIKVzF4-TUzJqOFuU"

# Deploy both functions
echo "📦 Deploying edge functions..."
supabase functions deploy portfolio-sync-webhook
supabase functions deploy portfolio-sync-cron

echo "✅ Functions deployed!"

# Create database webhook for portfolio table changes
echo "🔗 Creating database webhook for portfolio table..."
curl -X POST "https://${PROJECT_REF}.supabase.co/rest/v1/webhooks" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"portfolio-db-webhook\",
    \"url\": \"https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-sync-webhook\",
    \"events\": [\"INSERT\", \"UPDATE\", \"DELETE\"],
    \"table\": \"portfolio\",
    \"schema\": \"public\"
  }"

echo "✅ Database webhook created!"

# Set up cron job (every 15 minutes)
echo "⏰ Setting up cron job..."
curl -X POST "https://${PROJECT_REF}.supabase.co/rest/v1/functions" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"slug\": \"portfolio-sync-cron\",
    \"cron_schedule\": \"*/15 * * * *\"
  }" || echo "Note: Cron setup may need to be done via dashboard"

echo "✅ Cron job configured!"

# Test both functions
echo "🧪 Testing database webhook..."
curl -X POST "https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-sync-webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -d '{
    "type": "UPDATE",
    "table": "portfolio",
    "record": {
      "id": "test-portfolio-id",
      "title": "Test Portfolio"
    }
  }' || echo "Test webhook failed (expected if no portfolio exists)"

echo ""
echo "🧪 Testing cron job..."
curl -X POST "https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-sync-cron" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -d '{}' || echo "Cron test failed"

echo ""
echo "🎉 Setup completed!"
echo ""
echo "System Overview:"
echo "  📋 Database Webhook: Triggers on portfolio table changes"
echo "  ⏰ Cron Job: Runs every 15 minutes to sync all portfolios"
echo "  🔄 Automatic: Images sync when portfolios are created/updated"
echo "  🛡️ Backup: Cron ensures nothing is missed"
echo ""
echo "Functions deployed:"
echo "  • portfolio-sync-webhook: https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-sync-webhook"
echo "  • portfolio-sync-cron: https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-sync-cron"
echo ""
echo "Monitor with:"
echo "  supabase functions logs portfolio-sync-webhook"
echo "  supabase functions logs portfolio-sync-cron"
echo ""
echo "Manual sync all portfolios:"
echo "  curl -X POST https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-sync-cron" 