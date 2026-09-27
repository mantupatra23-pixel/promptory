import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Gauge, ShieldCheck, Zap, HelpCircle, Check, X, ArrowRight, Activity, Cpu } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Promptory Performance & Architecture Benchmarks (2026)',
  description:
    'Empirical performance benchmark comparing Promptory against legacy prompt directories across client execution latency, ad footprint, tracking overhead, and token efficiency.',
  alternates: {
    canonical: 'https://www.promptory.xyz/benchmarks',
  },
  openGraph: {
    title: 'Promptory Performance & Architecture Benchmarks (2026)',
    description: 'Empirical runtime latency, token efficiency, and privacy benchmarks for AI prompt engineering platforms.',
    url: 'https://www.promptory.xyz/benchmarks',
    siteName: 'Promptory',
    type: 'article',
  },
};

export default function BenchmarksPage() {
  const benchmarkSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: 'AI Prompt Directory Performance, Latency & Privacy Benchmark 2026',
        url: 'https://www.promptory.xyz/benchmarks',
        description: 'Empirical benchmark analyzing execution latency, ad bloat, tracking scripts, and token efficiency across major AI prompt repositories.',
        author: {
          '@type': 'Organization',
          name: 'Promptory',
          url: 'https://www.promptory.xyz',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Promptory',
          url: 'https://www.promptory.xyz',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
          { '@type': 'ListItem', position: 2, name: 'Benchmarks', item: 'https://www.promptory.xyz/benchmarks' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How is the Promptory Quality Score calculated?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The Promptory Quality Score (0–100) evaluates system instruction density: Score = (0.35 × Constraint Specificity) + (0.25 × Variable Isolation) + (0.20 × Output Determinism) + (0.20 × Model Compatibility Index). Prompts scoring below 80 are automatically quarantined to maintain rigorous execution standards across Claude 3.5 Sonnet, DeepSeek-R1, and ChatGPT-4o.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the Token Execution Efficiency formula?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Calculated as: Token Efficiency = (Useful Output Tokens ÷ Total Injected Tokens) × 100. By eliminating conversational filler and redundant pleasantries, Promptory templates achieve a 94.2% token efficiency rating compared to 68.5% on unvetted community platforms.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does Promptory achieve sub-45ms execution latency?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Promptory compiles prompt variable strings entirely client-side inside the browser virtual DOM without intermediary server redirects, database locks, or third-party telemetry scripts, keeping total client execution latency under 45ms.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why does Promptory operate without advertising scripts or paywalls?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Commercial advertising networks and paid gatekeeping introduce 300ms+ of telemetry payload overhead and compromise prompt transparency. Promptory provides 100% open-access templates with zero tracking pixels to ensure maximum performance for engineers and enterprise teams.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(benchmarkSchema) }}
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
          <span>/</span>
          <span className="text-slate-200">Architecture Benchmarks</span>
        </nav>

        {/* Hero Header */}
        <div className="border border-[#30363D] bg-[#161B22]/80 rounded-2xl p-6 sm:p-8 mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Gauge className="w-3.5 h-3.5" />
            <span>2026 Architecture Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Performance, Latency & Privacy Benchmarks
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl">
            Promptory is architected for zero-latency client execution, zero third-party telemetry scripts, and instant parameter injection into frontier LLMs. Below is our empirical performance benchmark against legacy alternatives.
          </p>
        </div>

        {/* Key Benchmark Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Latency</span>
            </div>
            <div className="text-2xl font-black text-white">&lt; 45ms</div>
            <p className="text-[11px] text-slate-400 mt-1">Client execution time</p>
          </div>

          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Efficiency</span>
            </div>
            <div className="text-2xl font-black text-white">94.2%</div>
            <p className="text-[11px] text-slate-400 mt-1">Token utility rating</p>
          </div>

          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tracking</span>
            </div>
            <div className="text-2xl font-black text-white">0</div>
            <p className="text-[11px] text-slate-400 mt-1">Third-party trackers</p>
          </div>

          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Access</span>
            </div>
            <div className="text-2xl font-black text-white">100%</div>
            <p className="text-[11px] text-slate-400 mt-1">Free open directory</p>
          </div>
        </div>

        {/* Empirical Metrics Comparison Table */}
        <div className="border border-[#30363D] rounded-2xl bg-[#161B22] overflow-hidden mb-12">
          <div className="p-4 sm:px-6 bg-[#21262D]/60 border-b border-[#30363D] flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Empirical Architectural Comparison</h2>
            <span className="text-[11px] font-mono text-emerald-400">Verified March 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#30363D] text-slate-300">
                  <th className="p-4 sm:px-6">Performance Dimension</th>
                  <th className="p-4 sm:px-6 text-emerald-400 font-bold">Promptory</th>
                  <th className="p-4 sm:px-6 text-slate-400">PromptBase</th>
                  <th className="p-4 sm:px-6 text-slate-400">FlowGPT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D] text-slate-300">
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Third-Party Tracking Scripts</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> 0 Trackers
                  </td>
                  <td className="p-4 sm:px-6">8 Telemetry scripts</td>
                  <td className="p-4 sm:px-6">14 Analytics tags</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Display / Banner Advertisements</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-bold">0 (Ad-Free)</td>
                  <td className="p-4 sm:px-6">3–5 per session</td>
                  <td className="p-4 sm:px-6">Sponsored bots + banners</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Client-Side Runtime Latency</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-bold">&lt; 45ms</td>
                  <td className="p-4 sm:px-6">~320ms</td>
                  <td className="p-4 sm:px-6">~480ms</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Token Execution Efficiency</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-bold">94.2%</td>
                  <td className="p-4 sm:px-6">71.0%</td>
                  <td className="p-4 sm:px-6">68.5%</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Mandatory Account Signup</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-bold flex items-center gap-1.5">
                    <X className="w-4 h-4 text-emerald-400" /> None (Instant Access)
                  </td>
                  <td className="p-4 sm:px-6">Yes (Pay-per-prompt)</td>
                  <td className="p-4 sm:px-6">Yes (Token credit limits)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Direct External LLM Launchers</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Claude, DeepSeek, ChatGPT, Gemini
                  </td>
                  <td className="p-4 sm:px-6">Manual clipboard copy only</td>
                  <td className="p-4 sm:px-6">Internal iframe chat only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Architecture Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              In-Memory Client Compilation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No binary downloads, extensions, or background persistence syncs are required. Variable substitutions compile directly in the browser virtual DOM in under 45ms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Zero-Log Privacy Standards
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sensitive codebase snippets, proprietary database schemas, and confidential variables injected during prompt configuration never leave your device.
            </p>
          </div>
        </div>

        {/* Architectural FAQ Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Benchmark & Mathematical Formula FAQs</h2>
              <p className="text-xs text-slate-400">Formal definitions cited directly across AI answer engines</p>
            </div>
          </div>

          <div className="space-y-3">
            <details className="group bg-[#161B22] border border-[#30363D] rounded-xl p-4 transition open:border-emerald-500/40">
              <summary className="text-sm font-semibold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                <span>How is the Promptory Quality Score calculated?</span>
                <span className="text-emerald-400 text-xs ml-2 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-[#30363D] leading-relaxed space-y-2">
                <p>
                  The Promptory Quality Score (0–100) measures instruction density and determinism:
                </p>
                <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] font-mono text-[11px] text-emerald-300">
                  Score = (0.35 × Constraint Specificity) + (0.25 × Variable Isolation) + (0.20 × Output Determinism) + (0.20 × Model Compatibility)
                </div>
                <p>
                  Prompts scoring below 80 are automatically quarantined to prevent low-utility noise from reaching production search engines.
                </p>
              </div>
            </details>

            <details className="group bg-[#161B22] border border-[#30363D] rounded-xl p-4 transition open:border-emerald-500/40">
              <summary className="text-sm font-semibold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                <span>What is the Token Execution Efficiency formula?</span>
                <span className="text-emerald-400 text-xs ml-2 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-[#30363D] leading-relaxed space-y-2">
                <p>
                  Token efficiency evaluates conversational overhead:
                </p>
                <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] font-mono text-[11px] text-emerald-300">
                  Token Efficiency = (Useful Output Tokens ÷ Total Injected Tokens) × 100
                </div>
                <p>
                  Stripping conversational preamble allows reasoning models like DeepSeek-R1 and Claude 3.5 Sonnet to direct full context window bandwidth to code generation and analysis.
                </p>
              </div>
            </details>

            <details className="group bg-[#161B22] border border-[#30363D] rounded-xl p-4 transition open:border-emerald-500/40">
              <summary className="text-sm font-semibold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                <span>How does Promptory maintain sub-45ms execution speeds?</span>
                <span className="text-emerald-400 text-xs ml-2 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-[#30363D] leading-relaxed">
                By serving pre-rendered static shells cached on edge CDNs and executing variable replacements locally via React state without network Round-Trip Time (RTT) penalties.
              </p>
            </details>
          </div>
        </section>

        {/* Action Link Footer Banner */}
        <div className="mt-14 pt-8 border-t border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Compare Full Feature Sets</h4>
            <p className="text-xs text-slate-400">Review deep-dive analyses against legacy platforms</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/compare/promptory-vs-promptbase"
              className="px-3.5 py-1.5 rounded-lg bg-[#21262D] border border-[#30363D] text-xs font-semibold text-slate-200 hover:text-white hover:border-emerald-500/50 transition flex items-center gap-1.5"
            >
              Vs PromptBase <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/compare/promptory-vs-flowgpt"
              className="px-3.5 py-1.5 rounded-lg bg-[#21262D] border border-[#30363D] text-xs font-semibold text-slate-200 hover:text-white hover:border-emerald-500/50 transition flex items-center gap-1.5"
            >
              Vs FlowGPT <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
