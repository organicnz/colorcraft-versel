#!/usr/bin/env node

/**
 * Auto-commit script for ColorCraft project
 * This script follows the commit rules defined in the workspace rules
 * Usage: ./scripts/commit.sh "Commit message" "Type of change"
 * Example: ./scripts/commit.sh "add dark mode toggle" "Feat"
 */

// @ts-check

import { execSync } from 'child_process';
import readline from 'readline';

// --- Configuration ---
const COMMIT_TYPES = {
  Feat: 'A new feature or functionality',
  Fix: 'A bug fix',
  Docs: 'Documentation only changes',
  Style: 'Changes that do not affect the meaning of the code (white-space, formatting, etc)',
  Refactor: 'A code change that neither fixes a bug nor adds a feature',
  Perf: 'A code change that improves performance',
  Test: 'Adding missing tests or correcting existing tests',
  Build: 'Changes that affect the build system or external dependencies',
  CI: 'Changes to our CI configuration files and scripts',
  Chore: "Other changes that don't modify src or test files",
  Revert: 'Reverts a previous commit',
};

const SCOPES = [
  'app', 'components', 'hooks', 'lib', 'styles', 'types', 'db', 'api', 'config', 'scripts', 'docs', 'test', 'ci', 'release'
];

// --- Helper Functions ---
const exec = (command) => {
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch {
    console.error(`❌ Error executing command: ${command}`);
    process.exit(1);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// --- Main Logic ---
async function main() {
  console.log('🎨 Welcome to the ColorCraft Commit Helper!');

  // 1. Get Commit Info
  let [message, type] = process.argv.slice(2);

  if (!type) {
    console.log('Please select a commit type:');
    const typeKeys = Object.keys(COMMIT_TYPES);
    typeKeys.forEach((key, index) => {
      console.log(`  ${index + 1}. ${key}: ${COMMIT_TYPES[key]}`);
    });
    const typeIndex = await question('> Select a type (number): ');
    type = typeKeys[parseInt(typeIndex, 10) - 1];
    if (!type) {
      console.error('❌ Invalid selection. Aborting.');
      process.exit(1);
    }
  }

  if (!message) {
    message = await question('> Enter your commit description: ');
    if (!message.trim()) {
      console.error('❌ Commit message cannot be empty. Aborting.');
      process.exit(1);
    }
  }

  // 2. Determine Scope
  const filesChanged = execSync('git diff --cached --name-only').toString().trim().split('\n');
  const potentialScope = filesChanged.map(file => {
    if (file.startsWith('src/')) {
      const parts = file.split('/');
      if (SCOPES.includes(parts[1])) return parts[1];
    }
    const baseDir = file.split('/')[0];
    if (SCOPES.includes(baseDir)) return baseDir;
    return null;
  }).filter(Boolean);
  
  const scope = [...new Set(potentialScope)].join(',') || 'app';

  // 3. Format Commit Message
  const commitMessage = `${type.toLowerCase()}(${scope}): ${message.toLowerCase()}`;
  console.log(`\n📝 Generated Commit Message:\n   "${commitMessage}"\n`);

  // 4. Run Quality Checks & Commit
  console.log('\n⚙️ Running pre-commit checks...');
  exec('git add .');
  
  try {
    console.log('\nLinting and formatting code...');
    execSync('npx lint-staged', { stdio: 'inherit' });

    console.log('\nCommitting changes...');
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

    console.log('\n✅ Commit successful!');
  } catch {
    console.error('\n❌ Pre-commit checks failed. Please fix the issues and try again.');
    process.exit(1);
  }
  
  // 5. Push changes
  console.log('\n🚀 Pushing changes to remote...');
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  exec(`git push --set-upstream origin ${currentBranch}`);

  console.log('\n✨ All done! Your changes are on their way.');
  rl.close();
}

main().catch(err => {
  console.error('An unexpected error occurred:', err);
  process.exit(1);
}); 