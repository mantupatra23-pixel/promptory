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
  const normalized = (taskSlug || '').toLowerCase();

  if (normalized.includes('test')) {
    return [
      {
        title: '01. Define Target Runtime & Interface Contract',
        detail: 'Isolate the exact module, function signature, or API endpoint requiring validation. Specify your test runner (e.g., Vitest, Jest, Pytest, Playwright) and mock requirements to prevent the model from generating incompatible syntax.',
        checkpoint: 'Ensure method inputs, outputs, and external dependencies (DB, Redis, Third-Party APIs) are clearly specified.',
      },
      {
        title: '02. Compile Variables with Strict Boundary Guardrails',
        detail: 'Paste your source logic into the template variables. The embedded negative constraints force the model to reject arbitrary assertions and instead focus on real failure states, timeouts, and null boundary exceptions.',
        checkpoint: 'Verify that zero-hallucination constraints are active in the prompt preview before execution.',
      },
      {
        title: '03. Execute Dual-Model Comparative Simulation',
        detail: 'Run the compiled prompt through the Promptory Live AI Output Simulator. Benchmark high-speed models (GPT-OSS 20B) for assertion velocity against deep reasoning models (GPT-OSS 120B) for complex architectural edge cases.',
        checkpoint: 'Review output assertions to confirm both happy-path coverage and defensive exception handling.',
      },
      {
        title: '04. Export to Local IDE & Run CI Pipeline',
        detail: 'Use the "Export API / IDE" modal to download the blueprint as a .cursorrules file or run `npx promptory-cli` to inject the test suite directly into your local repository test runner.',
        checkpoint: 'Execute your test suite locally: target a minimum of 85% branch coverage with deterministic passing runs.',
      },
    ];
  }

  if (normalized.includes('database') || normalized.includes('query')) {
    return [
      {
        title: '01. Ingest DDL Schema & Current Query Execution Plan',
        detail: 'Provide table schema, existing index declarations, and the EXPLAIN ANALYZE output or raw slow query log. Specifying row volume (e.g., 5M rows) ensures the model accounts for memory buffers and sequential scan costs.',
        checkpoint: 'Provide actual indexing structure to avoid duplicate index recommendations.',
      },
      {
        title: '02. Set Dialect Constraints & Isolation Levels',
        detail: 'Specify your exact database engine (PostgreSQL 16, MySQL 8, SQLite, Supabase) and concurrency limits. The negative constraints prevent the engine from suggesting generic syntax incompatible with your dialect.',
        checkpoint: 'Verify transaction isolation requirements and vacuum/connection pool limits.',
      },
      {
        title: '03. Simulate Plan Optimization & Index Synthesis',
        detail: 'Test the compiled query prompt in the Simulator to inspect composite index proposals, partial index strategies, and CTE refactoring suggestions for latency reduction.',
        checkpoint: 'Compare proposed query execution time against original sequential scan telemetry.',
      },
      {
        title: '04. Benchmark in Staging Before Production Migration',
        detail: 'Copy the optimized SQL statements and run them in an isolated staging branch using `EXPLAIN (BUFFERS, ANALYZE)` to confirm buffer hit ratios improve before creating migration scripts.',
        checkpoint: 'Confirm zero locking regressions on active write tables during index creation.',
      },
    ];
  }

  if (normalized.includes('debug') || normalized.includes('code-review')) {
    return [
      {
        title: '01. Isolate Stack Trace & Reproduction Scenario',
        detail: 'Capture the full stack trace, environment parameters (Node.js/Python version, OS), and the minimal reproducible code snippet. Avoid stripping out the error origin line numbers.',
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

  // Default Universal Technical Workflow
  return [
    {
      title: '01. Ingest Context & Parameter Isolation',
      detail: `Provide the core business or technical metrics required for the ${taskSlug} task. Isolate input parameters from instructions to preserve context window integrity and maximize LLM attention density.`,
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
  return [
    {
      question: `How does this prompt enforce deterministic outputs when run on ${modelName}?`,
      answer: `This prompt implements explicit structural syntax, strict markdown schema guidelines, and negative constraints that explicitly forbid speculative assumptions, introductory pleasantries, and conversational sign-offs. By removing subjective phrasing and pinning the output format (tables, step-by-step checklists, or typed code), responses remain consistent across multiple execution runs.`,
    },
    {
      question: `Can I integrate this workflow directly into Cursor, VS Code, or automated CI/CD pipelines?`,
      answer: `Yes. You can export this blueprint directly into your IDE by downloading the generated '.cursorrules' configuration file from the Remix modal, or by running 'npx promptory-cli add <slug>' directly inside your project repository terminal. This embeds the system prompt directly into your local agent workflow.`,
    },
    {
      question: `How does this prompt handle missing variables or incomplete input parameters?`,
      answer: `Unlike generic prompts that invent fictional facts when inputs are missing, this prompt contains zero-hallucination boundary rules. If a required input parameter is omitted, the model is instructed to halt execution and return an explicit 'STATUS: AWAITING INPUT DATA' checklist highlighting the missing parameters needed to proceed.`,
    },
    {
      question: `What are the latency and token overhead considerations when executing this prompt?`,
      answer: `The prompt has been token-optimized by stripping redundant pleasantries and repetitive instructions. When executed on Groq LPU inference using open-weights models like GPT-OSS 20B or Qwen 3.8 27B, end-to-end latency averages between 600ms and 1500ms, allocating over 90% of the active context window to substantive output generation.`,
    },
    {
      question: `Can I customize or fork this template for different tech stacks or business domains?`,
      answer: `Yes. Click the 'Remix / Fork' button on the prompt page to open the in-browser sandbox playground. You can modify variable definitions, inject custom negative constraints, test the fork instantly against live models, and export your tailored version as a reusable template.`,
    },
    {
      question: `Which AI frontier models are best suited for running this ${taskSlug} prompt?`,
      answer: `For rapid execution and automated scripts, ultra-fast models such as GPT-OSS 20B or Claude 3.5 Sonnet offer the lowest latency and sharp instruction adherence. For complex architectural planning, multi-file codebases, or deep analytical audits, high-parameter reasoning models such as GPT-OSS 120B or DeepSeek-R1 are recommended.`,
    },
  ];
}

// Re-export helpers required by app/page.tsx
export { sanitizeClaims, generateSeoTitle } from './prompts/normalizePrompt';
