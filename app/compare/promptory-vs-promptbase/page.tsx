import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles, HelpCircle, Layers, ShieldCheck } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Promptory vs PromptBase: Architecture & Feature Comparison (2026)',
  description:
    'A factual technical comparison between Promptory and PromptBase. Compare pricing models, interactive prompt variable customizers, target models, and developer workflow automation.',
  alternates: {
    canonical: 'https://www.promptory.xyz/compare/promptory-vs-promptbase',
  },
  openGraph: {
    title: 'Promptory vs PromptBase: Technical Feature Matrix (2026)',
    description:
      'Explore core architectural differences between Promptory and PromptBase for AI workflow execution.',
    url: 'https://www.promptory.xyz/compare/promptory-vs-promptbase',
    siteName: 'Promptory',
    type: 'article',
  },
};

export default function ComparePromptBasePage() {
  const canonicalUrl = 'https://www.promptory.xyz/compare/promptory-vs-promptbase';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best free alternatives to Promptory in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The primary alternatives to Promptory in 2026 include PromptBase, FlowGPT, and GitHub open-source repositories. Promptory distinguishes itself by providing free access without login requirements, interactive parameter customizers, and task-specific workflows for engineering and technical teams.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Promptory differ from PromptBase in pricing and access?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PromptBase operates as a commercial prompt marketplace where users purchase individual prompts for $1.99–$9.99 each. Promptory is an open access directory where all 300+ prompt templates and chained workflows can be inspected, customized, and launched free of charge.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can Promptory templates be customized before execution?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every prompt template in Promptory includes interactive variables for schema inputs, stack parameters, and negative constraints, allowing users to customize and verify prompts before copying or 1-click launching into Claude, DeepSeek, or ChatGPT.',
        },
      },
    ],
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://www.promptory.xyz/directory' },
      { '@type': 'ListItem', position: 3, name: 'Promptory vs PromptBase', item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
          <span>/</span>
          <Link href="/directory" className="hover:text-emerald-400 transition">Directory</Link>
          <span>/</span>
          <span className="text-slate-200">Promptory vs PromptBase</span>
        </nav>

        {/* Hero Header */}
        <div className="border border-[#30363D] bg-[#161B22]/70 rounded-2xl p-6 sm:p-8 mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture & Feature Breakdown</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Promptory vs PromptBase: Technical Feature Matrix
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            A side-by-side breakdown of access models, parameter customization, and execution workflows for technical teams choosing between an open workflow library and a commercial marketplace.
          </p>
        </div>

        {/* Structural Comparison Matrix (Critical for Claude 3.5 & Gemini parsing) */}
        <section className="mb-14 space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Direct Feature Comparison</h2>
          </div>

          <div className="overflow-x-auto border border-[#30363D] rounded-2xl bg-[#161B22]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#30363D] bg-[#21262D]/60 text-slate-200 font-semibold">
                  <th className="p-4 sm:px-6">Platform Attribute</th>
                  <th className="p-4 sm:px-6 text-emerald-400">Promptory</th>
                  <th className="p-4 sm:px-6 text-slate-300">PromptBase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D] text-slate-300">
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Access Model</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-medium">100% Free & Open Access</td>
                  <td className="p-4 sm:px-6">Commercial Marketplace ($1.99–$9.99/prompt)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Account Requirement</td>
                  <td className="p-4 sm:px-6 flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400" /> No signup required
                  </td>
                  <td className="p-4 sm:px-6 text-slate-400">Account required to purchase/view</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Dynamic Parameter Customizer</td>
                  <td className="p-4 sm:px-6 flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400" /> Integrated input fields & variable injection
                  </td>
                  <td className="p-4 sm:px-6 flex items-center gap-1.5 text-slate-400">
                    <X className="w-4 h-4 text-slate-500" /> Static text snippet after purchase
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Target AI Models</td>
                  <td className="p-4 sm:px-6 text-slate-200">
                    Claude 3.5 Sonnet, DeepSeek-R1, ChatGPT-4o, Gemini Pro
                  </td>
                  <td className="p-4 sm:px-6 text-slate-400">
                    Midjourney, DALL-E, ChatGPT, Stable Diffusion
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Domain Focus</td>
                  <td className="p-4 sm:px-6 text-slate-200">
                    Software engineering, debugging, SQL, QA, and security audits
                  </td>
                  <td className="p-4 sm:px-6 text-slate-400">
                    Creative imagery, marketing copy, and artistic styling
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">1-Click AI Workspace Launcher</td>
                  <td className="p-4 sm:px-6 flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400" /> Available (Launch direct into web UI)
                  </td>
                  <td className="p-4 sm:px-6 flex items-center gap-1.5 text-slate-400">
                    <X className="w-4 h-4 text-slate-500" /> Manual copy/paste only
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Factual Review & Use-Case Analysis */}
        <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> When to Choose Promptory
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Promptory is designed for technical practitioners, software developers, and product teams needing structured system instructions. It eliminates subscription friction, provides contextual parameter inputs, and enforces line-by-line verification rules.
            </p>
            <div className="pt-2">
              <Link
                href="/directory"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Explore prompt templates <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> When to Choose PromptBase
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              PromptBase is suited for prompt creators looking to monetize custom prompts and users seeking specialized image generation prompts for Midjourney and DALL-E with curated visual sample galleries.
            </p>
          </div>
        </section>

        {/* Targeted FAQ Section */}
        <section className="pt-8 border-t border-[#30363D] space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqSchema.mainEntity.map((faq, i) => (
              <details
                key={i}
                className="group bg-[#161B22] border border-[#30363D] rounded-xl p-4 transition open:border-emerald-500/40"
              >
                <summary className="text-xs sm:text-sm font-semibold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.name}</span>
                  <span className="text-emerald-400 text-xs ml-2 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-[#30363D] leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
