import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getModels, getProfessions } from '@/lib/db';
import PromptsExplorer from '@/components/PromptsExplorer';
import { ChevronRight, Cpu } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export default async function ModelCategoryPage({ params }: { params: { model: string } }) {
  const { data: model } = await supabase
    .from('models')
    .select('*')
    .eq('slug', params.model)
    .single();

  if (!model) {
    return notFound();
  }

  const [models, professions, { data: prompts }] = await Promise.all([
    getModels(),
    getProfessions(),
    supabase
      .from('prompts')
      .select(`
        *,
        model:models(*),
        profession:professions(*),
        task:tasks(*)
      `)
      .eq('model_id', model.id)
      .eq('status', 'published')
      .order('quality_score', { ascending: false }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-zinc-300">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/prompts" className="hover:text-zinc-300">Prompts</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-emerald-400 font-medium">{model.name}</span>
      </nav>

      {/* MODEL HEADER */}
      <div className="mb-10 bg-[#0F141C] border border-zinc-800 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">{model.name} System Prompts</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">{model.description}</p>
          </div>
        </div>
      </div>

      {/* EXPLORER GRID */}
      <PromptsExplorer
        models={models}
        professions={professions}
        initialPrompts={prompts || []}
      />
    </div>
  );
}
