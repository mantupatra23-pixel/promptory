import { searchPrompts } from '../lib/searchEngine.js';

const MOCK_DATABASE = [
  { id: 1, title: 'Senior Python and FastAPI Code Review', description: 'Deep audit for concurrency bugs, async bottlenecks, and security flaws.', model: { slug: 'claude' }, profession: { slug: 'developer' }, quality_score: 98 },
  { id: 2, title: 'Cold Email Hook Generator', description: 'Craft a compelling subject and opening line for outreach.', model: { slug: 'claude' }, profession: { slug: 'digital-marketer' }, quality_score: 92 },
  { id: 3, title: 'SEO-Optimized Content Outline', description: 'Generate keyword-rich content outline for blog posts.', model: { slug: 'gemini' }, profession: { slug: 'seo-specialist' }, quality_score: 88 },
  { id: 4, title: 'High-Converting Cold Email Generator', description: 'Craft persuasive cold email for B2B outreach.', model: { slug: 'claude' }, profession: { slug: 'digital-marketer' }, quality_score: 94 },
  { id: 5, title: 'Real Estate High-Conversion Client Follow-Up', description: 'Generate a personalized follow-up message for real estate clients.', model: { slug: 'chatgpt' }, profession: { slug: 'real-estate-agent' }, quality_score: 95 },
  { id: 6, title: 'Code Review with Context', description: 'Detailed review of code with actionable feedback.', model: { slug: 'chatgpt' }, profession: { slug: 'developer' }, quality_score: 88 },
  { id: 7, title: 'Code Review with Contextual Feedback', description: 'Provide concise, actionable code review with context.', model: { slug: 'chatgpt' }, profession: { slug: 'developer' }, quality_score: 88 },
  { id: 8, title: 'SEO Content Outline Builder', description: 'Generate keyword-rich outline for blog posts.', model: { slug: 'gemini' }, profession: { slug: 'seo-specialist' }, quality_score: 88 },
  { id: 9, title: 'FastAPI High-Concurrency Database Optimizer', description: 'Audit async PostgreSQL queries and SQLAlchemy connection pooling in FastAPI.', model: { slug: 'chatgpt' }, profession: { slug: 'developer' }, quality_score: 96 }
];

const BENCHMARK_TESTS = [
  { query: 'I need a prompt to review Python FastAPI code', expectedId: 1 },
  { query: 'Python FastAPI code review', expectedId: 1 },
  { query: 'help me audit my fast api backend', expectedIds: [1, 9] },
  { query: 'seo blog outline', expectedIds: [3, 8] },
  { query: 'write cold email for SaaS', expectedIds: [2, 4] },
  { query: 'real estate follow up', expectedId: 5 },
  { query: 'pyhton fastapi reveiw', expectedIds: [1, 9] },
  { query: 'xyzabc123unknown', expectedEmpty: true }
];

console.log('\n--- EXECUTING SEARCH ENGINE v2.0 BENCHMARK TESTS ---\n');
let passed = 0;

BENCHMARK_TESTS.forEach((test, idx) => {
  const { results } = searchPrompts(MOCK_DATABASE, test.query);
  const topResult = results[0];

  if (test.expectedEmpty) {
    if (results.length === 0) {
      console.log(`✅ TEST ${idx + 1} PASSED: "${test.query}" -> Successfully returned empty state.`);
      passed++;
    } else {
      console.error(`❌ TEST ${idx + 1} FAILED: "${test.query}" expected empty but got ${results.length} results.`);
    }
  } else if (test.expectedId) {
    if (topResult && topResult.id === test.expectedId) {
      console.log(`✅ TEST ${idx + 1} PASSED: "${test.query}" -> Top Result: "${topResult.title}"`);
      passed++;
    } else {
      console.error(`❌ TEST ${idx + 1} FAILED: "${test.query}" -> Got: "${topResult?.title || 'None'}" (Expected ID ${test.expectedId})`);
    }
  } else if (test.expectedIds) {
    if (topResult && test.expectedIds.includes(topResult.id)) {
      console.log(`✅ TEST ${idx + 1} PASSED: "${test.query}" -> Top Result: "${topResult.title}"`);
      passed++;
    } else {
      console.error(`❌ TEST ${idx + 1} FAILED: "${test.query}" -> Got: "${topResult?.title || 'None'}"`);
    }
  }
});

console.log(`\nResults: ${passed}/${BENCHMARK_TESTS.length} tests passed.\n`);
