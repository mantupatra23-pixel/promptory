import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Disable caching so Supabase updates reflect immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Multi-Step AI Workflows | Promptory',
  description: 'Battle-tested multi-step chained AI pipelines for software engineering, GEO search optimization, and production refactoring.',
};

export default async function WorkflowsPage() {
  const { data: workflows, error } = await supabase
    .from('workflows')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#0a0d12] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sequential AI Prompt Pipelines
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Multi-Step AI <span className="text-emerald-400">Workflows</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400">
            Eliminate LLM hallucinations by chaining specialized prompt phases. Output from each step directly powers the next.
          </p>
        </div>

        {/* Workflows List */}
        <div className="grid grid-cols-1 gap-8">
          {(!workflows || workflows.length === 0) ? (
            <div className="text-center py-16 border border-gray-800 rounded-2xl bg-[#0f141c]">
              <p className="text-gray-400">Loading workflows or initializing database...</p>
            </div>
          ) : (
            workflows.map((wf: any) => {
              // Safe steps parsing (handles both JSONB array and JSON string)
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

              return (
                <div
                  key={wf.id}
                  className="border border-gray-800 hover:border-gray-700 bg-[#0f141c]/90 rounded-2xl p-6 sm:p-8 transition-all duration-200 shadow-xl"
                >
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
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
                      Execution Steps ({stepsList.length} Phases)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stepsList.map((step: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-[#0b0e14] border border-gray-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                PHASE {step.step_number || idx + 1}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-white line-clamp-1">{step.title}</h4>
                            <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{step.goal}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-800/50 flex justify-between items-center text-xs">
                            <span className="text-[11px] text-gray-500">Chained Output</span>
                            <span className="text-emerald-400 font-mono font-medium">Ready &rarr;</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
