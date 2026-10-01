export interface ExecutionStep {
  title: string;
  detail: string;
  codeSnippet?: string;
  checkpoint?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateContextualSteps(
  taskSlug: string = 'coding',
  modelName: string = 'AI',
  roleName: string = 'Engineer'
): ExecutionStep[] {
  const t = (taskSlug || '').toLowerCase();

  // 1. SECURITY & AUDIT WORKFLOWS
  if (t.includes('security') || t.includes('audit') || t.includes('compliance')) {
    return [
      {
        title: '01. Define Attack Surface & Threat Perimeter',
        detail: 'Isolate the specific endpoint handlers, auth middleware, or crypto routines to audit. Specify frameworks (e.g., NextAuth, JWT, OAuth2) and database driver to uncover injection or permission escalation vectors.',
        checkpoint: 'Mandatory: Redact production secrets, private keys, and live API tokens before compiling.',
      },
      {
        title: '02. Enforce OWASP Top 10 & CWE Boundary Rules',
        detail: 'The prompt constraints instruct the LLM to inspect for IDOR, SSRF, SQLi, broken object level authorization, and timing attacks. It strictly rejects surface-level observations and demands concrete exploit scenarios.',
        checkpoint: 'Verify that the prompt requires CVSS severity ratings (Critical, High, Medium, Low) for each flag.',
      },
      {
        title: '03. Simulate Defense Payloads & Edge Bypass Checks',
        detail: 'Run the prompt in the Simulator using GPT-OSS 120B or Qwen 27B to analyze non-obvious payload variations, race conditions in token refreshing, and deserialization loopholes.',
        checkpoint: 'Review the generated remediation code: ensure it fixes root-cause logic rather than masking errors.',
      },
      {
        title: '04. Export Hardened Patch to Staging & CI Linting',
        detail: 'Download the remediation diff into your git branch via `npx promptory-cli` or `.cursorrules`. Run static analysis tools (Semgrep, Snyk, Trivy) in your CI pipeline to verify clean validation.',
        checkpoint: 'Add regression tests that explicitly attempt to execute the discovered exploit payload.',
      },
    ];
  }

  // 2. CONTENT OUTLINE, SEO & MARKETING WORKFLOWS
  if (t.includes('content') || t.includes('outline') || t.includes('seo') || t.includes('writing') || t.includes('marketing')) {
    return [
      {
        title: '01. Map Target Search Intent & Primary Keyword Cluster',
        detail: 'Input your core topic, primary keyword, secondary semantic entities (LSI), and user intent (Informational, Commercial, or Problem-Solving). Specify target audience seniority to set tone and technical depth.',
        checkpoint: 'Define target word count tier and identify top 3 competitor angles to out-rank.',
      },
      {
        title: '02. Synthesize High-Density H1–H3 Semantic Hierarchy',
        detail: 'The prompt enforces structured Markdown outlining with zero fluff introductory headings. It structures each section with specific sub-arguments, bulleted key takeaways, and data-proof placeholders.',
        checkpoint: 'Confirm every H2 header directly answers a high-intent search query or user pain point.',
      },
      {
        title: '03. Simulate Entity Coverage & Information Density',
        detail: 'Run through the Live AI Simulator to review table breakdowns, FAQ schema drafts, and hook variations. Ensure the outline satisfies search engine helpful-content benchmarks without conversational filler.',
        checkpoint: 'Verify the outline includes comparison tables, code snippets, or checklists for skimming readers.',
      },
      {
        title: '04. Export to Headless CMS or Editorial Notion Board',
        detail: 'Copy the compiled outline or export it directly into markdown files. Hand off to writers or pipeline automated drafts with pre-aligned structural boundaries to prevent hallucinations.',
        checkpoint: 'Anchor internal links and CTA positioning directly inside the generated outline structure.',
      },
    ];
  }

  // 3. TESTING & QA WORKFLOWS
  if (t.includes('test') || t.includes('qa') || t.includes('mock')) {
    return [
      {
        title: '01. Define Target Runtime & Interface Contract',
        detail: 'Isolate the exact module, function signature, or API endpoint requiring validation. Specify your test runner (e.g., Vitest, Jest, Pytest, Playwright) and mock requirements to prevent incompatible syntax.',
        checkpoint: 'Ensure method inputs, outputs, and external dependencies (DB, Redis, APIs) are specified.',
      },
      {
        title: '02. Compile Variables with Strict Boundary Guardrails',
        detail: 'Paste your source logic into template variables. Negative constraints force the model to reject arbitrary assertions and instead focus on real failure states, timeouts, and null boundary exceptions.',
        checkpoint: 'Verify that zero-hallucination constraints are active in the prompt preview before execution.',
      },
      {
        title: '03. Execute Dual-Model Comparative Simulation',
        detail: 'Run the compiled prompt through the Promptory Simulator. Benchmark high-speed models (GPT-OSS 20B) for assertion velocity against deep reasoning models (GPT-OSS 120B) for complex edge cases.',
        checkpoint: 'Review output assertions to confirm both happy-path coverage and defensive exception handling.',
      },
      {
        title: '04. Export to Local IDE & Run CI Pipeline',
        detail: 'Use "Export API / IDE" to download the blueprint as a .cursorrules file or run `npx promptory-cli` to inject the test suite directly into your local repository test runner.',
        checkpoint: 'Target a minimum of 85% branch coverage with deterministic passing runs.',
      },
    ];
  }

  // 4. DATABASE & QUERY OPTIMIZATION
  if (t.includes('database') || t.includes('query') || t.includes('sql') || t.includes('postgres') || t.includes('mongo')) {
    return [
      {
        title: '01. Ingest DDL Schema & Execution Telemetry',
        detail: 'Provide table schema, current index definitions, and the EXPLAIN ANALYZE output or slow query log. Specifying row volume (e.g., 5M rows) ensures the model accounts for sequential scan costs.',
        checkpoint: 'Provide actual indexing structure to avoid duplicate index recommendations.',
      },
      {
        title: '02. Set Dialect Constraints & Isolation Levels',
        detail: 'Specify your exact database engine (PostgreSQL 16, MySQL 8, SQLite, Supabase) and concurrency limits. Negative constraints prevent the engine from suggesting generic incompatible syntax.',
        checkpoint: 'Verify transaction isolation requirements and vacuum/connection pool limits.',
      },
      {
        title: '03. Simulate Plan Optimization & Index Synthesis',
        detail: 'Test the compiled query prompt in the Simulator to inspect composite index proposals, partial index strategies, and CTE refactoring suggestions for latency reduction.',
        checkpoint: 'Compare proposed query execution time against original sequential scan telemetry.',
      },
      {
        title: '04. Benchmark in Staging Before Production Migration',
        detail: 'Copy optimized SQL statements and run them in an isolated staging branch using `EXPLAIN (BUFFERS, ANALYZE)` to confirm buffer hit ratios improve before creating migration scripts.',
        checkpoint: 'Confirm zero locking regressions on active write tables during index creation.',
      },
    ];
  }

  // 5. CODE REVIEW & DEBUGGING
  if (t.includes('debug') || t.includes('code-review') || t.includes('refactor')) {
    return [
      {
        title: '01. Isolate Stack Trace & Reproduction Scenario',
        detail: 'Capture the full stack trace, environment parameters (Node.js/Python version, OS), and the minimal reproducible code snippet without stripping error origin line numbers.',
        checkpoint: 'Include exact exception logs alongside the relevant file context.',
      },
      {
        title: '02. Apply Root-Cause Boundary Constraints',
        detail: 'The prompt instructs the AI model to perform causality diagnosis rather than guessing surface patches. It prevents "try-catch wrapping" and forces structural architectural repairs.',
        checkpoint: 'Ensure negative constraints block conversational apologies and non-actionable suggestions.',
      },
      {
        title: '03. Cross-Check Against Frontier Reasoning Models',
        detail: 'Simulate the debugging prompt across Deep Reasoning models to detect memory leaks, race conditions, async deadlocks, or unhandled promise rejections.',
        checkpoint: 'Verify proposed diffs solve the underlying memory or concurrency bottleneck.',
      },
      {
        title: '04. Apply Diff & Validate Regressions',
        detail: 'Export the clean code diff into your IDE or Cursor editor. Run existing unit test suites to guarantee the bug fix introduces zero regressions in adjacent modules.',
        checkpoint: 'Validate that regression tests reproduce the original bug when failing and verify passing post-patch.',
      },
    ];
  }

  // 6. DEFAULT UNIVERSAL WORKFLOW
  return [
    {
      title: '01. Ingest Context & Parameter Isolation',
      detail: `Provide the core business or technical metrics required for the ${taskSlug} task. Isolate input parameters from instructions to preserve context window integrity and maximize attention density.`,
      checkpoint: 'Ensure all bracketed variables are filled with concrete, verifiable domain values.',
    },
    {
      title: '02. Apply Zero-Hallucination Negative Guardrails',
      detail: 'The system prompt applies strict boundary constraints that prevent conversational fluff, generic corporate boilerplate, and ungrounded speculation.',
      checkpoint: 'Confirm the output format enforces hierarchical markdown or structured code blocks.',
    },
    {
      title: '03. Benchmark Response Telemetry in Simulator',
      detail: 'Use the live dual-model simulation playground to verify token latency and structural adherence before integrating the prompt into mission-critical workflows.',
      checkpoint: 'Evaluate reasoning depth and speed tradeoffs across open-weights models.',
    },
    {
      title: '04. Export to Developer Workflows & IDEs',
      detail: 'Sync the prompt into your daily developer environment via `npx promptory-cli`, download as `.cursorrules`, or trigger direct execution across ChatGPT, Claude, and Gemini.',
      checkpoint: 'Store verified configurations for team-wide reproducible AI execution.',
    },
  ];
}

export function generateTopicFaqs(
  title: string,
  description: string,
  modelName: string = 'AI',
  roleName: string = 'Engineer',
  taskSlug: string = 'coding'
): FAQItem[] {
  const t = (taskSlug || '').toLowerCase();

  // 1. SECURITY FAQS
  if (t.includes('security') || t.includes('audit') || t.includes('compliance')) {
    return [
      {
        question: `Does this security prompt audit against standard threat matrices like OWASP Top 10?`,
        answer: `Yes. The prompt instructs the model to systematically evaluate code against standard OWASP and CWE vulnerability categories, specifically testing for SQL injection, Cross-Site Scripting (XSS), Server-Side Request Forgery (SSRF), broken object-level authorization (IDOR), and unvalidated redirects.`,
      },
      {
        question: `How should I share code snippets without exposing sensitive API credentials?`,
        answer: `Never paste real production secrets, API keys, or active connection strings into any AI prompt. Replace all secret keys with placeholder variables (e.g., 'API_KEY_PLACEHOLDER') before running the simulation or exporting into IDE tools.`,
      },
      {
        question: `Can this security prompt identify subtle business-logic flaws and race conditions?`,
        answer: `Yes, especially when executed with deep reasoning models like GPT-OSS 120B or Claude 3.5 Sonnet. The negative constraints force the model to trace async execution sequences, token rotation intervals, and permission middleware boundaries rather than merely running superficial regex checks.`,
      },
      {
        question: `How do I integrate this security audit into our GitHub Actions CI pipeline?`,
        answer: `You can use the 'Export API / IDE' modal to grab the raw system prompt, or install our CLI via 'npx promptory-cli add <slug>'. Run this check on pull requests against modified files using your internal Groq API key for sub-second PR security summaries.`,
      },
      {
        question: `What output format does the security audit deliver?`,
        answer: `The prompt produces an executive vulnerability matrix containing: (1) Vulnerability Name, (2) CVSS Severity score, (3) Affected File & Line Contract, (4) Exploit Proof-of-Concept walkthrough, and (5) Hardened, copy-pasteable remediation code.`,
      },
    ];
  }

  // 2. CONTENT OUTLINE & SEO FAQS
  if (t.includes('content') || t.includes('outline') || t.includes('seo') || t.includes('writing') || t.includes('marketing')) {
    return [
      {
        question: `How does this outline prompt structure headings for Google SERP features and AI Overviews?`,
        answer: `The prompt instructs the model to design an H1-H3 hierarchy where each H2 directly targets high-intent search queries. It includes semantic question headings specifically formatted to win Google Featured Snippets and satisfy Perplexity and Google AI Overview citations.`,
      },
      {
        question: `Does this prompt support entity mapping and semantic LSI keywords?`,
        answer: `Yes. When you provide your primary keyword and target topic in the variables, the prompt mandates the inclusion of relevant conceptual entities, co-occurring terms, and related search queries to build topical authority across the entire content piece.`,
      },
      {
        question: `How does this prompt eliminate generic corporate filler and fluff?`,
        answer: `Negative constraints explicitly prohibit common AI preamble phrases like 'In today\\'s fast-paced world' or 'It is essential to understand.' Instead, every outline section requires concrete data points, bulleted execution steps, or structured markdown tables.`,
      },
      {
        question: `Can I export this outline directly into Notion, Google Docs, or a headless CMS?`,
        answer: `Yes. The generated prompt produces standard GitHub-flavored Markdown. You can click 'Copy Final Prompt' or download the output from the Live Simulator to paste directly into Notion, Obsidian, or CMS markdown fields.`,
      },
      {
        question: `How do I adapt this outline prompt for different content lengths or formats?`,
        answer: `Use the 'Output Length' dropdown in the customizer to toggle between Short, Medium, and Detailed modes, or click 'Remix / Fork' to customize the sub-heading structure to match your exact editorial brand guidelines.`,
      },
    ];
  }

  // 3. TESTING & QA FAQS
  if (t.includes('test') || t.includes('qa') || t.includes('mock')) {
    return [
      {
        question: `What test frameworks are compatible with this testing prompt?`,
        answer: `The prompt is framework-agnostic but optimized for modern suites including Vitest, Jest, Pytest, Playwright, Mocha, and Go testing package. Specify your runner in the variables to receive native syntax and idiomatic assertions.`,
      },
      {
        question: `Does this prompt cover negative edge cases and failure modes?`,
        answer: `Yes. The system prompt mandates a test coverage distribution: ~40% happy path, ~40% edge cases (null inputs, boundary limits, empty arrays, unicode), and ~20% defensive exception throwing and timeout simulations.`,
      },
      {
        question: `How does this prompt handle database and third-party API mocks?`,
        answer: `It generates isolated mock fixtures using standard mocking libraries (e.g., vi.mock, jest.fn, unittest.mock). The output separates fixture setup from execution assertions to prevent test flakiness.`,
      },
      {
        question: `Can I run these generated test suites inside Cursor or VS Code directly?`,
        answer: `Yes. Click 'Export API / IDE' and choose '.cursorrules' or run 'npx promptory-cli add <slug>' to bring the prompt directly into your active coding workspace.`,
      },
      {
        question: `How does the prompt prevent hallucinated functions in test suites?`,
        answer: `A strict negative boundary constraint directs the AI to test ONLY the interface contracts provided in the input snippet. The model is forbidden from inventing unprovided helper methods or schema fields.`,
      },
    ];
  }

  // 4. DATABASE & SQL FAQS
  if (t.includes('database') || t.includes('query') || t.includes('sql') || t.includes('postgres') || t.includes('mongo')) {
    return [
      {
        question: `Which database engines and SQL dialects are supported?`,
        answer: `This prompt is optimized for PostgreSQL (including Supabase), MySQL 8+, SQLite, CockroachDB, and MongoDB aggregation pipelines. Explicitly provide your dialect in the input variables for accurate optimization syntax.`,
      },
      {
        question: `Does this prompt provide EXPLAIN ANALYZE interpretation?`,
        answer: `Yes. If you paste your raw execution plan or slow query log into the variables, the prompt breaks down cost nodes, flags Sequential Scans on large tables, and highlights buffer bottlenecks.`,
      },
      {
        question: `How does it decide between composite indexes, partial indexes, and query rewriting?`,
        answer: `The prompt applies deterministic index synthesis: it prioritizes query refactoring (stripping SELECT *, flattening subqueries) first, followed by partial indexes for filtered states, and composite indexes aligned with equality-then-range filtering order.`,
      },
      {
        question: `Can I test the performance of the generated SQL in the simulator?`,
        answer: `You can test the reasoning fidelity in our Live Simulator. For staging execution, copy the generated migration SQL and execute with 'EXPLAIN (BUFFERS, ANALYZE)' in your local database environment.`,
      },
    ];
  }

  // 5. DEFAULT UNIVERSAL FAQS
  return [
    {
      question: `How does this prompt enforce deterministic outputs when run on ${modelName}?`,
      answer: `This prompt implements explicit structural syntax, strict markdown schema guidelines, and negative constraints that explicitly forbid speculative assumptions, introductory pleasantries, and conversational sign-offs. By removing subjective phrasing and pinning the output format, responses remain consistent across multiple runs.`,
    },
    {
      question: `Can I integrate this workflow directly into Cursor, VS Code, or automated CI/CD pipelines?`,
      answer: `Yes. You can export this blueprint directly into your IDE by downloading the generated '.cursorrules' configuration file from the Remix modal, or by running 'npx promptory-cli add <slug>' directly inside your project repository terminal.`,
    },
    {
      question: `How does this prompt handle missing variables or incomplete input parameters?`,
      answer: `Unlike generic prompts that invent fictional facts when inputs are missing, this prompt contains zero-hallucination boundary rules. If a required input parameter is omitted, the model halts execution and returns an explicit 'STATUS: AWAITING INPUT DATA' checklist highlighting missing parameters.`,
    },
    {
      question: `What are the latency and token overhead considerations when executing this prompt?`,
      answer: `The prompt has been token-optimized by stripping redundant pleasantries. When executed on Groq LPU inference using open-weights models like GPT-OSS 20B or Qwen 27B, end-to-end latency averages between 600ms and 1500ms, allocating over 90% of the active context window to substantive output generation.`,
    },
    {
      question: `Can I customize or fork this template for different tech stacks or business domains?`,
      answer: `Yes. Click the 'Remix / Fork' button on the prompt page to open the in-browser sandbox playground. You can modify variable definitions, inject custom negative constraints, test the fork instantly against live models, and export your tailored version as a reusable template.`,
    },
  ];
}

// Re-export helpers required by app/page.tsx
export { sanitizeClaims, generateSeoTitle } from './prompts/normalizePrompt';
