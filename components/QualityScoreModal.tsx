'use client';

import React from 'react';
import { X, Target, ShieldCheck, FileText, Zap, Eye, CheckCircle2 } from 'lucide-react';
import { QualityScoreBreakdown } from '@/lib/qualityScore';

export interface QualityScoreModalProps {
  isOpen?: boolean;
  title: string;
  breakdown: QualityScoreBreakdown;
  onClose: () => void;
}

export default function QualityScoreModal({
  isOpen = true,
  title,
  breakdown,
  onClose,
}: QualityScoreModalProps) {
  if (!isOpen) return null;

  const metrics = [
    { label: 'Specificity', val: breakdown.specificity, icon: Target, desc: 'Clarity of parameters & variables' },
    { label: 'Context Framing', val: breakdown.context, icon: ShieldCheck, desc: 'Role framing & domain perspective' },
    { label: 'Structural Rules', val: breakdown.structure, icon: FileText, desc: 'Format constraints & structured output' },
    { label: 'Actionability', val: breakdown.actionability, icon: Zap, desc: 'Direct imperative instructions' },
    { label: 'Clarity & Brevity', val: breakdown.clarity, icon: Eye, desc: 'Token efficiency & zero fluff' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#1e2330] border border-slate-700/90 rounded-2xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/70">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Audit Breakdown
            </span>
            <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overall Score Banner */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#181b24] border border-slate-700/60">
          <div>
            <div className="text-xs font-semibold text-slate-300">Composite Quality Score</div>
            <div className="text-[11px] text-slate-500">Deterministic 5-factor evaluation</div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-400">{breakdown.total}</span>
            <span className="text-xs font-bold text-slate-500">/100</span>
          </div>
        </div>

        {/* Metrics List */}
        <div className="space-y-3">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {m.label}
                  </span>
                  <span className="font-mono text-slate-300 font-bold">{m.val} / 20</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${(m.val / 20) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition border border-slate-700/80"
        >
          Close Audit Report
        </button>

      </div>
    </div>
  );
}
