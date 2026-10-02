import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

// Agar local env nahi hai toh user manually update kar sakta hai
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'
);

const sampleWorkflows = [
  {
    title: 'Full-Stack Feature to GitHub PR Pipeline',
    slug: 'full-stack-feature-to-pr',
    description: 'Turn raw feature specs into architecture contracts, production TypeScript/Python code, security audits, and ready-to-merge PR documentation.',
    category: 'Engineering',
    target_role: 'Full-Stack Developer',
    estimated_time: '8 mins',
    is_pro: false,
    quality_score: 99,
    steps: [
      {
        step_number: 1,
        title: 'Architecture & Contract Blueprint',
        goal: 'Generate database schema, API contracts, and edge-case boundary matrix.',
        prompt: `Act as a Principal Software Architect. Given this feature request: {{feature_description}} and tech stack: {{tech_stack}}.\n\nGenerate:\n1. Strict Database Schema with foreign keys & indexes.\n2. REST/tRPC API Contracts with request/response schemas.\n3. Exhaustive Edge Cases list (rate limits, race conditions, null checks).\nDo not write full business logic yet. Output in markdown with clean syntax blocks.`
      },
      {
        step_number: 2,
        title: 'Production Implementation',
        goal: 'Transform the architecture contract into clean, fully typed production code.',
        prompt: `Act as a Senior Lead Engineer. Using the architecture blueprint from Step 1:\n{{step_1_output}}\n\nWrite production-ready, zero-placeholder code for both backend endpoints and frontend integration.\nEnsure:\n- Strict type safety\n- Explicit error handling with structured HTTP codes\n- Idempotency guards on mutations.`
      },
      {
        step_number: 3,
        title: 'Security & Race Condition Hardening',
        goal: 'Audit code against OWASP Top 10, memory leaks, and concurrency bugs.',
        prompt: `Act as a Senior Security Engineer. Perform a deep static vulnerability audit on the code written in Step 2:\n{{step_2_output}}\n\nHighlight vulnerabilities (SQLi, IDOR, memory leaks, token leakage) and rewrite the affected blocks with battle-tested security patches.`
      },
      {
        step_number: 4,
        title: 'Automated Tests & GitHub PR Description',
        goal: 'Generate complete unit/integration tests and a structured Pull Request.',
        prompt: `Act as a Staff QA & Release Manager. Using the hardened code:\n{{step_3_output}}\n\n1. Write unit tests with 100% path coverage for edge cases.\n2. Write a professional GitHub Pull Request description including Summary, Changes, Testing Checklist, and Security considerations.`
      }
    ]
  },
  {
    title: 'GEO & Search Intent Content Cluster Engine',
    slug: 'geo-search-intent-content-engine',
    description: 'Transform a single high-intent keyword into an AI-grounded, citation-ready technical guide with JSON-LD schema markup.',
    category: 'Marketing',
    target_role: 'SEO & Growth Engineer',
    estimated_time: '5 mins',
    is_pro: true,
    quality_score: 97,
    steps: [
      {
        step_number: 1,
        title: 'Intent Mapping & GEO Cluster Outline',
        goal: 'Extract user intent questions optimized for Perplexity, ChatGPT Search, and Google.',
        prompt: `Act as a Generative Engine Optimization (GEO) strategist. Target keyword: {{target_keyword}} for domain: {{domain_niche}}.\n\nGenerate:\n1. 10 direct semantic question clusters asked by buyers.\n2. Factual claim outline structured for AI answer engine citation.\n3. Content hierarchy H1, H2, H3 tags.`
      },
      {
        step_number: 2,
        title: 'Authoritative Technical Drafting',
        goal: 'Draft comprehensive, non-fluff copy with real code examples and actionable data.',
        prompt: `Act as a domain expert writer. Using outline from Step 1:\n{{step_1_output}}\n\nDraft the complete in-depth article. Tone: authoritative, direct, and zero generic marketing fluff. Include comparisons, data points, and clear actionable takeaways.`
      },
      {
        step_number: 3,
        title: 'Technical Schema & OpenGraph Meta Injector',
        goal: 'Generate valid FAQPage JSON-LD and viral social card metadata.',
        prompt: `Act as a Technical SEO Lead. Based on the article from Step 2:\n{{step_2_output}}\n\nGenerate:\n1. Valid <script type="application/ld+json"> FAQPage & Article schema.\n2. OpenGraph title, description, and high-CTR social share hooks for X and LinkedIn.`
      }
    ]
  },
  {
    title: 'Legacy Codebase Bug Buster & Memory Profiler',
    slug: 'codebase-bug-buster-profiler',
    description: 'Diagnose memory leaks, unhandled async promises, and CPU bottlenecks in legacy systems, followed by verified refactoring.',
    category: 'Engineering',
    target_role: 'DevOps & Performance Engineer',
    estimated_time: '6 mins',
    is_pro: true,
    quality_score: 98,
    steps: [
      {
        step_number: 1,
        title: 'Bottleneck & Memory Leak Audit',
        goal: 'Isolate uncollected listeners, closure leaks, and unbounded queues.',
        prompt: `Act as a Systems Performance Engineer. Analyze this code snippet / stack trace:\n{{buggy_code}}\n\nIdentify all root causes of memory leaks, thread starvation, unhandled rejections, or high CPU loops with exact line numbers and explanations.`
      },
      {
        step_number: 2,
        title: 'Zero-Regressions Refactor',
        goal: 'Rewrite the code with proper resource disposal and connection pooling.',
        prompt: `Rewrite the flawed code analyzed in Step 1:\n{{step_1_output}}\n\nApply idiomatic design patterns, connection pooling, and automatic garbage collection cleanup. Ensure backward compatibility with existing interfaces.`
      }
    ]
  }
];

console.log('Seeding workflows SQL ready...');
const sqlInsert = sampleWorkflows.map(w => {
  return `INSERT INTO workflows (title, slug, description, category, target_role, estimated_time, is_pro, quality_score, steps)
VALUES (
  ${JSON.stringify(w.title)},
  ${JSON.stringify(w.slug)},
  ${JSON.stringify(w.description)},
  ${JSON.stringify(w.category)},
  ${JSON.stringify(w.target_role)},
  ${JSON.stringify(w.estimated_time)},
  ${w.is_pro},
  ${w.quality_score},
  '${JSON.stringify(w.steps).replace(/'/g, "''")}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  steps = EXCLUDED.steps,
  quality_score = EXCLUDED.quality_score,
  description = EXCLUDED.description;`;
}).join('\n\n');

import fs from 'fs';
fs.writeFileSync('scripts/seed_workflows.sql', sqlInsert);
console.log('Generated scripts/seed_workflows.sql successfully!');
