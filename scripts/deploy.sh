#!/bin/bash
set -e

echo "Starting deployment process..."

# Ensure we're on Node.js 18
if command -v nvm &> /dev/null; then
  echo "Using nvm to set Node.js version..."
  nvm use 18
else
  echo "nvm not found, checking Node.js version..."
  NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_VERSION" != "18" ]; then
    echo "Warning: Node.js version is not 18. Deployment might fail."
  fi
fi

# Build locally first to check for issues
echo "Building project locally to check for issues..."
npm run build

if [ $? -eq 0 ]; then
  echo "Local build successful! Proceeding with Vercel deployment..."
  
  # Run Vercel deployment
  echo "Deploying to Vercel..."
  vercel --prod
  
  if [ $? -eq 0 ]; then
    echo "Deployment successful!"
  else
    echo "Deployment failed. Please check the logs for more information."
    exit 1
  fi
else
  echo "Local build failed. Please fix the issues before deploying."
  exit 1
fi 