'use client';

import React, { useState } from 'react';
import { HelpCircle, BookOpen, ChevronDown, CheckCircle2, Sliders, Play, Copy, ShieldCheck } from 'lucide-react';
import { PromptVariable } from '@/lib/variableParser';

interface Props {
  promptTitle: string;
  modelName: string;
  roleName: string;
  description?: string;
  variables: PromptVariable[];
  qualityScore: number;
}

export default function PromptGuideAndFAQ({
  promptTitle,
  modelName,
  roleName,
  description,
  variables,
  qualityScore,
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const variableNames = variables.map((v) => `[${v.key}]`).join(', ');

  const steps = [
    {
      num: '01',
      title: 'Configure Custom Variables',
      desc: variables.length > 0 
        ? `Fill in the dynamic inputs above (${variableNames}) with your specific context and task requirements.`
        : `Review the default prompt instructions and insert your domain context directly into the template.`,
      icon: Sliders,
    },
    {
      num: '02',
      title: 'Select Tone & Output Format',
      desc: `Adjust output constraints (e.g. Markdown, Table, Technical, Concise) to match your workflow specifications.`,
      icon: BookOpen,
    },
    {
      num: '03',
      title: 'Launch in 1-Click or Copy',
      desc: `Tap the "Copy Final Prompt" button or click any AI App launcher (${modelName}, Claude, Perplexity) to auto-copy and launch.`,
      icon: Copy,
    },
    {
      num: '04',
      title: 'Execute & Iterate',
      desc: `Paste into the chat interface. Because the prompt is deterministic (Score: ${qualityScore}/100), you will receive high-accuracy results immediately.`,
      icon: Play,
    },
  ];

  const faqs = [
    {
      q: `What is the best way to run "${promptTitle}" in ${modelName}?`,
      a: `To maximize output quality in ${modelName}, replace all placeholder parameters with detailed real-world data rather than generic summaries. Setting your desired output format (like Markdown or JSON) ensures structured formatting on the first response.`,
    },
    {
      q: `Can I use this prompt with other AI models besides ${modelName}?`,
      a: `Yes. While specifically tuned for ${modelName}, this prompt follows universal prompt engineering standards (role framing, clear constraints, few-shot conditioning) and works seamlessly with ChatGPT, Claude 3.5 Sonnet, Google Gemini, and DeepSeek-R1.`,
    },
    {
      q: variables.length > 0
        ? `What variables are required to customize this template?`
        : `Does this prompt require custom variables?`,
      a: variables.length > 0
        ? `This prompt requires ${variables.length} custom parameter${variables.length > 1 ? 's' : ''}: ${variableNames}. When filled, Promptory automatically compiles them into a single production-ready instruction set.`
        : `This prompt is ready for zero-shot deployment, meaning you can copy and run it immediately without mandatory template parameters.`,
    },
    {
      q: `Why does this prompt have a quality audit score of ${qualityScore}/100?`,
      a: `Promptory audits prompts across 5 deterministic criteria: Specificity (parameters), Context (role framing), Structure (formatting rules), Actionability (imperative clarity), and Token Conciseness. This prompt scored ${qualityScore}/100 for high execution reliability.`,
    },
    {
      q: `Is this prompt suitable for ${roleName} workflows?`,
      a: `Yes. This template is designed specifically for ${roleName} operators to automate repetitive cognitive tasks, reduce hallucination risks, and maintain professional standards across deliverables.`,
    },
  ];

  return (
    <div className="space-y-10 mt-14 pt-10 border-t border-zinc-800/80">
      
      {/* HOW TO USE SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h2 className="text-lg font-bold text-zinc-100">
            How to Use This <span className="text-emerald-400">{modelName}</span> Prompt
          </h2>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Follow these 4 steps to deploy this verified {roleName} prompt into your AI workspace.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#12161F]/80 border border-zinc-800/90 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Step {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-zinc-500" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-100 mb-1.5">{step.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC FAQ ACCORDION SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <h2 className="text-lg font-bold text-zinc-100">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Dynamic guidance and operational advice for "{promptTitle}".
        </p>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="bg-[#12161F]/90 border border-zinc-800/90 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-zinc-200">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 bg-[#0A0D12]/50 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
