'use client';

import React, { useState } from 'react';
import { Workflow, Sparkles, ArrowRight, Play, Copy, Check, ChevronRight, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface WorkflowStep {
  step: number;
  title: string;
  targetModel: string;
  template: string;
  explanation: string;
}

interface WorkflowItem {
  id: string;
  title: string;
  category: string;
  description: string;
  totalTime: string;
  steps: WorkflowStep[];
}

const PREBUILT_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'b2b-cold-outreach-engine',
    title: 'B2B Cold Outreach Synthesis Machine',
    category: 'Sales & Growth',
    totalTime: '3 Mins Execution',
    description: 'A 3-step chained prompt pipeline that takes a company domain, extracts deep pain points, and drafts personalized hyper-targeted cold emails.',
    steps: [
      {
        step: 1,
        title: 'Prospect Analysis & ICP Extraction',
        targetModel: 'Perplexity / Claude',
        template: 'Act as a Senior B2B Market Researcher. Analyze the target company [COMPANY_NAME] and domain [WEBSITE_URL]. Identify their primary value proposition, target customer profile, and top 3 operational bottlenecks.',
        explanation: 'Gathers deep business intelligence and finds leverage points.',
      },
      {
        step: 2,
        title: 'Pain Point to Solution Mapping',
        targetModel: 'Claude 3.5 Sonnet',
        template: 'Based on the company profile above, map out how [MY_SAAS_PRODUCT] directly solves their primary bottleneck. Create a 3-bullet contrast highlighting time/revenue lost vs saved.',
        explanation: 'Bridges prospect weaknesses to your product strengths.',
      },
      {
        step: 3,
        title: 'High-Converting 3-Sentence Cold Email',
        targetModel: 'ChatGPT / Claude',
        template: 'Write a 75-word cold outreach email to the VP of Engineering at [COMPANY_NAME]. Include a personalized observation from Step 1, the value proposition from Step 2, and end with a low-friction CTA proposing a 7-minute async review.',
        explanation: 'Generates non-salesy, high-response outreach copy.',
      },
    ],
  },
  {
    id: 'fullstack-fastapi-audit-engine',
    title: 'Full-Stack Async Code Review & Security Audit',
    category: 'Engineering & DevOps',
    totalTime: '5 Mins Execution',
    description: 'Automated 3-phase software audit pipeline that catches concurrency race conditions, security flaws, and auto-generates unit tests.',
    steps: [
      {
        step: 1,
        title: 'Async Concurrency & Pool Starvation Check',
        targetModel: 'Claude 3.5 Sonnet',
        template: 'Act as a Principal Backend Engineer. Audit the following Python FastAPI code snippet for asynchronous blocking calls, SQLAlchemy pool leaks, and memory bottlenecks: [CODE_SNIPPET].',
        explanation: 'Identifies performance-degrading sync blocks in async event loops.',
      },
      {
        step: 2,
        title: 'OWASP Security & Injection Vulnerability Audit',
        targetModel: 'DeepSeek-R1 / Claude',
        template: 'Scan the code from Step 1 for OWASP Top 10 vulnerabilities (SQLi, IDOR, SSRF, broken auth). Provide a severity matrix and hardened patch recommendations.',
        explanation: 'Hardens API endpoints against security breaches.',
      },
      {
        step: 3,
        title: 'Pytest Asyncio Unit & Integration Test Suite',
        targetModel: 'ChatGPT / Claude',
        template: 'Generate a comprehensive pytest-asyncio test suite for the patched endpoint. Include edge cases for timeouts, database connection errors, and invalid JWT authentication.',
        explanation: 'Ensures 100% test coverage for mission-critical endpoints.',
      },
    ],
  },
];

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem>(PREBUILT_WORKFLOWS[0]);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const handleCopyStep = async (stepNum: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepNum);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header */}
      <div className="border border-[#30363D] bg-[#161B22] rounded-2xl p-6 md:p-8 mb-8 shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Workflow className="w-3.5 h-3.5" />
          <span>Multi-Step AI Synthesizer</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          Chained AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Workflows</span>
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
          Single prompts solve isolated questions. Chained workflows connect multiple deterministic prompt steps to automate complex end-to-end business operations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Workflow Selection Column */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Available Workflows
          </h2>

          <div className="space-y-3">
            {PREBUILT_WORKFLOWS.map((wf) => {
              const isSelected = selectedWorkflow.id === wf.id;
              return (
                <button
                  key={wf.id}
                  onClick={() => setSelectedWorkflow(wf)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 shadow-md ${
                    isSelected
                      ? 'bg-[#1C2128] border-emerald-500/60 ring-1 ring-emerald-500/30'
                      : 'bg-[#161B22] border-[#30363D] hover:border-slate-500 hover:bg-[#1C2128]/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {wf.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{wf.totalTime}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1">{wf.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{wf.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Stepper Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-[#30363D] mb-6">
              <div>
                <span className="text-xs font-bold text-emerald-400">Step-by-Step Execution</span>
                <h3 className="text-lg font-bold text-white">{selectedWorkflow.title}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-[#0D1117] px-3 py-1 rounded-lg border border-[#30363D]">
                {selectedWorkflow.steps.length} Sequenced Prompts
              </span>
            </div>

            <div className="space-y-6">
              {selectedWorkflow.steps.map((s) => (
                <div
                  key={s.step}
                  className="bg-[#0D1117] border border-[#30363D] rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center">
                        {s.step}
                      </span>
                      <h4 className="text-sm font-bold text-white">{s.title}</h4>
                    </div>

                    <span className="text-[11px] text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {s.targetModel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{s.explanation}</p>

                  <div className="relative">
                    <pre className="p-3.5 rounded-xl bg-[#161B22] border border-[#30363D] text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                      {s.template}
                    </pre>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCopyStep(s.step, s.template)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-bold transition border border-[#30363D]"
                    >
                      {copiedStep === s.step ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied Step {s.step}!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Step {s.step} Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
