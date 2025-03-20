const http = require('http');
const { execSync } = require('child_process');

// Create a simple HTTP server to receive webhooks
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        
        console.log('\n==== Vercel Deployment Event ====');
        console.log(`Project: ${payload.project?.name || 'Unknown'}`);
        console.log(`Deployment URL: ${payload.deployment?.url || 'Unknown'}`);
        console.log(`Status: ${payload.deployment?.state || 'Unknown'}`);
        console.log(`Type: ${payload.type || 'Unknown'}`);
        console.log('===============================\n');
        
        // If deployment is complete, fetch the logs
        if (payload.type === 'deployment.succeeded' || payload.type === 'deployment.failed') {
          console.log('Fetching deployment logs...');
          try {
            // Get logs for this specific deployment
            if (payload.deployment?.url) {
              execSync(`vercel logs ${payload.deployment.url}`, { stdio: 'inherit' });
            } else {
              // Fallback to latest deployment logs
              execSync('pnpm logs:latest', { stdio: 'inherit' });
            }
          } catch (error) {
            console.error('Failed to fetch logs:', error.message);
          }
        }
        
        res.statusCode = 200;
        res.end('Webhook received');
      } catch (error) {
        console.error('Error parsing webhook payload:', error);
        res.statusCode = 400;
        res.end('Invalid payload');
      }
    });
  } else {
    res.statusCode = 405;
    res.end('Method not allowed');
  }
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`Vercel webhook server listening on port ${PORT}`);
  console.log(`Set up your Vercel webhook at:`);
  console.log(`https://vercel.com/[your-username]/[your-project]/settings/webhooks`);
  console.log(`with URL: http://your-public-url:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Webhook server stopped');
    process.exit(0);
  });
}); 