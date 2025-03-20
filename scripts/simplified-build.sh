#!/bin/bash
set -e

echo "Node version: $(node -v)"
echo "Running Next.js build..."

# Just run Next.js build directly
next build

echo "Build completed!" 