'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Step {
  step_number: number;
  title: string;
  goal: string;
  prompt: string;
}

interface Workflow {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  target_role: string;
  estimated_time: string;
  is_pro: boolean;
  quality_score: number;
  steps: Step[] | string;
}

export default function WorkflowDirectory({ initialWorkflows }: { initialWorkflows: Workflow[] }) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<boolean>(false);

  // Parse steps safely
  const parseSteps = (wf: Workflow): Step[] => {
    if (Array.isArray(wf.steps)) return wf.steps;
    if (typeof wf.steps === 'string') {
      try {
        return JSON.parse(wf.steps);
      } catch {
        return [];
      }
    }
    return [];
  };

  const categories = ['all', ...Array.from(new Set(initialWorkflows.map((w) => w.category).filter(Boolean)))];

  const filtered = initialWorkflows.filter((w) => {
    if (filterCategory === 'all') return true;
    return w.category?.toLowerCase() === filterCategory.toLowerCase();
  });

  // Extract {{variable}} tags from prompt text
  const extractVariables = (promptText: string): string[] => {
    const matches = promptText.match(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, '').trim())));
  };

  const currentSteps = selectedWorkflow ? parseSteps(selectedWorkflow) : [];
  const currentStep = currentSteps[activeStepIdx] || null;

  // Substitute variables into compiled prompt
  const getCompiledPrompt = () => {
    if (!currentStep) return '';
    let text = currentStep.prompt || '';
    Object.entries(variables).forEach(([key, val]) => {
      if (val) {
        text = text.replaceAll(`{{${key}}}`, val);
      }
    });
    return text;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterCategory === cat
                ? 'bg-emerald-500 text-black font-semibold shadow-lg shadow-emerald-500/20'
                : 'bg-[#121721] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {cat === 'all' ? 'All Pipelines' : cat}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((wf) => {
          const steps = parseSteps(wf);
          const score = wf.quality_score || 98;

          return (
            <div
              key={wf.id}
              className="bg-[#0f141f] border border-gray-800/90 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {wf.category || 'Engineering'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400 bg-gray-900 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {score}/100
                    </span>
                    {wf.is_pro ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        PRO
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-300">
                        FREE
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {wf.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {wf.description}
                  </p>
                </div>

                {/* Visual Pipeline Connector */}
                <div className="pt-2">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2">
                    Pipeline Flow ({steps.length} Steps)
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {steps.map((st, i) => (
                      <React.Fragment key={i}>
                        <div className="flex items-center gap-1.5 bg-[#080b11] border border-gray-800 px-2.5 py-1 rounded-lg shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span className="text-[11px] font-medium text-gray-300 max-w-[110px] truncate">
                            {st.title}
                          </span>
                        </div>
                        {i < steps.length - 1 && (
                          <span className="text-gray-600 text-xs shrink-0">&rarr;</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-6 mt-6 border-t border-gray-800/80 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Target: <strong className="text-gray-400 font-normal">{wf.target_role}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedWorkflow(wf);
                    setActiveStepIdx(0);
                    setVariables({});
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Launch Pipeline</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Studio Modal / Workbench */}
      {selectedWorkflow && currentStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0b0f17] border border-gray-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Studio Header */}
            <div className="p-5 border-b border-gray-800 bg-[#080b11] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    PIPELINE WORKBENCH
                  </span>
                  <span className="text-xs text-gray-500">• {selectedWorkflow.estimated_time}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                  {selectedWorkflow.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWorkflow(null)}
                className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stepper Navigation Bar */}
            <div className="bg-[#0e131d] px-5 py-3 border-b border-gray-800/80 flex items-center gap-2 overflow-x-auto">
              {currentSteps.map((st, i) => {
                const isActive = i === activeStepIdx;
                const isPassed = i < activeStepIdx;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveStepIdx(i)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                      isActive
                        ? 'bg-emerald-500 text-black font-bold'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#151b27] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span>{isPassed ? '✓' : i + 1}.</span>
                    <span className="max-w-[120px] truncate">{st.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Studio Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Step Summary */}
              <div className="bg-[#121824] border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    PHASE {currentStep.step_number || activeStepIdx + 1} OF {currentSteps.length}
                  </span>
                  <span className="text-[11px] text-gray-500">Chained Execution</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{currentStep.title}</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{currentStep.goal}</p>
              </div>

              {/* Dynamic Variables Input Section */}
              {extractVariables(currentStep.prompt || '').length > 0 && (
                <div className="space-y-3 bg-[#0d121a] border border-gray-800/80 rounded-xl p-4">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡</span> Inject Custom Variables
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {extractVariables(currentStep.prompt || '').map((varName) => (
                      <div key={varName} className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400 block">
                          {`{{${varName}}}`}
                        </label>
                        <input
                          type="text"
                          placeholder={`Enter ${varName}...`}
                          value={variables[varName] || ''}
                          onChange={(e) =>
                            setVariables({ ...variables, [varName]: e.target.value })
                          }
                          className="w-full bg-[#070a0f] border border-gray-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compiled Prompt Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Compiled Phase Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(getCompiledPrompt())}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    {copied ? '✓ Copied' : '📋 Copy Prompt'}
                  </button>
                </div>

                <div className="bg-[#05070a] border border-gray-800 rounded-xl p-4 font-mono text-xs text-emerald-300/90 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {getCompiledPrompt()}
                </div>
              </div>

              {/* Direct Open in AI Engine */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-gray-400 block mb-2">
                  Launch In Frontier Models:
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://chatgpt.com/?q=${encodeURIComponent(getCompiledPrompt())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs bg-[#161d2b] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white transition-colors"
                  >
                    ChatGPT ↗
                  </a>
                  <a
                    href="https://claude.ai/new"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleCopy(getCompiledPrompt())}
                    className="px-3 py-1.5 rounded-lg text-xs bg-[#161d2b] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white transition-colors"
                  >
                    Claude (Auto-Copy) ↗
                  </a>
                  <a
                    href="https://chat.deepseek.com/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleCopy(getCompiledPrompt())}
                    className="px-3 py-1.5 rounded-lg text-xs bg-[#161d2b] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white transition-colors"
                  >
                    DeepSeek R1 ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Studio Footer */}
            <div className="p-4 border-t border-gray-800 bg-[#080b11] flex items-center justify-between">
              <button
                type="button"
                disabled={activeStepIdx === 0}
                onClick={() => setActiveStepIdx((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                &larr; Previous Phase
              </button>

              <div className="flex items-center gap-2">
                {activeStepIdx < currentSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStepIdx((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Next Phase</span>
                    <span>&rarr;</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedWorkflow(null)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  >
                    Pipeline Finished ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
