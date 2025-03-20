#!/bin/bash
set -e

# Print versions and environment information
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Build the project
echo "Building the project with npm..."
npm run build

echo "Build completed successfully!" 