'use client';
import { Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  title?: string;
  price?: string;
}

export default function ProPaywall({ 
  title = "Unlock Advanced Multi-Step AI Automation",
  price = "$9/mo" 
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-[#080B10]/90 backdrop-blur-md p-6 sm:p-8 text-center my-6 shadow-2xl">
      {/* GLOW EFFECT */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto space-y-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
          <Lock className="w-5 h-5" />
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
            PRO ACCESS ONLY
          </span>
          <h3 className="text-lg font-bold text-zinc-100 mt-1">{title}</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Get unrestricted access to chained multi-step prompt pipelines, automated variables, and private production recipes.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => alert('Monetization gateway (Stripe/Razorpay) will connect here.')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" /> Unlock All Pro Recipes ({price})
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 pt-2 font-mono">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Instant Access</span>
          <span>•</span>
          <span>Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
}
