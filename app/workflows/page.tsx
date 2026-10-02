import React from 'react';
import { supabase } from '@/lib/supabase';
import WorkflowDirectory from './WorkflowDirectory';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Multi-Step AI Workflows | Promptory',
  description: 'Chained sequential prompt pipelines for software engineering, GEO search optimization, and growth systems.',
};

export default async function WorkflowsPage() {
  const { data: workflows } = await supabase
    .from('workflows')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Sleek Minimal Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sequential LLM Chaining
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Multi-Step AI <span className="text-emerald-400">Workflows</span>
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-gray-400">
            Chain specialized prompts into autonomous execution blueprints. Feed previous outputs into subsequent phases without hallucinations.
          </p>
        </div>

        {/* Client Directory & Studio */}
        <WorkflowDirectory initialWorkflows={workflows || []} />
      </div>
    </div>
  );
}
