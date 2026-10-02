'use client';

import React, { useState } from 'react';

const FAQS = [
  {
    q: 'How does the automated Production Quality Score work?',
    a: 'Our real-time scoring engine evaluates your prompt across 5 dimensions (20 pts each): Specificity, Context depth, Structural formatting, Actionability, and Clarity. Blueprints scoring 80+ are immediately verified and published to the live directory.',
  },
  {
    q: 'How do dynamic variables like [TARGET_GOAL] work?',
    a: 'When you wrap words in square brackets (e.g., [CODE_SNIPPET], [TECH_STACK]), Promptory automatically generates interactive input boxes for users on the prompt page. This allows engineers to customize variables in real time without manually editing prompt text.',
  },
  {
    q: 'Who owns the intellectual property of submitted blueprints?',
    a: 'You retain full author attribution. Blueprints submitted to Promptory Community are shared under open developer terms, enabling the global engineering community to use, fork, and test them across frontier models.',
  },
  {
    q: 'How can my prompt get featured on the homepage or workflows?',
    a: 'Prompts with a 95+ quality score, clean negative constraint boundaries, and proven model execution telemetry are reviewed weekly by our team for promotion to the Featured Carousel and Multi-Step Chained Workflows.',
  },
  {
    q: 'What are negative constraints and why are they required?',
    a: 'Negative constraints tell the LLM what NOT to do (e.g., "DO NOT return conversational preambles", "Zero mock placeholders", "Enforce strict typed JSON"). They eliminate 99% of hallucinations and are essential for production-grade system prompts.',
  },
];

export default function SubmitGuideAndFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-12 pt-8 border-t border-gray-800/80">
      {/* How to Use / Submission Guidelines */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span>📖</span> Blueprint Architecture Guide
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            How to Submit a High-Fidelity Blueprint
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Promptory does not accept generic, single-line prompts. Follow these 3 architectural standards to achieve a 90+ quality score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h4 className="text-sm font-bold text-white">Define Exact Persona & Objective</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Start with a concrete authority role (e.g., <em>"Act as a Principal Rust Systems Engineer"</em>). State the operational scope, expected output standard, and target production environment.
            </p>
          </div>

          <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h4 className="text-sm font-bold text-white">Inject Dynamic Parameters</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tag customizable fields with square brackets like <code className="text-emerald-400 font-mono text-[11px]">[CODE_SNIPPET]</code> or <code className="text-emerald-400 font-mono text-[11px]">[TARGET_GOAL]</code>. This makes your template reusable for hundreds of developers.
            </p>
          </div>

          <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h4 className="text-sm font-bold text-white">Enforce Negative Boundaries</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Always append strict failure gates: <em>"Zero conversational commentary", "Return only valid RFC-compliant JSON", "Fail closed if required inputs are missing"</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Blueprint Scoring Telemetry Breakdown */}
      <div className="bg-[#0a0e16] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white">Automated Quality Engine Checklist</h4>
            <p className="text-xs text-gray-400">Prompts need 80/100 points to bypass manual review and publish instantly.</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
            Threshold: 80+ Points
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="bg-[#0f141f] border border-gray-800/60 rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-white">Specificity</div>
            <div className="text-[11px] text-gray-400 mt-1">20 Points</div>
          </div>
          <div className="bg-[#0f141f] border border-gray-800/60 rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-white">Context Depth</div>
            <div className="text-[11px] text-gray-400 mt-1">20 Points</div>
          </div>
          <div className="bg-[#0f141f] border border-gray-800/60 rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-white">Structure</div>
            <div className="text-[11px] text-gray-400 mt-1">20 Points</div>
          </div>
          <div className="bg-[#0f141f] border border-gray-800/60 rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-white">Actionability</div>
            <div className="text-[11px] text-gray-400 mt-1">20 Points</div>
          </div>
          <div className="bg-[#0f141f] border border-gray-800/60 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-xs font-bold text-white">Clarity</div>
            <div className="text-[11px] text-gray-400 mt-1">20 Points</div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-white">Blueprint Submission FAQs</h3>
          <p className="text-xs text-gray-400">Everything you need to know about publishing to Promptory.</p>
        </div>

        <div className="space-y-2.5 max-w-3xl mx-auto">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#0c1017] border border-gray-800/90 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 hover:bg-gray-800/30 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-white">{faq.q}</span>
                  <span className="text-emerald-400 text-sm font-mono shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-gray-400 leading-relaxed border-t border-gray-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
