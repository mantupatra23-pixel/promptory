'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { WORKFLOWS_DATA } from '@/lib/workflowsData';
import PromptCustomizer from '@/components/PromptCustomizer';
import { ChevronRight, ArrowLeft, CheckCircle2, Circle, Clock, Sparkles, ArrowRight, Layers } from 'lucide-react';

export default function WorkflowExecutionPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const workflow = WORKFLOWS_DATA.find((w) => w.slug === slug);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!workflow) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Workflow Not Found</h2>
        <Link href="/workflows" className="text-emerald-400 text-xs hover:underline">
          Return to Workflows
        </Link>
      </div>
    );
  }

  const currentStep = workflow.steps[activeStepIndex];
  const totalSteps = workflow.steps.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6 flex-wrap">
        <Link href="/workflows" className="hover:text-emerald-400 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Workflows</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <span className="text-zinc-100 font-medium">{workflow.title}</span>
      </div>

      {/* Header Info */}
      <div className="border border-zinc-800 bg-[#12161F]/60 backdrop-blur rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {workflow.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Est. {workflow.estTime}</span>
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 mb-2">
          {workflow.title}
        </h1>
        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
          {workflow.description}
        </p>
      </div>

      {/* Step Pipeline Tracker */}
      <div className="mb-8 p-4 rounded-2xl bg-[#12161F] border border-zinc-800">
        <span className="text-xs font-bold text-zinc-400 block mb-3">Pipeline Progression:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {workflow.steps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const isCompleted = idx < activeStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-zinc-100 shadow-md'
                    : isCompleted
                    ? 'bg-[#0A0D12] border-emerald-800/40 text-zinc-300'
                    : 'bg-[#0A0D12] border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
                <div className="truncate">
                  <div className="text-xs font-semibold truncate">{step.title}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{step.model}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Banner & Context */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0D12] border border-zinc-800 mb-6">
        <div>
          <div className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
            Step {activeStepIndex + 1} of {totalSteps}
          </div>
          <h2 className="text-base font-bold text-zinc-100">{currentStep.title}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{currentStep.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {activeStepIndex > 0 && (
            <button
              onClick={() => setActiveStepIndex((prev) => prev - 1)}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white transition"
            >
              Previous Step
            </button>
          )}
          {activeStepIndex < totalSteps - 1 ? (
            <button
              onClick={() => setActiveStepIndex((prev) => prev + 1)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              Pipeline Finished
            </span>
          )}
        </div>
      </div>

      {/* Interactive Customizer for Active Step */}
      <PromptCustomizer
        key={currentStep.id}
        initialPrompt={currentStep.template}
        promptTitle={currentStep.title}
        modelName={currentStep.model}
        exampleInput={currentStep.defaultInputs}
      />

    </div>
  );
}
