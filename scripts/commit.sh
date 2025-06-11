#!/bin/bash

# Check if message and type are provided
if [ "$#" -eq 2 ]; then
    MESSAGE="$1"
    TYPE="$2"
elif [ "$#" -eq 1 ]; then
    MESSAGE="$1"
    TYPE="Chore"
else
    echo "Usage: ./scripts/commit.sh \"commit message\" \"Type\""
    echo "Available types: Feat, Fix, Docs, Refactor, Style, Test, Chore"
    exit 1
fi

# Format the commit message
FORMATTED_MESSAGE="${TYPE}(optimization): ${MESSAGE}"

echo "📝 Committing with message: ${FORMATTED_MESSAGE}"

# Add all changes
git add .

# Commit with the formatted message
git commit -m "${FORMATTED_MESSAGE}"

# Push to origin with force
git push --set-upstream origin --force

echo "✅ Changes committed and pushed successfully!" 