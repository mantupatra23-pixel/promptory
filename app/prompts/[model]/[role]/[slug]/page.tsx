import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { normalizePrompt } from '@/lib/prompts/normalizePrompt';
import { generateTopicFaqs, generateContextualSteps } from '@/lib/seo';
import PromptCustomizer from '@/components/PromptCustomizer';
import RelatedPrompts from '@/components/RelatedPrompts';
import ShareButton from '@/components/ShareButton';
import { Sparkles, ChevronRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const revalidate = 3600;

interface Props {
  params: {
    model: string;
    role: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: rawPrompt } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*), task:tasks(*)')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!rawPrompt) {
    return { title: 'Prompt Not Found | Promptory' };
  }

  const prompt = normalizePrompt(rawPrompt);
  const canonicalUrl = `https://www.promptory.xyz/prompts/${prompt.model.slug}/${prompt.profession.slug}/${prompt.slug}`;
  const ogImageUrl = `https://www.promptory.xyz/api/og?title=${encodeURIComponent(prompt.seoTitle)}&model=${encodeURIComponent(prompt.model.name)}&role=${encodeURIComponent(prompt.profession.name)}&score=${prompt.qualityScore}`;

  return {
    title: `${prompt.seoTitle} | Promptory`,
    description: prompt.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${prompt.seoTitle} | Promptory`,
      description: prompt.description,
      url: canonicalUrl,
      siteName: 'Promptory',
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: prompt.seoTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${prompt.seoTitle} | Promptory`,
      description: prompt.description,
      images: [ogImageUrl],
    },
  };
}

export default async function PromptDetailPage({ params }: Props) {
  const { data: rawPrompt } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*), task:tasks(*)')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!rawPrompt || rawPrompt.status === 'rejected') {
    notFound();
  }

  const prompt = normalizePrompt(rawPrompt);

  // 308 permanent redirect if route params do not match canonical database slugs
  if (params.model !== prompt.model.slug || params.role !== prompt.profession.slug) {
    permanentRedirect(`/prompts/${prompt.model.slug}/${prompt.profession.slug}/${prompt.slug}`);
  }

  const canonicalUrl = `https://www.promptory.xyz/prompts/${prompt.model.slug}/${prompt.profession.slug}/${prompt.slug}`;
  const faqs = (prompt.faqs && prompt.faqs.length > 0)
    ? prompt.faqs
    : generateTopicFaqs(prompt.title, prompt.description, prompt.model.name, prompt.profession.name, prompt.task.slug);
  const howToSteps = generateContextualSteps(prompt.task.slug);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
      { '@type': 'ListItem', position: 2, name: 'Tasks', item: 'https://www.promptory.xyz/tasks' },
      { '@type': 'ListItem', position: 3, name: prompt.task.name, item: `https://www.promptory.xyz/tasks/${prompt.task.slug}` },
      { '@type': 'ListItem', position: 4, name: prompt.model.name, item: `https://www.promptory.xyz/models/${prompt.model.slug}` },
      { '@type': 'ListItem', position: 5, name: prompt.seoTitle, item: canonicalUrl },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: prompt.seoTitle,
    description: prompt.description,
    url: canonicalUrl,
    datePublished: prompt.createdAt,
    dateModified: prompt.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: 'Promptory',
      url: 'https://www.promptory.xyz',
    },
  };

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f: any) => ({
      '@type': 'Question',
      name: f.question || f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer || f.a,
      },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/tasks" className="hover:text-emerald-400 transition">Tasks</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href={`/tasks/${prompt.task.slug}`} className="hover:text-emerald-400 transition">{prompt.task.name}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium truncate max-w-[220px]">{prompt.seoTitle}</span>
        </nav>

        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/tasks/${prompt.task.slug}`}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:border-emerald-400/50 transition"
              >
                Task: {prompt.task.name}
              </Link>
              <Link
                href={`/models/${prompt.model.slug}`}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-[#21262D] text-slate-300 border border-[#30363D] hover:text-white transition"
              >
                {prompt.model.name}
              </Link>
              <Link
                href={`/roles/${prompt.profession.slug}`}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#21262D] text-slate-300 capitalize border border-[#30363D] hover:text-white transition"
              >
                {prompt.profession.name}
              </Link>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3" />
                <span>Quality Score {prompt.qualityScore}/100</span>
              </span>
            </div>

            <ShareButton title={prompt.seoTitle} description={prompt.description} />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {prompt.seoTitle}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            {prompt.description}
          </p>
        </div>

        <PromptCustomizer
          initialPrompt={prompt.content}
          promptTitle={prompt.seoTitle}
          modelName={prompt.model.name}
          exampleInput={rawPrompt.example_input}
        />

        <section className="mt-14 pt-10 border-t border-[#30363D] space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">How to Execute This {prompt.task.name} Workflow</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {howToSteps.map((item) => (
              <div key={item.title} className="p-4 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-1.5 shadow-sm">
                <h3 className="text-xs sm:text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 pt-10 border-t border-[#30363D] space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">Technical execution guidance for &apos;{prompt.seoTitle}&apos;</p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq: any, i: number) => (
              <details key={i} className="group bg-[#161B22] border border-[#30363D] rounded-2xl p-4 transition open:border-emerald-500/40">
                <summary className="text-xs sm:text-sm font-bold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.question || faq.q}</span>
                  <span className="text-emerald-400 font-mono text-xs ml-2 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-[#30363D] leading-relaxed">
                  {faq.answer || faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <RelatedPrompts
          currentId={prompt.id}
          modelSlug={prompt.model.slug}
          professionSlug={prompt.profession.slug}
        />
      </div>
    </>
  );
}
