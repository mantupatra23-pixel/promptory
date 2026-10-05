'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Layers,
  Bookmark,
  FolderGit2,
  Download,
  Check,
  Copy,
  Crown
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [subData, setSubData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'submissions' | 'ide'>('overview');
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
  const [copiedCli, setCopiedCli] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // VIP Founder Rule: mantupatra23@gmail.com is always Pro
      const isVip = user.email?.toLowerCase() === 'mantupatra23@gmail.com';
      if (isVip) {
        localStorage.setItem('promptory_pro_active', 'true');
      }

      // Check Subscriptions Table
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
      }

      // Fetch User Submissions
      try {
        const { data: submissions } = await supabase
          .from('prompts')
          .select('*')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false });

        if (submissions) setUserSubmissions(submissions);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }

      // Fetch Local Saved Bookmarks
      try {
        const localSaved = JSON.parse(localStorage.getItem('promptory_saved') || '[]');
        setSavedItems(localSaved);
      } catch {
        setSavedItems([]);
      }

      setLoading(false);
    }

    loadUserData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('promptory_pro_active');
    router.push('/');
  };

  const isVipFounder = user?.email?.toLowerCase() === 'mantupatra23@gmail.com';
  const isPro = isVipFounder || subData?.status === 'active' || user?.user_metadata?.is_pro === true;
  
  const dynamicCheckoutUrl = typeof getCheckoutUrl === 'function' 
    ? getCheckoutUrl(user?.email) 
    : (process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL || 'https://promptory-ai.lemonsqueezy.com/checkout/buy/750e2a22-3cc6-45fe-9b40-b4549cd38f8c');

  const copyCliCommand = () => {
    navigator.clipboard.writeText('npx promptory-cli pull --all');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const downloadRules = (filename: string) => {
    const content = `# Promptory Deterministic AI Rules\n# Target User: ${user?.email}\n# Generated from promptory.xyz\n\n- Strict typing: Enforce zero 'any' placeholders in production code\n- Isolate boundary contracts and DB schemas before writing application logic\n- Enforce non-conversational, zero-fluff code blocks\n- Append strict regression test fixtures across all PR outputs\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] bg-[#07090e] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Loading developer profile & entitlements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Identity & Plan Header */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-2xl shadow-inner">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-[220px] sm:max-w-none">
                  {user?.email}
                </h1>
                {isVipFounder ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-black flex items-center gap-1 shadow-md shadow-emerald-500/20">
                    <Crown className="w-3 h-3 fill-black" /> VIP FOUNDER
                  </span>
                ) : isPro ? (
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
            className="relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#0D1117] border border-[#30363D] hover:border-red-500/40 hover:text-red-400 transition w-fit"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#30363D] pb-3 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-white bg-[#161B22]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-white bg-[#161B22]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Blueprints</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 font-mono">
              {savedItems.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'submissions'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-white bg-[#161B22]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>My Submissions</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 font-mono">
              {userSubmissions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('ide')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'ide'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-white bg-[#161B22]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>IDE Rules & CLI</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
                <div className="text-xs text-slate-400">Account Tier</div>
                <div className="text-base font-bold text-white mt-1">
                  {isVipFounder ? 'VIP Founder' : isPro ? 'Pro Developer' : 'Free Community'}
                </div>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
                <div className="text-xs text-slate-400">Chained Pipelines</div>
                <div className="text-base font-bold text-emerald-400 mt-1">
                  {isPro ? 'All 10 Unlocked' : 'Phase 1 Preview'}
                </div>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
                <div className="text-xs text-slate-400">Saved Blueprints</div>
                <div className="text-base font-bold text-white mt-1">{savedItems.length}</div>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
                <div className="text-xs text-slate-400">Contributed</div>
                <div className="text-base font-bold text-white mt-1">{userSubmissions.length}</div>
              </div>
            </div>

            {/* Plan & Entitlements Split */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Subscription Details (2 Cols) */}
              <div className="md:col-span-2 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-bold text-white">Subscription & Plan</h2>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {isVipFounder ? 'Lifetime SuperAdmin' : 'Merchant: Lemon Squeezy'}
                  </span>
                </div>

                {isVipFounder ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                        Founder Status
                      </span>
                      <h3 className="text-base font-bold text-white">Promptory VIP Founder Access</h3>
                      <p className="text-xs text-slate-400 mt-0.5">₹0 Lifetime • All 10 Pipelines & Frontier Reasoning Unlocked</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold w-fit">
                      <ShieldCheck className="w-3.5 h-3.5" /> Lifetime Active
                    </span>
                  </div>
                ) : isPro ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                        Active Subscription
                      </span>
                      <h3 className="text-base font-bold text-white">Promptory Pro Developer</h3>
                      <p className="text-xs text-slate-400 mt-0.5">₹799/mo • All Phases & Dual-Model Simulator Active</p>
                    </div>
                    <a
                      href="https://promptory.lemonsqueezy.com/billing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1117] border border-[#30363D] hover:border-slate-500 text-slate-200 text-xs font-semibold transition"
                    >
                      <span>Manage Invoices</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">Free Community Plan</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">
                          Upgrade to unlock Phases 2-4 on all pipelines, dual-model comparison simulator, and .cursorrules IDE sync.
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

                {/* Developer Entitlements Matrix */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#30363D]">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Entitlement Permissions
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                      <span className="text-slate-300">Single Prompt Engine</span>
                      <span className="text-emerald-400 font-bold">Enabled</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                      <span className="text-slate-300">Sequential Chaining (Phases 2-4)</span>
                      <span className={isPro ? "text-emerald-400 font-bold" : "text-amber-400 font-medium"}>
                        {isPro ? "Unlocked" : "Locked (Pro)"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                      <span className="text-slate-300">Parallel Dual Simulator</span>
                      <span className={isPro ? "text-emerald-400 font-bold" : "text-slate-500"}>
                        {isPro ? "Unlocked" : "Pro Only"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                      <span className="text-slate-300">IDE Agent Config Sync</span>
                      <span className={isPro ? "text-emerald-400 font-bold" : "text-slate-500"}>
                        {isPro ? "Unlocked" : "Pro Only"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick CLI Sidebar (1 Col) */}
              <div className="space-y-4">
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono">CLI Integration</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Pull verified prompt blueprints directly into your terminal workspace:
                  </p>
                  <div 
                    onClick={copyCliCommand}
                    className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] font-mono text-[11px] text-emerald-400 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition"
                  >
                    <span className="truncate">npx promptory-cli pull --all</span>
                    <button type="button" className="text-slate-500 hover:text-white shrink-0 ml-2">
                      {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-2 text-xs">
                  <span className="font-bold text-white block">Need Custom Pipelines?</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Pro subscribers get custom 4-phase architecture blueprints designed within 24 hours.
                  </p>
                  <Link
                    href="/submit"
                    className="text-emerald-400 hover:underline font-semibold block pt-1 text-[11px]"
                  >
                    Submit Architecture Request &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Blueprints */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Your Bookmarked Blueprints</h3>
              <Link href="/dir" className="text-xs text-emerald-400 hover:underline">
                Explore Directory &rarr;
              </Link>
            </div>

            {savedItems.length === 0 ? (
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-10 text-center space-y-3">
                <Bookmark className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Saved Blueprints Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the bookmark icon on any system prompt or workflow in the directory to store it for quick access here.
                </p>
                <Link
                  href="/dir"
                  className="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition"
                >
                  Browse 380+ Prompts
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedItems.map((item, idx) => (
                  <div key={idx} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-2">
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                    <Link href={`/prompts/${item.slug}`} className="text-xs text-emerald-400 font-semibold block pt-1">
                      Open Blueprint &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Your Contributed Blueprints</h3>
              <Link href="/submit" className="text-xs text-emerald-400 hover:underline">
                + Submit New Blueprint
              </Link>
            </div>

            {userSubmissions.length === 0 ? (
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-10 text-center space-y-3">
                <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Contributed Blueprints Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Share your battle-tested prompts with the global developer community and gain author attribution.
                </p>
                <Link
                  href="/submit"
                  className="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition"
                >
                  Submit a Blueprint &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userSubmissions.map((sub) => (
                  <div key={sub.id} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                        Score: {sub.quality_score || 90}/100
                      </span>
                      <span className="text-[10px] text-slate-500">Live in Directory</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{sub.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{sub.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: IDE Rules & CLI */}
        {activeTab === 'ide' && (
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Local IDE System Rules</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sync Promptory deterministic boundary constraints into Cursor, Windsurf, or VS Code. This ensures your local IDE agent follows strict non-hallucinatory schemas and clean production standards.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => downloadRules('.cursorrules')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .cursorrules</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadRules('.windsurfrules')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0D1117] hover:bg-[#1f2633] text-white border border-[#30363D] transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download .windsurfrules</span>
                </button>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Terminal CLI Synchronization</span>
                <span className="text-emerald-400 font-mono text-[11px]">Developer Workspace</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pull prompt templates directly into your active repository workspace with our automated CLI command:
              </p>
              <div 
                onClick={copyCliCommand}
                className="bg-[#0D1117] border border-[#30363D] rounded-xl p-3.5 font-mono text-xs text-emerald-400 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition"
              >
                <span>npx promptory-cli pull --all</span>
                <span className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]">
                  {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCli ? 'Copied' : 'Copy'}</span>
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
