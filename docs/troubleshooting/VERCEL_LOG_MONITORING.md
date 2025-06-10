# Vercel Log Monitoring System

This document provides an overview of the log monitoring system for Vercel deployments in the ColorCraft project.

## Overview

The log monitoring system helps detect and notify you of issues in your Vercel deployments by:

1. Periodically checking Vercel logs for errors
2. Analyzing error patterns and suggesting fixes
3. Providing automated notifications for critical issues
4. Integrating with Git workflow to prevent problematic deployments

## Components

The system consists of several components:

### 1. Log Checker (`scripts/vercel_log_checker.sh`)

A Bash script that:
- Periodically checks Vercel logs (default: every 5 minutes)
- Detects common error patterns
- Records errors and generates summaries
- Sends notifications for critical issues

### 2. Log Analyzer (`scripts/analyze-vercel-logs.js`)

A Node.js script that:
- Performs in-depth analysis of log files
- Identifies error patterns and their severity
- Provides specific suggestions for fixing issues
- Generates comprehensive reports

### 3. Cron Job Setup (`scripts/cron_vercel_logs.sh`)

A script that sets up automated monitoring:
- Hourly log checking
- Weekly detailed analysis
- Monthly log cleanup to prevent disk space issues

### 4. Git Hooks Integration

Pre-commit hooks that:
- Check for recent deployment issues before commits
- Fix common linting errors automatically
- Prevent problematic code from being deployed

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run logs` | View Vercel logs |
| `npm run logs:latest` | View latest deployment logs |
| `npm run logs:analyze` | Run detailed log analysis |
| `npm run logs:monitor` | Start real-time log monitoring |
| `npm run logs:monitor:background` | Start monitoring in background |
| `npm run logs:setup-cron` | Set up automated monitoring with cron |
| `npm run lint:fix` | Fix common linting errors |
| `npm run setup:husky` | Set up Git hooks for log monitoring |

## Log Files

The following log files are generated:

- `logs/vercel_logs_YYYYMMDD.txt`: Raw Vercel logs
- `logs/vercel_errors_YYYYMMDD.txt`: Detected errors
- `logs/vercel_summary.txt`: Summary of recent monitoring
- `logs/vercel_analysis_weekly.log`: Weekly detailed analysis

## Error Detection

The system detects various error types, including:

- JavaScript errors (TypeError, ReferenceError, etc.)
- Connection issues (database, API)
- Resource limitations (memory, timeouts)
- Environment variable problems
- Authentication failures
- HTTP errors (404, 500, etc.)

## Setup Instructions

To set up the log monitoring system:

1. **Initial Setup:**
   ```bash
   npm run setup:husky
   npm run logs:setup-cron
   ```

2. **Manual Monitoring:**
   ```bash
   npm run logs:monitor
   ```

3. **Analyze Current Logs:**
   ```bash
   npm run logs:analyze
   ```

## Integration with CI/CD

For CI/CD integration:

1. Add periodic log checks to your CI pipeline
2. Configure notifications for critical errors
3. Add post-deployment verification steps

## Best Practices

1. Check logs after each deployment
2. Review weekly analysis reports
3. Address critical issues immediately
4. Add new error patterns as they're discovered
5. Periodically review monitoring settings

## Troubleshooting

If you encounter issues with the monitoring system:

1. Verify Vercel CLI is installed and authenticated
2. Check log file permissions
3. Ensure scripts are executable
4. Review cron job configuration
5. Check for notification configuration errors

For detailed information on Vercel logs and commands, see `nextjs-supabase-resend.mdc`. 