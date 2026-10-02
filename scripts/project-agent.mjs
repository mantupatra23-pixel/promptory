import fs from 'fs';
import path from 'path';

const autoFix = process.argv.includes('--fix');

console.log('\n====================================================');
console.log('       PROMPTORY AUTONOMOUS AUDIT & REPAIR AGENT    ');
console.log('====================================================\n');

let totalScore = 100;
const report = {
  seo: { score: 25, issues: [], fixes: [] },
  monetization: { score: 25, issues: [], fixes: [] },
  database: { score: 25, issues: [], fixes: [] },
  architecture: { score: 25, issues: [], fixes: [] },
};

// 1. Audit SEO & Crawler Rules
const robotsPath = path.join(process.cwd(), 'app/robots.ts');
const sitemapPath = path.join(process.cwd(), 'app/sitemap.ts');

if (!fs.existsSync(robotsPath)) {
  report.seo.score -= 10;
  report.seo.issues.push('Missing app/robots.ts (CRAWLER LOCKOUT)');
} else {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (!robotsContent.includes('sitemap.xml')) {
    report.seo.score -= 5;
    report.seo.issues.push('robots.ts does not link to sitemap.xml');
  }
  if (!robotsContent.includes('GPTBot') && !robotsContent.includes('PerplexityBot')) {
    report.seo.score -= 5;
    report.seo.issues.push('AI Search Engines (GEO bots) not whitelisted');
  }
}

if (!fs.existsSync(sitemapPath)) {
  report.seo.score -= 10;
  report.seo.issues.push('Missing app/sitemap.ts (NO SITEMAP)');
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (sitemapContent.includes('revalidate = 86400')) {
    report.seo.score -= 3;
    report.seo.issues.push('Sitemap cache is 24h (too slow for community prompts)');
    if (autoFix) {
      const fixed = sitemapContent.replace('revalidate = 86400', 'revalidate = 3600');
      fs.writeFileSync(sitemapPath, fixed);
      report.seo.fixes.push('Optimized sitemap revalidation to 1 hour (3600s)');
    }
  }
  if (!sitemapContent.includes('/pricing')) {
    report.seo.score -= 4;
    report.seo.issues.push('Sitemap missing high-value /pricing conversion URL');
  }
}

// 2. Audit Monetization & Webhooks
const webhookSingle = path.join(process.cwd(), 'app/api/webhook/lemonsqueezy/route.ts');
const webhookPlural = path.join(process.cwd(), 'app/api/webhooks/lemonsqueezy/route.ts');

if (!fs.existsSync(webhookSingle) && !fs.existsSync(webhookPlural)) {
  report.monetization.score -= 15;
  report.monetization.issues.push('Missing Lemon Squeezy payment webhook handler');
} else {
  const hookFile = fs.existsSync(webhookPlural) ? webhookPlural : webhookSingle;
  const hookContent = fs.readFileSync(hookFile, 'utf8');
  if (!hookContent.includes('subscription_payment_success')) {
    report.monetization.score -= 7;
    report.monetization.issues.push('Webhook ignores subscription_payment_success event');
  }
}

// 3. Audit Architecture & Submit Pages
const submitPage = path.join(process.cwd(), 'app/submit/page.tsx');
if (fs.existsSync(submitPage)) {
  const submitContent = fs.readFileSync(submitPage, 'utf8');
  if (!submitContent.includes('100')) {
    report.architecture.score -= 5;
    report.architecture.issues.push('Submit page lacks real-time Quality Scoring indicator');
  }
} else {
  report.architecture.score -= 10;
  report.architecture.issues.push('Missing app/submit/page.tsx');
}

// 4. Check Environment Variables
const envLocal = path.join(process.cwd(), '.env.local');
const envExample = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envLocal) && !fs.existsSync(path.join(process.cwd(), '.env'))) {
  report.database.score -= 8;
  report.database.issues.push('No .env or .env.local file found');
}

// Calculate Total Score & Rank
totalScore =
  report.seo.score +
  report.monetization.score +
  report.database.score +
  report.architecture.score;

let rank = 'C';
if (totalScore >= 95) rank = 'S (Production Master)';
else if (totalScore >= 85) rank = 'A (Launch Ready)';
else if (totalScore >= 70) rank = 'B (Functional - Needs SEO/Billing Polish)';

// Display Results
console.log(`OVERALL HEALTH SCORE: ${totalScore} / 100`);
console.log(`CURRENT PROJECT RANK: [ ${rank} ]\n`);

console.log('--- AUDIT BREAKDOWN ---');
console.log(`1. SEO & GEO Search Readiness:    ${report.seo.score}/25`);
console.log(`2. Monetization & Payment Flows:  ${report.monetization.score}/25`);
console.log(`3. Database & System Integrity:   ${report.database.score}/25`);
console.log(`4. Codebase Architecture & UI:    ${report.architecture.score}/25\n`);

let hasIssues = false;
Object.entries(report).forEach(([cat, data]) => {
  if (data.issues.length > 0) {
    hasIssues = true;
    console.log(`[!] ISSUES FOUND IN [${cat.toUpperCase()}]:`);
    data.issues.forEach((iss) => console.log(`    - ${iss}`));
  }
  if (data.fixes.length > 0) {
    console.log(`[✓] AUTO-FIXES APPLIED IN [${cat.toUpperCase()}]:`);
    data.fixes.forEach((fix) => console.log(`    + ${fix}`));
  }
});

if (!hasIssues) {
  console.log('✨ All systems verified! No critical faults detected across the project.');
} else if (!autoFix) {
  console.log('\nTip: Run "node scripts/project-agent.mjs --fix" to automatically patch detected issues.');
}
console.log('====================================================\n');
