#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

function checkDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

function fixRouteConflicts() {
  console.log('Fixing route conflicts...');
  
  // Check if directories exist, create if not
  const portfolioDashDir = path.join(process.cwd(), 'src/app/(dashboard)/portfolio-dash');
  const servicesDashDir = path.join(process.cwd(), 'src/app/(dashboard)/services-dash');
  
  checkDirectory(portfolioDashDir);
  checkDirectory(servicesDashDir);
  checkDirectory(path.join(portfolioDashDir, '_components'));
  checkDirectory(path.join(servicesDashDir, '_components'));
  checkDirectory(path.join(portfolioDashDir, 'new'));
  checkDirectory(path.join(servicesDashDir, 'new'));
  checkDirectory(path.join(portfolioDashDir, '[id]', 'edit'));
  checkDirectory(path.join(servicesDashDir, '[id]', 'edit'));
  
  // Create redirect files for old routes
  const portfolioRedirectContent = `import { redirect } from "next/navigation";

export default function PortfolioRedirect() {
  redirect("/dashboard/portfolio-dash");
}`;

  const servicesRedirectContent = `import { redirect } from "next/navigation";

export default function ServicesRedirect() {
  redirect("/dashboard/services-dash");
}`;

  const portfolioRedirectPath = path.join(process.cwd(), 'src/app/(dashboard)/portfolio/page.tsx');
  const servicesRedirectPath = path.join(process.cwd(), 'src/app/(dashboard)/services/page.tsx');
  
  // Write files
  fs.writeFileSync(portfolioRedirectPath, portfolioRedirectContent);
  fs.writeFileSync(servicesRedirectPath, servicesRedirectContent);
  
  console.log('Updated portfolio redirect at:', portfolioRedirectPath);
  console.log('Updated services redirect at:', servicesRedirectPath);
  
  console.log('Route conflicts fixed!');
}

try {
  fixRouteConflicts();
} catch (error) {
  console.error('Error fixing route conflicts:', error);
} 