#!/bin/bash

# Add cron job to check Vercel logs every hour
# This script creates a cron job that runs the vercel_log_checker.sh script

# Get the full path of the current directory
PROJECT_DIR=$(pwd)

# Create a temporary crontab file
TEMP_CRONTAB=$(mktemp)

# Export existing crontab
crontab -l > "$TEMP_CRONTAB" 2>/dev/null || echo "# New crontab" > "$TEMP_CRONTAB"

# Check if the job already exists
if grep -q "vercel_log_checker.sh" "$TEMP_CRONTAB"; then
  echo "Cron job for Vercel log checking already exists"
else
  # Add new cron job to run every hour
  echo "# Check Vercel logs every hour" >> "$TEMP_CRONTAB"
  echo "0 * * * * cd $PROJECT_DIR && ./vercel_log_checker.sh 3600 > vercel_log_cron.log 2>&1" >> "$TEMP_CRONTAB"
  
  # Install new crontab
  crontab "$TEMP_CRONTAB"
  echo "Cron job added to check Vercel logs every hour"
fi

# Clean up
rm "$TEMP_CRONTAB"

echo "Cron job setup complete"
echo "To manually run the log checker: ./vercel_log_checker.sh [interval_in_seconds] [deployment_url]" 