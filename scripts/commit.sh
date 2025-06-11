#!/usr/bin/env node

/**
 * Auto-commit script for CareEcho project
 * This script follows the commit rules defined in .cursor/rules/commit_rules.mdc
 * Usage: node auto-commit.js "Commit message" "Type of change"
 * Example: node auto-commit.js "add dark mode toggle" "Feat"
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

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
  console.log('\n🚀 CareEcho Commit Helper 🚀');
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
  } else if (files.some(file => file.includes('/utils/'))) {
    component = "utils";
  } else if (files.some(file => file.includes('/api/'))) {
    component = "api";
  } else if (files.some(file => file.includes('/pages/'))) {
    component = "page";
  } else if (files.some(file => file.includes('/styles/'))) {
    component = "styles";
  } else if (files.some(file => file.includes('/ui/'))) {
    component = "ui";
  } else if (files.some(file => file.includes('/tests/'))) {
    component = "test";
  } else if (files.some(file => file.includes('/public/'))) {
    component = "assets";
  } else if (files.some(file => file.includes('package.json'))) {
    component = "deps";
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
  console.log('  Example: "Feat(player): add audio speed control"');
  console.log('- Fix: Bug fix');
  console.log('  Example: "Fix(api): resolve authentication token expiration issue"');
  console.log('- Docs: Documentation changes');
  console.log('  Example: "Docs(readme): update installation instructions"');
  console.log('- Refactor: Code changes that neither fix bugs nor add features');
  console.log('  Example: "Refactor(utils): simplify date formatting functions"');
  console.log('- Style: Changes related to styling, formatting, or UI');
  console.log('  Example: "Style(tailwind): update button hover states"');
  console.log('- Test: Adding or updating tests');
  console.log('  Example: "Test(unit): add tests for user authentication"');
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