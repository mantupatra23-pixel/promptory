import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPromptByRoute } from '@/lib/db';
import PromptCustomizer from '@/components/PromptCustomizer';
import { ShieldCheck, ChevronRight, Info, AlertTriangle, Cpu } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

interface PageProps {
  params: { model: string; profession: string; task: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const prompt = await getPromptByRoute(params.model, params.profession, params.task);
  if (!prompt) return { title: 'Prompt Not Found | Promptory' };

  const title = `${prompt.title} - Best ${prompt.model?.name} Prompt | Promptory`;
  const description = `${prompt.description} Quality Score: ${prompt.quality_score}/100. Tested system prompt template for ${prompt.profession?.name}s.`;
  const url = `https://promptory-tau.vercel.app/prompts/${params.model}/${params.profession}/${params.task}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Promptory',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PromptDetailPage({ params }: PageProps) {
  const prompt = await getPromptByRoute(params.model, params.profession, params.task);

  if (!prompt) {
    return notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: prompt.title,
    description: prompt.description,
    proficiencyLevel: 'Expert',
    articleSection: prompt.profession?.name,
    dependencies: prompt.model?.name,
    author: {
      '@type': 'Organization',
      name: 'Promptory',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://promptory-tau.vercel.app/prompts/${params.model}/${params.profession}/${params.task}`,
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* JSON-LD INJECTION FOR GOOGLE INDEXING */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-zinc-300">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/prompts" className="hover:text-zinc-300">Prompts</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-400">{prompt.model?.name}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-emerald-400">{prompt.title}</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {prompt.model?.name}
          </span>
          <span className="px-2.5 py-0.5 rounded text-xs bg-zinc-800 text-zinc-300">
            {prompt.profession?.name}
          </span>
          <div className="ml-auto flex items-center gap-1 text-xs text-zinc-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Quality Score: {prompt.quality_score}/100</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3">{prompt.title}</h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">{prompt.description}</p>
      </div>

      {/* INTERACTIVE BUILDER */}
      <div className="mb-12">
        <PromptCustomizer
          promptId={prompt.id}
          promptTitle={prompt.title}
          template={prompt.prompt_template}
          exampleInput={prompt.example_input}
        />
      </div>

      {/* EXAMPLE DEMO OUTPUT */}
      {prompt.example_output && (
        <div className="mb-10 bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <Info className="w-4 h-4 text-emerald-400" /> Illustrative Output Demo
          </div>
          <div className="p-4 rounded-lg bg-[#0A0D12] text-xs sm:text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed border border-zinc-900">
            {prompt.example_output}
          </div>
        </div>
      )}

      {/* USE CASES & COMMON MISTAKES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompt.use_cases && prompt.use_cases.length > 0 && (
          <div className="p-5 rounded-xl bg-[#0F141C] border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> Best Use Cases
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
              {prompt.use_cases.map((uc: string, idx: number) => (
                <li key={idx}>{uc}</li>
              ))}
            </ul>
          </div>
        )}

        {prompt.common_mistakes && prompt.common_mistakes.length > 0 && (
          <div className="p-5 rounded-xl bg-[#0F141C] border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" /> Common Mistakes
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
              {prompt.common_mistakes.map((cm: string, idx: number) => (
                <li key={idx}>{cm}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
