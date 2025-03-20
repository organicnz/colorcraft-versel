#!/bin/bash

# Vercel Log Monitor
# Script to check Vercel logs periodically
# Usage: ./vercel_log_checker.sh [interval_in_seconds] [deployment_url]

INTERVAL=${1:-300}  # Default to checking every 5 minutes
DEPLOYMENT_URL=${2:-"colorcraft-versel-tarlan-isaevs-projects.vercel.app"}
LOG_FILE="vercel_logs_$(date +%Y%m%d).txt"

echo "Starting Vercel log monitoring for $DEPLOYMENT_URL" 
echo "Logs will be saved to $LOG_FILE"
echo "Press Ctrl+C to stop monitoring"

while true; do
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
  echo "======== $TIMESTAMP ========" >> $LOG_FILE
  echo "Checking logs..." 
  
  # Run for just 10 seconds to get latest logs
  timeout 10 vercel logs $DEPLOYMENT_URL --follow >> $LOG_FILE 2>&1
  
  # Check for errors in the logs
  ERROR_COUNT=$(grep -i "error\|fail\|exception" $LOG_FILE | wc -l)
  if [ $ERROR_COUNT -gt 0 ]; then
    echo "WARNING: Found $ERROR_COUNT errors in the logs"
  fi
  
  echo "Next check in $INTERVAL seconds..."
  sleep $INTERVAL
done 