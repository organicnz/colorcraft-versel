# Deployment Logs Guide for ColorCraft

This guide explains how to access, understand, and troubleshoot deployment logs for the ColorCraft application deployed on Vercel.

## Quick Commands

### Retrieve Logs

```bash
# Get build logs
npm run logs:build

# Get runtime logs
npm run logs:runtime

# Generate activity to create runtime logs
npm run logs:trigger
```

### Monitor Logs

```bash
# Continuous monitoring
npm run logs:monitor

# Background monitoring
npm run logs:monitor:background

# Analyze existing logs
npm run logs:analyze
```

## Understanding Vercel Deployments

Vercel provides two main types of logs:

1. **Build Logs**: Show what happened during the deployment build process.
2. **Runtime Logs**: Show what happens when users interact with your deployed application.

The build logs are especially helpful for debugging issues related to the deployment process, while runtime logs are essential for monitoring the application's behavior and identifying issues in production.

## Log Retrieval Tools

We've created several tools to make log retrieval and analysis easier:

### 1. `fetch-deployment-logs.js`

This script fetches either build or runtime logs and saves them to the `logs/` directory. It provides summaries to help quickly identify issues.

```bash
node scripts/fetch-deployment-logs.js build [deployment-url]
node scripts/fetch-deployment-logs.js runtime [deployment-url]
```

### 2. `trigger-deployment-activity.js`

This script generates traffic to your deployment to help create runtime logs when there isn't natural traffic.

```bash
node scripts/trigger-deployment-activity.js [deployment-url] [count] [interval]
```

### 3. `analyze-vercel-logs.js`

This script analyzes log files for common error patterns and provides suggestions for fixes.

```bash
node scripts/analyze-vercel-logs.js [log-file-path]
```

### 4. `vercel_log_checker.sh`

This script continuously monitors logs for errors and sends notifications when critical issues are detected.

```bash
bash scripts/vercel_log_checker.sh [interval_in_seconds]
```

## Common Issues and Solutions

### No Runtime Logs Appearing

If you're not seeing runtime logs:

1. Use the `trigger-deployment-activity.js` script to generate traffic
2. Check if your deployment is actually receiving traffic
3. Verify that your application is correctly deployed

### Build Failures

If your build is failing:

1. Check for missing dependencies or outdated packages
2. Verify that all required environment variables are set
3. Look for TypeScript or other compilation errors
4. Ensure Node.js version compatibility

### Runtime Errors

Common runtime issues:

1. **Database Connectivity**: Check for connection strings and credentials
2. **API Issues**: Look for rate limiting, timeouts, or connection errors
3. **Authentication Problems**: Verify auth configuration is correct
4. **Environment Variables**: Ensure all required variables are set

## Recommended Workflow

When troubleshooting deployment issues:

1. Check build logs first to ensure the application deployed correctly
2. Generate some traffic using the trigger script
3. Check runtime logs for any errors
4. Analyze logs using the analysis script
5. Fix identified issues and redeploy
6. Set up monitoring for ongoing observation

## Log File Structure

Log files are saved in the `logs/` directory with timestamps in the filename:

- Build logs: `vercel-build-logs-[timestamp].txt`
- Runtime logs: `vercel-runtime-logs-[timestamp].txt`

## Advanced Usage

### Automating Log Checks

You can set up automated log checking using cron jobs:

```bash
# Set up a cron job for log checking
npm run logs:setup-cron
```

### Analyzing JSON Logs

For more detailed analysis, you can retrieve logs in JSON format:

```bash
npm run logs:json > logs/detailed-logs.json
```

## Conclusion

Proper log monitoring is essential for maintaining a healthy production application. The tools provided in this repository make it easier to access, analyze, and respond to issues identified in logs.

For more information on Vercel deployments, refer to the [official Vercel documentation](https://vercel.com/docs). 