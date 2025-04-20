#!/bin/bash

# Enhanced build script for Vercel deployments
# This script ensures a clean build process with proper error handling
# and addresses common Vercel deployment issues

set -e # Exit on error

# Print Node.js and npm versions for debugging
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Check for node_modules
if [ ! -d "node_modules" ]; then
  echo "Warning: node_modules directory not found. Dependencies may not be installed correctly."
fi

# Verify environment variables
echo "Verifying environment variables..."
node scripts/verify-env.js || true

# Verify database connections (but don't fail build if it fails)
echo "Verifying database connections..."
node scripts/verify-db-connection.js || echo "Database verification failed, but continuing build..."

# Clean up previous build artifacts
echo "Cleaning up previous build..."
rm -rf .next || true
rm -rf .vercel/output || true

# Create logs directory if it doesn't exist
mkdir -p logs

# Ensure package installation is up to date
echo "Ensuring dependencies are up to date..."
if [ -f "yarn.lock" ]; then
  yarn install --frozen-lockfile --prefer-offline || echo "Continuing despite yarn install issues..."
elif [ -f "package-lock.json" ]; then
  npm ci || echo "Continuing despite npm ci issues..."
else
  npm install || echo "Continuing despite npm install issues..."
fi

# Set NODE_OPTIONS to increase memory limit if needed
export NODE_OPTIONS="--max-old-space-size=4096"

# Run the Next.js build with a fallback if it fails
echo "Starting Next.js build..."
next build || (echo "Retrying build with reduced features..." && NEXT_MINIMAL=1 next build)

echo "Build completed successfully!"
exit 0