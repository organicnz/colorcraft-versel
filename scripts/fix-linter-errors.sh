#!/bin/bash

# Script to fix common linting issues like trailing whitespace
# Usage: ./scripts/fix-linter-errors.sh [file_pattern]

FILE_PATTERN=${1:-"**/*.{js,ts,tsx,jsx,sh,md}"}

echo "Fixing linter errors in files matching pattern: $FILE_PATTERN"

# Function to fix trailing whitespace issues
fix_trailing_whitespace() {
  local file="$1"
  local ext="${file##*.}"
  
  # Skip binary files and node_modules
  if [[ -z "$(file "$file" | grep text)" || "$file" =~ node_modules ]]; then
    return
  fi
  
  echo "Fixing trailing whitespace in $file"
  
  # Create a temporary file
  local tmp_file=$(mktemp)
  
  # Remove trailing whitespace and save to temporary file
  sed 's/[[:space:]]*$//' "$file" > "$tmp_file"
  
  # If there are differences, update the original file
  if ! cmp -s "$file" "$tmp_file"; then
    cp "$tmp_file" "$file"
    echo "  - Fixed trailing whitespace"
  else
    echo "  - No trailing whitespace found"
  fi
  
  # Clean up
  rm "$tmp_file"
}

# Function to run prettier on supported files
run_prettier() {
  local file="$1"
  local ext="${file##*.}"
  
  # Only run prettier on supported file types
  if [[ "$ext" =~ ^(js|ts|tsx|jsx|json|css|scss|html|md)$ ]]; then
    echo "Running prettier on $file"
    npx prettier --write "$file"
  fi
}

# Find files that match the pattern
find_files() {
  local pattern="$1"
  if command -v fd >/dev/null 2>&1; then
    # Use fd-find if available (faster)
    fd --type f --glob "$pattern" --exclude node_modules --exclude .git
  else
    # Fallback to find
    find . -type f -not -path "./node_modules/*" -not -path "./.git/*" -name "$pattern"
  fi
}

# Process each file
process_files() {
  local pattern="$1"
  local files=$(find_files "$pattern")
  
  if [ -z "$files" ]; then
    echo "No files found matching pattern: $pattern"
    return
  fi
  
  echo "Found $(echo "$files" | wc -l) files to process"
  
  for file in $files; do
    fix_trailing_whitespace "$file"
    run_prettier "$file"
  done
}

# Run ESLint fix if it's installed
run_eslint_fix() {
  if [ -f "node_modules/.bin/eslint" ]; then
    echo "Running ESLint auto-fix..."
    npx eslint --fix .
  else
    echo "ESLint not found, skipping auto-fix"
  fi
}

# Run the fix on the provided pattern
process_files "$FILE_PATTERN"

# Run ESLint fix
run_eslint_fix

echo "Done fixing linter errors"

# Also fix specifically mentioned files with trailing whitespace issues
for file in src/lib/supabase/server.ts src/middleware.ts src/lib/rate-limit.ts scripts/cron_vercel_logs.sh; do
  if [ -f "$file" ]; then
    echo "Fixing specifically mentioned file: $file"
    fix_trailing_whitespace "$file"
    run_prettier "$file"
  fi
done

echo "All linter fixes complete!" 