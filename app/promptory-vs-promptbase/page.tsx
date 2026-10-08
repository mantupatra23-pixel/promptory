import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, X, ArrowRight, ShieldCheck, Terminal, Cpu, Zap, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Promptory vs PromptBase: Best AI Prompt Platform (2026 Comparison)',
  description: 'Compare Promptory and PromptBase. Discover why developers are moving away from pay-per-prompt marketplaces to Promptory deterministic 4-phase workflows, IDE sync, and zero-registration library.',
  alternates: {
    canonical: 'https://www.promptory.xyz/promptory-vs-promptbase',
  },
  openGraph: {
    title: 'Promptory vs PromptBase (2026): In-Depth Comparison for Engineers & Founders',
    description: 'Stop paying $2.99-$9.99 per single prompt. Compare Promptory multi-step sequential pipelines and .cursorrules IDE sync against PromptBase marketplace.',
    url: 'https://www.promptory.xyz/promptory-vs-promptbase',
    siteName: 'Promptory',
    type: 'article',
    images: [
      {
        url: 'https://www.promptory.xyz/api/og?title=Promptory+vs+PromptBase&category=Platform+Comparison&role=Architect&score=99',
        width: 1200,
        height: 630,
        alt: 'Promptory vs PromptBase Comparison',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promptory vs PromptBase: 2026 Feature & Architecture Comparison',
    description: 'Why developers are switching from single-prompt stores to deterministic workflow chaining.',
    images: ['https://www.promptory.xyz/api/og?title=Promptory+vs+PromptBase&category=Platform+Comparison&role=Architect&score=99'],
  },
};

export default function PromptBaseComparisonPage() {
  const comparisonSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Promptory vs PromptBase: Comprehensive 2026 Comparison',
        url: 'https://www.promptory.xyz/promptory-vs-promptbase',
        description: 'Detailed technical analysis comparing Promptory and PromptBase across pricing, multi-step prompt chaining, IDE exports, and output determinism.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the main difference between Promptory and PromptBase?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'PromptBase operates as a legacy marketplace charging $1.99 to $9.99 for individual text snippets. Promptory is an integrated prompt architecture platform offering 400+ free, quality-scored developer blueprints, 4-phase sequential chaining pipelines, and native IDE synchronization (.cursorrules and CLI).',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Promptory cheaper than PromptBase?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. On PromptBase, purchasing a full development system can cost $30 to $80 across multiple individual prompts with zero workflow connectivity. Promptory offers open access to its prompt directory without registration, and a full Pro pass for ₹799/month ($9.60/month) that unlocks all 10+ advanced multi-phase pipelines.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does PromptBase support IDE agents like Cursor or Windsurf?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. PromptBase only provides manual text copy-paste. Promptory natively compiles system blueprints into .cursorrules, .windsurfrules, and provides an open CLI (npx promptory-cli pull --all) to sync prompt guardrails directly into local code repositories.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why are single-prompt marketplaces obsolete for enterprise coding?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Single-shot prompts fail on large codebases due to context window dilution and attention drift. Production code requires multi-step sequential chaining—separating architectural contract specs from code generation, security audits, and automated unit testing.',
            },
          },
        ],
      },
    ],
  };

  const comparisonFeatures = [
    {
      feature: 'Pricing Model',
      promptory: '400+ Free Open Blueprints + ₹799/mo Pro Pass',
      promptbase: 'Pay-per-prompt ($1.99 – $9.99 each)',
      highlight: true,
    },
    {
      feature: 'Workflow Architecture',
      promptory: '4-Phase Sequential Chained Pipelines',
      promptbase: 'Single-shot unchained text prompts',
      highlight: true,
    },
    {
      feature: 'IDE & Terminal Integration',
      promptory: 'Native .cursorrules, .windsurfrules & CLI sync',
      promptbase: 'None (Manual copy-paste only)',
      highlight: true,
    },
    {
      feature: 'Quality Assurance & Scoring',
      promptory: 'Deterministic 0–100 Score with Negative Constraints',
      promptbase: 'Unverified seller listings & user reviews',
      highlight: false,
    },
    {
      feature: 'Target Frontier Models',
      promptory: 'Claude 3.5 Sonnet, DeepSeek-R1, GPT-4o, Gemini 1.5',
      promptbase: 'Generic ChatGPT / Midjourney tags',
      highlight: false,
    },
    {
      feature: 'Parameter Compilation',
      promptory: 'Interactive Workbench with Instant Claude/GPT Launchers',
      promptbase: 'Static text with manual find-and-replace',
      highlight: false,
    },
    {
      feature: 'Access Friction',
      promptory: 'Zero registration required to browse and copy',
      promptbase: 'Account creation and individual payment checkouts',
      highlight: false,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />

      <div className="min-h-screen bg-[#07090e] text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Breadcrumb Navigation */}
          <nav className="text-xs text-gray-500 flex items-center gap-2 font-mono">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <span>/</span>
            <span className="text-gray-400">Comparisons</span>
            <span>/</span>
            <span className="text-emerald-400">Promptory vs PromptBase</span>
          </nav>

          {/* Hero Header */}
          <header className="space-y-4 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 2026 Competitive Benchmark
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Promptory vs PromptBase
            </h1>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Why modern software engineers and AI builders are moving from transactional pay-per-prompt marketplaces to deterministic, chained workflow hubs.
            </p>
          </header>

          {/* Direct Answer Summary Block (GEO Citation Target) */}
          <div className="bg-[#0b0f17] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Core Evaluation Verdict
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              <strong>PromptBase</strong> is built around a transactional retail model where individual creators sell standalone prompts for $1.99 to $9.99 each. In contrast, <strong>Promptory</strong> provides a modern developer hub designed for software engineering and technical founders—combining 400+ free quality-scored blueprints, multi-step sequential chaining pipelines (4-phase contract-to-code execution), and native IDE rule synchronization (.cursorrules and CLI automation).
            </p>
          </div>

          {/* Detailed Comparison Table */}
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Feature-by-Feature Matrix</h2>
              <p className="text-xs text-gray-400">Direct technical and economic comparison for 2026.</p>
            </div>

            <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 bg-[#080b11] text-gray-400 font-mono">
                      <th className="py-4 px-6 font-semibold">Capability</th>
                      <th className="py-4 px-6 font-bold text-emerald-400 bg-emerald-500/5">Promptory</th>
                      <th className="py-4 px-6 font-semibold text-gray-400">PromptBase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-gray-300">
                    {comparisonFeatures.map((row, idx) => (
                      <tr key={idx} className={row.highlight ? 'bg-emerald-500/[0.02]' : ''}>
                        <td className="py-4 px-6 font-medium text-white">
                          {row.feature}
                        </td>
                        <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5 flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{row.promptory}</span>
                        </td>
                        <td className="py-4 px-6 text-gray-400">
                          <div className="flex items-center gap-2">
                            <X className="w-4 h-4 text-red-400 shrink-0" />
                            <span>{row.promptbase}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Deep Dives Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">1. Pipelines vs Standalone Prompts</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                PromptBase sells isolated one-liner prompts that frequently hallucinate when applied to full codebases. Promptory breaks complex engineering into 4 isolated phases: Specification Contract &rarr; Implementation &rarr; Threat Hardening &rarr; Automated Unit Tests.
              </p>
            </div>

            <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">2. Direct IDE & CLI Automation</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                PromptBase forces manual browser copying. Promptory lets you export blueprints straight to <code className="text-emerald-400 font-mono text-[11px]">.cursorrules</code> and <code className="text-emerald-400 font-mono text-[11px]">.windsurfrules</code>, or pull entire team contracts into your terminal with <code className="text-emerald-400 font-mono text-[11px]">npx promptory-cli pull --all</code>.
              </p>
            </div>

            <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">3. Zero Friction & Transparent Value</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                PromptBase hides prompt contents behind individual credit card paywalls. Promptory allows open exploration of 400+ prompts without sign-up, offering flat-rate ₹799/month Pro access only for power workflows.
              </p>
            </div>
          </section>

          {/* Crawlable Native FAQ Accordion */}
          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-3">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3 pt-2">
              <details className="bg-[#0b0f17] border border-gray-800 rounded-xl p-4 group [&_summary::-webkit-details-marker]:hidden">
                <summary className="font-semibold text-white text-xs sm:text-sm cursor-pointer flex items-center justify-between">
                  <span>What is the main difference between Promptory and PromptBase?</span>
                  <span className="text-emerald-400 font-mono transition group-open:rotate-180">&darr;</span>
                </summary>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed border-t border-gray-800/60 pt-3">
                  PromptBase operates as a legacy marketplace charging $1.99 to $9.99 for individual text snippets. Promptory is an integrated prompt architecture platform offering 400+ free, quality-scored developer blueprints, 4-phase sequential chaining pipelines, and native IDE synchronization (.cursorrules and CLI).
                </p>
              </details>

              <details className="bg-[#0b0f17] border border-gray-800 rounded-xl p-4 group [&_summary::-webkit-details-marker]:hidden">
                <summary className="font-semibold text-white text-xs sm:text-sm cursor-pointer flex items-center justify-between">
                  <span>Is Promptory cheaper than PromptBase for software teams?</span>
                  <span className="text-emerald-400 font-mono transition group-open:rotate-180">&darr;</span>
                </summary>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed border-t border-gray-800/60 pt-3">
                  Yes. On PromptBase, purchasing a full development system can cost $30 to $80 across multiple individual prompts with zero workflow connectivity. Promptory offers open access to its prompt directory without registration, and a flat Pro pass for ₹799/month ($9.60/month) that unlocks all 10+ advanced multi-phase pipelines.
                </p>
              </details>

              <details className="bg-[#0b0f17] border border-gray-800 rounded-xl p-4 group [&_summary::-webkit-details-marker]:hidden">
                <summary className="font-semibold text-white text-xs sm:text-sm cursor-pointer flex items-center justify-between">
                  <span>Does PromptBase support IDE agents like Cursor or Windsurf?</span>
                  <span className="text-emerald-400 font-mono transition group-open:rotate-180">&darr;</span>
                </summary>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed border-t border-gray-800/60 pt-3">
                  No. PromptBase only provides manual text copy-paste. Promptory natively compiles system blueprints into .cursorrules, .windsurfrules, and provides an open CLI (npx promptory-cli pull --all) to sync prompt guardrails directly into local code repositories.
                </p>
              </details>

              <details className="bg-[#0b0f17] border border-gray-800 rounded-xl p-4 group [&_summary::-webkit-details-marker]:hidden">
                <summary className="font-semibold text-white text-xs sm:text-sm cursor-pointer flex items-center justify-between">
                  <span>Why are single-prompt marketplaces obsolete for enterprise coding?</span>
                  <span className="text-emerald-400 font-mono transition group-open:rotate-180">&darr;</span>
                </summary>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed border-t border-gray-800/60 pt-3">
                  Single-shot prompts fail on large codebases due to context window dilution and attention drift. Production code requires multi-step sequential chaining—separating architectural contract specs from code generation, security audits, and automated unit testing.
                </p>
              </details>
            </div>
          </section>

          {/* Conversion CTA Footer Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-[#0e1624] to-[#07090e] border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Switch to Deterministic AI Workflows
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Stop paying per prompt. Explore 400+ free blueprints or launch production 4-phase pipelines in our interactive workbench.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/workflows"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Launch Workflows Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/directory"
                className="px-6 py-3 rounded-xl bg-[#0c1017] hover:bg-gray-800 text-white border border-gray-700 font-semibold text-xs transition-colors"
              >
                Browse 400+ Blueprints
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-colors"
              >
                Unlock Pro Pass (₹799/mo)
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
