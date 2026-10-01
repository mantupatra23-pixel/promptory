#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const args = process.argv.slice(2);
const command = args[0];
const slug = args[1];

const BASE_URL = 'https://www.promptory.xyz';

function showHelp() {
  console.log(`
\x1b[36mPromptory CLI\x1b[0m — Production-grade AI engineering workflows

\x1b[33mUsage:\x1b[0m
  npx promptory add <slug> [--cursor] [--raw]

\x1b[33mOptions:\x1b[0m
  --cursor     Export directly to .cursorrules file
  --raw        Export to <slug>.md prompt file

\x1b[33mExamples:\x1b[0m
  npx promptory add fastapi-code-review --cursor
  npx promptory add founder-performance --raw
`);
}

if (!command || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (command !== 'add' || !slug) {
  console.error('\x1b[31mError:\x1b[0m Missing slug. Example: \x1b[32mnpx promptory add fastapi-code-review\x1b[0m');
  process.exit(1);
}

const isCursor = args.includes('--cursor');
const endpoint = `${BASE_URL}/api/export/${slug}`;

console.log(`\x1b[34m[Promptory]\x1b[0m Fetching \x1b[32m${slug}\x1b[0m from Promptory Engine...`);

https.get(endpoint, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);

      if (!parsed.success) {
        console.error(`\x1b[31m[Error]\x1b[0m ${parsed.error || 'Failed to fetch prompt'}`);
        process.exit(1);
      }

      if (isCursor) {
        const targetPath = path.join(process.cwd(), '.cursorrules');
        fs.writeFileSync(targetPath, parsed.cursorrules, 'utf8');
        console.log(`\x1b[32m✔ Successfully written to .cursorrules in current directory!\x1b[0m`);
      } else {
        const targetFile = `${slug}.md`;
        const targetPath = path.join(process.cwd(), targetFile);
        fs.writeFileSync(targetPath, parsed.rawPrompt, 'utf8');
        console.log(`\x1b[32m✔ Successfully saved to ${targetFile}!\x1b[0m`);
      }

    } catch (e) {
      console.error(`\x1b[31m[Error]\x1b[0m Failed to parse server response.`);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error(`\x1b[31m[Network Error]\x1b[0m ${err.message}`);
  process.exit(1);
});
