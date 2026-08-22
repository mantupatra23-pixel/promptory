'use client';

import React from 'react';
import { X, ShieldCheck, Target, FileText, Zap, Eye } from 'lucide-react';
import { ScoreBreakdown } from '@/lib/qualityScore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  breakdown: ScoreBreakdown;
  title: string;
}

export default function QualityScoreModal({ isOpen, onClose, breakdown, title }: Props) {
  if (!isOpen) return null;

  const factors = [
    { label: 'Specificity', val: breakdown.specificity, icon: Target, desc: 'Clear task parameters and variable constraints' },
    { label: 'Context', val: breakdown.context, icon: ShieldCheck, desc: 'Persona role, scenario background, target audience' },
    { label: 'Structure', val: breakdown.structure, icon: FileText, desc: 'Formatting rules, markdown blocks, step ordering' },
    { label: 'Actionability', val: breakdown.actionability, icon: Zap, desc: 'Direct imperative instructions and zero-ambiguity' },
    { label: 'Clarity', val: breakdown.clarity, icon: Eye, desc: 'Conciseness, high readability, and clean phrasing' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#12161F] border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Audit Verified
              </span>
              <span className="text-xs text-zinc-500">Deterministic Engine</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Quality Score Breakdown</h3>
            <p className="text-xs text-zinc-400 truncate max-w-[280px]">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800/60 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Score Banner */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0D12] border border-zinc-800 mb-5">
          <span className="text-sm font-medium text-zinc-300">Overall Prompt Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-400">{breakdown.total}</span>
            <span className="text-xs text-zinc-500 font-bold">/100</span>
          </div>
        </div>

        {/* 5 Factor Breakdown */}
        <div className="space-y-3.5">
          {factors.map((f) => {
            const Icon = f.icon;
            const percentage = (f.val / 20) * 100;
            return (
              <div key={f.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    {f.label}
                  </span>
                  <span className="font-semibold text-zinc-300">{f.val} <span className="text-zinc-600">/ 20</span></span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500 leading-tight">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
        >
          Close Breakdown
        </button>
      </div>
    </div>
  );
}
