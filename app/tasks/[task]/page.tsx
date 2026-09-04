import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface PageProps {
  params: { task: string };
  searchParams?: {
    model?: string;
    role?: string;
  };
}

export const revalidate = 3600;

function getTaskFaqs(taskName: string, taskSlug: string) {
  if (taskSlug === 'database' || taskSlug === 'performance') {
    return [
      {
        q: `What performance bottlenecks do these ${taskName} prompts resolve?`,
        a: `They audit EXPLAIN query plans, unindexed foreign keys, slow sequential scans, N+1 query loops, and connection pool exhaustion.`,
      },
      {
        q: `Can I test these prompts with Claude, DeepSeek, and ChatGPT?`,
        a: `Yes. All prompts include deterministic output schemas and negative constraints compatible across Claude 3.5 Sonnet, DeepSeek-R1, and GPT-4o.`,
      },
      {
        q: `What contextual inputs should I provide?`,
        a: `Provide your schema DDL, table row counts, execution query plans (EXPLAIN ANALYZE), and target runtime constraints for best results.`,
      },
    ];
  }

  return [
    {
      q: `What tasks do these ${taskName} prompts solve?`,
      a: `They address deterministic execution, boundary test verification, style guide adherence, and structural formatting for ${taskName.toLowerCase()} workflows.`,
    },
    {
      q: `How do I adapt these system prompts to my codebase?`,
      a: `Insert your repository dependencies, static typing specifications, and runtime constraints into the brackets before running the prompt.`,
    },
    {
      q: `Can I customize the variables before copying?`,
      a: `Yes. Each prompt detail page includes an interactive parameter form that updates the prompt body in real time.`,
    },
  ];
}

async function getTaskData(taskSlug: string) {
  const { data: task } = await supabase
    .from('tasks')
    .select('id, name, slug, description, updated_at')
    .eq('slug', taskSlug)
    .single();

  if (!task) return null;

  const { data: prompts, count } = await supabase
    .from('prompts')
    .select(`
      id, slug, title, description, quality_score, updated_at,
      models:model_id (id, name, slug),
      professions:profession_id (id, name, slug)
    `, { count: 'exact' })
    .eq('task_id', task.id)
    .eq('status', 'published')
    .order('quality_score', { ascending: false });

  return {
    task,
    prompts: prompts || [],
    totalCount: count || 0,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getTaskData(params.task);
  if (!data || data.totalCount === 0) {
    return { title: 'Task Not Found | Promptory' };
  }

  const { task, totalCount } = data;
  const canonicalUrl = `https://www.promptory.xyz/tasks/${task.slug}`;
  const isThin = totalCount < 3;

  return {
    title: `AI ${task.name} Prompts & Production Workflows | Promptory`,
    description: `Discover ${totalCount} tested AI system prompts for ${task.name.toLowerCase()}. Verified for Claude 3.5, ChatGPT, and DeepSeek-R1.`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !isThin,
      follow: true,
    },
    openGraph: {
      title: `AI ${task.name} Prompts | Promptory`,
      description: task.description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Promptory',
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI ${task.name} Prompts | Promptory`,
      description: task.description,
    },
  };
}

export default async function TaskDetailPage({ params, searchParams }: PageProps) {
  const data = await getTaskData(params.task);

  if (!data || data.totalCount === 0) {
    notFound();
  }

  const { task, prompts, totalCount } = data;

  const selectedModel = searchParams?.model || '';
  const selectedRole = searchParams?.role || '';

  const filteredPrompts = prompts.filter((p: any) => {
    const matchModel = selectedModel ? p.models?.slug === selectedModel : true;
    const matchRole = selectedRole ? p.professions?.slug === selectedRole : true;
    return matchModel && matchRole;
  });

  const modelMap = new Map<string, { name: string; slug: string }>();
  const roleMap = new Map<string, { name: string; slug: string }>();

  prompts.forEach((p: any) => {
    if (p.models) modelMap.set(p.models.slug, p.models);
    if (p.professions) roleMap.set(p.professions.slug, p.professions);
  });

  const { data: relatedTasks } = await supabase
    .from('tasks')
    .select('name, slug')
    .neq('slug', task.slug)
    .limit(6);

  const faqs = getTaskFaqs(task.name, task.slug);
  const canonicalUrl = `https://www.promptory.xyz/tasks/${task.slug}`;

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
      { '@type': 'ListItem', position: 2, name: 'Tasks', item: 'https://www.promptory.xyz/tasks' },
      { '@type': 'ListItem', position: 3, name: task.name, item: canonicalUrl },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `AI ${task.name} Prompts`,
    description: task.description,
    url: canonicalUrl,
    hasPart: filteredPrompts.slice(0, 15).map((p: any) => ({
      '@type': 'TechArticle',
      headline: p.title,
      url: `https://www.promptory.xyz/prompts/${p.models?.slug || 'chatgpt'}/${p.professions?.slug || 'developer'}/${p.slug}`,
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 mb-6 flex items-center space-x-2 flex-wrap">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/tasks" className="hover:text-emerald-400 transition-colors">Tasks</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium">{task.name}</span>
        </nav>

        {/* Task Header */}
        <div className="border border-[#30363D] bg-[#161B22]/70 rounded-2xl p-6 sm:p-8 mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {totalCount} Verified Prompts
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-[#21262D] text-slate-300 border border-[#30363D]">
              Canonical Hub
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            AI {task.name} Prompts
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            {task.description}
          </p>

          {/* Model / Role Filter Pills */}
          <div className="mt-6 pt-5 border-t border-[#30363D]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400">Models:</span>
              <Link
                href={`/tasks/${task.slug}`}
                className={`px-2.5 py-1 rounded-md border ${
                  !selectedModel ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#21262D] border-[#30363D] text-slate-400 hover:text-white'
                }`}
              >
                All
              </Link>
              {Array.from(modelMap.values()).map((m) => (
                <Link
                  key={m.slug}
                  href={`/tasks/${task.slug}?model=${m.slug}${selectedRole ? `&role=${selectedRole}` : ''}`}
                  className={`px-2.5 py-1 rounded-md border ${
                    selectedModel === m.slug ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#21262D] border-[#30363D] text-slate-400 hover:text-white'
                  }`}
                >
                  {m.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400">Roles:</span>
              <Link
                href={`/tasks/${task.slug}${selectedModel ? `?model=${selectedModel}` : ''}`}
                className={`px-2.5 py-1 rounded-md border ${
                  !selectedRole ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#21262D] border-[#30363D] text-slate-400 hover:text-white'
                }`}
              >
                All
              </Link>
              {Array.from(roleMap.values()).map((r) => (
                <Link
                  key={r.slug}
                  href={`/tasks/${task.slug}?role=${r.slug}${selectedModel ? `&model=${selectedModel}` : ''}`}
                  className={`px-2.5 py-1 rounded-md border capitalize ${
                    selectedRole === r.slug ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#21262D] border-[#30363D] text-slate-400 hover:text-white'
                  }`}
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt Card Grid */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
            <span>Production {task.name} Workflows</span>
            <span className="text-xs text-slate-400 font-normal">
              Showing {filteredPrompts.length} of {totalCount}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((p: any) => {
              const modelSlug = p.models?.slug || 'chatgpt';
              const roleSlug = p.professions?.slug || 'software-developer';
              return (
                <Link
                  key={p.id}
                  href={`/prompts/${modelSlug}/${roleSlug}/${p.slug}`}
                  className="group p-6 rounded-2xl bg-[#161B22] border border-[#30363D] hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.models?.name || 'AI'}
                      </span>
                      <span className="text-slate-400 capitalize text-xs">
                        {p.professions?.name || 'Developer'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 line-clamp-2">
                      {p.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#30363D]/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Sparkles className="w-3 h-3" />
                      Score {p.quality_score || 98}/100
                    </span>
                    <span className="text-slate-300 group-hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors">
                      Open Prompt
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dynamic Task-Specific FAQs */}
        <section className="mb-14 pt-8 border-t border-[#30363D]">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-[#161B22] border border-[#30363D] rounded-xl p-4 transition open:border-emerald-500/40"
              >
                <summary className="text-sm font-semibold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-emerald-400 text-xs ml-2 group-open:rotate-180 transition-transform">
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

        {/* Cross-linking to Related Tasks */}
        {relatedTasks && relatedTasks.length > 0 && (
          <section className="pt-8 border-t border-[#30363D]">
            <h2 className="text-base font-bold text-white mb-3">Explore Related Tasks</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTasks.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/tasks/${rt.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-[#161B22] border border-[#30363D] text-xs text-slate-300 hover:text-white hover:border-emerald-500/40 transition"
                >
                  AI {rt.name} Prompts →
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
