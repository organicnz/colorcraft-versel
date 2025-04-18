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
  echo "0 * * * * cd $PROJECT_DIR && ./scripts/vercel_log_checker.sh 3600 > logs/vercel_log_cron.log 2>&1" >> "$TEMP_CRONTAB"

  # Also add a weekly job to run the more detailed analysis
  echo "# Run detailed log analysis once a week (Sunday at midnight)" >> "$TEMP_CRONTAB"
  echo "0 0 * * 0 cd $PROJECT_DIR && node scripts/analyze-vercel-logs.js > logs/vercel_analysis_weekly.log 2>&1" >> "$TEMP_CRONTAB"

  # And add a clean-up job to remove old log files (keep last 30 days)
  echo "# Clean up old log files (keep last 30 days)" >> "$TEMP_CRONTAB"
  echo "0 1 * * * find $PROJECT_DIR/logs -name \"vercel_logs_*.txt\" -type f -mtime +30 -delete" >> "$TEMP_CRONTAB"

  # Install new crontab
  crontab "$TEMP_CRONTAB"
  echo "Cron jobs added for:"
  echo "- Hourly log checking"
  echo "- Weekly detailed analysis"
  echo "- Monthly log cleanup"
fi

# Clean up
rm "$TEMP_CRONTAB"

echo "Cron job setup complete"
echo "To manually run the log checker: npm run logs:monitor"
echo "To manually run the log analyzer: npm run logs:analyze"

# Make sure the logs directory exists
mkdir -p logs

# Make sure the scripts are executable
chmod +x scripts/vercel_log_checker.sh
chmod +x scripts/analyze-vercel-logs.js

echo "Script permissions set"