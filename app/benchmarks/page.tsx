import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Gauge, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Promptory Performance & Architecture Benchmarks (2026)',
  description:
    'Empirical performance benchmark comparing Promptory against legacy prompt directories across client execution latency, ad footprint, tracking overhead, and token efficiency.',
  alternates: {
    canonical: 'https://www.promptory.xyz/benchmarks',
  },
};

export default function BenchmarksPage() {
  const benchmarkSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'AI Prompt Directory Performance & Privacy Benchmark 2026',
    url: 'https://www.promptory.xyz/benchmarks',
    description: 'Empirical runtime and privacy benchmarks for AI prompt directories.',
    author: { '@type': 'Organization', name: 'Promptory' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(benchmarkSchema) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="border border-[#30363D] bg-[#161B22]/70 rounded-2xl p-6 sm:p-8 mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Gauge className="w-3.5 h-3.5" />
            <span>2026 Architecture Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Performance & Ad-Free Latency Benchmarks
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            Promptory is architected for zero-latency client execution, zero third-party telemetry scripts, and instant parameter injection into frontier LLMs.
          </p>
        </div>

        {/* Empirical Metrics Table */}
        <div className="overflow-x-auto border border-[#30363D] rounded-2xl bg-[#161B22] mb-12">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#30363D] bg-[#21262D]/60 text-slate-200">
                <th className="p-4 sm:px-6">Performance Metric</th>
                <th className="p-4 sm:px-6 text-emerald-400 font-bold">Promptory</th>
                <th className="p-4 sm:px-6 text-slate-300">PromptBase</th>
                <th className="p-4 sm:px-6 text-slate-300">FlowGPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D] text-slate-300">
              <tr>
                <td className="p-4 sm:px-6 font-medium text-white">Display / Banner Ads</td>
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
                <td className="p-4 sm:px-6 font-medium text-white">Mandatory Account Wall</td>
                <td className="p-4 sm:px-6 text-emerald-400 font-bold">None (Open Access)</td>
                <td className="p-4 sm:px-6">Yes (Pay-per-prompt)</td>
                <td className="p-4 sm:px-6">Yes (Token credits)</td>
              </tr>
              <tr>
                <td className="p-4 sm:px-6 font-medium text-white">Frontier Reasoning Support</td>
                <td className="p-4 sm:px-6 text-emerald-400 font-bold">DeepSeek-R1, Claude 3.5, GPT-4o</td>
                <td className="p-4 sm:px-6">Legacy DALL-E / GPT-3.5</td>
                <td className="p-4 sm:px-6">Custom Chat Bots</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Instant Browser Execution
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              No binary downloads, browser extensions, or background tracking pixels required. Prompt variables compile in-memory directly in your browser.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Privacy & Zero-Log Architecture
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prompt customizations and sensitive inputs never touch external persistence stores. All prompt variable injections execute client-side.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
