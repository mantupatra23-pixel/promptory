import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Next.js 15 Server Actions Best Practices: Security, Zod & Architecture',
  description:
    'Master Next.js 15 Server Actions with production best practices: auth guards, Zod validation, optimistic UI, and zero-leak security patterns.',
  alternates: {
    canonical: 'https://www.promptory.xyz/blog/nextjs-15-server-actions-best-practices',
  },
  openGraph: {
    title: 'Next.js 15 Server Actions Best Practices: Security, Zod & Architecture',
    description:
      'Production guide to hardening Server Actions in Next.js 15: async runtime APIs, auth boundaries, and IDE rule enforcement.',
    url: 'https://www.promptory.xyz/blog/nextjs-15-server-actions-best-practices',
    siteName: 'Promptory',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      '@id': 'https://www.promptory.xyz/blog/nextjs-15-server-actions-best-practices/#article',
      headline: 'Next.js 15 Server Actions Best Practices: Security, Zod & Architecture',
      description:
        'A comprehensive production guide covering Next.js 15 Server Actions, input validation with Zod, authentication boundaries with Supabase SSR, and IDE guardrails.',
      url: 'https://www.promptory.xyz/blog/nextjs-15-server-actions-best-practices',
      author: {
        '@type': 'Organization',
        name: 'Promptory Architecture Team',
        url: 'https://www.promptory.xyz',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Promptory',
        url: 'https://www.promptory.xyz',
      },
      datePublished: '2026-10-08T00:00:00+00:00',
      dateModified: '2026-10-08T00:00:00+00:00',
    },
    {
      '@type': 'SoftwareSourceCode',
      name: 'Secure Next.js 15 Server Action Pattern',
      programmingLanguage: 'TypeScript',
      codeSampleType: 'full',
      runtimePlatform: 'Next.js 15, Node.js',
    },
  ],
};

export default function NextjsServerActionsGuidePage() {
  return (
    <article className="min-h-screen bg-[#0D1117] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Breadcrumb Header */}
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <nav className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Link href="/" className="hover:underline">Promptory</Link>
            <span>/</span>
            <Link href="/directory" className="hover:underline">Engineering Guides</Link>
            <span>/</span>
            <span className="text-slate-400">Server Actions</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Next.js 15 Server Actions Best Practices: Production Security, Validation &amp; Architecture
          </h1>
          <p className="text-lg text-slate-400 font-normal">
            Treat Server Actions as public HTTP endpoints. Learn how to implement schema validation, prevent closure leaks, and enforce IDE contracts.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-2">
            <span>By Promptory Architecture Team</span>
            <span>•</span>
            <span>Updated October 2026</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">10 Min Read</span>
          </div>
        </header>

        {/* Section 1: The Core Vulnerability */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            1. The Core Vulnerability: Why Server Actions Are Not Private Functions
          </h2>
          <p className="leading-relaxed text-slate-300">
            A common misconception in React Server Components is assuming that adding <code className="text-emerald-400 font-mono text-xs bg-slate-900 px-1 py-0.5 rounded">&apos;use server&apos;</code> makes a function a secure internal RPC. In reality, Next.js compiles every exported Server Action into a <strong>publicly discoverable HTTP POST endpoint</strong> with a deterministic action hash.
          </p>
          <p className="leading-relaxed text-slate-300">
            Anyone with a web browser or a terminal can forge a POST request directly to your action endpoint using tools like cURL. If your action skips explicit input validation and server-side authorization checks, an attacker can manipulate payload parameters directly.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-emerald-400 text-sm">Next.js 15 Breaking Paradigm: Asynchronous Headers</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              In Next.js 15, dynamic APIs like <code className="text-slate-200 font-mono text-xs">cookies()</code> and <code className="text-slate-200 font-mono text-xs">headers()</code> are fully asynchronous. Attempting to read cookies synchronously inside your Server Actions will trigger runtime warnings or outright execution failures.
            </p>
          </div>
        </section>

        {/* Section 2: Production Code Pattern */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            2. Production Architecture: Security, Validation, and Mutation Contracts
          </h2>
          <p className="text-sm text-slate-300">
            Every production Server Action must satisfy three invariants:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-300">
            <li><strong>Strict Input Sanitization:</strong> Reject unparsed client arguments using schema engines like Zod.</li>
            <li><strong>Independent Authentication Checks:</strong> Re-verify session identity on every invocation instead of trusting client states.</li>
            <li><strong>Discriminated Union Returns:</strong> Return typed results (<code className="text-emerald-300 font-mono text-xs">&#123; success: true, data &#125; | &#123; success: false, error &#125;</code>) rather than unhandled thrown exceptions.</li>
          </ul>

          {/* Code Block */}
          <div className="relative bg-[#0A0D12] rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span>app/actions/update-profile.ts</span>
              <span className="text-emerald-400 font-semibold">Production Hardened</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const ProfileSchema = z.object({
  username: z.string().trim().min(3).max(30),
  bio: z.string().trim().max(160).optional(),
});

type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateProfileAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<{ username: string }>> {
  // 1. Validate inputs via Zod
  const parsed = ProfileSchema.safeParse({
    username: formData.get('username'),
    bio: formData.get('bio'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // 2. Await Next.js 15 async cookies
  const cookieStore = await cookies();

  // 3. Authenticate with Supabase SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored when invoked from Server Component render tree
          }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Unauthorized mutation attempt.' };
  }

  // 4. Perform database operation
  const { error: dbError } = await supabase
    .from('profiles')
    .update(parsed.data)
    .eq('id', user.id);

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  return { success: true, data: { username: parsed.data.username } };
}`}
            </pre>
          </div>
        </section>

        {/* Section 3: UI State & Optimistic Updates */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            3. State Management &amp; React 19 UI Hooks
          </h2>
          <p className="leading-relaxed text-slate-300">
            Rather than relying on ad-hoc <code className="text-emerald-400 font-mono text-xs">useState</code> loaders, couple Server Actions directly with React 19&apos;s <code className="text-emerald-400 font-mono text-xs">useActionState</code> and <code className="text-emerald-400 font-mono text-xs">useOptimistic</code> primitives.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h3 className="font-semibold text-emerald-400 text-sm mb-1">useActionState</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically handles transition pending states, error payloads, and input resets without manual boolean state flags.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h3 className="font-semibold text-emerald-400 text-sm mb-1">useOptimistic</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Renders pending user interactions immediately on the client and automatically rolls back the UI state if the action returns a failure response.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: IDE Rules Enforcement */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            4. Automating Guardrails in Your IDE Workflow
          </h2>
          <p className="leading-relaxed text-slate-300">
            Manual code reviews cannot catch every missing authentication check. The most reliable way to enforce Server Action security across a development team is by injecting strict linting rules directly into your AI coding assistant.
          </p>
          <p className="leading-relaxed text-slate-300">
            You can drop our production-tested{' '}
            <Link
              href="/cursor-rules"
              className="text-emerald-400 font-semibold underline hover:text-emerald-300"
            >
              Next.js 15 .cursorrules template
            </Link>{' '}
            directly into your repository root. It instructs Cursor to automatically flag unvalidated parameters, ban deprecated authentication libraries, and guarantee asynchronous cookie handling.
          </p>
        </section>

        {/* Section 5: Production Audit Checklist */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            5. The 6-Point Production Audit Checklist
          </h2>
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
            <p className="text-emerald-400 font-bold uppercase tracking-wider mb-2">Pre-Deploy Action Verification</p>
            <div className="space-y-2">
              <p>[✓] <strong>Input Verification:</strong> Every action parameter runs through Zod or Valibot safeParse.</p>
              <p>[✓] <strong>Session Validation:</strong> Authentication session is resolved on the server per request.</p>
              <p>[✓] <strong>Async Headers:</strong> All calls to cookies() and headers() are explicitly awaited.</p>
              <p>[✓] <strong>Server Boundary:</strong> Sensitive modules are sealed using the &apos;server-only&apos; package.</p>
              <p>[✓] <strong>Rate Limiting:</strong> High-risk mutations are wrapped with Upstash Redis token bucket guards.</p>
              <p>[✓] <strong>CSRF Guard:</strong> Verify origin headers for cross-domain POST vulnerability deterrence.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <footer className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20 border border-emerald-500/30 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Level Up Your Full-Stack Next.js Architecture
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Discover verified system prompts, API contracts, and Cursor rule configurations for Next.js 15 and Python backends in the{' '}
            <Link href="/directory" className="text-emerald-400 underline font-semibold">
              Promptory developer directory
            </Link>.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/cursor-rules"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-black bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/10 text-sm"
            >
              Get Next.js 15 .cursorrules →
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 text-sm"
            >
              Browse 400+ Prompts
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
