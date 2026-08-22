import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PromptCard from '@/components/PromptCard';
import HeroSearch from '@/components/HeroSearch';
import { Sparkles, TrendingUp, Cpu, Briefcase, ArrowRight } from 'lucide-react';

export const revalidate = 60; // Next.js ISR (Incremental Static Regeneration)

export default async function HomePage() {
  // Safe parallel fetch with automatic fallbacks
  const [promptsRes, modelsRes, professionsRes] = await Promise.allSettled([
    supabase.from('prompts').select('*, model:models(*), profession:professions(*)').order('quality_score', { ascending: false }),
    supabase.from('models').select('*').order('name'),
    supabase.from('professions').select('*').order('name'),
  ]);

  const prompts = promptsRes.status === 'fulfilled' && promptsRes.value.data ? promptsRes.value.data : [];
  const dbModels = modelsRes.status === 'fulfilled' && modelsRes.value.data ? modelsRes.value.data : [];
  const dbProfessions = professionsRes.status === 'fulfilled' && professionsRes.value.data ? professionsRes.value.data : [];

  // Static Fallbacks if database tables are in sync
  const modelsList = dbModels.length > 0 ? dbModels : [
    { id: '1', name: 'ChatGPT', slug: 'chatgpt', description: 'OpenAI GPT-4o & reasoning models' },
    { id: '2', name: 'Claude', slug: 'claude', description: 'Anthropic Claude 3.5 Sonnet & Opus for coding' },
    { id: '3', name: 'DeepSeek', slug: 'deepseek', description: 'DeepSeek-R1 & V3 reasoning models' },
    { id: '4', name: 'Gemini', slug: 'gemini', description: 'Google Gemini 1.5 Pro with large context' },
    { id: '5', name: 'Midjourney', slug: 'midjourney', description: 'Hyper-realistic AI image generation' },
    { id: '6', name: 'Perplexity', slug: 'perplexity', description: 'AI search engine for deep online research' },
  ];

  const professionsList = dbProfessions.length > 0 ? dbProfessions : [
    { id: '1', name: 'Developer', slug: 'developer' },
    { id: '2', name: 'Digital Marketer', slug: 'digital-marketer' },
    { id: '3', name: 'Founder', slug: 'founder' },
    { id: '4', name: 'Real Estate Agent', slug: 'real-estate-agent' },
    { id: '5', name: 'SEO Specialist', slug: 'seo-specialist' },
  ];

  const featuredPrompts = prompts.slice(0, 6);
  const trendingPrompts = prompts.slice(6, 12).length > 0 ? prompts.slice(6, 12) : prompts.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* HERO SECTION */}
      <section className="text-center py-10 md:py-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tested & Verified AI Prompts Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-zinc-100 tracking-tight leading-tight mb-4">
          Find the Right AI Prompt <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            For Any Real-World Task
          </span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
          Discover curated, tested system prompts and automation recipes built for engineers, marketers, and operators.
        </p>

        {/* HERO SEARCH WITH INTELLIGENT DEBOUNCE & CHIPS */}
        <HeroSearch />
      </section>

      {/* EXPLORE BY AI MODEL */}
      <section className="mb-14 border-t border-zinc-800/60 pt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> Explore by AI Model
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelsList.map((m: any) => (
            <Link
              key={m.id || m.slug}
              href={`/models/${m.slug}`}
              className="p-4 rounded-xl bg-[#12161F]/60 border border-zinc-800 hover:border-emerald-500/40 hover:bg-[#12161F] transition group"
            >
              <div className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                {m.name}
              </div>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{m.description || `Curated prompts for ${m.name}`}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* EXPLORE BY PROFESSION */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-4 h-4 text-cyan-400" />
          <h2 className="text-lg font-bold text-zinc-100">Explore by Profession</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {professionsList.map((r: any) => (
            <Link
              key={r.id || r.slug}
              href={`/roles/${r.slug}`}
              className="px-4 py-2 rounded-xl bg-[#12161F]/80 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-cyan-500/50 transition"
            >
              {r.name}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED & HIGH-SCORE PROMPTS */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Featured & High-Score Prompts</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Tested prompts loaded dynamically from Supabase</p>
          </div>
          <Link href="/directory" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            <span>View All Prompts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPrompts.map((prompt: any) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      {/* TRENDING PROMPTS SECTION */}
      {trendingPrompts.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-xl font-bold text-zinc-100">Trending Prompts</h2>
                <p className="text-xs text-zinc-500 mt-0.5">High-engagement workflows this week</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPrompts.map((prompt: any) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
