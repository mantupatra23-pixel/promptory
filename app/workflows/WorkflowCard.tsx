'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WorkflowCard({ wf }: { wf: any }) {
  const [selectedStep, setSelectedStep] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Safe parsing of steps
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

  const qualityScore = wf.quality_score || 98;
  const targetRole = wf.target_role || 'Developer & Founder';
  const estimatedTime = wf.estimated_time || '5-10 mins';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="border border-gray-800 hover:border-gray-700 bg-[#0f141c]/90 rounded-2xl p-6 sm:p-8 transition-all duration-200 shadow-xl">
        {/* Meta Top */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {wf.category || 'Engineering'}
              </span>
              <span className="text-xs text-gray-400">Target: {targetRole}</span>
              <span className="text-xs text-gray-500">• {estimatedTime}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white pt-1">{wf.title}</h2>
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

        <p className="text-sm text-gray-300 py-4 leading-relaxed">{wf.description}</p>

        {/* Steps Pipeline View */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
              Execution Steps ({stepsList.length} Phases)
            </h3>
            <span className="text-[11px] text-gray-400 italic">Tap any phase to view & execute prompt</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stepsList.map((step: any, idx: number) => (
              <div
                key={idx}
                onClick={() => setSelectedStep(step)}
                className="group bg-[#0b0e14] border border-gray-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500 hover:bg-[#111722] cursor-pointer transition-all duration-200 transform active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                      PHASE {step.step_number || idx + 1}
                    </span>
                    <span className="text-[10px] text-gray-400">Click to Open</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{step.goal}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-800/50 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-gray-500">Chained Output</span>
                  <span className="text-emerald-400 font-mono font-medium group-hover:translate-x-1 transition-transform">
                    Execute &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Modal for Selected Phase */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f141c] border border-gray-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#0b0e14]">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  PHASE {selectedStep.step_number}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedStep.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selectedStep.goal}</p>
              </div>
              <button
                onClick={() => setSelectedStep(null)}
                className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 flex items-center justify-center transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Prompt Display */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Chained Phase Prompt:
                </span>
                <button
                  onClick={() => handleCopy(selectedStep.prompt)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 transition-all flex items-center gap-1.5"
                >
                  {copied ? '✓ Copied to Clipboard!' : '📋 Copy Phase Prompt'}
                </button>
              </div>

              <div className="bg-[#07090d] border border-gray-800 rounded-xl p-4 font-mono text-xs text-gray-200 whitespace-pre-wrap leading-relaxed">
                {selectedStep.prompt || 'No prompt content configured for this phase.'}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-800 bg-[#0b0e14] flex justify-end gap-3">
              <button
                onClick={() => setSelectedStep(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleCopy(selectedStep.prompt)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
              >
                {copied ? 'Copied!' : 'Copy & Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
