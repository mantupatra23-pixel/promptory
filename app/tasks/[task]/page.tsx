import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface PageProps {
  params: { task: string };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase.from('tasks').select('slug');
  return (data || []).map((t) => ({ task: t.slug }));
}

async function getTaskHubData(taskSlug: string) {
  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('slug', taskSlug)
    .single();

  if (!task) return null;

  const { data: prompts, count } = await supabase
    .from('prompts')
    .select(`
      id, slug, title, description, quality_score, updated_at,
      models:model_id(slug, name),
      professions:profession_id(slug, name)
    `, { count: 'exact' })
    .eq('task_slug', taskSlug)
    .order('quality_score', { ascending: false })
    .limit(30);

  return {
    task,
    prompts: (prompts || []) as any[],
    count: count || 0,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getTaskHubData(params.task);
  if (!data) return { title: 'Task Not Found | Promptory' };

  const { task, count } = data;
  const canonicalUrl = `https://www.promptory.xyz/tasks/${task.slug}`;
  const isThin = count < 3;

  return {
    title: `Best AI ${task.name} Prompts & Workflows | Promptory`,
    description: `Curated collection of verified AI system prompts for ${task.name.toLowerCase()}. Audited for Claude 3.5, ChatGPT-4o, and DeepSeek-R1.`,
    alternates: { canonical: canonicalUrl },
    robots: {
      index: !isThin,
      follow: true,
    },
    openGraph: {
      title: `AI ${task.name} Prompts & Workflows | Promptory`,
      description: task.description,
      url: canonicalUrl,
    },
  };
}

export default async function TaskHubPage({ params }: PageProps) {
  const data = await getTaskHubData(params.task);
  if (!data) notFound();

  const { task, prompts, count } = data;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `AI ${task.name} Prompts`,
    description: task.description,
    url: `https://www.promptory.xyz/tasks/${task.slug}`,
    hasPart: prompts.map((p) => ({
      '@type': 'TechArticle',
      headline: p.title,
      url: `https://www.promptory.xyz/prompts/${p.models?.slug || 'chatgpt'}/${p.professions?.slug || 'developer'}/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>/</span>
          <Link href="/directory" className="hover:text-emerald-400">Directory</Link>
          <span>/</span>
          <span className="text-gray-200 capitalize">{task.name}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            AI {task.name} Prompts
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl leading-relaxed mb-4">
            {task.description}
          </p>
          <div className="text-sm text-emerald-400 font-mono">
            {count} Production-Audited Workflows Available
          </div>
        </div>

        {prompts.length === 0 ? (
          <div className="p-8 text-center bg-gray-900 border border-gray-800 rounded-lg text-gray-400">
            Prompts for this task are currently undergoing quality review.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((p) => (
              <Link
                key={p.id}
                href={`/prompts/${p.models?.slug || 'chatgpt'}/${p.professions?.slug || 'developer'}/${p.slug}`}
                className="group p-6 bg-gray-900/60 hover:bg-gray-900 border border-gray-800 hover:border-emerald-500/50 rounded-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="font-mono text-emerald-400">{p.models?.name}</span>
                    <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300">{p.professions?.name}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {p.title}
                  </h2>
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                  <span>Score: {p.quality_score || 95}/100</span>
                  <span className="text-emerald-400 font-medium">Launch Prompt →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Explore Related Domains</h2>
          <div className="flex flex-wrap gap-2">
            {['coding', 'code-review', 'debugging', 'testing', 'performance', 'database', 'security', 'seo'].map((t) => (
              <Link
                key={t}
                href={`/tasks/${t}`}
                className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-sm text-gray-300 hover:text-white hover:border-gray-700 capitalize"
              >
                {t.replace('-', ' ')}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
