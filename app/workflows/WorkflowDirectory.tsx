'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isSubscribedPro, setIsSubscribedPro] = useState(false);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [activeHub, setActiveHub] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function checkAccess(currentUser: any) {
      if (!currentUser?.email) {
        setIsSubscribedPro(false);
        return;
      }

      const email = currentUser.email.toLowerCase().trim();

      // 1. VIP Admin: mantupatra23@gmail.com hamesha unlocked
      if (email === 'mantupatra23@gmail.com') {
        setIsSubscribedPro(true);
        return;
      }

      // 2. Paying user check from subscriptions table
      try {
        const { data: sub, error } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_email', email)
          .maybeSingle();

        if (!error && sub && (sub.status === 'active' || sub.status === 'paid')) {
          setIsSubscribedPro(true);
        } else {
          setIsSubscribedPro(false);
        }
      } catch (err) {
        setIsSubscribedPro(false);
      }
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthLoading(false);
      checkAccess(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      checkAccess(u);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isVipFounder = user?.email?.toLowerCase() === 'mantupatra23@gmail.com';
  const hasProSubscription = isVipFounder || isSubscribedPro;

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
    return (initialWorkflows || []).filter((wf) => {
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

  // Strict Rule: Phase 1 (index 0) free. Phase 2, 3, 4 (index > 0) STRICTLY LOCKED for everyone except VIP and Paid Pro
  const isCurrentStepLocked = activeStepIdx > 0 && !hasProSubscription;

  const getCompiledPrompt = () => {
    if (!currentStep || isCurrentStepLocked) return '';
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

  const handleLaunchClick = (wf: Workflow) => {
    if (!user) {
      setShowAuthGate(true);
      return;
    }
    setSelectedWorkflow(wf);
    setActiveStepIdx(0);
    setVariables({});
  };

  return (
    <div className="space-y-8">
      {/* VIP Founder Active Banner */}
      {isVipFounder && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <span>👑</span>
            <strong>Founder VIP Mode Active:</strong> All Pro Pipelines & Phases are 100% Unlocked for ({user?.email}).
          </span>
          <span className="bg-emerald-500 text-black px-2 py-0.5 rounded font-mono font-bold text-[10px]">
            LIFETIME FREE
          </span>
        </div>
      )}

      {/* Search & Hub Navigation Bar */}
      <div className="bg-[#0b0f17] border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {HUBS.map((hub) => {
            const count =
              hub.id === 'all'
                ? (initialWorkflows || []).length
                : (initialWorkflows || []).filter(
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

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkflows.map((wf) => {
          const steps = parseSteps(wf);
          const score = wf.quality_score || 98;

          return (
            <div
              key={wf.id}
              className="bg-[#0f141f] border border-gray-800/90 hover:border-emerald-500/50 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3.5">
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

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {wf.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {wf.description}
                  </p>
                </div>

                <div className="pt-1">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1.5 flex items-center justify-between">
                    <span>Phases ({steps.length})</span>
                    {wf.is_pro && (
                      <span className="text-[10px] text-amber-400/90">Phase 1 Free • 2-{steps.length} Pro</span>
                    )}
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

              <div className="pt-4 mt-4 border-t border-gray-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-500 truncate max-w-[120px]">
                  {wf.target_role}
                </span>

                <button
                  type="button"
                  onClick={() => handleLaunchClick(wf)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1"
                >
                  <span>Launch</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Sign-In Required Gate Modal */}
      {showAuthGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0f141f] border border-gray-700 rounded-2xl w-full max-w-md p-6 text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl">
              🔐
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sign In Required</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                You must be logged in to execute sequential AI workflows and inject custom template variables.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black block transition-all shadow-lg shadow-emerald-500/20"
              >
                Sign In to Continue &rarr;
              </Link>
              <button
                type="button"
                onClick={() => setShowAuthGate(false)}
                className="w-full py-2 rounded-xl text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Workbench Modal with Strict Pro Lock */}
      {selectedWorkflow && currentStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0b0f17] border border-gray-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Workbench Top */}
            <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#080b11] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    HUB WORKBENCH
                  </span>
                  {selectedWorkflow.is_pro && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      PRO PIPELINE
                    </span>
                  )}
                  {isVipFounder && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-black">
                      VIP PASS
                    </span>
                  )}
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

            {/* Stepper Navigation: Phase 2, 3, 4 strictly show 🔒 for non-pro */}
            <div className="bg-[#0e131d] px-4 py-2.5 border-b border-gray-800/80 flex items-center gap-2 overflow-x-auto">
              {currentSteps.map((st, i) => {
                const isActive = i === activeStepIdx;
                const isStepLocked = i > 0 && !hasProSubscription;

                return (
                  <button
                    key={i}
                    onClick={() => setActiveStepIdx(i)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                      isActive
                        ? isStepLocked
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                          : 'bg-emerald-500 text-black font-bold'
                        : isStepLocked
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-[#151b27] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span>{isStepLocked ? '🔒' : `${i + 1}.`}</span>
                    <span className="max-w-[120px] truncate">{st.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Workbench Body */}
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

              {/* If step is locked (Phases 2, 3, 4 for free users), show Pro Paywall */}
              {isCurrentStepLocked ? (
                <div className="bg-gradient-to-b from-[#131926] to-[#0a0e16] border border-amber-500/40 rounded-2xl p-6 text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
                    🔒
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      PROMPTORY PRO REQUIRED
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">
                      Unlock Phase {activeStepIdx + 1} & All Production Blueprints
                    </h3>
                    <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
                      Phase 1 is free to test. Subsequent production phases (hardened code, vulnerability tests, and automated PR schemas) are exclusive to Pro subscribers.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/pricing"
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-95 text-black shadow-lg shadow-amber-500/20"
                    >
                      ⚡ Unlock with Pro (₹799/mo)
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveStepIdx(0)}
                      className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                    >
                      Back to Phase 1 (Free)
                    </button>
                  </div>
                </div>
              ) : (
                /* Unlocked Step Content */
                <>
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
                </>
              )}
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
