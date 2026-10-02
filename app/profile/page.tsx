'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getCheckoutUrl } from '@/lib/checkout';
import { 
  CreditCard, 
  Sparkles, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  Loader2, 
  Terminal,
  Clock,
  Layers
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [subData, setSubData] = useState<any>(null);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Auto-grant Pro if Admin Email
      if (user.email === 'mantupatra23@gmail.com') {
        localStorage.setItem('promptory_pro_active', 'true');
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setSubData(data);
          if (data.status === 'active') {
            localStorage.setItem('promptory_pro_active', 'true');
          }
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('promptory_pro_active');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Loading developer profile...</span>
        </div>
      </div>
    );
  }

  const isPro = subData?.status === 'active' || user?.email === 'mantupatra23@gmail.com';
  const dynamicCheckoutUrl = getCheckoutUrl(user?.email);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xl shadow-inner">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white truncate max-w-[240px] sm:max-w-none">
                {user?.email}
              </h1>
              {isPro ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> PRO MEMBER
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  FREE TIER
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Joined {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#0D1117] border border-[#30363D] hover:border-red-500/40 hover:text-red-400 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Subscription & Plan</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {user?.email === 'mantupatra23@gmail.com' ? 'SuperAdmin Access' : 'Billing via Lemon Squeezy'}
              </span>
            </div>

            {isPro ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                      Active Plan
                    </span>
                    <h3 className="text-base font-bold text-white">Promptory Pro (Lifetime Developer)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">₹0 • Unlimited Cloud Executions</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Active Pro
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Free Community Plan</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Upgrade to unlock dual-model reasoning comparisons, GPT-OSS 120B simulations, and direct IDE sync.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">₹0/mo</span>
                </div>

                <div className="pt-2">
                  <a
                    href={dynamicCheckoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-black" />
                    <span>Upgrade to Pro (₹799/mo)</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#30363D]">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Developer Entitlements</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                <span className="text-slate-300">Single Model AI Preview</span>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                <span className="text-slate-300">Parallel Dual-Model Simulator</span>
                <span className={isPro ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {isPro ? "Unlocked" : "Pro Only"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                <span className="text-slate-300">GPT-OSS 120B Reasoning</span>
                <span className={isPro ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {isPro ? "Unlocked" : "Pro Only"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                <span className="text-slate-300">Automated CLI (npx sync)</span>
                <span className={isPro ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {isPro ? "Unlocked" : "Pro Only"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-200">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">CLI Integration</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pull blueprints directly into your workspace:
            </p>
            <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] font-mono text-[11px] text-emerald-400 overflow-x-auto select-all">
              npx promptory-cli pull --all
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
