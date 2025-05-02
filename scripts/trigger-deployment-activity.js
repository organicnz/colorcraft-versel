#!/usr/bin/env node

/**
 * Trigger Deployment Activity
 * 
 * This script triggers various HTTP requests to a Vercel deployment to generate runtime logs.
 * It helps when debugging or monitoring a deployment by creating real traffic.
 * 
 * Usage: node scripts/trigger-deployment-activity.js [deployment-url] [count] [interval]
 */

const https = require('https');
const http = require('http');
const { spawn } = require('child_process');

// Default values
const DEFAULT_DEPLOYMENT = 'colorcraft-ggopd9i0q-tarlan-isaevs-projects.vercel.app';
const DEFAULT_COUNT = 5;
const DEFAULT_INTERVAL = 2000; // ms

// Parse command line arguments
const args = process.argv.slice(2);
const deploymentUrl = args[0] || DEFAULT_DEPLOYMENT;
const requestCount = parseInt(args[1], 10) || DEFAULT_COUNT;
const interval = parseInt(args[2], 10) || DEFAULT_INTERVAL;

// Paths to request (add more as needed)
const paths = [
  '/',
  '/api/check-env',
  '/api/features',
  '/contact',
  '/auth/signin',
  '/about',
  '/debug',
  '/api/test-supabase'
];

/**
 * Send an HTTP request and log the response
 */
function sendRequest(url) {
  return new Promise((resolve, reject) => {
    console.log(`Sending request to: ${url}`);
    
    const client = url.startsWith('https') ? https : http;
    const requestOptions = new URL(url);
    
    const req = client.get(url, (res) => {
      const { statusCode } = res;
      
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        console.log(`Response from ${url}: Status ${statusCode}`);
        resolve({
          url,
          statusCode,
          responseSize: rawData.length
        });
      });
    });
    
    req.on('error', (error) => {
      console.error(`Error requesting ${url}: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

/**
 * Run a Vercel logs command to view logs in real-time
 */
function watchLogs() {
  console.log(`Starting log watcher for ${deploymentUrl}...`);
  
  const logProcess = spawn('vercel', ['logs', deploymentUrl], {
    stdio: 'inherit'
  });
  
  logProcess.on('error', (error) => {
    console.error(`Failed to start log watcher: ${error.message}`);
  });
  
  return logProcess;
}

/**
 * Main function to execute requests and watch logs
 */
async function main() {
  console.log(`\n=== Triggering activity on ${deploymentUrl} ===`);
  console.log(`Will send ${requestCount} rounds of requests with ${interval}ms intervals`);
  
  // Watch logs in a separate process
  const logProcess = watchLogs();
  
  try {
    // Make multiple rounds of requests
    for (let round = 1; round <= requestCount; round++) {
      console.log(`\n--- Round ${round}/${requestCount} ---`);
      
      // Send requests to different paths
      const requests = paths.map(path => {
        const url = `https://${deploymentUrl}${path}`;
        return sendRequest(url);
      });
      
      // Wait for all requests in this round to complete
      await Promise.allSettled(requests);
      
      // Wait for interval before next round
      if (round < requestCount) {
        console.log(`Waiting ${interval}ms before next round...`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    console.log('\nAll requests completed. Waiting for logs...');
    console.log('Press Ctrl+C to exit');
    
    // Keep the script running to see logs
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('Error during execution:', error);
  } finally {
    // Kill the log process when done
    if (logProcess) {
      logProcess.kill();
    }
  }
}

// Run the main function
main(); 