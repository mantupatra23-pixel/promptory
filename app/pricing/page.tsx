'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const isVipFounder = user?.email?.toLowerCase() === 'mantupatra23@gmail.com';

  // Base Lemon Squeezy live checkout URL
  const baseCheckoutUrl =
    process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL ||
    'https://promptory-ai.lemonsqueezy.com/checkout/buy/750e2a22-3cc6-45fe-9b40-b4549cd38f8c';

  // Logged-in user ka email checkout link me auto-attach karein
  const finalCheckoutUrl = useMemo(() => {
    if (!user?.email) return baseCheckoutUrl;
    const cleanEmail = encodeURIComponent(user.email.trim());
    const separator = baseCheckoutUrl.includes('?') ? '&' : '?';
    return `${baseCheckoutUrl}${separator}checkout[email]=${cleanEmail}`;
  }, [baseCheckoutUrl, user]);

  const faqs = [
    {
      q: 'How does instant Pro activation work?',
      a: 'The moment your payment completes on Lemon Squeezy, our automated webhook receives the event and upgrades your Supabase account state in real-time. Within 3 seconds, all locked blueprints, multi-step workflow phases, and CLI exports unlock automatically without manual intervention.'
    },
    {
      q: 'What payment methods are supported in India and worldwide?',
      a: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, Mastercard, RuPay, Amex), Net Banking, and Apple Pay through Lemon Squeezy, our global Merchant of Record.'
    },
    {
      q: 'Can I use these prompts and workflows in commercial products?',
      a: 'Yes, 100%. All prompts, system guardrails, negative constraints, and .cursorrules configurations downloaded from Promptory come with full commercial rights. You can ship them directly into production codebases and client deliverables.'
    },
    {
      q: 'Can I cancel my subscription anytime?',
      a: 'Yes. You can cancel your subscription at any time with 1 click from your account dashboard or the Lemon Squeezy billing portal. There are no questions asked, and you keep Pro access until the current billing cycle finishes.'
    },
    {
      q: 'Do you offer an invoice for company/tax expense?',
      a: 'Yes. Lemon Squeezy automatically generates a compliant GST / VAT tax invoice immediately after payment, complete with your company name, address, and tax ID for corporate expense reimbursement.'
    },
    {
      q: 'What is the 7-day money-back guarantee?',
      a: 'Try Promptory Pro risk-free for 7 days. If you find the production blueprints or multi-step workflows do not improve your AI output fidelity, email our support for a full refund.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* VIP Founder Banner */}
        {isVipFounder && (
          <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/25 to-emerald-500/15 border border-emerald-500/50 rounded-2xl p-4 text-center text-xs text-emerald-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40">
            <span className="text-base">👑</span>
            <span>
              <strong>VIP Founder Account Active ({user?.email}):</strong> You have permanent lifetime access to all Pro features, pipelines, and models for free.
            </span>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold shadow-inner">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Launch Deal • 47% Flat Discount Active</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Stop Guessing Prompts. <br />
            Ship <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-transparent">Deterministic AI</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-base text-gray-400 leading-relaxed font-sans">
            Unlock 380+ battle-tested system prompt blueprints, chained 4-phase workflows, negative constraints, and 1-click IDE rules for Cursor, Windsurf, and Claude.
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Instant automatic unlock within 3 seconds of payment</span>
          </div>
        </div>

        {/* Pricing Cards: Mobile Stacked (Flex Column), Desktop Side-by-Side (Grid) */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">

          {/* Plan 1: Community Free */}
          <div className="bg-[#0c1017] border border-gray-800/90 rounded-3xl p-7 sm:p-9 flex flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Community</h3>
                  <p className="text-xs text-gray-400 mt-1">For basic exploration and casual prompting.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-800 text-gray-300">
                  Free Forever
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-gray-400">/ forever</span>
              </div>

              <div className="space-y-3.5 pt-2 text-xs text-gray-300 border-t border-gray-800/80">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Access to <strong>3 Free Production Prompts</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Access to <strong>4 Free Multi-Step Workflows</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Phase 1 Free</strong> on all 6 Pro Pipelines</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click Launch to ChatGPT, Claude & DeepSeek</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500">
                  <X className="w-4 h-4 text-gray-600 shrink-0" />
                  <span className="line-through">Full Blueprints & Negative Boundary Rules</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500">
                  <X className="w-4 h-4 text-gray-600 shrink-0" />
                  <span className="line-through">CLI Terminal Sync (`npx promptory-cli`)</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500">
                  <X className="w-4 h-4 text-gray-600 shrink-0" />
                  <span className="line-through">.cursorrules & Windsurf IDE File Export</span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="w-full py-3.5 rounded-xl text-xs font-bold text-center border border-gray-700 bg-gray-900/60 hover:bg-gray-800 text-white transition-all block"
            >
              Start Browsing Free &rarr;
            </Link>
          </div>

          {/* Plan 2: Pro Developer (Monthly ₹799 Spotlight) */}
          <div className="relative bg-gradient-to-b from-[#0e1828] via-[#0a101b] to-[#070b12] border-2 border-emerald-500 rounded-3xl p-7 sm:p-9 flex flex-col justify-between space-y-8 shadow-2xl shadow-emerald-500/20 ring-1 ring-emerald-500/50">
            {/* Top Popular Badge */}
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-lg shadow-emerald-500/30 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 fill-black" />
              <span>Recommended for Developers</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Pro Developer</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      PRO
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">Full production guardrails, CLI sync & multi-step pipelines.</p>
                </div>
              </div>

              {/* Price Display: Clean Strikethrough with ₹799 */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-500 line-through text-lg font-bold">
                    ₹1,499
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    ₹799
                  </span>
                  <span className="text-xs text-gray-400">
                    / month
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-mono">
                  ⚡ Less than ₹27/day. Pays for itself on day 1.
                </p>
              </div>

              {/* Pro Feature Bullets */}
              <div className="space-y-3 pt-3 text-xs text-gray-200 border-t border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Unlimited Access to All 380+ Blueprints</strong> (No 3-prompt lock)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Zero-Hallucination Guardrails</strong> & Negative Constraints</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>All 4 Phases Unlocked</strong> on 10+ Multi-Step Pipelines</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Instant <strong>.cursorrules & Windsurf IDE Sync</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Automated <strong>Terminal CLI Sync</strong> (`npx promptory-cli`)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Export to Code:</strong> Python SDK, OpenAI & Claude JSON</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Priority Custom Workflow Requests (24h turnaround)</span>
                </div>
              </div>
            </div>

            {/* High Converting Action CTA */}
            <div className="space-y-2.5">
              {isVipFounder ? (
                <div className="w-full py-4 rounded-xl text-xs font-bold text-center bg-emerald-500 text-black shadow-lg shadow-emerald-500/30">
                  👑 VIP Founder Access Active (Lifetime Free)
                </div>
              ) : (
                <a
                  href={finalCheckoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 rounded-xl text-sm font-extrabold text-center bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Upgrade to Pro Now (₹799/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
              <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400 font-sans">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> 7-Day Money-Back Guarantee
                </span>
                <span>•</span>
                <span>1-Click Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 text-center">
          <div className="p-4 rounded-2xl bg-[#0b0f17] border border-gray-800">
            <div className="text-2xl font-extrabold text-white">2,400+</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Engineers & Founders</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b0f17] border border-gray-800">
            <div className="text-2xl font-extrabold text-emerald-400">380+</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Production Blueprints</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b0f17] border border-gray-800">
            <div className="text-2xl font-extrabold text-cyan-400">99.4%</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Deterministic Accuracy</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b0f17] border border-gray-800">
            <div className="text-2xl font-extrabold text-amber-400">4.9 / 5</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Developer Satisfaction</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white">Loved by Developers Shipping Production AI</h3>
            <p className="text-xs text-gray-400">Here is how engineers use Promptory to eliminate hallucinations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#0b0f17] border border-gray-800/90 rounded-2xl p-5 space-y-3">
              <div className="flex text-amber-400 gap-0.5 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                &ldquo;The negative constraints alone cut our LLM hallucination rate to zero in our Next.js backend. Worth 10x the price.&rdquo;
              </p>
              <div className="text-[11px] text-gray-500 font-semibold">— Senior Backend Dev @ SaaS</div>
            </div>
            <div className="bg-[#0b0f17] border border-gray-800/90 rounded-2xl p-5 space-y-3">
              <div className="flex text-amber-400 gap-0.5 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                &ldquo;1-click export to .cursorrules completely changed how our team writes code with Cursor IDE. Zero manual tweaking needed.&rdquo;
              </p>
              <div className="text-[11px] text-gray-500 font-semibold">— Full-Stack Founder</div>
            </div>
            <div className="bg-[#0b0f17] border border-gray-800/90 rounded-2xl p-5 space-y-3">
              <div className="flex text-amber-400 gap-0.5 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                &ldquo;Multi-step workflows are incredible. Chaining Phase 1 into Phase 4 gives us production-grade unit tests and PR reviews instantly.&rdquo;
              </p>
              <div className="text-[11px] text-gray-500 font-semibold">— AI Systems Engineer</div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="bg-[#0a0e16] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xl">
          <div className="text-center space-y-1">
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
                  <td className="py-3.5 px-4 font-medium text-white">Single System Prompts Directory</td>
                  <td className="py-3.5 px-4 text-center">3 Free Prompts</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">380+ with Full Blueprints</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Multi-Step Sequential AI Workflows</td>
                  <td className="py-3.5 px-4 text-center">Phase 1 Only</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">All 4 Phases Unlocked</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Multi-Hub Workbench Access</td>
                  <td className="py-3.5 px-4 text-center">Limited</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">All 5 Hubs Unrestricted</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Negative Boundary Constraints & Schema Locks</td>
                  <td className="py-3.5 px-4 text-center text-gray-500">Locked</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">Full Zero-Hallucination Rules</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">IDE Integration (.cursorrules / .windsurf)</td>
                  <td className="py-3.5 px-4 text-center text-gray-500">Manual Copy</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">1-Click Config Download</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Terminal CLI Sync (`npx promptory-cli`)</td>
                  <td className="py-3.5 px-4 text-center text-gray-500">Locked</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">Unlimited Direct Sync</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Frontier Reasoning Export (Claude, DeepSeek, GPT)</td>
                  <td className="py-3.5 px-4 text-center">Basic</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">Instant Deep Context Chaining</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Priority Custom Workflow Submissions</td>
                  <td className="py-3.5 px-4 text-center text-gray-500">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">Included (24h Delivery)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="text-center space-y-1 pb-2">
            <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-gray-400">Everything you need to know about activation, payments, and licensing.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#0b0f17] border border-gray-800 rounded-2xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-gray-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Badges Footer Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-gray-400 border-t border-gray-800/80">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">🔒</span>
            <span>256-bit SSL Bank-Grade Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">⚡</span>
            <span>Instant Automatic Webhook Activation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">🛡️</span>
            <span>Lemon Squeezy Merchant of Record Protection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">💳</span>
            <span>UPI, Cards & NetBanking Accepted</span>
          </div>
        </div>

      </div>
    </div>
  );
}
