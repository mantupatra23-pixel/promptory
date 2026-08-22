import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PromptCard from '@/components/PromptCard';
import { ChevronRight, Sparkles, Cpu, Layers } from 'lucide-react';

interface Props {
  params: {
    model: string;
  };
}

const MODEL_INFO: Record<string, { name: string; desc: string; highlights: string }> = {
  chatgpt: {
    name: 'ChatGPT (GPT-4o)',
    desc: 'Battle-tested prompts and system instructions tailored for OpenAI GPT-4o, reasoning models, and standard GPT workflows.',
    highlights: 'Multi-modal analysis, code refactoring, role-play system prompts',
  },
  claude: {
    name: 'Anthropic Claude',
    desc: 'Deep reasoning, coding, and architectural prompts tuned for Claude 3.5 Sonnet and Opus.',
    highlights: 'Clean code generation, long context memory, zero-hallucination research',
  },
  deepseek: {
    name: 'DeepSeek (R1 & V3)',
    desc: 'High-performance open reasoning system prompts optimized for DeepSeek-R1 and DeepSeek-V3.',
    highlights: 'Mathematical reasoning, algorithm design, fast inference',
  },
  gemini: {
    name: 'Google Gemini 1.5 Pro',
    desc: 'Massive context window prompts and multi-modal pipeline templates for Gemini 1.5 Pro & Flash.',
    highlights: 'Full-codebase ingestion, cross-document analysis, video summarization',
  },
  midjourney: {
    name: 'Midjourney v6',
    desc: 'Hyper-realistic photography, UI design, vector illustration, and 3D render parameter prompts.',
    highlights: 'Lighting styles, camera parameters (--ar 16:9, --v 6.0), texture controls',
  },
  perplexity: {
    name: 'Perplexity AI',
    desc: 'Deep online market research, competitor analysis, and cited academic investigation queries.',
    highlights: 'Live citations, real-time web discovery, source verification',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = params.model.toLowerCase();
  const info = MODEL_INFO[key] || {
    name: params.model.toUpperCase(),
    desc: `Curated AI prompts optimized for ${params.model}.`,
  };

  return {
    title: `Best ${info.name} Prompts & System Instructions | Promptory`,
    description: info.desc,
    alternates: {
      canonical: `https://www.promptory.xyz/prompts/model/${params.model.toLowerCase()}`,
    },
    openGraph: {
      title: `Best ${info.name} Prompts | Promptory`,
      description: info.desc,
      url: `https://www.promptory.xyz/prompts/model/${params.model.toLowerCase()}`,
    },
  };
}

export default async function ModelPromptsPage({ params }: Props) {
  const modelKey = params.model.toLowerCase();
  const modelInfo = MODEL_INFO[modelKey] || {
    name: params.model.toUpperCase(),
    desc: `Discover verified prompts crafted specifically for ${params.model}.`,
    highlights: 'Tested accuracy, structured formatting, live parameter tuning',
  };

  // Fetch prompts matching model
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .order('quality_score', { ascending: false });

  const filteredPrompts = (prompts || []).filter((p: any) => {
    const mSlug = p.model?.slug || (typeof p.model === 'string' ? p.model : '');
    const mName = p.model?.name || '';
    return mSlug.toLowerCase().includes(modelKey) || mName.toLowerCase().includes(modelKey);
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best ${modelInfo.name} Prompts`,
    description: modelInfo.desc,
    url: `https://www.promptory.xyz/prompts/model/${modelKey}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
        { '@type': 'ListItem', position: 2, name: 'Models', item: 'https://www.promptory.xyz/directory' },
        { '@type': 'ListItem', position: 3, name: modelInfo.name, item: `https://www.promptory.xyz/prompts/model/${modelKey}` },
      ],
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href="/directory" className="hover:text-emerald-400 transition-colors">Models</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-100 font-medium">{modelInfo.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="border border-zinc-800 bg-[#12161F]/60 backdrop-blur rounded-2xl p-6 md:p-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
          <Cpu className="w-3.5 h-3.5" />
          <span>Model Hub</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 mb-3 tracking-tight">
          Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{modelInfo.name}</span> Prompts
        </h1>
        <p className="text-zinc-300 text-sm md:text-base max-w-3xl leading-relaxed mb-4">
          {modelInfo.desc}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="text-zinc-500">Key Strengths:</span>
          <span className="bg-[#0A0D12] border border-zinc-800 px-2.5 py-1 rounded-md text-zinc-300">
            {modelInfo.highlights}
          </span>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Available Prompts ({filteredPrompts.length})
        </h2>
      </div>

      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt: any) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-zinc-800 rounded-xl bg-[#12161F]/30">
          <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-300 font-medium">No custom prompts loaded for {modelInfo.name} yet.</p>
          <p className="text-xs text-zinc-500 mt-1">Autonomous daily ingestion will populate verified templates shortly.</p>
        </div>
      )}
    </div>
  );
}
