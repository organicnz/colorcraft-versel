#!/bin/bash
set -e
echo "Purging sensitive data from Git history..."
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env.local .history -r" --prune-empty --tag-name-filter cat -- --all
git reflog expire --expire=now --all
git gc --prune=now --aggressive
echo "Git history has been rewritten to remove sensitive files"
echo "IMPORTANT: You must force push these changes with: git push --force --all"
echo "SECURITY ACTION REQUIRED: 1. Immediately rotate your Supabase service key"
