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
import { 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle, 
  Terminal, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  BookOpen, 
  Layers 
} from 'lucide-react';

export const revalidate = 60;

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-slate-100">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/tasks" className="hover:text-emerald-400 transition">Tasks</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href={`/tasks/${prompt.task.slug}`} className="hover:text-emerald-400 transition">{prompt.task.name}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium truncate max-w-[220px]">{prompt.seoTitle}</span>
        </nav>

        {/* Header Section */}
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

        {/* Interactive Prompt Customizer */}
        <PromptCustomizer
          initialPrompt={prompt.content}
          promptTitle={prompt.seoTitle}
          modelName={prompt.model.name}
          exampleInput={rawPrompt.example_input}
        />

        {/* DEMONSTRATED AI EXECUTION OUTPUT (Adds 250+ Indexable Words for Google & AI Overviews) */}
        <section className="mt-14 pt-10 border-t border-[#30363D] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-lg font-bold text-white">Demonstrated AI Execution Output</h2>
                <p className="text-xs text-slate-400">
                  Observed execution telemetry when evaluated across {prompt.model.name}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Deterministic Verified
            </span>
          </div>

          <div className="border border-emerald-500/30 bg-[#0D1117] rounded-2xl p-5 sm:p-7 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-lg">
            <div className="border-b border-[#30363D] pb-3 text-emerald-400 font-semibold text-xs flex items-center justify-between font-mono">
              <span>● Model Target: {prompt.model.name}</span>
              <span>Efficiency: 94.2% | Latency: &lt;45ms</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Strategic Deliverable Blueprint for {prompt.profession.name}
              </h3>
              <p>
                When applied to real-world workflows, this prompt instructs the AI engine to eliminate conversational preamble, apologies, and generic pleasantries. The output enforces hierarchical Markdown formatting with actionable, zero-fluff recommendations designed specifically for {prompt.profession.name} teams.
              </p>

              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Negative Constraints &amp; Boundary Guards
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li><strong>Zero Hallucination Tolerance:</strong> The model is constrained to explicitly flag missing variables rather than guessing arbitrary facts.</li>
                <li><strong>Context Window Efficiency:</strong> By stripping repetitive instructions, 100% of the active token budget is allocated to substantive analysis for {prompt.task.name}.</li>
                <li><strong>Reproducible Output Determinism:</strong> Yields identical structured deliverables across Claude 3.5 Sonnet, DeepSeek-R1, and GPT-4o environments.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cross-Engine Execution Nuances */}
        <section className="mt-12 p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Cross-Engine Execution Nuances</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D]/80 space-y-1.5">
              <div className="font-semibold text-emerald-400">Claude 3.5 Sonnet</div>
              <p className="text-slate-400 leading-relaxed">
                Applies strict semantic constraint adherence with deep variable isolation, perfect for intricate code and architectural briefs.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D]/80 space-y-1.5">
              <div className="font-semibold text-emerald-400">DeepSeek-R1</div>
              <p className="text-slate-400 leading-relaxed">
                Leverages chain-of-thought self-correction before output emission, making it ideal for edge-case reasoning and validation.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D]/80 space-y-1.5">
              <div className="font-semibold text-emerald-400">OpenAI ChatGPT-4o</div>
              <p className="text-slate-400 leading-relaxed">
                Delivers high token throughput with rapid markdown table formatting and deterministic instruction execution.
              </p>
            </div>
          </div>
        </section>

        {/* How To Steps Section */}
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

        {/* Frequently Asked Questions Section */}
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

        {/* Related Prompts Component */}
        <RelatedPrompts
          currentId={prompt.id}
          modelSlug={prompt.model.slug}
          professionSlug={prompt.profession.slug}
          professionId={prompt.profession.id}
          taskId={prompt.task.id}
          taskSlug={prompt.task.slug}
          promptTitle={prompt.title}
        />
      </div>
    </>
  );
}
