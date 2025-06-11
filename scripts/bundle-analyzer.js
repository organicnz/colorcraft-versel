sss#!/usr/bin/env node

/**
 * Advanced Bundle Analyzer
 * Provides detailed analysis of Next.js bundle composition and optimization opportunities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting Advanced Bundle Analysis...\n');

// Configuration
const BUILD_DIR = '.next';
const ANALYSIS_OUTPUT = 'bundle-analysis';

// Ensure analysis output directory exists
if (!fs.existsSync(ANALYSIS_OUTPUT)) {
  fs.mkdirSync(ANALYSIS_OUTPUT, { recursive: true });
}

/**
 * Analyze bundle composition
 */
function analyzeBundleComposition() {
  console.log('📊 Analyzing bundle composition...');
  
  const buildStatsPath = path.join(BUILD_DIR, 'bundle-stats.json');
  
  if (!fs.existsSync(buildStatsPath)) {
    console.log('⚠️  Bundle stats not found. Running build with analysis...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      return;
    }
  }

  // Analyze static file sizes
  const staticDir = path.join(BUILD_DIR, 'static');
  if (fs.existsSync(staticDir)) {
    analyzeStaticFiles(staticDir);
  }

  // Analyze page sizes
  analyzePageSizes();
}

/**
 * Analyze static files (JS, CSS, images)
 */
function analyzeStaticFiles(staticDir) {
  console.log('\n📁 Static Files Analysis:');
  
  const jsDir = path.join(staticDir, 'chunks');
  const cssDir = path.join(staticDir, 'css');
  const mediaDir = path.join(staticDir, 'media');

  // Analyze JavaScript chunks
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(jsDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024),
        };
      })
      .sort((a, b) => b.size - a.size);

    console.log('\n🟨 JavaScript Chunks (Top 10):');
    jsFiles.slice(0, 10).forEach((file, index) => {
      const indicator = file.sizeKB > 100 ? '🔴' : file.sizeKB > 50 ? '🟡' : '🟢';
      console.log(`${index + 1}. ${indicator} ${file.name} - ${file.sizeKB}KB`);
    });

    const totalJSSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`\nTotal JS Size: ${Math.round(totalJSSize / 1024)}KB`);
  }

  // Analyze CSS files
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir)
      .filter(file => file.endsWith('.css'))
      .map(file => {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024),
        };
      })
      .sort((a, b) => b.size - a.size);

    console.log('\n🟦 CSS Files:');
    cssFiles.forEach((file, index) => {
      const indicator = file.sizeKB > 50 ? '🔴' : file.sizeKB > 20 ? '🟡' : '🟢';
      console.log(`${index + 1}. ${indicator} ${file.name} - ${file.sizeKB}KB`);
    });

    const totalCSSSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`\nTotal CSS Size: ${Math.round(totalCSSSize / 1024)}KB`);
  }
}

/**
 * Analyze page sizes and routing
 */
function analyzePageSizes() {
  console.log('\n📄 Page Analysis:');
  
  const serverDir = path.join(BUILD_DIR, 'server', 'pages');
  if (!fs.existsSync(serverDir)) {
    console.log('⚠️  Server pages directory not found');
    return;
  }

  const pages = [];
  
  function scanDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        scanDirectory(itemPath, `${basePath}/${item}`);
      } else if (item.endsWith('.js') || item.endsWith('.html')) {
        pages.push({
          route: `${basePath}/${item}`.replace(/\.(js|html)$/, ''),
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024),
        });
      }
    });
  }

  scanDirectory(serverDir);
  
  pages.sort((a, b) => b.size - a.size);
  
  console.log('\n📊 Page Sizes (Top 10):');
  pages.slice(0, 10).forEach((page, index) => {
    const indicator = page.sizeKB > 100 ? '🔴' : page.sizeKB > 50 ? '🟡' : '🟢';
    console.log(`${index + 1}. ${indicator} ${page.route} - ${page.sizeKB}KB`);
  });
}

/**
 * Analyze dependencies and suggest optimizations
 */
function analyzeDependencies() {
  console.log('\n📦 Dependency Analysis:');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json not found');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Heavy dependencies to watch out for
  const heavyDeps = [
    'lodash', 'moment', 'rxjs', 'core-js', 'babel-polyfill', 
    'react-dom', '@mui/material', 'antd', 'semantic-ui-react'
  ];

  const foundHeavyDeps = Object.keys(dependencies).filter(dep => 
    heavyDeps.some(heavy => dep.includes(heavy))
  );

  if (foundHeavyDeps.length > 0) {
    console.log('\n⚠️  Heavy Dependencies Found:');
    foundHeavyDeps.forEach(dep => {
      console.log(`  • ${dep} - Consider lighter alternatives or tree-shaking`);
    });
  }

  // Suggest optimizations
  console.log('\n💡 Optimization Suggestions:');
  
  const suggestions = [
    {
      condition: dependencies['lodash'],
      message: 'Consider using lodash-es for better tree-shaking'
    },
    {
      condition: dependencies['moment'],
      message: 'Consider switching to date-fns or dayjs for smaller bundle size'
    },
    {
      condition: dependencies['react-dom'],
      message: 'Ensure you\'re using React 18+ for automatic batching optimizations'
    },
    {
      condition: Object.keys(dependencies).length > 50,
      message: 'Large number of dependencies detected. Consider bundle analysis and removal of unused packages'
    }
  ];

  suggestions.forEach(({ condition, message }) => {
    if (condition) {
      console.log(`  💡 ${message}`);
    }
  });
}

/**
 * Generate optimization report
 */
function generateReport() {
  console.log('\n📋 Generating Optimization Report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    bundleSize: 'Check bundle analysis above',
    recommendations: [
      'Enable gzip compression on your server',
      'Implement proper image optimization with next/image',
      'Consider code splitting for large components',
      'Use dynamic imports for heavy libraries',
      'Implement proper caching strategies',
      'Monitor Core Web Vitals regularly',
      'Consider using a CDN for static assets'
    ],
    nextSteps: [
      'Run npm run analyze for detailed bundle visualization',
      'Implement lazy loading for non-critical components',
      'Optimize images and convert to WebP format',
      'Review and remove unused dependencies',
      'Enable experimental features like React Server Components'
    ]
  };

  const reportPath = path.join(ANALYSIS_OUTPUT, 'optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`✅ Report saved to: ${reportPath}`);
}

/**
 * Check for Next.js specific optimizations
 */
function checkNextJSOptimizations() {
  console.log('\n⚡ Next.js Optimization Check:');
  
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    const optimizations = [
      {
        check: nextConfig.includes('experimental'),
        message: '✅ Experimental features configured'
      },
      {
        check: nextConfig.includes('images'),
        message: '✅ Image optimization configured'
      },
      {
        check: nextConfig.includes('swcMinify'),
        message: '✅ SWC minification enabled'
      },
      {
        check: nextConfig.includes('compiler'),
        message: '✅ Compiler optimizations configured'
      }
    ];

    optimizations.forEach(({ check, message }) => {
      console.log(check ? message : message.replace('✅', '⚠️  Missing:'));
    });
  } else {
    console.log('⚠️  next.config.js not found');
  }
}

/**
 * Main execution
 */
function main() {
  try {
    analyzeBundleComposition();
    analyzeDependencies();
    checkNextJSOptimizations();
    generateReport();
    
    console.log('\n🎉 Bundle analysis completed!');
    console.log('\n🚀 Quick Actions:');
    console.log('  • Run: npm run build:analyze for visual bundle analysis');
    console.log('  • Run: npm run lighthouse for performance audit');
    console.log('  • Check: bundle-analysis/ directory for detailed reports');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

// Run the analysis
main(); 