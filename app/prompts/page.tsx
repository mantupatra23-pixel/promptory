import { getModels, getProfessions, getPrompts } from '@/lib/db';
import PromptCard from '@/components/PromptCard';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export const revalidate = 60;

export default async function PromptsDirectoryPage() {
  const [models, professions, prompts] = await Promise.all([
    getModels(),
    getProfessions(),
    getPrompts()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Prompts Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 mb-2">Explore All AI Prompts</h1>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Browse vetted system prompts filtered by model capabilities, professional roles, and quality benchmarks.
        </p>
      </div>

      {/* FILTER PILLS */}
      <div className="space-y-4 mb-10 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-zinc-300">Models:</span>
          <div className="flex gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-zinc-950 text-xs font-semibold cursor-pointer">All Models</span>
            {models.map((m: any) => (
              <span key={m.id} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:border-emerald-500/40 cursor-pointer transition-colors">
                {m.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300 ml-5">Roles:</span>
          <div className="flex gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium cursor-pointer">All Professions</span>
            {professions.map((p: any) => (
              <span key={p.id} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:border-emerald-500/40 cursor-pointer transition-colors">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* PROMPTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((p: any) => (
          <PromptCard
            key={p.id}
            prompt={{
              id: p.id,
              title: p.title,
              slug: p.slug,
              model: p.model,
              profession: p.profession,
              task: p.task,
              description: p.description,
              promptTemplate: p.prompt_template,
              exampleInput: p.example_input,
              exampleOutput: p.example_output,
              qualityScore: p.quality_score,
              status: p.status
            }}
          />
        ))}
      </div>
    </div>
  );
}
