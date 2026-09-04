import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { generateTopicFaqs } from '@/lib/seo';
import { normalizePrompt } from '@/lib/prompts/normalizePrompt';

interface PageProps {
  params: { task: string };
  searchParams?: {
    model?: string;
    role?: string;
  };
}

export const revalidate = 60;

const TASK_KEYWORD_MAP: Record<string, string[]> = {
  debugging: ['debug', 'bug', 'error', 'exception', 'troubleshoot', 'crash', 'trace'],
  'bug-debugging': ['debug', 'bug', 'error', 'exception', 'troubleshoot', 'crash', 'trace'],
  coding: ['code', 'fastapi', 'react', 'typescript', 'python', 'nextjs', 'backend', 'api'],
  database: ['postgres', 'database', 'sql', 'query', 'redis', 'migration', 'schema'],
  testing: ['test', 'pytest', 'playwright', 'jest', 'vitest', 'coverage'],
  performance: ['performance', 'latency', 'throughput', 'caching', 'concurrency', 'profiling'],
  security: ['security', 'vulnerability', 'auth', 'jwt', 'rbac', 'owasp', 'injection'],
  seo: ['seo', 'search', 'serp', 'keyword', 'meta', 'ranking', 'sitemap'],
  'content-writing': ['content', 'blog', 'article', 'writing', 'copywriting'],
  'email-outreach': ['email', 'outreach', 'prospect', 'followup'],
  email: ['email', 'outreach', 'prospect', 'followup'],
  marketing: ['ads', 'marketing', 'conversion', 'campaign', 'landing'],
  'code-review': ['review', 'refactor', 'clean', 'smell'],
};

async function getTaskData(taskSlug: string) {
  const isDebug = taskSlug === 'debugging' || taskSlug === 'bug-debugging';

  const { data: task } = await supabase
    .from('tasks')
    .select('id, name, slug, description, updated_at')
    .or(isDebug ? 'slug.eq.debugging,slug.eq.bug-debugging' : `slug.eq.${taskSlug}`)
    .maybeSingle();

  if (!task) return null;

  // 1. Primary Query: Match by task_id or task_slug
  const filterClause = isDebug
    ? `task_id.eq.${task.id},task_slug.eq.debugging,task_slug.eq.bug-debugging`
    : `task_id.eq.${task.id},task_slug.eq.${task.slug},task_slug.eq.${taskSlug}`;

  let { data: rawPrompts } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .or(filterClause)
    .order('quality_score', { ascending: false });

  let validRaw = (rawPrompts || []).filter(
    (p) => p.status !== 'draft' && p.status !== 'rejected'
  );

  // 2. Automated Fallback: If 0 prompts mapped in DB, fetch by domain keyword match
  if (validRaw.length === 0) {
    const keywords = TASK_KEYWORD_MAP[taskSlug] || TASK_KEYWORD_MAP[task.slug] || [taskSlug];
    const orQuery = keywords
      .slice(0, 6)
      .map((k) => `title.ilike.%${k}%,description.ilike.%${k}%`)
      .join(',');

    const { data: fallbackPrompts } = await supabase
      .from('prompts')
      .select('*, model:models(*), profession:professions(*)')
      .or(orQuery)
      .order('quality_score', { ascending: false })
      .limit(30);

    validRaw = (fallbackPrompts || []).filter(
      (p) => p.status !== 'draft' && p.status !== 'rejected'
    );
  }

  const prompts = validRaw.map(normalizePrompt);

  return {
    task,
    prompts,
    totalCount: prompts.length,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getTaskData(params.task);
  if (!data) {
    return { title: 'Task Not Found | Promptory' };
  }

  const { task, totalCount } = data;
  const canonicalUrl = `https://www.promptory.xyz/tasks/${task.slug}`;

  return {
    title: `AI ${task.name} Prompts & Workflows | Promptory`,
    description: `Browse ${totalCount} tested AI system prompts for ${task.name.toLowerCase()}. Verified for Claude 3.5, ChatGPT, and DeepSeek-R1.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `AI ${task.name} Prompts | Promptory`,
      description: task.description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Promptory',
    },
  };
}

export default async function TaskDetailPage({ params, searchParams }: PageProps) {
  const data = await getTaskData(params.task);

  if (!data) {
    notFound();
  }

  const { task, prompts, totalCount } = data;
  const selectedModel = searchParams?.model || '';
  const selectedRole = searchParams?.role || '';

  const filteredPrompts = prompts.filter((p) => {
    const matchModel = selectedModel ? p.model?.slug === selectedModel : true;
    const matchRole = selectedRole ? p.profession?.slug === selectedRole : true;
    return matchModel && matchRole;
  });

  const modelMap = new Map<string, { name: string; slug: string }>();
  const roleMap = new Map<string, { name: string; slug: string }>();

  prompts.forEach((p) => {
    if (p.model?.slug) modelMap.set(p.model.slug, p.model);
    if (p.profession?.slug) roleMap.set(p.profession.slug, p.profession);
  });

  const { data: relatedTasks } = await supabase
    .from('tasks')
    .select('name, slug')
    .neq('slug', task.slug)
    .limit(6);

  const faqs = generateTopicFaqs(
    `AI ${task.name} Prompts`,
    task.description,
    'Claude & ChatGPT',
    'Software Engineers',
    task.slug
  );

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 mb-6 flex items-center space-x-2 flex-wrap">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/tasks" className="hover:text-emerald-400 transition-colors">Tasks</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium">{task.name}</span>
        </nav>

        {/* Header */}
        <div className="border border-[#30363D] bg-[#161B22]/70 rounded-2xl p-6 sm:p-8 mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {totalCount} Verified Prompts
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-[#21262D] text-slate-300 border border-[#30363D]">
              Canonical Task Hub
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            AI {task.name} Prompts
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            {task.description}
          </p>

          {/* Filters */}
          {(modelMap.size > 0 || roleMap.size > 0) && (
            <div className="mt-6 pt-5 border-t border-[#30363D]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              {modelMap.size > 0 && (
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
              )}

              {roleMap.size > 0 && (
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
              )}
            </div>
          )}
        </div>

        {/* Prompt Grid */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
            <span>{task.name} Workflows</span>
            <span className="text-xs text-slate-400 font-normal">
              Showing {filteredPrompts.length} of {totalCount}
            </span>
          </h2>

          {filteredPrompts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#161B22] border border-[#30363D] text-center text-slate-400 text-sm">
              No published prompts found for this filter combination.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((p) => {
                const modelSlug = p.model?.slug || 'chatgpt';
                const roleSlug = p.profession?.slug || 'software-developer';
                return (
                  <Link
                    key={p.id}
                    href={`/prompts/${modelSlug}/${roleSlug}/${p.slug}`}
                    className="group p-6 rounded-2xl bg-[#161B22] border border-[#30363D] hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                          {p.model?.name || 'AI'}
                        </span>
                        <span className="text-slate-400 capitalize text-xs bg-[#21262D] px-2 py-0.5 rounded border border-[#30363D]">
                          {p.profession?.name || 'Developer'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 line-clamp-2">
                        {p.seoTitle}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#30363D]/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Sparkles className="w-3 h-3" />
                        Score {p.qualityScore}/100
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
          )}
        </div>

        {/* Task FAQs */}
        {faqs.length > 0 && (
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
                    <span>{faq.question}</span>
                    <span className="text-emerald-400 text-xs ml-2 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-[#30363D] leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Tasks */}
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
