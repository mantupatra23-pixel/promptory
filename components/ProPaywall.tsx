'use client';

import React, { useEffect, useState } from 'react';
import { Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCheckoutUrl } from '@/lib/checkout';

interface Props {
  title?: string;
  description?: string;
  price?: string;
  onClose?: () => void;
}

export default function ProPaywall({ 
  title = "Unlock Advanced Multi-Model AI Simulation",
  description = "Get unrestricted access to parallel model comparisons, deep reasoning models, and instant IDE rule export.",
  price = "₹799/mo",
  onClose
}: Props) {
  const [checkoutUrl, setCheckoutUrl] = useState(getCheckoutUrl());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setCheckoutUrl(getCheckoutUrl(session.user.email));
      }
    });
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-[#0D1117]/95 backdrop-blur-xl p-6 sm:p-8 text-center my-6 shadow-2xl shadow-emerald-950/30">
      {/* GLOW EFFECT */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-32 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto space-y-4">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            PRO FEATURE ONLY
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white pt-1">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Unlock All Pro Features ({price})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#161B22] border border-[#30363D] transition"
            >
              Dismiss
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-2 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Instant Access
          </span>
          <span>•</span>
          <span>Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
}
