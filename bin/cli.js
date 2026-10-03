#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log("\x1b[32m✔ Promptory CLI v1.0.0\x1b[0m");
console.log("Pulling deterministic system prompt blueprints into workspace...");

const cursorRules = `# Promptory Deterministic AI Rules
# Strict Contract & Zero Fluff Guidelines

- You are a Principal Engineer operating with fail-closed execution.
- If requirements or contracts are missing, halt immediately with: "PIPELINE_HALT: [Reason]".
- Adhere strictly to OWASP top 10 standards and RFC specifications.
`;

const dest = path.join(process.cwd(), '.cursorrules');
fs.writeFileSync(dest, cursorRules, 'utf-8');

console.log(`\x1b[32m✔ Successfully created .cursorrules at: ${dest}\x1b[0m`);
console.log("Explore 4-phase sequential pipelines at: https://www.promptory.xyz/workflows");
