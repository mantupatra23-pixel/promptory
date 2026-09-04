import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { normalizePrompt } from '../lib/prompts/normalizePrompt.js';
import { analyzeDuplicateCorpus } from '../lib/content/duplicateDetection.js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
);

const UNSUPPORTED_CLAIM_REGEX = /\b(100%\s*Quality\s*Audited|zero[- ]hallucination|100%\s*accurate|battle[- ]tested|guaranteed ranking|guaranteed|eliminate hallucinations)\b/i;

async function runInventoryAudit() {
  console.log('Auditing Supabase prompt corpus...');

  const { data: rawPrompts, error } = await supabase
    .from('prompts')
    .select(`
      id, slug, title, description, prompt_template, prompt, content,
      quality_score, status, created_at, updated_at, tags, variables, use_cases, faqs,
      model:models(id, name, slug),
      profession:professions(id, name, slug),
      task:tasks(id, name, slug)
    `)
    .eq('status', 'published');

  if (error || !rawPrompts) {
    console.error('Failed to load prompts:', error);
    process.exit(1);
  }

  const normalized = rawPrompts.map(normalizePrompt);

  // Duplicate analysis
  const duplicateAudits = analyzeDuplicateCorpus(
    normalized.map((p) => ({ id: p.id, slug: p.slug, title: p.title, body: p.content }))
  );
  const duplicateMap = new Map(duplicateAudits.map((d) => [d.id, d]));

  let unsupportedClaimCount = 0;
  let thinPromptCount = 0;
  const inventoryReport = [];

  for (const p of normalized) {
    const dupInfo = duplicateMap.get(p.id);
    const hasUnsupportedClaim = (
      UNSUPPORTED_CLAIM_REGEX.test(p.title) ||
      UNSUPPORTED_CLAIM_REGEX.test(p.description) ||
      UNSUPPORTED_CLAIM_REGEX.test(p.content)
    );

    if (hasUnsupportedClaim) unsupportedClaimCount++;
    if (p.content.length < 250) thinPromptCount++;

    inventoryReport.push({
      id: p.id,
      slug: p.slug,
      title: p.title,
      seoTitle: p.seoTitle,
      task: p.task.slug,
      model: p.model.slug,
      profession: p.profession.slug,
      contentLength: p.content.length,
      qualityScore: p.qualityScore,
      contentQualityScore: p.contentQualityScore,
      duplicateStatus: dupInfo?.duplicateStatus || 'unique',
      similarityScore: dupInfo?.similarityScore || 0,
      matchedDuplicate: dupInfo?.matchedWith?.title || null,
      hasUnsupportedClaims: hasUnsupportedClaim,
    });
  }

  if (!fs.existsSync('reports')) fs.mkdirSync('reports', { recursive: true });

  fs.writeFileSync('reports/prompt-inventory.json', JSON.stringify(inventoryReport, null, 2));

  const duplicateCandidates = inventoryReport.filter((r) => r.duplicateStatus !== 'unique');
  const taskCounts = {};
  inventoryReport.forEach((r) => {
    taskCounts[r.task] = (taskCounts[r.task] || 0) + 1;
  });

  const markdownContent = `# Promptory Prompt Inventory & SEO Audit

- **Total Active Prompts**: ${inventoryReport.length}
- **Unique Prompts**: ${inventoryReport.length - duplicateCandidates.length}
- **Potential Duplicate Pairs**: ${duplicateCandidates.length}
- **Unsupported Marketing Claims Flagged**: ${unsupportedClaimCount}
- **Thin Prompts (< 250 characters)**: ${thinPromptCount}

## Task Distribution
${Object.entries(taskCounts)
  .map(([task, count]) => `- **${task}**: ${count} prompts`)
  .join('\n')}

## Duplicate Candidates (For Review - URLs Preserved)
${duplicateCandidates.length === 0 ? '_No duplicates detected._' : duplicateCandidates
  .slice(0, 20)
  .map((d) => `- [${d.similarityScore}%] **${d.title}** (matches: "${d.matchedDuplicate}")`)
  .join('\n')}
`;

  fs.writeFileSync('reports/prompt-inventory.md', markdownContent);
  console.log('Generated reports/prompt-inventory.json and reports/prompt-inventory.md');
}

runInventoryAudit();
