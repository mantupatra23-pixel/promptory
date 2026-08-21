'use client';
import { useState } from 'react';
import PromptCustomizer from './PromptCustomizer';
import { CheckCircle2, Circle, ArrowRight, Layers, Clock, Cpu } from 'lucide-react';

interface Step {
  id: string;
  step_order: number;
  title: string;
  description: string;
  model_name: string;
  prompt_template: string;
  example_input?: string;
}

interface Workflow {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  estimated_time: string;
  models_used: string[];
  steps: Step[];
}

export default function WorkflowRunner({ workflow }: { workflow: Workflow }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = workflow.steps[activeStepIndex];

  return (
    <div className="space-y-8">
      {/* STEPS TIMELINE SELECTOR */}
      <div className="bg-[#0F141C] border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-4 border-b border-zinc-800/80 pb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Multi-Step Recipe</span>
              <h2 className="text-base font-bold text-zinc-100">{workflow.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-zinc-500" /> {workflow.estimated_time}</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-zinc-500" /> {workflow.models_used.join(', ')}</span>
          </div>
        </div>

        {/* STEP BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {workflow.steps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const isDone = idx < activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                  isActive
                    ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg'
                    : isDone
                    ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    : 'bg-zinc-900/30 border-zinc-900 text-zinc-500 hover:border-zinc-800'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                    <span>Step {idx + 1}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                      {step.model_name}
                    </span>
                  </div>
                  <h4 className={`text-xs font-semibold mt-0.5 line-clamp-1 ${isActive ? 'text-zinc-100' : 'text-zinc-300'}`}>
                    {step.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE STEP DETAILS & CUSTOMIZER */}
      {activeStep && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
            <div>
              <span className="text-xs font-mono text-emerald-400">Step {activeStepIndex + 1} of {workflow.steps.length}</span>
              <h3 className="text-lg font-bold text-zinc-100">{activeStep.title}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{activeStep.description}</p>
            </div>
            {activeStepIndex < workflow.steps.length - 1 && (
              <button
                onClick={() => setActiveStepIndex((prev) => Math.min(workflow.steps.length - 1, prev + 1))}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}
          </div>

          <PromptCustomizer
            promptId={activeStep.id}
            promptTitle={`${workflow.title} - Step ${activeStepIndex + 1}`}
            template={activeStep.prompt_template}
            exampleInput={activeStep.example_input}
          />
        </div>
      )}
    </div>
  );
}
