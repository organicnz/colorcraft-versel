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

/**
 * @typedef {'Feat' | 'Fix' | 'Docs' | 'Refactor' | 'Style' | 'Test' | 'Chore'} CommitType
 */

// Valid commit types according to our rules
const VALID_TYPES = [
  'Feat',
  'Fix', 
  'Docs',
  'Refactor',
  'Style',
  'Test',
  'Chore'
];

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display the commit rules header
function displayRulesHeader() {
  console.log('\n🎨 ColorCraft Commit Helper 🎨');
  console.log('Following commit message format: Type(scope): description');
  console.log('Example: Feat(component): add dark mode toggle\n');
}

// Get unstaged and staged files to determine component/area
function getChangedFiles() {
  try {
    // Check for staged files first
    const stagedFiles = execSync('git diff --name-only --cached')
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean);
    
    // If there are staged files, return them
    if (stagedFiles.length > 0) {
      return stagedFiles;
    }
    
    // Otherwise check for unstaged files
    return execSync('git diff --name-only')
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch (error) {
    console.error('Error getting changed files:', error.message);
    return [];
  }
}

// Determine the component name from changed files
function determineComponent(files) {
  // Default component is "app"
  let component = "app";
  
  if (files.length === 0) {
    return component;
  }
  
  // Check patterns in files to determine component
  if (files.some(file => file.includes('/components/'))) {
    component = "component";
  } else if (files.some(file => file.includes('/utils/') || file.includes('/lib/'))) {
    component = "utils";
  } else if (files.some(file => file.includes('/api/'))) {
    component = "api";
  } else if (files.some(file => file.includes('/app/') && file.includes('/page.'))) {
    component = "page";
  } else if (files.some(file => file.includes('/styles/') || file.includes('tailwind') || file.includes('.css'))) {
    component = "styles";
  } else if (files.some(file => file.includes('/ui/'))) {
    component = "ui";
  } else if (files.some(file => file.includes('/tests/') || file.includes('.test.') || file.includes('.spec.'))) {
    component = "test";
  } else if (files.some(file => file.includes('/public/') || file.includes('/assets/'))) {
    component = "assets";
  } else if (files.some(file => file.includes('package.json') || file.includes('package-lock.json'))) {
    component = "deps";
  } else if (files.some(file => file.includes('tsconfig') || file.includes('next.config') || file.includes('.env'))) {
    component = "config";
  } else if (files.some(file => file.includes('/hooks/'))) {
    component = "hooks";
  } else if (files.some(file => file.includes('/types/'))) {
    component = "types";
  } else if (files.some(file => file.includes('/portfolio/'))) {
    component = "portfolio";
  } else if (files.some(file => file.includes('/auth/'))) {
    component = "auth";
  } else if (files.some(file => file.includes('/dashboard/') || file.includes('/crm/'))) {
    component = "dashboard";
  }
  
  return component;
}

// Generate a commit message following our rules
function generateCommitMessage(type, message, component) {
  // Ensure the first letter of the message is lowercase
  const formattedMessage = message.charAt(0).toLowerCase() + message.slice(1);
  
  // Remove period at the end if present
  const cleanMessage = formattedMessage.endsWith('.') 
    ? formattedMessage.slice(0, -1) 
    : formattedMessage;
    
  return `${type}(${component}): ${cleanMessage}`;
}

// Execute git commands
function executeGitCommands(commitMessage) {
  try {
    // Add all changes
    execSync('git add .');
    console.log('✅ Changes added to staging');
    
    // Commit with the formatted message
    execSync(`git commit -m "${commitMessage}"`);
    console.log('✅ Changes committed successfully');
    
    // Push changes
    execSync('git push --set-upstream origin --force');
    console.log('✅ Changes pushed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Error in git operations:', error.message);
    return false;
  }
}

// Show examples of commit types
function showCommitTypeExamples() {
  console.log('Commit Type Examples:');
  console.log('- Feat: New feature or functionality');
  console.log('  Example: "Feat(portfolio): add image gallery component"');
  console.log('- Fix: Bug fix');
  console.log('  Example: "Fix(auth): resolve authentication token expiration issue"');
  console.log('- Docs: Documentation changes');
  console.log('  Example: "Docs(readme): update installation instructions"');
  console.log('- Refactor: Code changes that neither fix bugs nor add features');
  console.log('  Example: "Refactor(utils): simplify color formatting functions"');
  console.log('- Style: Changes related to styling, formatting, or UI');
  console.log('  Example: "Style(tailwind): update button hover states"');
  console.log('- Test: Adding or updating tests');
  console.log('  Example: "Test(unit): add tests for portfolio service"');
  console.log('- Chore: Maintenance tasks, dependency updates, etc.');
  console.log('  Example: "Chore(deps): update dependencies to latest versions"');
  console.log('');
}

// Main function
function main() {
  displayRulesHeader();
  
  const args = process.argv.slice(2);
  const commitMessage = args[0];
  const commitType = args[1];
  
  // If commit message and type are provided as args, use them directly
  if (commitMessage && commitType && VALID_TYPES.includes(commitType)) {
    const files = getChangedFiles();
    const component = determineComponent(files);
    const formattedMessage = generateCommitMessage(commitType, commitMessage, component);
    
    console.log(`Generated commit message: "${formattedMessage}"`);
    executeGitCommands(formattedMessage);
    rl.close();
    return;
  }
  
  // Otherwise, prompt for input
  showCommitTypeExamples();
  
  rl.question('What changes did you make? ', (message) => {
    if (!message) {
      console.error('❌ Commit message is required');
      rl.close();
      return;
    }
    
    rl.question(`Select commit type (${VALID_TYPES.join('/')}): `, (type) => {
      if (!VALID_TYPES.includes(type)) {
        console.error(`❌ Invalid commit type. Please use one of: ${VALID_TYPES.join(', ')}`);
        rl.close();
        return;
      }
      
      const files = getChangedFiles();
      const component = determineComponent(files);
      const formattedMessage = generateCommitMessage(type, message, component);
      
      rl.question(`Commit with message: "${formattedMessage}"? (y/n) `, (confirm) => {
        if (confirm.toLowerCase() === 'y') {
          executeGitCommands(formattedMessage);
        } else {
          console.log('❌ Commit cancelled');
        }
        rl.close();
      });
    });
  });
}

// Run the script
main(); 