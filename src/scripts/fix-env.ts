import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const tempEnvPath = path.resolve(process.cwd(), '.env.local.tmp');

try {
  // Read the environment file
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Process lines
  const lines = envContent.split('\n');
  const processedLines: string[] = [];
  
  let currentLine = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // If line is empty or comment, add as is
    if (!line.trim() || line.trim().startsWith('#')) {
      if (currentLine) {
        processedLines.push(currentLine);
        currentLine = '';
      }
      processedLines.push(line);
      continue;
    }
    
    // If line contains = and doesn't end with a continuation character, it's a new key
    if (line.includes('=') && !currentLine) {
      currentLine = line;
    }
    // If there is no = but we have a current line, this is a continuation
    else if (!line.includes('=') && currentLine) {
      currentLine += line;
    }
    // If this line has = and we already have a current line, process the current line first
    else if (line.includes('=')) {
      if (currentLine) {
        processedLines.push(currentLine);
      }
      currentLine = line;
    }
  }
  
  // Add the last line if any
  if (currentLine) {
    processedLines.push(currentLine);
  }
  
  // Write the fixed content
  fs.writeFileSync(tempEnvPath, processedLines.join('\n'));
  
  // Backup original file
  fs.renameSync(envPath, `${envPath}.bak`);
  
  // Move new file into place
  fs.renameSync(tempEnvPath, envPath);
  
  console.log('Successfully fixed .env.local file:');
  console.log('Original file backed up to .env.local.bak');
  
  // Print the fixed keys (with sensitive info masked)
  const fixedContent = fs.readFileSync(envPath, 'utf8');
  const fixedLines = fixedContent.split('\n');
  
  for (const line of fixedLines) {
    if (line.includes('=')) {
      const [key, value] = line.split('=');
      console.log(`${key}=${value.substring(0, 10)}...`);
    } else {
      console.log(line);
    }
  }
} catch (error) {
  console.error('Error fixing environment file:', error);
} 