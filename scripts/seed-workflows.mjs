import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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
        prompt: `Act as a Principal Software Architect.
Target Feature: {{feature_description}}
Tech Stack: {{tech_stack}}

[FAIL-CLOSED INPUT ENFORCEMENT]
If {{feature_description}} or {{tech_stack}} is missing, ambiguous, or lacks core entities, HALT IMMEDIATELY.
Return strictly: "PIPELINE_HALT: [Specific missing parameter or ambiguous requirement]".
Do not assume defaults or generate placeholder mockups.

[OUTPUT CONTRACT SPECIFICATION]
Output must be deterministic, token-efficient, and formatted strictly in Markdown AST:
1. Database Schema: PostgreSQL DDL with explicit foreign keys, non-nullable constraints, and compound indexes.
2. API Interface Contract: Strict TypeScript interface or JSON-Schema defining Request Headers, Params, Body, and 200/400/500 Response shapes.
3. Edge Case Matrix: Markdown table covering Rate Limits, Concurrency/Race Conditions, and Null/Empty payload boundaries.
Size Limit: Under 500 tokens. Zero conversational intro or summary sign-offs.`
      },
      {
        step_number: 2,
        title: 'Production Implementation',
        goal: 'Transform the architecture contract into clean, fully typed production code.',
        prompt: `Act as a Senior Lead Systems Engineer.
Upstream Architecture Contract:
{{step_1_output}}

[FAIL-CLOSED VERIFICATION]
If {{step_1_output}} does not contain valid DDL or typed API interfaces from Phase 1, HALT and return:
"PIPELINE_HALT: Upstream architecture contract is incomplete or invalid".

[EXECUTION DIRECTIVES]
Write production-grade, zero-placeholder code for both backend handler routes and frontend client integration.
Enforce:
- End-to-end type safety matching the Phase 1 interface contract.
- Explicit error handling with structured JSON responses and proper HTTP status codes.
- Idempotency guards on all mutating state endpoints.
Do not emit TODOs, comments like '// implement here', or conversational explanations.`
      },
      {
        step_number: 3,
        title: 'Security & Concurrency Hardening',
        goal: 'Audit code against OWASP Top 10, memory leaks, and concurrency bugs.',
        prompt: `Act as a Senior Security Engineer & Penetration Auditor.
Code Under Review:
{{step_2_output}}

[FAIL-CLOSED VERIFICATION]
If {{step_2_output}} is missing executable code or contains unparsed placeholders, HALT with:
"PIPELINE_HALT: No executable code detected from Phase 2".

[AUDIT CONTRACT]
1. Static Threat Matrix: Identify risks across OWASP Top 10 (SQLi, IDOR, Broken Authentication, SSRF) and async resource leaks.
2. Hardened Rewrite: Rewrite vulnerable code blocks with hardened security controls, parameterized queries, and strict input validation.
Output only the threat assessment table and hardened patch blocks.`
      },
      {
        step_number: 4,
        title: 'Automated Tests & GitHub PR Description',
        goal: 'Generate complete unit/integration tests and a structured Pull Request.',
        prompt: `Act as a Staff QA Engineer & Release Architect.
Hardened Codebase:
{{step_3_output}}

[FAIL-CLOSED VERIFICATION]
If {{step_3_output}} is missing hardened implementations, HALT with:
"PIPELINE_HALT: Hardened security artifacts missing".

[DELIVERABLES]
1. Automated Test Suite: Write executable unit and integration tests (using Vitest, Jest, or Pytest) targeting edge cases identified in Phase 1.
2. GitHub Pull Request: Output a structured Markdown PR containing:
   - Summary of Changes
   - Breaking Changes & Migration Steps
   - Security Audit Verification Checklist`
      }
    ]
  },
  {
    title: 'PostgreSQL Query Optimization & Index Blueprint',
    slug: 'postgresql-query-optimization',
    description: 'Transform sluggish sequential scans and heavy joins into sub-10ms indexed queries with EXPLAIN ANALYZE telemetry.',
    category: 'Engineering',
    target_role: 'Database Engineer',
    estimated_time: '6 mins',
    is_pro: true,
    quality_score: 98,
    steps: [
      {
        step_number: 1,
        title: 'Query & Schema Profiling',
        goal: 'Isolate slow sequential scans, table bloat, and redundant memory allocations.',
        prompt: `Act as a Principal PostgreSQL DBA.
Target Slow Query: {{slow_query}}
Schema DDL & Row Count: {{schema_details}}

[FAIL-CLOSED GUARDRAIL]
If {{slow_query}} is not a valid SQL statement, HALT and output:
"PIPELINE_HALT: Missing or invalid SQL query definition".

[ANALYSIS CONTRACT]
1. Query Cost Breakdown: Identify seq scans, nested loop spills, and high-cost buffer reads.
2. Bottleneck Isolation: Pinpoint missing indexes, bad join predicates, or missing statistics.
Format strictly in Markdown AST.`
      },
      {
        step_number: 2,
        title: 'Index Strategy & Query Rewrite',
        goal: 'Design composite, partial, or BRIN indexes and rewrite SQL query.',
        prompt: `Using Phase 1 analysis:
{{step_1_output}}

[FAIL-CLOSED VERIFICATION]
If {{step_1_output}} is missing cost breakdown, HALT with: "PIPELINE_HALT: Upstream query profiling data missing".

[OPTIMIZATION CONTRACT]
1. DDL Statements: Write zero-downtime 'CREATE INDEX CONCURRENTLY' statements with exact composite columns.
2. Query Rewrite: Rewrite the original SQL using CTEs or EXISTS clauses to optimize buffer cache hit ratio.`
      },
      {
        step_number: 3,
        title: 'Lock Contention & Concurrency Audit',
        goal: 'Audit transactional lock impact under high concurrent throughput.',
        prompt: `Using Phase 2 rewritten query and index DDL:
{{step_2_output}}

Evaluate lock levels (AccessExclusiveLock vs ShareUpdateExclusiveLock). Provide connection-level parameters ('lock_timeout', 'statement_timeout') to prevent deadlock cascades under load.`
      },
      {
        step_number: 4,
        title: 'PgBouncer & Connection Pooling Tuning',
        goal: 'Configure connection pool sizing and automated rollback scripts.',
        prompt: `Using database migration artifacts from Step 2 & 3:
{{step_3_output}}

Generate:
1. Transaction-mode PgBouncer allocation parameters.
2. Reversible rollback migration script in clean SQL.`
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
        prompt: `Act as a Generative Engine Optimization (GEO) strategist.
Target Keyword: {{target_keyword}}
Domain Niche: {{domain_niche}}

[FAIL-CLOSED GUARDRAIL]
If {{target_keyword}} is blank or ambiguous, HALT with: "PIPELINE_HALT: Target keyword is missing".

[DELIVERABLES]
1. 10 semantic buyer-intent questions actively queried on Perplexity & Claude.
2. Factual citation outline structured for AI answer card extractions.
3. Strict H1, H2, H3 hierarchy with target entities.`
      },
      {
        step_number: 2,
        title: 'Authoritative Technical Drafting',
        goal: 'Draft comprehensive, non-fluff copy with real code examples and actionable data.',
        prompt: `Using outline from Step 1:
{{step_1_output}}

Draft the complete in-depth article. Tone: authoritative, direct, and zero generic marketing fluff. Include comparisons, concrete data, and step-by-step technical examples.`
      },
      {
        step_number: 3,
        title: 'Technical Schema & OpenGraph Meta Injector',
        goal: 'Generate valid FAQPage JSON-LD and viral social card metadata.',
        prompt: `Using the drafted article from Step 2:
{{step_2_output}}

Generate:
1. Strict, RFC-valid <script type="application/ld+json"> containing @graph with FAQPage and TechArticle schemas.
2. OpenGraph title, description, and high-CTR preview copy.`
      }
    ]
  }
];

// 1. Generate updated SQL file
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

fs.writeFileSync('scripts/seed_workflows.sql', sqlInsert);
console.log('✔ Generated updated scripts/seed_workflows.sql with Fail-Closed contracts!');

// 2. Direct Supabase sync if credentials exist in .env.local
async function pushToSupabase() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const [k, ...v] = line.split('=');
      if (!k || !v.length) continue;
      const key = k.trim();
      const val = v.join('=').trim().replace(/^["']|["']$/g, '');
      if (key === 'NEXT_PUBLIC_SUPABASE_URL' && !supabaseUrl) supabaseUrl = val;
      if ((key === 'SUPABASE_SERVICE_ROLE_KEY' || key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') && !supabaseKey) supabaseKey = val;
    }
  }

  if (!supabaseUrl || !supabaseKey) {
    console.log('Notice: .env.local credentials not found. Run scripts/seed_workflows.sql in Supabase SQL editor.');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Connecting to Supabase to update workflows...');

    for (const w of sampleWorkflows) {
      const { error } = await supabase
        .from('workflows')
        .upsert({
          slug: w.slug,
          title: w.title,
          description: w.description,
          category: w.category,
          target_role: w.target_role,
          estimated_time: w.estimated_time,
          is_pro: w.is_pro,
          quality_score: w.quality_score,
          steps: w.steps
        }, { onConflict: 'slug' });

      if (error) {
        console.error(`Error updating ${w.slug}:`, error.message);
      } else {
        console.log(`✔ Live updated Supabase workflow: ${w.title}`);
      }
    }
    console.log('All workflows successfully synchronized with Supabase!');
  } catch (err) {
    console.error('Supabase update failed:', err.message);
  }
}

pushToSupabase();
