import { getModels, getProfessions, getPrompts } from '@/lib/db';
import PromptsExplorer from '@/components/PromptsExplorer';
import { Sparkles, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export default async function PromptsDirectoryPage() {
  const [models, professions, prompts] = await Promise.all([
    getModels(),
    getProfessions(),
    getPrompts()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Prompts Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 mb-2">Explore All AI Prompts</h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Real-time filter and instant search across verified system prompts.
          </p>
        </div>

        <Link
          href="/submit"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-lg self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Submit Prompt
        </Link>
      </div>

      <PromptsExplorer
        models={models}
        professions={professions}
        initialPrompts={prompts}
      />
    </div>
  );
}
