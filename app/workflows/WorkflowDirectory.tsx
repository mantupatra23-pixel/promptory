'use client';

import React, { useState, useMemo } from 'react';
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

const HUBS = [
  { id: 'all', label: 'All Hubs', icon: '🌐' },
  { id: 'Engineering', label: 'Engineering Hub', icon: '⚙️' },
  { id: 'AI Engineering', label: 'AI Systems Hub', icon: '🤖' },
  { id: 'DevOps', label: 'DevOps & Security Hub', icon: '🛡️' },
  { id: 'Sales & Marketing', label: 'Growth Hub', icon: '📈' },
  { id: 'SEO & Content', label: 'SEO Engine Hub', icon: '🎯' },
];

export default function WorkflowDirectory({ initialWorkflows }: { initialWorkflows: Workflow[] }) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [activeHub, setActiveHub] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<boolean>(false);

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

  const filteredWorkflows = useMemo(() => {
    return initialWorkflows.filter((wf) => {
      const matchesHub =
        activeHub === 'all' || wf.category?.toLowerCase() === activeHub.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' ||
        wf.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.target_role?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesHub && matchesSearch;
    });
  }, [initialWorkflows, activeHub, searchQuery]);

  const extractVariables = (promptText: string): string[] => {
    const matches = promptText.match(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, '').trim())));
  };

  const currentSteps = selectedWorkflow ? parseSteps(selectedWorkflow) : [];
  const currentStep = currentSteps[activeStepIdx] || null;

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
      {/* Search & Hub Navigation Bar */}
      <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pipelines by architecture, role, or stack (e.g., PostgreSQL, LangGraph, DevOps)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#070a0f] border border-gray-800 focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-gray-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Hub Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {HUBS.map((hub) => {
            const count =
              hub.id === 'all'
                ? initialWorkflows.length
                : initialWorkflows.filter(
                    (w) => w.category?.toLowerCase() === hub.id.toLowerCase()
                  ).length;

            return (
              <button
                key={hub.id}
                onClick={() => setActiveHub(hub.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeHub === hub.id
                    ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20'
                    : 'bg-[#121824] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                <span>{hub.icon}</span>
                <span>{hub.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeHub === hub.id ? 'bg-black/20 text-black' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hub Status Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-gray-400">
          Showing <span className="text-emerald-400 font-bold">{filteredWorkflows.length}</span> pipelines in{' '}
          <strong className="text-white font-medium capitalize">
            {HUBS.find((h) => h.id === activeHub)?.label || 'All Hubs'}
          </strong>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span>Frontier Verified: Claude 3.5 • GPT-4o • DeepSeek R1</span>
        </div>
      </div>

      {/* Hub Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkflows.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#0a0e14] border border-gray-800 rounded-2xl">
            <p className="text-sm text-gray-400">No pipelines match your search filter.</p>
            <button
              onClick={() => {
                setActiveHub('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-emerald-400 underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredWorkflows.map((wf) => {
            const steps = parseSteps(wf);
            const score = wf.quality_score || 98;

            return (
              <div
                key={wf.id}
                className="bg-[#0f141f] border border-gray-800/90 hover:border-emerald-500/50 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between group shadow-xl hover:shadow-emerald-950/20"
              >
                <div className="space-y-3.5">
                  {/* Card Header Top */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {wf.category || 'Engineering'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 bg-gray-900 border border-emerald-500/20 px-2 py-0.5 rounded">
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

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {wf.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {wf.description}
                    </p>
                  </div>

                  {/* Mini Pipeline Flow Preview */}
                  <div className="pt-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
                      Phases ({steps.length})
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {steps.map((st, i) => (
                        <div
                          key={i}
                          className="bg-[#080b11] border border-gray-800/80 px-2 py-0.5 rounded text-[10px] text-gray-300 truncate max-w-[90px]"
                        >
                          {st.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-gray-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-500 truncate max-w-[120px]">
                    {wf.target_role}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWorkflow(wf);
                      setActiveStepIdx(0);
                      setVariables({});
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1"
                  >
                    <span>Launch</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Workbench Modal (Fully Functional) */}
      {selectedWorkflow && currentStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0b0f17] border border-gray-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Workbench Header */}
            <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#080b11] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    HUB WORKBENCH
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

            {/* Stepper Navigation */}
            <div className="bg-[#0e131d] px-4 py-2.5 border-b border-gray-800/80 flex items-center gap-2 overflow-x-auto">
              {currentSteps.map((st, i) => {
                const isActive = i === activeStepIdx;
                const isPassed = i < activeStepIdx;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveStepIdx(i)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
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

            {/* Workbench Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="bg-[#121824] border border-gray-800 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-400">
                    PHASE {currentStep.step_number || activeStepIdx + 1} OF {currentSteps.length}
                  </span>
                  <span className="text-gray-500">Chained Output</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{currentStep.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{currentStep.goal}</p>
              </div>

              {extractVariables(currentStep.prompt || '').length > 0 && (
                <div className="space-y-2 bg-[#0d121a] border border-gray-800/80 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                    <span>⚡</span> Custom Variables
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {extractVariables(currentStep.prompt || '').map((varName) => (
                      <div key={varName}>
                        <label className="text-[10px] font-mono text-gray-400 block mb-1">
                          {`{{${varName}}}`}
                        </label>
                        <input
                          type="text"
                          placeholder={`Enter ${varName}...`}
                          value={variables[varName] || ''}
                          onChange={(e) =>
                            setVariables({ ...variables, [varName]: e.target.value })
                          }
                          className="w-full bg-[#070a0f] border border-gray-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Compiled Phase Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(getCompiledPrompt())}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors flex items-center gap-1"
                  >
                    {copied ? '✓ Copied' : '📋 Copy Prompt'}
                  </button>
                </div>
                <div className="bg-[#05070a] border border-gray-800 rounded-xl p-3.5 font-mono text-xs text-emerald-300/90 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {getCompiledPrompt()}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-gray-400">Quick Launch:</span>
                <a
                  href={`https://chatgpt.com/?q=${encodeURIComponent(getCompiledPrompt())}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg text-xs bg-[#161d2b] border border-gray-800 text-gray-300 hover:text-white"
                >
                  ChatGPT ↗
                </a>
                <a
                  href="https://claude.ai/new"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleCopy(getCompiledPrompt())}
                  className="px-2.5 py-1 rounded-lg text-xs bg-[#161d2b] border border-gray-800 text-gray-300 hover:text-white"
                >
                  Claude ↗
                </a>
              </div>
            </div>

            {/* Workbench Footer */}
            <div className="p-3.5 border-t border-gray-800 bg-[#080b11] flex items-center justify-between">
              <button
                type="button"
                disabled={activeStepIdx === 0}
                onClick={() => setActiveStepIdx((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                &larr; Prev
              </button>
              <div className="flex items-center gap-2">
                {activeStepIdx < currentSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStepIdx((prev) => prev + 1)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20"
                  >
                    Next Phase &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedWorkflow(null)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    Done ✓
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
