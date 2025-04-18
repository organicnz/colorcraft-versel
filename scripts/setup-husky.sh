#!/bin/bash

# Script to set up Husky git hooks
# This will install and configure husky for the project

echo "Setting up Husky git hooks..."

# Install husky if not already installed
if [ ! -d "node_modules/husky" ]; then
  echo "Installing husky..."
  npm install -D husky
fi

# Initialize husky
npx husky install

# Make sure .husky directory exists
mkdir -p .husky

# Make sure our pre-commit script is executable
if [ -f ".husky/pre-commit" ]; then
  chmod +x .husky/pre-commit
  echo "Pre-commit hook is ready and executable"
else
  echo "Creating pre-commit hook..."
  npx husky add .husky/pre-commit "bash ./scripts/fix-linter-errors.sh && npm run lint && npm run type-check"
  echo 'echo "Checking for recent Vercel deployment issues..."' >> .husky/pre-commit
  echo 'if [ -f "logs/vercel_errors_$(date +%Y%m%d).txt" ]; then' >> .husky/pre-commit
  echo '  ERROR_COUNT=$(grep -c "ERRORS DETECTED" "logs/vercel_errors_$(date +%Y%m%d).txt")' >> .husky/pre-commit
  echo '  if [ "$ERROR_COUNT" -gt 0 ]; then' >> .husky/pre-commit
  echo '    echo "⚠️ Warning: Vercel deployment errors detected today!"' >> .husky/pre-commit
  echo '    echo "Please run '\''npm run logs:analyze'\'' to check deployment issues before pushing."' >> .husky/pre-commit
  echo '  fi' >> .husky/pre-commit
  echo 'fi' >> .husky/pre-commit
fi

# Add husky to package.json for prepare script if not already there
if ! grep -q "\"prepare\":" package.json; then
  # Use a temporary file to avoid messing up the JSON
  TEMP_FILE=$(mktemp)
  node -e "
    const pkg = require('./package.json');
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.prepare = 'husky';
    console.log(JSON.stringify(pkg, null, 2));
  " > "$TEMP_FILE"
  
  # Only copy if the JSON is valid
  if jq . "$TEMP_FILE" >/dev/null 2>&1; then
    cp "$TEMP_FILE" package.json
    echo "Added prepare script to package.json"
  else
    echo "Failed to update package.json - please add manually: \"prepare\": \"husky\""
  fi
  
  # Clean up
  rm "$TEMP_FILE"
fi

echo "Making script files executable..."
find ./scripts -name "*.sh" -exec chmod +x {} \;

echo "Husky setup complete!"
echo "Git hooks will now run before commits to ensure code quality" 