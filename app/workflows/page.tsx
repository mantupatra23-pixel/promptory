import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import WorkflowDirectory from './WorkflowDirectory';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Multi-Step AI Workflows & Chained Pipelines | Promptory',
  description: 'Battle-tested sequential AI prompt pipelines for software engineering, GEO search optimization, and DevOps systems. Zero hallucinations through chained context.',
};

export default async function WorkflowsPage() {
  const { data: workflows } = await supabase
    .from('workflows')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Why do single-shot prompts fail in production software environments?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Single-shot prompts fail due to context window dilution and attention saturation. Compressing architectural contracts, business rules, typed validation, and implementation into one prompt causes context drift and non-deterministic placeholder generation."
                }
              },
              {
                "@type": "Question",
                "name": "How does Promptory enforce deterministic outputs in LLMs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Promptory blueprints enforce determinism using negative boundary constraints, strict RFC-compliant JSON output schemas, and multi-step phase isolation, preventing extraneous conversational tokens and untested mock code."
                }
              },
              {
                "@type": "Question",
                "name": "Can multi-step prompt workflows integrate into automated CI/CD pipelines?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Promptory blueprints can be invoked programmatically via standard APIs or synchronized into local codebases via npx promptory-cli pull --all, enabling automated PR review and schema testing in GitHub Actions."
                }
              },
              {
                "@type": "Question",
                "name": "What is the performance impact of context isolation vs monolithic prompts?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Context isolation reduces total tokens ingested by up to 5Fail-Closed across multi-turn sessions by pruning dead conversational branches and passing only verified state artifacts between phases."
                }
              }
            ]
          })
        }}
      />

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Deterministic Sequential AI Pipelines
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Multi-Step AI <span className="text-emerald-400">Workflows</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 leading-relaxed">
            Eliminate LLM hallucinations by chaining specialized prompt phases. The structured output of each step serves as verified context for the next phase.
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            <div className="bg-[#0c1017] border border-gray-800/80 rounded-xl p-3.5 text-center">
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">RFC-Strict</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Schema Contracts</div>
            </div>
            <div className="bg-[#0c1017] border border-gray-800/80 rounded-xl p-3.5 text-center">
              <div className="text-lg sm:text-xl font-bold font-mono text-white">4-Phase</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Pipeline Chaining</div>
            </div>
            <div className="bg-[#0c1017] border border-gray-800/80 rounded-xl p-3.5 text-center">
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">Fail-Closed</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Halt Guardrails</div>
            </div>
            <div className="bg-[#0c1017] border border-gray-800/80 rounded-xl p-3.5 text-center">
              <div className="text-lg sm:text-xl font-bold font-mono text-white">1-Click</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Frontier Export</div>
            </div>
          </div>
        </div>

        {/* Dynamic Workflow Catalog & Interactive Studio */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Active Production Pipelines ({workflows?.length || 0})
            </h2>
            <span className="text-xs text-gray-400">Updated weekly with verified models</span>
          </div>

          <WorkflowDirectory initialWorkflows={workflows || []} />
        </div>

        {/* Section: How Chained Pipelines Outperform Mega-Prompts */}
        <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Why Chained Pipelines Beat Single Prompts
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              When given massive 2,000-token instructions in a single prompt, frontier LLMs degrade in reasoning depth and skip constraints. Promptory splits them into deterministic micro-stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#070a0f] border border-gray-800/80 rounded-xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Context Window Isolation</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Phase 1 outputs only architectural blueprints. Phase 2 receives this clean structure without conversational garbage, allowing 10Fail-Closed token focus on code quality.
              </p>
            </div>

            <div className="bg-[#070a0f] border border-gray-800/80 rounded-xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Negative Constraint Enforcement</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Each step applies independent boundary locks. If a phase fails tests or introduces hallucinated variables, the pipeline stops before code is ever merged.
              </p>
            </div>

            <div className="bg-[#070a0f] border border-gray-800/80 rounded-xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Multi-Model Interoperability</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Use Claude 3.5 Sonnet for deep architectural reasoning in Phase 1, and DeepSeek R1 for aggressive code vulnerability auditing in Phase 3.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Frequently Asked Questions */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h3>
            <p className="text-xs sm:text-sm text-gray-400">Everything you need to know about executing Promptory pipelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0c1017] border border-gray-800 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white">How do I pass outputs between phases?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                When you execute Phase 1 in ChatGPT or Claude, copy the AI response. Open Phase 2 in the workbench and paste the previous output into the specified context placeholder.
              </p>
            </div>

            <div className="bg-[#0c1017] border border-gray-800 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white">Are these workflows compatible with API automation?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Yes. All prompt phases follow strict input/output contracts, making them plug-and-play with LangChain, LlamaIndex, or custom Python scripts using OpenAI SDK.
              </p>
            </div>

            <div className="bg-[#0c1017] border border-gray-800 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white">What is included in the Pro Workflow access?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pro members receive unlimited access to all advanced pipelines, automated vulnerability test fixtures, and newly published workflows updated every week.
              </p>
            </div>

            <div className="bg-[#0c1017] border border-gray-800 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white">Can I request a custom workflow for my team?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Yes. Active Pro subscribers can submit workflow architecture requests directly to our team via the submit portal for priority inclusion.
              </p>
            </div>
          </div>
        </div>

        {/* Pro Conversion Call-to-Action */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111723] to-[#0a0d13] border border-emerald-500/30 p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              ⚡ PROMPTORY PRO MEMBERSHIP
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Unlock All Production Workflows & Blueprints
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Get unrestricted access to every multi-step pipeline, anti-hallucination guardrail, and developer export for ₹799/month.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all"
            >
              Get Pro Access (₹799/mo) &rarr;
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-medium border border-gray-700 bg-gray-800/80 text-gray-200 hover:bg-gray-700 transition-colors"
            >
              Explore Single Prompts
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
