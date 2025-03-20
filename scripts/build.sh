#!/bin/bash
set -e

# Print environment information
echo "===================== ENVIRONMENT INFO ====================="
echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory structure:"
find . -type d -maxdepth 3 | sort

echo "===================== PACKAGE INFO ====================="
cat package.json

echo "===================== ENV VARIABLES ====================="
printenv | grep NEXT || true

echo "===================== STARTING BUILD ====================="
# Run Next.js build directly from node_modules
./node_modules/.bin/next build

echo "Build completed!" 