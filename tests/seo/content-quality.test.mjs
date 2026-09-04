import { sanitizeClaims, normalizePrompt } from '../../lib/prompts/normalizePrompt.js';
import { computeJaccardSimilarity, tokenizeText } from '../../lib/content/duplicateDetection.js';

console.log('Running SEO & Content Quality Verification Suite...\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

// 1. Claims Filter Tests
const claimSample = 'This battle-tested prompt is 100% accurate and provides zero-hallucination code with guaranteed ranking.';
const sanitized = sanitizeClaims(claimSample);
assert(!sanitized.includes('battle-tested'), 'Removes "battle-tested" claim');
assert(!sanitized.includes('100% accurate'), 'Removes "100% accurate" claim');
assert(!sanitized.includes('zero-hallucination'), 'Removes "zero-hallucination" claim');
assert(!sanitized.includes('guaranteed ranking'), 'Removes "guaranteed ranking" claim');

// 2. Normalization Field Resolution
const rawPrompt = {
  id: 'test-123',
  slug: 'postgres-tuning',
  title: 'PostgreSQL High-Volume Query Optimization & Index Planner',
  prompt: 'SELECT * FROM test_table;',
  task_slug: 'database',
};
const normalized = normalizePrompt(rawPrompt);
assert(normalized.content === 'SELECT * FROM test_table;', 'Resolves legacy "prompt" field into content');
assert(normalized.seoTitle.includes('PostgreSQL'), 'Generates search-intent SEO title');
assert(!normalized.seoTitle.includes('& Architecture Optimizer'), 'Cleans title clutter');

// 3. Duplicate Detection Similarity Test
const tokensA = tokenizeText('PostgreSQL Query Optimization and Performance Tuning Prompt');
const tokensB = tokenizeText('PostgreSQL Query Optimization and Index Performance Tuning');
const sim = computeJaccardSimilarity(tokensA, tokensB);
assert(sim >= 0.70, `Calculates realistic Jaccard similarity (${(sim * 100).toFixed(1)}%)`);

console.log(`\nResults: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) process.exit(1);
