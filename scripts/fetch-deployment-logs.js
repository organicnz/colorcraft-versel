#!/usr/bin/env node

/**
 * Fetch Vercel Deployment Logs
 * 
 * This script fetches and displays logs from a Vercel deployment.
 * It handles both runtime logs and build logs, and formats them for easier reading.
 * 
 * Usage: 
 *   node scripts/fetch-deployment-logs.js runtime [deployment-url]
 *   node scripts/fetch-deployment-logs.js build [deployment-url]
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Default deployment URL from package.json
const DEFAULT_DEPLOYMENT = 'colorcraft-ggopd9i0q-tarlan-isaevs-projects.vercel.app';

// Parse command line arguments
const args = process.argv.slice(2);
const logType = args[0] || 'runtime'; // 'runtime' or 'build'
const deploymentUrl = args[1] || DEFAULT_DEPLOYMENT;

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logFile = path.join(logsDir, `vercel-${logType}-logs-${timestamp}.txt`);

/**
 * Execute a command and return the output
 */
function executeCommand(command, timeout = 20000) {
  try {
    console.log(`Executing: ${command}`);
    const output = execSync(command, { 
      encoding: 'utf8',
      timeout: timeout
    });
    return output;
  } catch (error) {
    console.error('Command execution failed:', error.message);
    if (error.stdout) console.log('Standard output:', error.stdout);
    if (error.stderr) console.error('Error output:', error.stderr);
    return error.stdout || null;
  }
}

/**
 * Execute a command with a timeout and callback for output
 */
function executeWithTimeout(command, timeoutMs, callback) {
  const parts = command.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1);
  
  console.log(`Executing with timeout (${timeoutMs}ms): ${command}`);
  
  const child = spawn(cmd, args);
  let output = '';
  
  child.stdout.on('data', (data) => {
    const chunk = data.toString();
    output += chunk;
    process.stdout.write(chunk);
  });
  
  child.stderr.on('data', (data) => {
    const chunk = data.toString();
    output += chunk;
    process.stderr.write(chunk);
  });
  
  const timer = setTimeout(() => {
    console.log('\nTimeout reached. Terminating command execution...');
    child.kill();
    if (output) {
      fs.writeFileSync(logFile, output);
      console.log(`Partial logs saved to: ${logFile}`);
    }
    callback(output);
  }, timeoutMs);
  
  child.on('close', (code) => {
    clearTimeout(timer);
    console.log(`Command exited with code ${code}`);
    if (output) {
      fs.writeFileSync(logFile, output);
      console.log(`Logs saved to: ${logFile}`);
    }
    callback(output);
  });
}

/**
 * Fetch and display runtime logs
 */
function fetchRuntimeLogs() {
  console.log(`Fetching runtime logs for ${deploymentUrl}...`);
  
  const timeoutMs = 10000; // 10 seconds timeout
  
  // Use spawn with a timeout for runtime logs
  executeWithTimeout(`vercel logs ${deploymentUrl}`, timeoutMs, (logs) => {
    if (logs && logs.length > 0) {
      console.log('\n========== RUNTIME LOGS SUMMARY ==========\n');
      console.log(`Retrieved ${logs.split('\n').length} lines of logs.`);
      
      // Check for error patterns
      const errorCount = (logs.match(/error|exception|failed/gi) || []).length;
      if (errorCount > 0) {
        console.log(`Found ${errorCount} potential error messages.`);
      } else {
        console.log('No obvious errors detected in logs.');
      }
    } else {
      console.log('No runtime logs received or command timed out.');
    }
    
    // Terminate the process after timeout callback
    if (logType === 'runtime') {
      process.exit(0);
    }
  });
}

/**
 * Fetch and display build logs
 */
function fetchBuildLogs() {
  console.log(`Fetching build logs for ${deploymentUrl}...`);
  
  try {
    // Use the vercel CLI to get build logs
    const logs = executeCommand(`vercel inspect --logs ${deploymentUrl}`, 30000);
    
    if (logs && logs.length > 0) {
      // Save logs to a file
      fs.writeFileSync(logFile, logs);
      console.log(`Build logs saved to: ${logFile}`);
      console.log('\n========== BUILD LOGS SUMMARY ==========\n');
      
      // Count lines and extract important information
      const lines = logs.split('\n');
      console.log(`Retrieved ${lines.length} lines of build logs.`);
      
      // Look for build errors
      const errorLines = lines.filter(line => 
        line.includes('error') || 
        line.includes('failed') || 
        line.includes('warning')
      );
      
      if (errorLines.length > 0) {
        console.log(`\nFound ${errorLines.length} warning/error lines in the build logs:`);
        errorLines.slice(0, 10).forEach(line => console.log(`- ${line}`));
        if (errorLines.length > 10) {
          console.log(`... and ${errorLines.length - 10} more.`);
        }
      } else {
        console.log('No obvious build errors detected.');
      }
      
      // Look for deployment status
      const deploymentLines = lines.filter(line => 
        line.includes('Deployment completed') || 
        line.includes('Ready')
      );
      if (deploymentLines.length > 0) {
        console.log('\nDeployment status:');
        deploymentLines.forEach(line => console.log(`- ${line}`));
      }
      
      return true;
    }
  } catch (error) {
    console.error('Failed to fetch build logs:', error.message);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  console.log(`Starting log fetcher for deployment: ${deploymentUrl}`);
  
  if (logType === 'runtime') {
    fetchRuntimeLogs();
  } else if (logType === 'build') {
    fetchBuildLogs();
  } else {
    console.error(`Unknown log type: ${logType}. Use 'runtime' or 'build'.`);
    process.exit(1);
  }
}

// Run the main function
main(); 