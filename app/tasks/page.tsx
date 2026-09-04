import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Layers, ArrowRight } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'AI Prompts by Task & Workflow | Promptory',
  description:
    'Browse production AI prompts organized by engineering task: debugging, database optimization, code reviews, security, and automated testing.',
  alternates: {
    canonical: 'https://www.promptory.xyz/tasks',
  },
  openGraph: {
    title: 'AI Prompts by Task & Workflow | Promptory',
    description:
      'Browse production AI prompts organized by engineering task: debugging, database optimization, code reviews, and testing.',
    url: 'https://www.promptory.xyz/tasks',
    siteName: 'Promptory',
    type: 'website',
  },
};

export default async function TasksIndexPage() {
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, name, slug, description, updated_at')
    .order('name', { ascending: true });

  const { data: prompts } = await supabase
    .from('prompts')
    .select('task_id')
    .eq('status', 'published');

  const countMap = new Map<string, number>();
  (prompts || []).forEach((p) => {
    if (p.task_id) {
      countMap.set(p.task_id, (countMap.get(p.task_id) || 0) + 1);
    }
  });

  const activeTasks = (tasks || []).filter((t) => (countMap.get(t.id) || 0) > 0);

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
      { '@type': 'ListItem', position: 2, name: 'Tasks', item: 'https://www.promptory.xyz/tasks' },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Prompts by Task & Category',
    description: 'Index of engineering task categories and battle-tested AI workflows.',
    url: 'https://www.promptory.xyz/tasks',
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
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-200">Tasks</span>
        </nav>

        <div className="border border-[#30363D] bg-[#161B22]/70 rounded-2xl p-6 sm:p-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Task Taxonomy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            AI Prompts by Task
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Discover deterministic system instructions structured around real-world software development, architecture, and business execution goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTasks.map((t) => {
            const count = countMap.get(t.id) || 0;
            return (
              <Link
                key={t.id}
                href={`/tasks/${t.slug}`}
                className="group p-6 rounded-2xl bg-[#161B22] border border-[#30363D] hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-mono text-emerald-400 font-semibold">{count} Prompts</span>
                    <span className="text-slate-500 uppercase text-[10px] tracking-wider">Production Hub</span>
                  </div>
                  <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {t.name}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {t.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#30363D]/80 flex items-center justify-between text-xs font-medium text-emerald-400">
                  <span>Explore {t.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
