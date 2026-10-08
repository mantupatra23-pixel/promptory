import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Next.js 15 & Python Cursor Rules Directory | Production IDE Prompts',
  description:
    'Battle-tested .cursorrules configurations for Next.js 15 App Router, Supabase SSR, FastAPI async backends, and DeepSeek-R1 SQL query profilers.',
  alternates: {
    canonical: 'https://www.promptory.xyz/cursor-rules',
  },
  openGraph: {
    title: 'Production Cursor Rules & AI Prompt Directory — Promptory',
    description:
      'Eliminate hallucinated imports and async bugs with verified Next.js 15 and Python FastAPI .cursorrules.',
    url: 'https://www.promptory.xyz/cursor-rules',
    siteName: 'Promptory',
    type: 'website',
  },
};

const structuredSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      '@id': 'https://www.promptory.xyz/cursor-rules/#article',
      headline: 'Production Cursor Rules Directory for Next.js 15 and Python Developers',
      description:
        'Technical guide and ready-to-use configuration files for Cursor IDE targeting Next.js 15 App Router, Supabase SSR, and FastAPI.',
      url: 'https://www.promptory.xyz/cursor-rules',
      author: {
        '@type': 'Organization',
        name: 'Promptory Architecture Team',
        url: 'https://www.promptory.xyz',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Promptory',
        url: 'https://www.promptory.xyz',
      },
    },
    {
      '@type': 'SoftwareSourceCode',
      name: 'Next.js 15 Production .cursorrules',
      programmingLanguage: 'TypeScript',
      codeSampleType: 'full',
      runtimePlatform: 'Next.js 15, Node.js',
    },
    {
      '@type': 'SoftwareSourceCode',
      name: 'FastAPI High-Performance .cursorrules',
      programmingLanguage: 'Python',
      codeSampleType: 'full',
      runtimePlatform: 'Python 3.12, FastAPI',
    },
  ],
};

export default function CursorRulesDirectoryPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
      />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Breadcrumb */}
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <nav className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Link href="/" className="hover:underline">Promptory</Link>
            <span>/</span>
            <Link href="/directory" className="hover:underline">Directory</Link>
            <span>/</span>
            <span className="text-slate-400">Cursor Rules</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Production Cursor Rules &amp; Developer AI Prompt Directory
          </h1>
          <p className="text-lg text-slate-400 font-normal">
            Eliminate LLM hallucinations, deprecated imports, and concurrency bugs across Next.js 15 App Router, Supabase SSR, and Python FastAPI.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Next.js 15 Verified
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Python FastAPI
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              DeepSeek-R1 Ready
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-800 text-slate-300">
              Zero Preamble Fluff
            </span>
          </div>
        </header>

        {/* Section 1: Problem Space */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            Why Generic AI Prompts Fail in Modern Full-Stack Engineering
          </h2>
          <p className="leading-relaxed text-slate-300">
            When developers prompt frontier LLMs without persistent workspace guardrails, models default to outdated training weights. In modern stacks, this introduces breaking regressions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <h3 className="font-semibold text-white mb-2">Next.js 15 Breaking Paradigms</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Async request APIs (<code className="text-emerald-400 font-mono text-xs">cookies()</code>, <code className="text-emerald-400 font-mono text-xs">headers()</code>) and revised Server Action caching throw runtime errors if generated using older Next.js 13/14 conventions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <h3 className="font-semibold text-white mb-2">Python Concurrency &amp; Event Loops</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Unchecked LLMs produce synchronous blocking I/O calls inside asynchronous FastAPI routes, starving the asyncio event loop and causing severe latency spikes under production loads.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Next.js 15 .cursorrules */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
              1. Verified .cursorrules for Next.js 15 + Supabase SSR
            </h2>
            <span className="text-xs font-mono text-slate-400">Save to project root: <code className="text-slate-200">.cursorrules</code></span>
          </div>
          <p className="text-sm text-slate-300">
            Paste this configuration into the root of your Next.js 15 project. It instructs Cursor to enforce TypeScript strict mode, await asynchronous runtime headers, and mandate modern Supabase SSR clients.
          </p>

          <div className="relative group bg-[#0A0D12] rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span>.cursorrules (Next.js 15 + Supabase)</span>
              <span className="text-emerald-400 font-semibold">Strict Boundary Enforced</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`# Next.js 15 & Supabase Production Execution Contract

You are a Principal Full-Stack Engineer specializing in Next.js 15 (App Router) and Supabase.

### STRICT ARCHITECTURAL RULES
1. TypeScript Strictness:
   - NEVER use "any", "unknown", or loose type casting.
   - All Server Actions must return strongly typed discriminated unions: { success: true; data: T } | { success: false; error: string }.

2. Next.js 15 Async API Contracts:
   - Always treat cookies() and headers() as asynchronous functions. Always await them:
     const cookieStore = await cookies();
   - Never access searchParams directly on page components without awaiting.

3. Authentication & Supabase SSR:
   - For server-side queries, strictly utilize createServerClient from "@supabase/ssr".
   - Deprecated "@supabase/auth-helpers-nextjs" is strictly banned.

4. UI & Rendering:
   - Default to React Server Components (RSC). Only mark components with 'use client' when handling browser event listeners or hooks.
   - Use Tailwind CSS for utility styling.

5. Output Format:
   - Provide copy-pasteable, production-ready code. Eliminate conversational preambles and post-scripts.`}
            </pre>
          </div>
        </section>

        {/* Section 3: Python FastAPI .cursorrules */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
              2. Verified .cursorrules for Python &amp; FastAPI Backends
            </h2>
            <span className="text-xs font-mono text-slate-400">Save to: <code className="text-slate-200">backend/.cursorrules</code></span>
          </div>
          <p className="text-sm text-slate-300">
            Engineered for high-throughput Python backends using async SQLAlchemy 2.0, Pydantic v2 data models, and non-blocking dependency injection.
          </p>

          <div className="relative group bg-[#0A0D12] rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span>.cursorrules (Python FastAPI)</span>
              <span className="text-cyan-400 font-semibold">AsyncIO Safe</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`# Python 3.12 & FastAPI Production Architecture Contract

You are a Senior Backend Systems Engineer specializing in FastAPI and asynchronous Python architecture.

### STRICT BOUNDARIES & CONSTRAINTS
1. Concurrency Safety:
   - All route handlers performing I/O must be defined with "async def".
   - Never execute blocking database calls or sync requests inside async endpoints. Use httpx.AsyncClient for external HTTP.
   - Strictly use AsyncSession from sqlalchemy.ext.asyncio for database operations.

2. Data Validation & Serialization:
   - All request/response payloads must use Pydantic v2 BaseModel with explicit Field() constraints and type annotations.
   - Always define response_model on API endpoints to prevent serializing private database attributes.

3. Modular Architecture:
   - Decouple routes into APIRouter instances under a modular app/api/v1 structure.
   - Database sessions must be injected via FastAPI Depends() generators ensuring deterministic cleanup.

4. Output Constraints:
   - Return clean, PEP-8 compliant code with zero conversational fluff.`}
            </pre>
          </div>
        </section>

        {/* Section 4: DeepSeek-R1 SQL Profiler */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            3. DeepSeek-R1 Autonomous SQL EXPLAIN Profiler Prompt
          </h2>
          <p className="text-sm text-slate-300">
            DeepSeek-R1 excels at deterministic mathematical verification. Use this system prompt to analyze slow PostgreSQL query execution trees and generate zero-downtime indexing statements.
          </p>

          <div className="bg-[#0A0D12] rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-purple-400 font-semibold">
              DeepSeek-R1 Execution Blueprint
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`Act as a Principal Database Reliability Engineer (DBA).
Given the following PostgreSQL slow query and its execution plan:

[QUERY]:
{{SLOW_QUERY}}

[EXPLAIN (ANALYZE, BUFFERS) OUTPUT]:
{{EXPLAIN_TREE}}

MANDATORY EXECUTION DIRECTIVES:
1. Identify high-cost Sequential Scans (Seq Scan), hash joins, and memory spill-to-disk operations.
2. Provide precise "CREATE INDEX CONCURRENTLY" statements with optimal column ordering for filter predicates.
3. Rewrite the query with optimized CTEs or subqueries to minimize buffer shared hits.
4. Explain estimated latency improvements in a concise markdown comparison table.`}
            </pre>
          </div>
        </section>

        {/* Section 5: Comparison Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            Promptory vs. Static Repositories &amp; Marketplaces
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-emerald-400">Promptory</th>
                  <th className="py-3 px-4">cursor.directory</th>
                  <th className="py-3 px-4">GitHub Repos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Quality Scoring</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">0–100 Tested Metric</td>
                  <td className="py-3 px-4 text-slate-500">None (Unscored)</td>
                  <td className="py-3 px-4 text-slate-500">Manual Stars Only</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Dynamic Variables</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">1-Click Visual Inject</td>
                  <td className="py-3 px-4 text-slate-500">Static Text Only</td>
                  <td className="py-3 px-4 text-slate-500">Manual Search/Replace</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Framework Targeting</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Next.js 15 / Python 3.12</td>
                  <td className="py-3 px-4 text-slate-400">Mixed / Deprecated</td>
                  <td className="py-3 px-4 text-slate-400">Varies by Author</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">1-Click Model Launch</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Claude, Gemini, ChatGPT</td>
                  <td className="py-3 px-4 text-slate-500">Copy to Clipboard Only</td>
                  <td className="py-3 px-4 text-slate-500">Copy to Clipboard Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="font-semibold text-white">Where should .cursorrules files be placed in a monorepo?</h3>
              <p className="text-sm text-slate-400 mt-1">
                You can place a global <code className="text-emerald-400 font-mono text-xs">.cursorrules</code> file in the repository root for organization-wide standards, and dedicated rules files inside specific subdirectories (e.g., <code className="text-emerald-400 font-mono text-xs">apps/web/.cursorrules</code> and <code className="text-emerald-400 font-mono text-xs">apps/api/.cursorrules</code>).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="font-semibold text-white">Do verbose system prompts slow down Cursor&apos;s auto-completion?</h3>
              <p className="text-sm text-slate-400 mt-1">
                No. Because Promptory rules strip conversational filler and polite greetings, they reduce input context overhead by up to 35%, leading to faster first-token generation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <footer className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20 border border-emerald-500/30 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Explore 400+ Verified Developer System Prompts
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Access battle-tested prompts for Next.js, LangGraph agents, Rust performance tuning, and automated code reviews.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/directory"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-black bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/10 text-sm"
            >
              Browse Full Directory →
            </Link>
            <Link
              href="/blog/best-ai-prompts-for-developers"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 text-sm"
            >
              Read Architecture Guide
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
