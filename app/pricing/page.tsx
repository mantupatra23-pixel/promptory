'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getCheckoutUrl, DEFAULT_CHECKOUT_URL } from '@/lib/checkout';
import { Check, Zap, Sparkles, Terminal, ArrowRight, Flame, Clock } from 'lucide-react';

export default function PricingPage() {
  const [checkoutUrl, setCheckoutUrl] = useState(DEFAULT_CHECKOUT_URL);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setCheckoutUrl(getCheckoutUrl(session.user.email));
      }
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-slate-100 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>377+ Production Blueprints &bull; Fresh Prompts Added Daily</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Supercharge Your AI Workflow
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Production prompts, multi-model dual benchmarking, and IDE sync built for engineers and founders.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
        {/* FREE PLAN */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#161B22] border border-[#30363D] flex flex-col justify-between space-y-6 shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Community</span>
              <span className="text-xs font-mono text-slate-500">Free forever</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white">₹0</span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ideal for developers exploring tested system prompts and casual execution testing.
            </p>

            <div className="border-t border-[#30363D] pt-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Access all <strong className="text-white">377+ prompt blueprints</strong>{' '}
                  <span className="text-[11px] text-emerald-400 font-mono">(Updated daily)</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Basic simulator execution (GPT-OSS 20B)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click copy to ChatGPT, Claude, and Gemini</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Single model simulation tests</span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 border border-[#30363D] transition block"
          >
            Start Browsing Free
          </Link>
        </div>

        {/* PRO PLAN */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#161B22] border-2 border-emerald-500/60 relative flex flex-col justify-between space-y-6 shadow-xl shadow-emerald-950/20">
          <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
            <Zap className="w-3 h-3 fill-black" />
            <span>Recommended</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pro Developer</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                All Features
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white">₹799</span>
              <span className="text-xs text-slate-400 ml-1">/ month (~$9 USD)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full reasoning telemetry, dual-view benchmarks, and CLI syncing for high-output engineering teams.
            </p>

            <div className="border-t border-[#30363D] pt-4 space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">
                  Early access to daily production prompt drops
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Parallel Dual-Model Comparison Simulator</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited GPT-OSS 120B &amp; DeepSeek-R1 deep reasoning runs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant .cursorrules &amp; .windsurfrules IDE config sync</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Developer CLI License Key included</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-medium">Request custom prompts (24-hour turnaround)</span>
              </div>
            </div>
          </div>

          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>Upgrade to Pro (₹799/mo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Feature Highlight Matrix */}
      <div className="border border-[#30363D] bg-[#0D1117] rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Why Developers Choose Promptory Pro</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] space-y-1.5">
            <span className="font-bold text-cyan-400">Zero Hallucination Telemetry</span>
            <p className="text-slate-400 leading-relaxed">
              Detect boundary regressions across LLMs before pushing prompts to production agents.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] space-y-1.5">
            <span className="font-bold text-emerald-400">IDE Integration</span>
            <p className="text-slate-400 leading-relaxed">
              Sync system prompts straight into Cursor, VS Code, and Claude projects via CLI automation.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] space-y-1.5">
            <span className="font-bold text-amber-400">Daily Production Drops</span>
            <p className="text-slate-400 leading-relaxed">
              Battle-tested prompts refreshed daily across latest frontier model releases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
