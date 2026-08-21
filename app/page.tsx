import Link from 'next/link';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import { getModels, getProfessions, getPrompts } from '@/lib/db';
import PromptCard from '@/components/PromptCard';
import HeroSearch from '@/components/HeroSearch';

export const revalidate = 60;

export default async function HomePage() {
  const [models, professions, prompts] = await Promise.all([
    getModels(),
    getProfessions(),
    getPrompts()
  ]);

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tested & Verified AI Prompts Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100 mb-6 leading-tight">
          Find the Right AI Prompt <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            For Any Real-World Task
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
          Discover curated, tested system prompts and automation recipes built for engineers, marketers, and operators.
        </p>

        {/* FUNCTIONAL HERO SEARCH */}
        <HeroSearch />
      </section>

      {/* POPULAR AI MODELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-zinc-800/60">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" /> Explore by AI Model
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {models.map((model: any) => (
            <Link 
              key={model.id}
              href={`/prompts/${model.slug}`}
              className="p-4 rounded-xl bg-[#0F141C] border border-zinc-800/80 hover:border-emerald-500/40 transition-all group"
            >
              <h3 className="font-semibold text-zinc-200 group-hover:text-emerald-400 text-sm mb-1">{model.name}</h3>
              <p className="text-xs text-zinc-500 line-clamp-1">{model.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR PROFESSIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-lg font-bold text-zinc-100 mb-6">Explore by Profession</h2>
        <div className="flex gap-2 flex-wrap">
          {professions.map((prof: any) => (
            <Link
              key={prof.id}
              href={`/prompts`}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
            >
              {prof.name}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PROMPTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Featured & High-Score Prompts</h2>
            <p className="text-xs text-zinc-400">Tested prompts loaded dynamically from Supabase</p>
          </div>
          <Link href="/prompts" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">
            View All Prompts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
      </section>
    </div>
  );
}
