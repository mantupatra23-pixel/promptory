import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PromptCard from '@/components/PromptCard';
import HeroSearch from '@/components/HeroSearch';
import { 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Briefcase, 
  ArrowRight, 
  Code2, 
  Megaphone, 
  Rocket, 
  Home as HomeIcon, 
  Search as SearchIcon
} from 'lucide-react';

export const revalidate = 60;

const MODEL_LOGOS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  chatgpt: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.597 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813v6.7227zm1.145-2.068a1.4428 1.4428 0 1 1 2.0407-2.0407 1.4428 1.4428 0 0 1-2.0407 2.0407z" />
      </svg>
    ),
  },
  claude: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
      </svg>
    ),
  },
  deepseek: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C7.03 3 3 7.03 3 12c0 3.98 2.59 7.35 6.19 8.52.45.08.61-.2.61-.43v-1.68c-2.51.55-3.04-1.07-3.04-1.07-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.91.06 1.39.93 1.39.93.81 1.38 2.11.98 2.63.75.08-.58.32-.98.57-1.21-2-.23-4.11-1-4.11-4.46 0-.99.35-1.79.93-2.42-.09-.23-.4-1.15.09-2.39 0 0 .76-.24 2.48.93.72-.2 1.5-.3 2.27-.3.77 0 1.55.1 2.27.3 1.72-1.17 2.48-.93 2.48-.93.49 1.24.18 2.16.09 2.39.58.63.93 1.43.93 2.42 0 3.47-2.11 4.23-4.12 4.45.33.28.62.84.62 1.7v2.52c0 .24.16.52.62.43C18.41 19.35 21 15.98 21 12c0-4.97-4.03-9-9-9z" />
      </svg>
    ),
  },
  gemini: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z" />
      </svg>
    ),
  },
  midjourney: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
      </svg>
    ),
  },
  perplexity: {
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15 8H9L12 2ZM4 10L10 12L4 14V10ZM20 10V14L14 12L20 10ZM9 16H15L12 22L9 16Z" />
      </svg>
    ),
  },
};

const ROLE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  developer: { icon: <Code2 className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
  'digital-marketer': { icon: <Megaphone className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  founder: { icon: <Rocket className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  'real-estate-agent': { icon: <HomeIcon className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  'seo-specialist': { icon: <SearchIcon className="w-3.5 h-3.5" />, color: 'text-teal-400' },
};

export default async function HomePage() {
  const [promptsRes, modelsRes, professionsRes] = await Promise.allSettled([
    supabase.from('prompts').select('*, model:models(*), profession:professions(*)').order('quality_score', { ascending: false }),
    supabase.from('models').select('*').order('name'),
    supabase.from('professions').select('*').order('name'),
  ]);

  const prompts = promptsRes.status === 'fulfilled' && promptsRes.value.data ? promptsRes.value.data : [];
  const dbModels = modelsRes.status === 'fulfilled' && modelsRes.value.data ? modelsRes.value.data : [];
  const dbProfessions = professionsRes.status === 'fulfilled' && professionsRes.value.data ? professionsRes.value.data : [];

  const totalPromptsCount = prompts.length;

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
          <span>{totalPromptsCount} Production Prompts Live</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          Find the Right AI Prompt <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            For Any Real-World Task
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Discover curated, tested system prompts and automation recipes built for engineers, marketers, and operators.
        </p>

        {/* HERO SEARCH */}
        <HeroSearch />

        {/* Metrics Bar */}
        <div className="grid grid-cols-3 max-w-lg mx-auto mt-10 pt-6 border-t border-[#30363D] text-center">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{totalPromptsCount}</div>
            <div className="text-[11px] text-slate-400 font-medium">Total Prompts</div>
          </div>
          <div className="border-x border-[#30363D]">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">6</div>
            <div className="text-[11px] text-slate-400 font-medium">AI Models</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-cyan-400">100%</div>
            <div className="text-[11px] text-slate-400 font-medium">Quality Audited</div>
          </div>
        </div>

      </section>

      {/* EXPLORE BY AI MODEL */}
      <section className="mb-14 border-t border-[#30363D] pt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> Explore by AI Model
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelsList.map((m: any) => {
            const logoInfo = MODEL_LOGOS[m.slug?.toLowerCase()] || {
              icon: <Cpu className="w-5 h-5" />,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20',
            };

            return (
              <Link
                key={m.id || m.slug}
                href={`/models/${m.slug}`}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#161B22] hover:bg-[#1C2128] border border-[#30363D] hover:border-emerald-500/50 transition group shadow-md"
              >
                <div className={`p-2.5 rounded-xl border ${logoInfo.bg} ${logoInfo.color} shrink-0 transition`}>
                  {logoInfo.icon}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {m.name}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {m.description || `Curated prompts for ${m.name}`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* EXPLORE BY PROFESSION */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-4 h-4 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Explore by Profession</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {professionsList.map((r: any) => {
            const roleKey = (r.slug || r.name).toLowerCase().replace(/\s+/g, '-');
            const roleIcon = ROLE_ICONS[roleKey] || {
              icon: <Briefcase className="w-3.5 h-3.5" />,
              color: 'text-slate-400',
            };

            return (
              <Link
                key={r.id || r.slug}
                href={`/roles/${r.slug || roleKey}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161B22] hover:bg-[#1C2128] border border-[#30363D] text-xs font-semibold text-slate-300 hover:text-white hover:border-emerald-500/50 transition group shadow-sm"
              >
                <span className={`${roleIcon.color} group-hover:scale-110 transition-transform`}>
                  {roleIcon.icon}
                </span>
                <span>{r.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED PROMPTS */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Featured & High-Score Prompts</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tested prompts loaded dynamically from Supabase</p>
          </div>
          <Link href="/directory" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            <span>View All ({totalPromptsCount}) Prompts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPrompts.map((prompt: any) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      {/* TRENDING PROMPTS */}
      {trendingPrompts.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Trending Prompts</h2>
                <p className="text-xs text-slate-400 mt-0.5">High-engagement workflows this week</p>
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
