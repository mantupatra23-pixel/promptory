'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'forgot') {
        const redirectTo = `${window.location.origin}/reset-password`;
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Password reset link sent! Check your email inbox to create a new password.');
        }
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          router.push('/workflows');
        } else {
          setSuccessMsg('Account created successfully! Please verify via the link sent to your email.');
        }
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        router.push('/workflows');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow Accent */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-24 bg-emerald-500/15 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
              P
            </span>
            <span className="font-extrabold text-white text-lg tracking-tight">Promptory</span>
          </Link>

          <h2 className="text-xl font-bold text-white pt-1">
            {mode === 'forgot'
              ? 'Reset your password'
              : mode === 'signup'
              ? 'Create developer account'
              : 'Welcome back'}
          </h2>

          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            {mode === 'forgot'
              ? 'Enter your registered email to receive a secure password recovery link.'
              : mode === 'signup'
              ? 'Unlock 400+ prompts, frontier model chaining, and IDE sync.'
              : 'Sign in to access your saved prompts, active pipelines, and Pro pass.'}
          </p>
        </div>

        {/* Mode Switcher */}
        {mode !== 'forgot' ? (
          <div className="flex bg-[#0D1117] p-1 rounded-xl border border-[#30363D] mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === 'signin'
                  ? 'bg-[#161B22] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === 'signup'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Processing...</span>
              </>
            ) : mode === 'forgot' ? (
              <>
                <span>Send Reset Link</span>
                <KeyRound className="w-3.5 h-3.5 text-black" />
              </>
            ) : mode === 'signup' ? (
              <>
                <span>Create Promptory Account</span>
                <Sparkles className="w-3.5 h-3.5 fill-black" />
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Note */}
        <div className="mt-6 pt-5 border-t border-[#30363D] flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Supabase Secured
          </span>
          <span>•</span>
          <span>Instant Developer Access</span>
        </div>
      </div>
    </div>
  );
}
