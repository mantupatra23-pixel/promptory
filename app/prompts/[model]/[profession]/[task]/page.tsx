import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PromptCustomizer from '@/components/PromptCustomizer';
import PromptGuideAndFAQ from '@/components/PromptGuideAndFAQ';
import RelatedPrompts from '@/components/RelatedPrompts';
import ShareButton from '@/components/ShareButton';
import { ChevronRight, Sparkles } from 'lucide-react';
import { calculateQualityScore } from '@/lib/qualityScore';
import { parsePromptVariables } from '@/lib/variableParser';

interface PageProps {
  params: {
    model: string;
    profession: string;
    task: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .limit(100);

  const prompt = (prompts || []).find((p: any) => {
    const m = (p.model?.slug || p.model || '').toLowerCase();
    const prof = (p.profession?.slug || p.role || p.profession || '').toLowerCase().replace(/\s+/g, '-');
    const t = (p.slug || p.task || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    return m === params.model.toLowerCase() && prof === params.profession.toLowerCase() && t === params.task.toLowerCase();
  }) || prompts?.[0];

  const title = prompt?.title ? `${prompt.title} | Promptory` : 'Tested AI System Prompt';
  const description = prompt?.description || 'Customizable, battle-tested system prompt with variable controls.';
  const canonicalUrl = `https://www.promptory.xyz/prompts/${params.model}/${params.profession}/${params.task}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
    },
  };
}

export default async function PromptDetailPage({ params }: PageProps) {
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .limit(100);

  const prompt = (prompts || []).find((p: any) => {
    const m = (p.model?.slug || p.model || '').toLowerCase();
    const prof = (p.profession?.slug || p.role || p.profession || '').toLowerCase().replace(/\s+/g, '-');
    const t = (p.slug || p.task || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    return m === params.model.toLowerCase() && prof === params.profession.toLowerCase() && t === params.task.toLowerCase();
  }) || prompts?.[0];

  if (!prompt) {
    notFound();
  }

  const modelName = prompt.model?.name || params.model.toUpperCase();
  const roleName = prompt.profession?.name || params.profession.replace('-', ' ');
  const promptTemplate = prompt.prompt_template || prompt.prompt || prompt.content || '';
  const scoreBreakdown = calculateQualityScore(promptTemplate, prompt.quality_score || 97);
  const detectedVariables = parsePromptVariables(promptTemplate);
  const currentUrl = `https://www.promptory.xyz/prompts/${params.model}/${params.profession}/${params.task}`;

  // Structured Data Schema for Googlebot
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: prompt.title,
        description: prompt.description,
        author: {
          '@type': 'Organization',
          name: 'Promptory',
          url: 'https://www.promptory.xyz',
        },
        mainEntityOfPage: currentUrl,
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the best way to run ${prompt.title} in ${modelName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `To maximize output quality in ${modelName}, replace all placeholder parameters with detailed real-world data rather than generic summaries. Setting your desired output format ensures structured formatting on the first response.`,
            },
          },
          {
            '@type': 'Question',
            name: `Can I use this prompt with other AI models?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes. This prompt follows universal prompt engineering standards and works across ChatGPT, Claude 3.5 Sonnet, Google Gemini, and DeepSeek.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <Link href={`/models/${params.model}`} className="hover:text-emerald-400 transition-colors">{modelName}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <Link href={`/roles/${params.profession}`} className="hover:text-emerald-400 transition-colors">{roleName}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <span className="text-zinc-100 font-medium truncate max-w-[200px]">{prompt.title}</span>
      </nav>

      {/* Header Info */}
      <div className="border border-zinc-800 bg-[#12161F]/60 backdrop-blur rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {modelName}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300">
              {roleName}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950/50 border border-emerald-800/50 text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Score {scoreBreakdown.total}/100
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ShareButton title={prompt.title} url={currentUrl} />
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 mb-3 tracking-tight">
          {prompt.title}
        </h1>
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-3xl">
          {prompt.description}
        </p>
      </div>

      {/* Customizer, Live Output & 1-Click AI Launchers */}
      <PromptCustomizer initialPrompt={promptTemplate} modelName={modelName} />

      {/* Dynamic Non-Hardcoded How-To-Use & FAQ Section */}
      <PromptGuideAndFAQ
        promptTitle={prompt.title}
        modelName={modelName}
        roleName={roleName}
        description={prompt.description}
        variables={detectedVariables}
        qualityScore={scoreBreakdown.total}
      />

      {/* Related Prompts */}
      <RelatedPrompts
        currentId={prompt.id}
        modelSlug={params.model}
        professionSlug={params.profession}
      />
    </div>
  );
}
