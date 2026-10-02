'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WorkflowCard({ wf }: { wf: any }) {
  // Safe steps extraction
  let stepsList: any[] = [];
  if (Array.isArray(wf.steps)) {
    stepsList = wf.steps;
  } else if (typeof wf.steps === 'string') {
    try {
      stepsList = JSON.parse(wf.steps);
    } catch {
      stepsList = [];
    }
  }

  // Active step state (defaults to Phase 1)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const activeStep = stepsList[activeStepIndex] || null;
  const qualityScore = wf.quality_score || 98;
  const targetRole = wf.target_role || 'Developer & Founder';
  const estimatedTime = wf.estimated_time || '5-10 mins';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-800/80 bg-[#0f141c]/90 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/80 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {wf.category || 'Engineering'}
            </span>
            <span className="text-xs text-gray-400">Target: {targetRole}</span>
            <span className="text-xs text-gray-500">• {estimatedTime}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{wf.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-gray-900 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            {qualityScore}/100 Score
          </div>
          {wf.is_pro ? (
            <Link
              href="/pricing"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:opacity-95 shadow-lg shadow-amber-500/20"
            >
              ⚡ Unlock Pro
            </Link>
          ) : (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Free Pipeline
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed">{wf.description}</p>

      {/* Phase Selection Steppers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Pipeline Steps ({stepsList.length} Phases)
          </span>
          <span className="text-[11px] text-gray-400">Tap step to inspect & copy prompt</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stepsList.map((step: any, idx: number) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`text-left rounded-xl p-3.5 border transition-all duration-200 ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                    : 'border-gray-800 bg-[#0b0e14] hover:border-gray-700 hover:bg-[#111722]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isActive
                        ? 'bg-emerald-500 text-black'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    PHASE {step.step_number || idx + 1}
                  </span>
                  {isActive && (
                    <span className="text-[10px] text-emerald-400 font-semibold animate-pulse">● Active</span>
                  )}
                </div>
                <h4 className={`text-xs font-semibold line-clamp-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Phase Runner Panel (Inline, Zero-Modal) */}
      {activeStep && (
        <div className="bg-[#080b0f] border border-gray-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  PHASE {activeStep.step_number || activeStepIndex + 1}:
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">{activeStep.title}</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">{activeStep.goal}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(activeStep.prompt)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1.5"
              >
                {copied ? '✓ Copied' : '📋 Copy Prompt'}
              </button>

              {activeStepIndex < stepsList.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStepIndex((prev) => prev + 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 bg-gray-800/80 text-gray-200 hover:bg-gray-700 transition-colors"
                >
                  Next Phase &rarr;
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <pre className="font-mono text-xs text-emerald-300/90 bg-[#040608] p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-gray-800/70">
              {activeStep.prompt || 'No prompt configured.'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
