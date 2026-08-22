import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PromptCard from '@/components/PromptCard';
import { ChevronRight, Briefcase, Sparkles, Layers } from 'lucide-react';

interface Props {
  params: {
    role: string;
  };
}

const ROLE_INFO: Record<string, { title: string; desc: string; focus: string }> = {
  developer: {
    title: 'Software Developers & Engineers',
    desc: 'System prompts for Python, FastAPI, Next.js, Rust, Docker, SQL schema optimization, and pull request audits.',
    focus: 'Architecture reviews, async concurrency, performance benchmarking, unit test suites',
  },
  'digital-marketer': {
    title: 'Digital Marketers & Growth Leads',
    desc: 'High-converting cold email sequences, paid ads hooks, landing page value propositions, and social copy.',
    focus: 'Direct-response copywriting, persona targeting, email deliverability hooks',
  },
  founder: {
    title: 'Founders & Product Operators',
    desc: 'SaaS pitch decks, competitor teardowns, monetization strategies, and product roadmap planning.',
    focus: 'Unit economics, customer interviews, GTM strategy, value proposition testing',
  },
  'seo-specialist': {
    title: 'SEO Specialists & Content Strategists',
    desc: 'Programmatic SEO content templates, keyword cluster architectures, schema generators, and internal link trees.',
    focus: 'SERP intent mapping, semantic keyword coverage, EEAT optimization',
  },
  'real-estate-agent': {
    title: 'Real Estate Agents & Brokers',
    desc: 'High-intent client follow-ups, luxury listing descriptions, investor deal teardowns, and lead nurturing emails.',
    focus: 'Client relationship nurturing, neighborhood spotlight articles, property pitch scripts',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = params.role.toLowerCase();
  const info = ROLE_INFO[key] || {
    title: `${params.role.replace('-', ' ').toUpperCase()} Professionals`,
    desc: `Curated system prompts engineered for ${params.role.replace('-', ' ')}.`,
  };

  return {
    title: `Best AI Prompts for ${info.title} | Promptory`,
    description: info.desc,
    alternates: {
      canonical: `https://www.promptory.xyz/roles/${key}`,
    },
    openGraph: {
      title: `AI Prompts for ${info.title} | Promptory`,
      description: info.desc,
      url: `https://www.promptory.xyz/roles/${key}`,
    },
  };
}

export default async function RolePromptsPage({ params }: Props) {
  const roleKey = params.role.toLowerCase();
  const roleInfo = ROLE_INFO[roleKey] || {
    title: `${params.role.replace('-', ' ').toUpperCase()}`,
    desc: `High-scoring production prompts designed for ${params.role.replace('-', ' ')}.`,
    focus: 'Domain-specific instructions, variable templates, output constraints',
  };

  const { data: prompts } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .order('quality_score', { ascending: false });

  const filteredPrompts = (prompts || []).filter((p: any) => {
    const rSlug = p.profession?.slug || (typeof p.profession === 'string' ? p.profession : '');
    const rName = p.profession?.name || '';
    return rSlug.toLowerCase().includes(roleKey) || rName.toLowerCase().replace(/\s+/g, '-').includes(roleKey);
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `AI Prompts for ${roleInfo.title}`,
    description: roleInfo.desc,
    url: `https://www.promptory.xyz/roles/${roleKey}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
        { '@type': 'ListItem', position: 2, name: 'Roles', item: 'https://www.promptory.xyz/directory' },
        { '@type': 'ListItem', position: 3, name: roleInfo.title, item: `https://www.promptory.xyz/roles/${roleKey}` },
      ],
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href="/directory" className="hover:text-emerald-400 transition-colors">Roles</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-100 font-medium">{roleInfo.title}</span>
      </nav>

      <div className="border border-zinc-800 bg-[#12161F]/60 backdrop-blur rounded-2xl p-6 md:p-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Role Directory</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 mb-3 tracking-tight">
          AI Prompts for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">{roleInfo.title}</span>
        </h1>
        <p className="text-zinc-300 text-sm md:text-base max-w-3xl leading-relaxed mb-4">
          {roleInfo.desc}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="text-zinc-500">Core Workflow Focus:</span>
          <span className="bg-[#0A0D12] border border-zinc-800 px-2.5 py-1 rounded-md text-zinc-300">
            {roleInfo.focus}
          </span>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Tailored Templates ({filteredPrompts.length})
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
          <p className="text-zinc-300 font-medium">No specialized prompts loaded for this role yet.</p>
          <p className="text-xs text-zinc-500 mt-1">Autonomous ingestion pipelines add new verified templates daily.</p>
        </div>
      )}
    </div>
  );
}
