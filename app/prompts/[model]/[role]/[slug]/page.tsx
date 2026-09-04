import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
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

function getCanonicalPromptBody(prompt: any): string {
  if (!prompt) return '';
  return (
    prompt.prompt_template?.trim() ||
    prompt.prompt?.trim() ||
    prompt.content?.trim() ||
    ''
  );
}

function cleanSearchIntentTitle(rawTitle: string): string {
  if (!rawTitle) return 'AI System Prompt';
  return rawTitle
    .replace(/\s*\|\s*Promptory.*$/i, '')
    .replace(/\s*—\s*Verified.*$/i, '')
    .replace(/& Architecture Optimizer/gi, 'Optimizer')
    .trim();
}

function buildContextualFaqs(title: string, modelName: string, roleName: string) {
  const isCoding = /code|test|pytest|fastapi|react|rust|postgres|query|debug|api|security/i.test(title);

  if (isCoding) {
    return [
      {
        q: `What specific inputs does this ${title} require?`,
        a: `Provide your exact code snippet, schema definitions, runtime error traces, and architectural constraints into the parameter inputs for zero-hallucination outputs.`,
      },
      {
        q: `Can I run this prompt with models other than ${modelName}?`,
        a: `Yes. While fine-tuned for ${modelName}'s system instruction handling, the imperative constraints transfer cleanly to Claude 3.5 Sonnet, DeepSeek-R1, and GPT-4o.`,
      },
      {
        q: `How does this prompt avoid AI code hallucinations?`,
        a: `It enforces strict boundary constraints and negative prompting rules, compelling the AI to audit line-by-line rather than assuming missing dependencies.`,
      },
      {
        q: `Is this prompt suitable for ${roleName} production workflows?`,
        a: `Yes. It is engineered specifically for ${roleName} environments to eliminate repetitive boilerplate iterations and enforce consistent production standards.`,
      },
    ];
  }

  return [
    {
      q: `What is the best way to execute "${title}" in ${modelName}?`,
      a: `To maximize output precision in ${modelName}, customize the dynamic bracket variables with real context, target audience details, and structural output formats.`,
    },
    {
      q: `Can I execute this prompt on multiple AI models?`,
      a: `Yes. You can copy the configured prompt or launch it in 1-click across ChatGPT, Claude, DeepSeek, and Google Gemini Pro via the AI App Launcher.`,
    },
    {
      q: `What parameters are required to customize this template?`,
      a: `All dynamic variables marked in brackets are automatically converted into interactive input fields in the customizer above.`,
    },
    {
      q: `Is this workflow tailored for ${roleName}s?`,
      a: `Yes. Every instruction is calibrated around real-world ${roleName} tasks to ensure immediate, actionable deliverables.`,
    },
  ];
}

function getContextualSteps(title: string, modelName: string) {
  const isCoding = /code|test|pytest|fastapi|react|rust|postgres|query|debug|api|security/i.test(title);

  if (isCoding) {
    return [
      {
        step: '01',
        title: 'Input Code & Stack Context',
        desc: 'Insert your function, query plan, or schema into the customizer parameters.',
      },
      {
        step: '02',
        title: 'Define Constraints',
        desc: 'Specify runtime environment constraints, typing standards, and expected performance benchmarks.',
      },
      {
        step: '03',
        title: 'Launch in 1-Click',
        desc: `Copy the generated prompt or launch directly into ${modelName}, Claude 3.5, or DeepSeek-R1.`,
      },
      {
        step: '04',
        title: 'Audit & Benchmark',
        desc: 'Review the deterministic code audit and verify the suggested optimizations in staging.',
      },
    ];
  }

  return [
    {
      step: '01',
      title: 'Configure Custom Variables',
      desc: 'Fill in the dynamic inputs above with your specific context and task requirements.',
    },
    {
      step: '02',
      title: 'Select Format & Tone',
      desc: 'Adjust constraints (e.g., Markdown, Structured Table, Concise) to match your workflow.',
    },
    {
      step: '03',
      title: 'Launch in 1-Click or Copy',
      desc: 'Tap "Copy Final Prompt" or launch directly into your preferred AI model.',
    },
    {
      step: '04',
      title: 'Execute & Review',
      desc: 'Paste into your AI workspace and receive deterministic, high-accuracy output immediately.',
    },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const { data: prompt } = await supabase
    .from('prompts')
    .select('title, description, quality_score, model:models(name, slug), profession:professions(name, slug)')
    .eq('slug', slug)
    .maybeSingle();

  if (!prompt) {
    return { title: 'Prompt Not Found | Promptory' };
  }

  const modelName = (prompt.model as any)?.name || params.model.toUpperCase();
  const roleName = (prompt.profession as any)?.name || params.role.replace(/-/g, ' ');
  const actualModelSlug = (prompt.model as any)?.slug || params.model;
  const actualRoleSlug = (prompt.profession as any)?.slug || params.role;

  const cleanTitle = cleanSearchIntentTitle(prompt.title);
  const description =
    prompt.description ||
    `Production-tested ${modelName} system prompt for ${roleName}. Benchmark, customize variables, and deploy on Promptory.`;

  const canonicalUrl = `https://www.promptory.xyz/prompts/${actualModelSlug}/${actualRoleSlug}/${slug}`;
  const ogImageUrl = `https://www.promptory.xyz/api/og?title=${encodeURIComponent(cleanTitle)}&model=${encodeURIComponent(modelName)}&role=${encodeURIComponent(roleName)}&score=${prompt.quality_score || 98}`;

  return {
    title: `${cleanTitle} — ${modelName} Prompt | Promptory`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cleanTitle} | Promptory`,
      description,
      url: canonicalUrl,
      siteName: 'Promptory',
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cleanTitle} | Promptory`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PromptDetailPage({ params }: Props) {
  const { data: prompt } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*), task:tasks(*)')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!prompt) {
    notFound();
  }

  const actualModelSlug = prompt.model?.slug || params.model;
  const actualRoleSlug = prompt.profession?.slug || params.role;

  // 308 Permanent Redirect for canonical URL integrity
  if (params.model !== actualModelSlug || params.role !== actualRoleSlug) {
    permanentRedirect(`/prompts/${actualModelSlug}/${actualRoleSlug}/${prompt.slug}`);
  }

  const modelName = prompt.model?.name || params.model.toUpperCase();
  const roleName = prompt.profession?.name || params.role.replace(/-/g, ' ');
  const taskName = prompt.task?.name || 'Coding';
  const taskSlug = prompt.task?.slug || prompt.task_slug || 'coding';

  const cleanTitle = cleanSearchIntentTitle(prompt.title);
  const promptBody = getCanonicalPromptBody(prompt);

  const faqs = buildContextualFaqs(cleanTitle, modelName, roleName);
  const howToSteps = getContextualSteps(cleanTitle, modelName);
  const canonicalUrl = `https://www.promptory.xyz/prompts/${actualModelSlug}/${actualRoleSlug}/${prompt.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
      { '@type': 'ListItem', position: 2, name: 'Tasks', item: 'https://www.promptory.xyz/tasks' },
      { '@type': 'ListItem', position: 3, name: taskName, item: `https://www.promptory.xyz/tasks/${taskSlug}` },
      { '@type': 'ListItem', position: 4, name: modelName, item: `https://www.promptory.xyz/models/${actualModelSlug}` },
      { '@type': 'ListItem', position: 5, name: cleanTitle, item: canonicalUrl },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: cleanTitle,
    description: prompt.description || `${cleanTitle} workflow for ${modelName}.`,
    url: canonicalUrl,
    datePublished: prompt.created_at,
    dateModified: prompt.updated_at || prompt.created_at,
    author: {
      '@type': 'Organization',
      name: 'Promptory Technical Review',
      url: 'https://www.promptory.xyz',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Promptory',
      logo: { '@type': 'ImageObject', url: 'https://www.promptory.xyz/logo.png' },
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-emerald-400 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/tasks" className="hover:text-emerald-400 transition">
            Tasks
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href={`/tasks/${taskSlug}`} className="hover:text-emerald-400 transition">
            {taskName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium truncate max-w-[220px]">{cleanTitle}</span>
        </nav>

        {/* Header Section */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/tasks/${taskSlug}`}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:border-emerald-400/50 transition"
              >
                Task: {taskName}
              </Link>
              <Link
                href={`/models/${actualModelSlug}`}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-[#21262D] text-slate-300 border border-[#30363D] hover:text-white transition"
              >
                {modelName}
              </Link>
              <Link
                href={`/roles/${actualRoleSlug}`}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#21262D] text-slate-300 capitalize border border-[#30363D] hover:text-white transition"
              >
                {roleName}
              </Link>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3" />
                <span>Score {prompt.quality_score || 98}/100</span>
              </span>
            </div>

            <ShareButton title={cleanTitle} description={prompt.description} />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {cleanTitle}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            {prompt.description || promptBody.slice(0, 160) + '...'}
          </p>
        </div>

        {/* Interactive Customizer */}
        <PromptCustomizer
          initialPrompt={promptBody}
          promptTitle={cleanTitle}
          modelName={modelName}
          exampleInput={prompt.example_input}
        />

        {/* How to Use Section */}
        <section className="mt-14 pt-10 border-t border-[#30363D] space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">How to Execute This {taskName} Workflow</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {howToSteps.map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-1.5 shadow-sm"
              >
                <span className="text-[11px] font-bold text-emerald-400 font-mono">Step {item.step}</span>
                <h3 className="text-xs sm:text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Contextual FAQ */}
        <section className="mt-14 pt-10 border-t border-[#30363D] space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">
                Technical execution guidance for &apos;{cleanTitle}&apos;
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-[#161B22] border border-[#30363D] rounded-2xl p-4 transition open:border-emerald-500/40"
              >
                <summary className="text-xs sm:text-sm font-bold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-emerald-400 font-mono text-xs ml-2 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-[#30363D] leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Prompts Grid */}
        <RelatedPrompts
          currentId={prompt.id}
          modelSlug={actualModelSlug}
          professionSlug={actualRoleSlug}
        />
      </div>
    </>
  );
}
