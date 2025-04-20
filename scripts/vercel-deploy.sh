#!/bin/bash

# Vercel Deployment Script
# This script provides a robust deployment workflow for Vercel
# with pre-flight checks and error handling

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print formatted messages
print_message() {
  echo -e "${2}$1${NC}"
}

print_section() {
  echo
  echo -e "${BLUE}====== $1 ======${NC}"
  echo
}

print_success() {
  print_message "✅ $1" "${GREEN}"
}

print_warning() {
  print_message "⚠️  $1" "${YELLOW}"
}

print_error() {
  print_message "❌ $1" "${RED}"
}

# Function to wait for user confirmation
confirm() {
  read -p "$(print_message "$1 (y/n): " "${YELLOW}")" -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_message "Operation cancelled by user" "${YELLOW}"
    exit 1
  fi
}

# Deploy environment (production or preview)
ENVIRONMENT=${1:-"preview"}
PRODUCTION=false
TEAM=${2:-""}
TEAM_ARG=""

if [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "prod" ]; then
  ENVIRONMENT="production"
  PRODUCTION=true
fi

if [ -n "$TEAM" ]; then
  TEAM_ARG="--scope $TEAM"
fi

print_section "Starting Vercel Deployment"
print_message "Environment: $ENVIRONMENT" "${BLUE}"
if [ -n "$TEAM" ]; then
  print_message "Team: $TEAM" "${BLUE}"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  print_error "Vercel CLI is not installed. Please install it with: npm install -g vercel"
  exit 1
fi

# Check if user is logged in to Vercel
print_section "Verifying Vercel Authentication"
if ! vercel whoami $TEAM_ARG &> /dev/null; then
  print_error "You are not logged in to Vercel"
  print_message "Please login using 'vercel login'" "${YELLOW}"
  exit 1
else
  USER=$(vercel whoami $TEAM_ARG)
  print_success "Authenticated as $USER"
fi

# Run pre-flight checks
print_section "Running Pre-flight Checks"

# Check for uncommitted changes
if [ -d ".git" ]; then
  if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes"
    confirm "Continue anyway?"
  else
    print_success "Git working directory is clean"
  fi
fi

# Verify environment variables
print_message "Verifying environment variables..." "${BLUE}"
if node scripts/verify-env.js; then
  print_success "Environment variables verified"
else
  print_error "Environment variable check failed"
  confirm "Continue anyway?"
fi

# Verify database connection
print_message "Verifying database connection..." "${BLUE}"
if node scripts/verify-db-connection.js; then
  print_success "Database connection verified"
else
  print_error "Database connection check failed"
  confirm "Continue anyway?"
fi

# Lint check
print_message "Running lint check..." "${BLUE}"
if npm run lint --silent; then
  print_success "Lint check passed"
else
  print_warning "Lint check found issues"
  confirm "Continue anyway?"
fi

# Verify existing project on Vercel
print_section "Checking Vercel Project"
if vercel project ls $TEAM_ARG | grep -q $(node -e "console.log(require('./package.json').name)"); then
  print_success "Project exists on Vercel"
else
  print_warning "Project may not exist on Vercel yet"
  confirm "Continue with deployment?"
fi

# Deployment confirmation
print_section "Deployment Confirmation"
if [ "$PRODUCTION" = true ]; then
  confirm "You are about to deploy to PRODUCTION. Are you sure?"
else
  confirm "Deploy to preview environment?"
fi

# Perform deployment
print_section "Deploying to Vercel"
print_message "Starting deployment process..." "${BLUE}"

DEPLOY_COMMAND="vercel $TEAM_ARG"
if [ "$PRODUCTION" = true ]; then
  DEPLOY_COMMAND="$DEPLOY_COMMAND --prod"
fi

echo $DEPLOY_COMMAND
if eval $DEPLOY_COMMAND; then
  print_success "Deployment completed successfully!"
  
  # Get the deployment URL
  if [ "$PRODUCTION" = true ]; then
    URL=$(vercel $TEAM_ARG ls --production --limit 1 | grep -v "Deployments for" | awk '{print $2}')
  else
    URL=$(vercel $TEAM_ARG ls --limit 1 | grep -v "Deployments for" | awk '{print $2}')
  fi
  
  if [ -n "$URL" ]; then
    print_message "Deployment URL: $URL" "${GREEN}"
  fi
  
  print_section "Verifying Deployment"
  print_message "Checking logs for errors..." "${BLUE}"
  vercel $TEAM_ARG logs $(vercel $TEAM_ARG ls --limit 1 | grep -v "Deployments for" | awk '{print $1}') | grep -i "error\|exception\|fail" || print_success "No errors found in logs"
else
  print_error "Deployment failed"
  exit 1
fi

print_section "Deployment Complete"
print_success "Deployment to $ENVIRONMENT environment was successful" 