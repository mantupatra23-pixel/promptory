import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { WORKFLOWS_DATA } from '@/lib/workflowsData';
import { Workflow, Sparkles, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Workflow Recipes | Multi-Prompt Automation Pipelines | Promptory',
  description: 'End-to-end chained sequences of prompts designed to execute complete business operations from strategy to output.',
  alternates: {
    canonical: 'https://www.promptory.xyz/workflows',
  },
};

export default function WorkflowsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#12161F]/60 backdrop-blur rounded-2xl p-6 md:p-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Workflow className="w-3.5 h-3.5" />
          <span>Multi-Prompt Automation</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight">
          AI Workflow <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Recipes</span>
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm max-w-2xl">
          Chained sequences of verified prompts designed to execute complete business operations from initial strategy to production-ready output.
        </p>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORKFLOWS_DATA.map((wf) => (
          <div
            key={wf.slug}
            className="group bg-[#12161F]/90 border border-zinc-800/90 hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {wf.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{wf.estTime}</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors mb-2">
                {wf.title}
              </h2>

              {/* Description */}
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed mb-6">
                {wf.description}
              </p>

              {/* Step Sequence Pills */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Workflow Pipeline ({wf.steps.length} Steps):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {wf.steps.map((step, idx) => (
                    <span
                      key={step.id}
                      className="px-2.5 py-1 rounded-lg bg-[#0A0D12] border border-zinc-800 text-[11px] font-mono text-zinc-300"
                    >
                      {idx + 1}. {step.title.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <Link
              href={`/workflows/${wf.slug}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition group-hover:bg-emerald-500 group-hover:text-black shadow-md"
            >
              <span>Run Workflow Sequence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
