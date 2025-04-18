#!/bin/bash

# Vercel Log Monitor
# Script to check Vercel logs periodically and detect issues
# Usage: ./vercel_log_checker.sh [interval_in_seconds] [deployment_url] [notify_email]

INTERVAL=${1:-300}  # Default to checking every 5 minutes
DEPLOYMENT_URL=${2:-"colorcraft-versel-tarlan-isaevs-projects.vercel.app"}
NOTIFY_EMAIL=${3:-""}
LOG_DIR="logs"
LOG_FILE="$LOG_DIR/vercel_logs_$(date +%Y%m%d).txt"
ERROR_LOG="$LOG_DIR/vercel_errors_$(date +%Y%m%d).txt"
SUMMARY_FILE="$LOG_DIR/vercel_summary.txt"

# Create logs directory if it doesn't exist
mkdir -p $LOG_DIR

# Initialize or rotate logs if they're too large (>10MB)
if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE") -gt 10485760 ]; then
  mv "$LOG_FILE" "$LOG_FILE.$(date +%H%M%S).bak"
  touch "$LOG_FILE"
  echo "Log file rotated due to size"
fi

echo "====== Vercel Log Monitoring Started ======" >> $LOG_FILE
echo "Starting Vercel log monitoring for $DEPLOYMENT_URL" | tee -a $LOG_FILE
echo "Logs will be saved to $LOG_FILE" | tee -a $LOG_FILE
echo "Errors will be saved to $ERROR_LOG" | tee -a $LOG_FILE
echo "Press Ctrl+C to stop monitoring"

# Initialize counters for summary
TOTAL_CHECKS=0
TOTAL_ERRORS=0
CRITICAL_ERRORS=0

# Common error patterns to look for
ERROR_PATTERNS=(
  "TypeError"
  "ReferenceError"
  "SyntaxError"
  "RangeError"
  "URIError"
  "FATAL ERROR"
  "Unhandled rejection"
  "INTERNAL_SERVER_ERROR"
  "Cannot find module"
  "Database connection error"
  "Timeout exceeded"
  "Memory limit exceeded"
  "Rate limit exceeded"
  "AccessDenied"
  "Forbidden"
  "Unauthorized"
  "404 NOT_FOUND"
  "500 INTERNAL_SERVER_ERROR"
  "503 SERVICE_UNAVAILABLE"
  "ETIMEDOUT"
  "ECONNREFUSED"
  "ENOTFOUND"
)

# Critical error patterns that require immediate attention
CRITICAL_PATTERNS=(
  "FATAL ERROR"
  "Database connection error"
  "Memory limit exceeded"
  "503 SERVICE_UNAVAILABLE"
  "ECONNREFUSED"
)

# Function to send notification
send_notification() {
  local subject="$1"
  local body="$2"
  
  if [ -n "$NOTIFY_EMAIL" ]; then
    echo "$body" | mail -s "$subject" "$NOTIFY_EMAIL"
    echo "Notification sent to $NOTIFY_EMAIL"
  fi
  
  # Always log the notification
  echo "======== NOTIFICATION: $subject ========" >> $ERROR_LOG
  echo "$body" >> $ERROR_LOG
  echo "" >> $ERROR_LOG
}

# Function to check logs for errors
check_for_errors() {
  local log_content="$1"
  local error_count=0
  local critical_count=0
  local error_lines=""
  
  # Check for all error patterns
  for pattern in "${ERROR_PATTERNS[@]}"; do
    local matches=$(echo "$log_content" | grep -i "$pattern")
    if [ -n "$matches" ]; then
      error_count=$((error_count + $(echo "$matches" | wc -l)))
      error_lines+="$matches"$'\n'
      
      # Check if this is a critical error
      for critical in "${CRITICAL_PATTERNS[@]}"; do
        if [[ "$pattern" == "$critical" ]]; then
          critical_count=$((critical_count + $(echo "$matches" | grep -i "$critical" | wc -l)))
        fi
      done
    fi
  done
  
  if [ $error_count -gt 0 ]; then
    echo "======== ERRORS DETECTED: $error_count (Critical: $critical_count) ========" >> $ERROR_LOG
    echo "$error_lines" >> $ERROR_LOG
    echo "" >> $ERROR_LOG
    
    TOTAL_ERRORS=$((TOTAL_ERRORS + error_count))
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + critical_count))
    
    # Notify about critical errors immediately
    if [ $critical_count -gt 0 ]; then
      send_notification "CRITICAL: Vercel deployment issues detected" "Critical errors were found in your Vercel logs for $DEPLOYMENT_URL at $(date).\n\nError details:\n$error_lines\n\nPlease check $ERROR_LOG for more information."
    fi
  fi
  
  return $error_count
}

# Function to write summary
write_summary() {
  cat > $SUMMARY_FILE << EOF
======== VERCEL LOG MONITORING SUMMARY ========
Last updated: $(date)
Deployment: $DEPLOYMENT_URL
Total checks: $TOTAL_CHECKS
Total errors detected: $TOTAL_ERRORS
Critical errors: $CRITICAL_ERRORS
Check frequency: Every $INTERVAL seconds

Recent errors: $(tail -n 10 $ERROR_LOG 2>/dev/null || echo "None found")
EOF

  echo "Summary updated in $SUMMARY_FILE"
}

# Main monitoring loop
while true; do
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
  echo "======== $TIMESTAMP ========" >> $LOG_FILE
  echo "Checking logs..." | tee -a $LOG_FILE
  
  # Run vercel logs command and capture output
  LOG_OUTPUT=$(timeout 20 vercel logs $DEPLOYMENT_URL --limit=100 2>&1)
  echo "$LOG_OUTPUT" >> $LOG_FILE
  
  # Increment check counter
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
  
  # Check for errors in the log output
  check_for_errors "$LOG_OUTPUT"
  ERROR_COUNT=$?
  
  if [ $ERROR_COUNT -gt 0 ]; then
    echo "WARNING: Found $ERROR_COUNT errors in the logs (see $ERROR_LOG for details)" | tee -a $LOG_FILE
  else
    echo "No errors found in this check" | tee -a $LOG_FILE
  fi
  
  # Update summary every 10 checks
  if [ $((TOTAL_CHECKS % 10)) -eq 0 ]; then
    write_summary
  fi
  
  echo "Next check in $INTERVAL seconds..." | tee -a $LOG_FILE
  sleep $INTERVAL
done 