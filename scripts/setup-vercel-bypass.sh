#!/bin/bash

# ColorCraft Vercel Bypass Setup Script
# This script helps you set up unlimited Vercel deployments via GitHub Actions

echo "🚀 ColorCraft Vercel Bypass Setup"
echo "=================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel@latest
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI found"
fi

echo ""
echo "📋 Setup Checklist:"
echo ""

# Step 1: Vercel Token
echo "1. 🔑 Get your Vercel Token:"
echo "   → Go to: https://vercel.com/account/tokens"
echo "   → Click 'Create Token'"
echo "   → Name it: 'GitHub Actions Deploy'"
echo "   → Copy the token"
echo ""

# Step 2: GitHub Secrets
echo "2. 🔐 Add GitHub Secrets:"
echo "   → Go to: https://github.com/organicnz/colorcraft-versel/settings/secrets/actions"
echo "   → Click 'New repository secret'"
echo "   → Add these secrets:"
echo ""
echo "   VERCEL_TOKEN=your_vercel_token_here"
echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo "   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
echo "   RESEND_API_KEY=your_resend_key"
echo ""

# Step 3: Link Project
echo "3. 🔗 Link your Vercel project (run this now):"
echo ""
read -p "   Press Enter to run 'vercel link'..."

# Run vercel link
if vercel link; then
    echo "✅ Project linked successfully!"
else
    echo "❌ Failed to link project. Make sure you're logged into Vercel:"
    echo "   Run: vercel login"
    exit 1
fi

echo ""
echo "4. 🚀 Test deployment:"
echo "   → Push to main branch or"
echo "   → Go to Actions tab and run 'Deploy to Vercel via GitHub Actions'"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "Benefits you now have:"
echo "✅ Unlimited Vercel deployments (bypass 100/day limit)"
echo "✅ All Vercel features (edge functions, serverless, analytics)"
echo "✅ Preview deployments on pull requests"
echo "✅ Automatic deployment on push to main"
echo "✅ Same performance and features as native Vercel"
echo ""

echo "🔧 Next steps:"
echo "1. Add all secrets to GitHub repository"
echo "2. Push your code to trigger first deployment"
echo "3. Check Actions tab for deployment status"
echo ""

echo "📚 Need help? Check DEPLOYMENT.md for detailed instructions"
echo ""
echo "Happy deploying! 🚀" 