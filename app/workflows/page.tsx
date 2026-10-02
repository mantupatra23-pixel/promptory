import React from 'react';
import { supabase } from '@/lib/supabase';
import WorkflowCard from './WorkflowCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Multi-Step AI Workflows | Promptory',
  description: 'Battle-tested multi-step chained AI pipelines for software engineering, GEO search optimization, and production refactoring.',
};

export default async function WorkflowsPage() {
  const { data: workflows } = await supabase
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
              <p className="text-gray-400">No workflows found in database.</p>
            </div>
          ) : (
            workflows.map((wf: any) => (
              <WorkflowCard key={wf.id} wf={wf} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
