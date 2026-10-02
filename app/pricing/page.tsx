'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const isVipFounder = user?.email?.toLowerCase() === 'mantupatra23@gmail.com';

  // Lemon Squeezy checkout URLs (Set in Vercel or replace with your store checkout link)
  const checkoutUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL || 'https://promptory.lemonsqueezy.com/buy';

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* VIP Founder Banner */}
        {isVipFounder && (
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-4 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
            <span>👑</span>
            <span>
              <strong>VIP Founder Account Active ({user?.email}):</strong> You have permanent lifetime access to all Pro features, pipelines, and models.
            </span>
          </div>
        )}

        {/* Pricing Header */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <span>⚡</span> 380+ Battle-Tested Blueprints • 10+ Multi-Step Chained Pipelines
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Predictable Pricing for <span className="text-emerald-400">High-Fidelity AI</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-400 leading-relaxed">
            Eliminate prompt trial-and-error. Unlock deterministic multi-step pipelines, anti-hallucination constraints, and instant IDE rule configs.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-[#0f141f] border border-gray-800 p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                  SAVE 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">

          {/* Plan 1: Community Free */}
          <div className="bg-[#0c1017] border border-gray-800/80 rounded-3xl p-7 sm:p-9 flex flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Community</h3>
                  <p className="text-xs text-gray-400 mt-1">For exploration and casual prompting.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-800 text-gray-300">
                  Free Forever
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-gray-400">/ forever</span>
              </div>

              <div className="space-y-3 pt-2 text-xs text-gray-300 border-t border-gray-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Access to <strong>380+ Community Prompts</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Access to <strong>4 Free Multi-Step Workflows</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Phase 1 Free</strong> on all 6 Pro Pipelines</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>1-Click Launch to ChatGPT, Claude & DeepSeek</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500">
                  <span>✕</span>
                  <span className="line-through">Phase 2, 3 & 4 on Pro Pipelines</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500">
                  <span>✕</span>
                  <span className="line-through">Strict Negative Constraints & Boundary Locks</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500">
                  <span>✕</span>
                  <span className="line-through">.cursorrules & Windsurf IDE Sync</span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="w-full py-3 rounded-xl text-xs font-bold text-center border border-gray-700 bg-gray-900/60 hover:bg-gray-800 text-white transition-all block"
            >
              Start Browsing Free &rarr;
            </Link>
          </div>

          {/* Plan 2: Pro Developer */}
          <div className="relative bg-gradient-to-b from-[#0f1726] to-[#0a0f1a] border-2 border-emerald-500/80 rounded-3xl p-7 sm:p-9 flex flex-col justify-between space-y-8 shadow-2xl shadow-emerald-950/40">
            {/* Top Popular Badge */}
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-black shadow-lg shadow-emerald-500/30">
              RECOMMENDED FOR DEVELOPERS
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Pro Developer</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      PRO
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Full sequential pipeline chaining & production guardrails.</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">
                  {billingCycle === 'monthly' ? '₹799' : '₹599'}
                </span>
                <span className="text-xs text-gray-400">
                  / month {billingCycle === 'annual' && '(billed ₹7,188/yr)'}
                </span>
                <span className="text-[11px] text-gray-500">(~$9 USD)</span>
              </div>

              <div className="space-y-3 pt-2 text-xs text-gray-200 border-t border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Full 4-Phase Access</strong> on all 10+ Multi-Step Pipelines</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Zero-Hallucination Guardrails</strong> & Negative Boundaries</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Full Production Code Rewrite</strong> & Security Blueprints</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Instant <strong>.cursorrules & .windsurfrules</strong> IDE Sync</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Automated <strong>PR Description & Unit Test</strong> Generators</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Frontier Model Interop (Claude 3.5 Sonnet, DeepSeek R1, GPT-4o)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Priority Custom Workflow Requests (24h turnaround)</span>
                </div>
              </div>
            </div>

            {isVipFounder ? (
              <div className="w-full py-3.5 rounded-xl text-xs font-bold text-center bg-emerald-500 text-black shadow-lg shadow-emerald-500/30">
                VIP Access Active (Lifetime Free)
              </div>
            ) : (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-extrabold text-center bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/30 transition-all block transform active:scale-[0.99]"
              >
                Upgrade to Pro ({billingCycle === 'monthly' ? '₹799/mo' : '₹599/mo'}) &rarr;
              </a>
            )}
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="bg-[#0a0e16] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Full Feature Comparison</h3>
            <p className="text-xs text-gray-400">Everything transparent. No hidden charges.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="py-3 px-4 font-semibold">Capability</th>
                  <th className="py-3 px-4 font-semibold text-center">Community Free</th>
                  <th className="py-3 px-4 font-semibold text-center text-emerald-400">Pro Developer (₹799)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Single System Prompts Directory</td>
                  <td className="py-3 px-4 text-center">380+ Prompts</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">380+ with Full Blueprints</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Multi-Step Sequential AI Workflows</td>
                  <td className="py-3 px-4 text-center">Phase 1 Only</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">All 4 Phases Unlocked</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Multi-Hub Workbench Access</td>
                  <td className="py-3 px-4 text-center">Limited</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">All 5 Hubs Unrestricted</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Negative Boundary Constraints & Schema Locks</td>
                  <td className="py-3 px-4 text-center text-gray-500">Locked</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">Full Zero-Hallucination Rules</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">IDE Integration (.cursorrules / .windsurf)</td>
                  <td className="py-3 px-4 text-center text-gray-500">Manual Copy</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">1-Click Config Download</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Frontier Reasoning Export (Claude, DeepSeek, GPT)</td>
                  <td className="py-3 px-4 text-center">Basic</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">Instant Deep Context Chaining</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Priority Custom Workflow Submissions</td>
                  <td className="py-3 px-4 text-center text-gray-500">—</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">Included (24h Delivery)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Lemon Squeezy Trust & Billing FAQs */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Billing & Guarantee FAQs</h3>
            <p className="text-xs text-gray-400">Everything you need to know about payment processing and security.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0b0f17] border border-gray-800 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white">How does payment processing work?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Payments are securely handled by Lemon Squeezy, our global Merchant of Record. We support Credit/Debit cards, UPI, Apple Pay, Google Pay, and Net Banking across 130+ currencies.
              </p>
            </div>

            <div className="bg-[#0b0f17] border border-gray-800 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white">Can I cancel my subscription anytime?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Yes. You can cancel your subscription with 1-click at any time from your customer billing portal. You will retain full Pro access until the end of your billing cycle.
              </p>
            </div>

            <div className="bg-[#0b0f17] border border-gray-800 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white">How do Multi-Step Workflows unlock?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                As soon as your Lemon Squeezy payment completes, our webhook immediately updates your account state. All locked phases (Phase 2, 3, 4) unlock in real-time across all hubs.
              </p>
            </div>

            <div className="bg-[#0b0f17] border border-gray-800 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white">Is there an invoice for tax/business expense?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Yes. Lemon Squeezy automatically issues a compliant GST / VAT invoice to your email with your business details, ready for company expense reimbursement.
              </p>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-400 border-t border-gray-800/80">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">🔒</span>
              <span>256-bit SSL Bank-Grade Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">⚡</span>
              <span>Instant Automatic Account Activation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">🛡️</span>
              <span>Lemon Squeezy Merchant of Record Protection</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
