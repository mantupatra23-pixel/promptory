import { notFound } from 'next/navigation';
import { getWorkflowBySlug } from '@/lib/db';
import WorkflowRunner from '@/components/WorkflowRunner';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60;

export default async function WorkflowDetailPage({ params }: { params: { slug: string } }) {
  const workflow = await getWorkflowBySlug(params.slug);

  if (!workflow) {
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-zinc-300">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/workflows" className="hover:text-zinc-300">Workflows</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-emerald-400">{workflow.title}</span>
      </nav>

      {/* RUNNER INTERFACE */}
      <WorkflowRunner workflow={workflow} />
    </div>
  );
}
