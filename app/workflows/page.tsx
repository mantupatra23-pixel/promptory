import Link from 'next/link';
import { getWorkflows } from '@/lib/db';
import { Layers, ArrowRight, Clock, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function WorkflowsDirectoryPage() {
  const workflows = await getWorkflows();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-2xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Prompt Automation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 mb-3">AI Workflow Recipes</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          End-to-end chained sequences of prompts designed to execute complete business operations from strategy to output.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map((wf: any) => (
          <div
            key={wf.id}
            className="p-6 rounded-xl bg-[#0F141C] border border-zinc-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-zinc-800 text-emerald-400 border border-zinc-700/60">
                  {wf.category}
                </span>
                <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {wf.estimated_time}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors mb-2">
                {wf.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {wf.description}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4 pt-4 border-t border-zinc-800/80">
                <span className="text-[11px] text-zinc-500 font-mono">Steps ({wf.steps?.length || 0}):</span>
                <div className="flex gap-1.5 flex-wrap">
                  {wf.steps?.map((st: any, i: number) => (
                    <span key={st.id} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {i + 1}. {st.title.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/workflows/${wf.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all group-hover:bg-emerald-500 group-hover:text-zinc-950"
              >
                Run Workflow Sequence <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
