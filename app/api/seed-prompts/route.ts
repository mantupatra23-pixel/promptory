import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: sample, error: sampleErr } = await supabase.from('prompts').select('*').limit(1);
    if (sampleErr) {
      return NextResponse.json({ error: sampleErr.message }, { status: 500 });
    }
    const existingCols = sample && sample.length > 0 ? Object.keys(sample[0]) : [];

    const p1Text = `Act as a Principal Full-Stack Engineer and Cursor IDE configuration architect. Generate strict, production-ready .cursorrules for Next.js 15 App Router with Supabase authentication and Tailwind CSS.

### MANDATORY CONTRACTS
1. Enforce TypeScript strict mode without any use of "any".
2. All server mutations must execute inside Server Actions using safe-action patterns.
3. Always use Supabase SSR client (@supabase/ssr) instead of deprecated auth-helpers.
4. Output valid, unescaped markdown ready to be placed directly in .cursorrules.`;

    const p2Text = `Act as a Principal Database Reliability Engineer (DBA). Given a slow query and EXPLAIN (ANALYZE, BUFFERS) execution tree, diagnose the root bottleneck.

### ANALYSIS PROTOCOL
1. Isolate high-cost Seq Scans, nested loops, and memory spill-to-disk events.
2. Write zero-downtime CREATE INDEX CONCURRENTLY statements.
3. Provide restructured CTEs / SQL syntax to minimize buffer read counts.`;

    const p3Text = `Act as an AI Systems Architect specializing in autonomous agent tool orchestration. Architect deterministic tool definitions and multi-agent handoff contracts.

### ENFORCEMENT RULES
1. Define rigid JSON schemas with strict: true validation.
2. Implement fail-closed timeout budgets and anti-loop escape protocols.
3. Include fallback handlers when external API parameters fail schema validation.`;

    const killerPrompts = [
      {
        title: 'Next.js 15 + Supabase Production .cursorrules Engine',
        slug: 'nextjs-15-supabase-cursorrules-engine',
        category: 'Developer',
        target_role: 'Full-Stack Developer',
        model: 'Claude 3.5 Sonnet',
        target_model: 'Claude 3.5 Sonnet',
        model_compatibility: ['Claude 3.5 Sonnet', 'GPT-4o'],
        quality_score: 99,
        description: 'Zero-hallucination IDE rule configuration for App Router, Server Actions, TypeScript strict types, and Supabase SSR authentication.',
        is_featured: true,
        prompt_template: p1Text,
        prompt_text: p1Text
      },
      {
        title: 'DeepSeek-R1 Autonomous SQL EXPLAIN & Index Profiler',
        slug: 'deepseek-r1-sql-explain-index-profiler',
        category: 'Developer',
        target_role: 'Database Engineer',
        model: 'DeepSeek-R1',
        target_model: 'DeepSeek-R1',
        model_compatibility: ['DeepSeek-R1', 'Claude 3.5 Sonnet'],
        quality_score: 100,
        description: 'Deterministic PostgreSQL query planner optimizer. Analyzes slow sequential scans, buffer hits, and outputs zero-downtime concurrent index queries.',
        is_featured: true,
        prompt_template: p2Text,
        prompt_text: p2Text
      },
      {
        title: 'Multi-Agent Tool Calling JSON Schema & Handoff Contract',
        slug: 'multi-agent-tool-calling-schema-contract',
        category: 'AI Engineering',
        target_role: 'AI Systems Architect',
        model: 'Claude 3.5 Sonnet',
        target_model: 'Claude 3.5 Sonnet',
        model_compatibility: ['Claude 3.5 Sonnet', 'GPT-4o'],
        quality_score: 98,
        description: 'Production-ready JSON schemas and anti-loop recovery protocols for LangGraph, CrewAI, and OpenAI function calling agents.',
        is_featured: true,
        prompt_template: p3Text,
        prompt_text: p3Text
      }
    ];

    const results = [];
    for (const item of killerPrompts) {
      const payload: Record<string, any> = {};
      for (const [k, v] of Object.entries(item)) {
        if (existingCols.length === 0 || existingCols.includes(k)) {
          payload[k] = v;
        }
      }
      // Ensure required prompt_template column is always assigned
      payload['prompt_template'] = item.prompt_template;

      const { error } = await supabase.from('prompts').upsert(payload, { onConflict: 'slug' });
      if (error) {
        results.push({ slug: item.slug, status: 'error', message: error.message });
      } else {
        results.push({ slug: item.slug, status: 'success' });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
