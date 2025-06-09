#!/bin/bash

# Setup Portfolio Image Sync Edge Function and Webhook
# This script deploys the edge function and creates the webhook

set -e  # Exit on any error

echo "🚀 Setting up Portfolio Image Sync Edge Function..."

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo "Please install it: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ Error: Not logged in to Supabase CLI"
    echo "Please run: supabase login"
    exit 1
fi

# Get project reference
echo "📋 Getting project information..."
PROJECT_REF=$(supabase status | grep "API URL" | awk -F'//' '{print $2}' | awk -F'.' '{print $1}')

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Error: Could not determine project reference"
    echo "Make sure you're linked to a Supabase project: supabase link"
    exit 1
fi

echo "✅ Project Reference: $PROJECT_REF"

# Deploy the edge function
echo "📦 Deploying portfolio-image-sync edge function..."
supabase functions deploy portfolio-image-sync

# Set environment variables for the edge function
echo "🔧 Setting environment variables..."
if [ -f ".env.local" ]; then
    supabase secrets set --env-file .env.local
    echo "✅ Environment variables set from .env.local"
else
    echo "⚠️  Warning: .env.local not found. Make sure environment variables are set."
fi

# Get service role key for webhook creation
SERVICE_ROLE_KEY=$(grep "SUPABASE_SERVICE_ROLE_KEY" .env.local 2>/dev/null | cut -d'=' -f2 | tr -d '"' || echo "")

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local"
    echo "Please add your service role key to .env.local"
    exit 1
fi

# Create the webhook
echo "🔗 Creating storage webhook..."
WEBHOOK_URL="https://${PROJECT_REF}.supabase.co/functions/v1/portfolio-image-sync"

curl -X POST "https://${PROJECT_REF}.supabase.co/rest/v1/webhooks" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"portfolio-image-sync\",
    \"url\": \"${WEBHOOK_URL}\",
    \"events\": [\"INSERT\", \"UPDATE\", \"DELETE\"],
    \"filter\": \"bucket_id=eq.portfolio\",
    \"table\": \"objects\",
    \"schema\": \"storage\"
  }" \
  --silent --show-error --fail

echo "✅ Webhook created successfully!"

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Edge Function URL: ${WEBHOOK_URL}"
echo ""
echo "The system will now automatically:"
echo "  • Detect file uploads/deletions in portfolio storage"
echo "  • Update portfolio.before_images and portfolio.after_images arrays"
echo "  • Handle proper file path structure: {uuid}/before_images/ and {uuid}/after_images/"
echo ""
echo "Test the function by uploading an image to:"
echo "  portfolio/{your-portfolio-uuid}/before_images/test.jpg"
echo ""
echo "Monitor function logs with:"
echo "  supabase functions logs portfolio-image-sync" 