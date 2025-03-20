#!/bin/bash
set -e

# Print versions
echo "Node version: $(node -v)"

# Install dependencies with npm (which comes pre-installed on Vercel)
echo "Installing dependencies with npm..."
npm install

echo "Installation completed successfully!" 