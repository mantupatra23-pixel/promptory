import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PromptsExplorer from '@/components/PromptsExplorer';
import { Layers, PlusCircle } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'AI Prompts Directory | Browse Tested Prompts | Promptory',
  description: 'Search and filter verified system prompts across ChatGPT, Claude, Gemini, and DeepSeek.',
  alternates: {
    canonical: 'https://www.promptory.xyz/directory',
  },
};

export default async function DirectoryPage() {
  const [promptsRes, modelsRes, professionsRes] = await Promise.allSettled([
    supabase.from('prompts').select('*, model:models(*), profession:professions(*)').order('quality_score', { ascending: false }),
    supabase.from('models').select('*').order('name'),
    supabase.from('professions').select('*').order('name'),
  ]);

  const prompts = promptsRes.status === 'fulfilled' && promptsRes.value.data ? promptsRes.value.data : [];
  const models = modelsRes.status === 'fulfilled' && modelsRes.value.data ? modelsRes.value.data : [];
  const professions = professionsRes.status === 'fulfilled' && professionsRes.value.data ? professionsRes.value.data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#12161F]/60 backdrop-blur rounded-2xl p-6 md:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Library</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight">
            Explore AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Prompts Directory</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm max-w-2xl">
            Filter by AI model, profession, or search natural language tasks to find battle-tested system prompts.
          </p>
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shrink-0 shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Prompt</span>
        </Link>
      </div>

      {/* Explorer Component */}
      <PromptsExplorer
        models={models}
        professions={professions}
        initialPrompts={prompts}
      />
    </div>
  );
}
