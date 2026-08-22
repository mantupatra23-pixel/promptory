import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Target, ShieldCheck, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Promptory',
  description: 'Learn about Promptory and our curated AI prompt engineering mission.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="border-b border-[#30363D] pb-6">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">About Promptory</h1>
        <p className="text-xs text-slate-400 mt-1">Empowering engineers and builders with battle-tested AI workflows.</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">What is Promptory?</h2>
          <p>
            Promptory is an open AI system prompt and chained workflow directory engineered for developers, technical founders, and operators. Instead of generic conversational queries, we build deterministic, parameterized system instructions with real-time quality auditing.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white">Zero Guesswork</h3>
            <p className="text-xs text-slate-400">Interactive variables replace boilerplate prompt writing with structured forms.</p>
          </div>
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white">Quality Audited</h3>
            <p className="text-xs text-slate-400">Every prompt is scored across 5 dimensions to eliminate hallucinations.</p>
          </div>
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white">1-Click Launch</h3>
            <p className="text-xs text-slate-400">Export as .cursorrules or launch directly into Claude, ChatGPT, and Gemini.</p>
          </div>
        </div>

        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">Get in Touch</h2>
          <p>
            Have ideas, partnerships, or suggestions? Reach out directly to the team at:
          </p>
          <p className="font-mono text-emerald-400 font-semibold">
            mantupatra23@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
