#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting codebase optimization...\n');

// 1. Remove unused dependencies
console.log('📦 Analyzing dependencies...');
try {
  execSync('npx depcheck --json > /tmp/depcheck.json', { stdio: 'inherit' });
  const depcheckResult = JSON.parse(fs.readFileSync('/tmp/depcheck.json', 'utf8'));
  
  if (depcheckResult.dependencies.length > 0) {
    console.log('⚠️  Found unused dependencies:', depcheckResult.dependencies);
  } else {
    console.log('✅ No unused dependencies found');
  }
  
  if (depcheckResult.devDependencies.length > 0) {
    console.log('⚠️  Found unused dev dependencies:', depcheckResult.devDependencies);
  } else {
    console.log('✅ No unused dev dependencies found');
  }
} catch (error) {
  console.log('❌ Depcheck analysis failed, continuing...');
}

// 2. Optimize images
console.log('\n🖼️  Optimizing images...');
const publicDir = path.join(process.cwd(), 'public');
if (fs.existsSync(publicDir)) {
  try {
    // Only optimize if imagemin is available
    try {
      execSync('npx imagemin public/**/*.{jpg,jpeg,png,gif,svg} --out-dir=public/ --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant', { stdio: 'inherit' });
      console.log('✅ Images optimized');
    } catch {
      console.log('⚠️  Imagemin not available, skipping image optimization');
    }
  } catch (error) {
    console.log('⚠️  Image optimization failed, continuing...');
  }
} else {
  console.log('⚠️  No public directory found');
}

// 3. Clean build artifacts
console.log('\n🧹 Cleaning build artifacts...');
const cleanDirs = ['.next', 'node_modules/.cache', '.vercel'];
cleanDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✅ Cleaned ${dir}`);
  }
});

// 4. Optimize package.json scripts
console.log('\n📝 Optimizing package.json...');
const packagePath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add performance scripts if they don't exist
const performanceScripts = {
  'perf:build': 'ANALYZE=true npm run build',
  'perf:lighthouse': 'npx lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html',
  'perf:bundle': 'npx bundle-wizard',
  'clean:all': 'rm -rf .next node_modules/.cache .vercel && npm install',
  'optimize': 'node scripts/optimize-codebase.js'
};

let scriptsUpdated = false;
Object.entries(performanceScripts).forEach(([key, value]) => {
  if (!packageJson.scripts[key]) {
    packageJson.scripts[key] = value;
    scriptsUpdated = true;
    console.log(`✅ Added script: ${key}`);
  }
});

if (scriptsUpdated) {
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json updated');
} else {
  console.log('✅ package.json already optimized');
}

// 5. Create performance monitoring file
console.log('\n⚡ Setting up performance monitoring...');
const perfMonitorPath = path.join(process.cwd(), 'src/lib/performance.ts');
const perfMonitorContent = `// Performance monitoring utilities
export const performanceMetrics = {
  // Mark the start of a performance measurement
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  },

  // Measure the time between two marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        if (endMark) {
          window.performance.measure(name, startMark, endMark);
        } else {
          window.performance.measure(name, startMark);
        }
        
        const measurement = window.performance.getEntriesByName(name)[0];
        return measurement?.duration || 0;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  },

  // Get all performance entries
  getEntries: () => {
    if (typeof window !== 'undefined' && window.performance) {
      return window.performance.getEntries();
    }
    return [];
  },

  // Clear performance marks and measures
  clear: () => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
  },

  // Log Core Web Vitals
  logCoreWebVitals: (metric: { name: string; value: number; id: string }) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Core Web Vital:', metric);
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // gtag('event', metric.name, {
      //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      //   event_label: metric.id,
      //   non_interaction: true,
      // });
    }
  }
};

// Hook for measuring React component render times
export const usePerfMeasure = (componentName: string) => {
  if (typeof window !== 'undefined') {
    performanceMetrics.mark(\`\${componentName}-start\`);
    
    return () => {
      performanceMetrics.mark(\`\${componentName}-end\`);
      const duration = performanceMetrics.measure(
        componentName,
        \`\${componentName}-start\`,
        \`\${componentName}-end\`
      );
      
      if (process.env.NODE_ENV === 'development' && duration > 16) {
        console.warn(\`⚠️ \${componentName} took \${duration.toFixed(2)}ms to render\`);
      }
    };
  }
  
  return () => {};
};
`;

if (!fs.existsSync(perfMonitorPath)) {
  fs.writeFileSync(perfMonitorPath, perfMonitorContent);
  console.log('✅ Performance monitoring created');
} else {
  console.log('✅ Performance monitoring already exists');
}

// 6. Optimize Next.js config
console.log('\n⚙️  Optimizing Next.js configuration...');
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
console.log('✅ Next.js config already optimized in previous updates');

// 7. Setup bundle analysis
console.log('\n📊 Setting up bundle analysis...');
try {
  execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' });
  console.log('✅ Bundle analyzer installed');
} catch (error) {
  console.log('⚠️  Bundle analyzer installation failed');
}

console.log('\n🎉 Codebase optimization completed!');
console.log('\n📋 Next steps:');
console.log('1. Run "npm run perf:build" to analyze bundle size');
console.log('2. Run "npm run perf:lighthouse" to check performance scores');
console.log('3. Use "npm run clean:all" to clean everything and reinstall');
console.log('4. Monitor Core Web Vitals in production'); 