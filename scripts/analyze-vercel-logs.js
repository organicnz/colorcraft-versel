#!/usr/bin/env node

/**
 * Vercel Log Analyzer
 * 
 * This script analyzes Vercel logs to detect common error patterns,
 * provide insights, and suggest fixes for detected issues.
 * 
 * Usage: node analyze-vercel-logs.js [log-file-path]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Error patterns to look for, with remediation suggestions
const ERROR_PATTERNS = [
  {
    pattern: /Cannot find module '([^']+)'/i,
    type: 'Missing Module',
    severity: 'high',
    suggestion: (match) => `Install the missing module: npm install ${match[1]}`
  },
  {
    pattern: /TypeError: ([^\s]+) is not a function/i,
    type: 'Type Error',
    severity: 'high',
    suggestion: (match) => `Check the usage of '${match[1]}'. It might be undefined or not callable.`
  },
  {
    pattern: /ReferenceError: ([^\s]+) is not defined/i, 
    type: 'Reference Error',
    severity: 'high',
    suggestion: (match) => `'${match[1]}' is being used but hasn't been defined or imported.`
  },
  {
    pattern: /ECONNREFUSED|connection refused/i,
    type: 'Connection Error',
    severity: 'critical',
    suggestion: () => `Database or external service connection failed. Check service availability and credentials.`
  },
  {
    pattern: /memory limit exceeded/i,
    type: 'Resource Limit',
    severity: 'critical',
    suggestion: () => `Application exceeded memory limits. Optimize memory usage or upgrade plan.`
  },
  {
    pattern: /timeout exceeded/i,
    type: 'Timeout',
    severity: 'high',
    suggestion: () => `Operation timed out. Check for long-running functions or external service delays.`
  },
  {
    pattern: /rate limit exceeded/i,
    type: 'Rate Limit',
    severity: 'medium',
    suggestion: () => `API rate limit exceeded. Implement request throttling or caching.`
  },
  {
    pattern: /database connection error/i,
    type: 'Database Error',
    severity: 'critical', 
    suggestion: () => `Database connection failed. Check connection string and credentials.`
  },
  {
    pattern: /NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY/i,
    type: 'Environment Variable',
    severity: 'critical',
    suggestion: () => `Missing Supabase environment variables. Check Vercel project settings and add missing variables.`
  },
  {
    pattern: /404 NOT_FOUND for path/i,
    type: 'Not Found',
    severity: 'medium',
    suggestion: (match) => `Resource not found. Check route configuration and file paths.`
  },
  {
    pattern: /INTERNAL_SERVER_ERROR/i,
    type: 'Server Error',
    severity: 'high',
    suggestion: () => `Internal server error. Check server logs for more details.`
  },
  {
    pattern: /Unexpected token/i,
    type: 'Syntax Error',
    severity: 'high',
    suggestion: () => `Syntax error in your code. Check for missing brackets, commas or other syntax issues.`
  },
  {
    pattern: /Invalid hook call/i,
    type: 'React Hook Error',
    severity: 'high',
    suggestion: () => `Invalid React hook usage. Hooks must be called at the top level of a function component.`
  }
];

// Configuration options
const MAX_LOGS_TO_PROCESS = 1000; // Number of log lines to process
const SEVERITY_LEVELS = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3
};

// Stats for reporting
const stats = {
  totalErrors: 0,
  errorsByType: {},
  errorsBySeverity: {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  },
  uniqueErrors: new Set()
};

/**
 * Analyze a log file for errors
 */
async function analyzeLogFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: Log file not found: ${filePath}`);
    return;
  }

  console.log(`Analyzing Vercel logs from: ${filePath}\n`);
  
  // Read the file line by line
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const errors = [];
  let lineCount = 0;
  
  for await (const line of rl) {
    lineCount++;
    if (lineCount > MAX_LOGS_TO_PROCESS) break;
    
    // Skip empty lines
    if (!line.trim()) continue;
    
    // Check each line against error patterns
    for (const errorDef of ERROR_PATTERNS) {
      const match = line.match(errorDef.pattern);
      if (match) {
        const error = {
          line: lineCount,
          text: line,
          type: errorDef.type,
          severity: errorDef.severity,
          suggestion: errorDef.suggestion(match)
        };
        
        errors.push(error);
        stats.totalErrors++;
        stats.errorsByType[errorDef.type] = (stats.errorsByType[errorDef.type] || 0) + 1;
        stats.errorsBySeverity[errorDef.severity]++;
        stats.uniqueErrors.add(line);
        break; // Stop after first match for this line
      }
    }
  }
  
  return errors;
}

/**
 * Get recent logs from Vercel
 */
function getRecentVercelLogs(outputPath) {
  try {
    console.log('Fetching recent Vercel logs...');
    const logsDir = path.dirname(outputPath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Use the vercel CLI to get logs
    const result = execSync('npx vercel logs --limit 100', { encoding: 'utf8' });
    fs.writeFileSync(outputPath, result);
    console.log(`Logs saved to: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Failed to fetch Vercel logs:', error.message);
    return false;
  }
}

/**
 * Generates a report for the analyzed errors
 */
function generateReport(errors) {
  if (errors.length === 0) {
    console.log('No errors found in the logs.');
    return;
  }
  
  console.log(`== Vercel Log Analysis Report ==`);
  console.log(`Found ${stats.totalErrors} errors (${stats.uniqueErrors.size} unique)`);
  console.log('\nErrors by severity:');
  for (const severity of Object.keys(stats.errorsBySeverity)) {
    if (stats.errorsBySeverity[severity] > 0) {
      console.log(`- ${severity.toUpperCase()}: ${stats.errorsBySeverity[severity]}`);
    }
  }
  
  console.log('\nErrors by type:');
  for (const type of Object.keys(stats.errorsByType)) {
    console.log(`- ${type}: ${stats.errorsByType[type]}`);
  }
  
  console.log('\nTop issues to fix:');
  
  // Sort errors by severity (critical first)
  const sortedErrors = [...errors].sort((a, b) => 
    SEVERITY_LEVELS[b.severity] - SEVERITY_LEVELS[a.severity]
  );
  
  // Get unique errors by type (to avoid repetition)
  const uniqueErrorTypes = new Map();
  for (const error of sortedErrors) {
    if (!uniqueErrorTypes.has(error.type)) {
      uniqueErrorTypes.set(error.type, error);
    }
  }
  
  // Print top issues
  Array.from(uniqueErrorTypes.values())
    .slice(0, 5)
    .forEach((error, index) => {
      console.log(`\n${index + 1}. ${error.type.toUpperCase()} (${error.severity}):`);
      console.log(`   Example: ${error.text.substring(0, 100)}${error.text.length > 100 ? '...' : ''}`);
      console.log(`   Suggestion: ${error.suggestion}`);
    });
}

/**
 * Main function
 */
async function main() {
  // Get log file path from command line or use default
  let logFilePath = process.argv[2];
  
  // If no file specified, fetch recent logs
  if (!logFilePath) {
    const defaultLogPath = path.join('logs', `vercel_logs_${new Date().toISOString().split('T')[0]}.txt`);
    if (!getRecentVercelLogs(defaultLogPath)) {
      console.error('Could not fetch recent logs. Please specify a log file path.');
      process.exit(1);
    }
    logFilePath = defaultLogPath;
  }
  
  // Analyze the log file
  const errors = await analyzeLogFile(logFilePath);
  
  // Generate and display the report
  generateReport(errors);
  
  // Suggest next steps
  console.log('\n== Next Steps ==');
  if (stats.errorsBySeverity.critical > 0) {
    console.log('Critical issues found! Immediate attention required.');
  }
  
  if (stats.totalErrors > 0) {
    console.log('1. Fix the issues listed above starting with critical and high severity items');
    console.log('2. Deploy changes and monitor logs to verify fixes');
    console.log('3. Set up automated monitoring for continuous oversight');
  } else {
    console.log('No significant issues detected. Keep monitoring logs regularly.');
  }
}

// Run the main function
main().catch(error => {
  console.error('Error analyzing logs:', error);
  process.exit(1);
}); 