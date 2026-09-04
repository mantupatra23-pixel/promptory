import { sanitizeClaims, normalizePrompt, generateSeoTitle } from '../../lib/prompts/normalizePrompt.js';
import { computeJaccardSimilarity, tokenizeText } from '../../lib/content/duplicateDetection.js';

console.log('Running SEO Verification Suite...\n');
let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name}`);
    failed++;
  }
}

// 1. Claims Sanitizer Test
const claimText = '100% Quality Audited prompt with zero-hallucination code, battle-tested for guaranteed ranking.';
const clean = sanitizeClaims(claimText);
assert(!clean.includes('100% Quality Audited'), 'Replaces "100% Quality Audited"');
assert(!clean.includes('zero-hallucination'), 'Replaces "zero-hallucination"');
assert(!clean.includes('battle-tested'), 'Replaces "battle-tested"');
assert(!clean.includes('guaranteed ranking'), 'Replaces "guaranteed ranking"');

// 2. Search-Intent Title Normalization
const badTitle = 'PostgreSQL High-Volume Query Optimization & Index Planner';
const seoTitle = generateSeoTitle(badTitle, 'database');
assert(seoTitle.includes('PostgreSQL Query Optimization'), 'Normalizes cluttered internal titles');
assert(!seoTitle.includes('& Architecture Optimizer'), 'Strips repetitive suffix clutter');

// 3. Normalization Fallback Check
const raw = {
  id: 'test-1',
  slug: 'test-slug',
  title: 'Pytest & Playwright Performance Audit & Architecture Optimizer',
  prompt: 'def test_example(): pass',
  task_slug: 'testing',
};
const norm = normalizePrompt(raw);
assert(norm.content === 'def test_example(): pass', 'Safely resolves canonical prompt body');
assert(norm.task.slug === 'testing', 'Preserves task taxonomy slug');

// 4. Duplicate Tokenizer Test
const setA = tokenizeText('PostgreSQL Query Optimization Prompt for Developers');
const setB = tokenizeText('PostgreSQL Query Optimization and Index Tuning Prompt');
const sim = computeJaccardSimilarity(setA, setB);
assert(sim >= 0.50, `Calculates text similarity index (${(sim * 100).toFixed(1)}%)`);

console.log(`\nTests finished: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) process.exit(1);
