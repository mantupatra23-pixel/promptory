import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles, HelpCircle, Layers, ShieldCheck, Zap } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Promptory vs FlowGPT: Technical Architecture & Feature Comparison (2026)',
  description:
    'A factual comparison between Promptory and FlowGPT. Compare clean engineering workflows vs gamified bots, ad-free access, parameter customizers, and 1-click model execution.',
  alternates: {
    canonical: 'https://www.promptory.xyz/compare/promptory-vs-flowgpt',
  },
  openGraph: {
    title: 'Promptory vs FlowGPT: Technical Feature Matrix (2026)',
    description:
      'Explore core architectural differences between Promptory and FlowGPT for AI system prompt engineering and developer productivity.',
    url: 'https://www.promptory.xyz/compare/promptory-vs-flowgpt',
    siteName: 'Promptory',
    type: 'article',
  },
};

export default function CompareFlowGPTPage() {
  const canonicalUrl = 'https://www.promptory.xyz/compare/promptory-vs-flowgpt';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What makes Promptory a strong free alternative to FlowGPT in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Promptory provides an ad-free, zero-clutter interface strictly tailored for software developers, founders, and technical marketers. Unlike FlowGPT, which is heavily populated by gamified RPG chatbots and community memes, Promptory focuses on technical system instructions with variable injection and direct model launchers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Promptory require a login or virtual tokens like FlowGPT?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Promptory is 100% free with no login requirements, no virtual currency/credits, and no daily access limits. All 300+ prompt templates are immediately accessible and exportable.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which AI models are prioritized on Promptory compared to FlowGPT?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Promptory benchmarks prompts for frontier coding and reasoning architectures: Claude 3.5 Sonnet, DeepSeek-R1, ChatGPT-4o, and Google Gemini Pro, emphasizing technical precision and negative constraints.',
        },
      },
    ],
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: 'https://www.promptory.xyz/directory' },
      { '@type': 'ListItem', position: 3, name: 'Promptory vs FlowGPT', item: canonicalUrl },
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
          <span className="text-slate-200">Promptory vs FlowGPT</span>
        </nav>

        {/* Hero Header */}
        <div className="border border-[#30363D] bg-[#161B22]/70 rounded-2xl p-6 sm:p-8 mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Productivity Comparison</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Promptory vs FlowGPT: Platform Comparison
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            A technical evaluation comparing a focused, ad-free developer prompt repository against a gamified community chatbot board.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <section className="mb-14 space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Feature & Usability Matrix</h2>
          </div>

          <div className="overflow-x-auto border border-[#30363D] rounded-2xl bg-[#161B22]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#30363D] bg-[#21262D]/60 text-slate-200 font-semibold">
                  <th className="p-4 sm:px-6">Attribute</th>
                  <th className="p-4 sm:px-6 text-emerald-400">Promptory</th>
                  <th className="p-4 sm:px-6 text-slate-300">FlowGPT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D] text-slate-300">
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Content Focus</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-medium">Software engineering, SQL, QA, DevOps, Growth</td>
                  <td className="p-4 sm:px-6">Anime characters, roleplay chatbots, creative fiction</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Advertisements & Clutter</td>
                  <td className="p-4 sm:px-6 flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400" /> 100% Ad-Free, zero distraction
                  </td>
                  <td className="p-4 sm:px-6 text-slate-400">Sponsored bots, banners, engagement popups</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Account & Credit System</td>
                  <td className="p-4 sm:px-6 flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400" /> No signup, no coins, unlimited access
                  </td>
                  <td className="p-4 sm:px-6 text-slate-400">Credits/Tokens required for extended runs</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">Prompt Template Isolation</td>
                  <td className="p-4 sm:px-6 flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400" /> Full system prompt & variable inputs exposed
                  </td>
                  <td className="p-4 sm:px-6 text-slate-400">Often obfuscated inside web chat frames</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-medium text-white">1-Click External Model Launch</td>
                  <td className="p-4 sm:px-6 flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400" /> Direct launch into Claude, ChatGPT, Gemini
                  </td>
                  <td className="p-4 sm:px-6 text-slate-400">Internal proprietary web UI only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Use-Case Analysis */}
        <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Why Engineers Prefer Promptory
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When diagnosing database bottlenecks, writing unit tests, or configuring CI/CD pipelines, engineers need structured system constraints rather than conversational roleplay bots. Promptory isolates the raw prompt logic for immediate copy or IDE integration.
            </p>
            <div className="pt-2">
              <Link
                href="/directory"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Browse verified workflows <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> When FlowGPT is Useful
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FlowGPT is tailored for casual users looking to interact directly with pre-configured chat characters, creative conversational bots, and community-voted fiction scenarios directly in the browser.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
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
