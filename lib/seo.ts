/**
 * Normalizes internal workflow titles into clean, search-intent-aligned titles
 * without modifying canonical database slugs or record IDs.
 */
export function generateIntentTitle(rawTitle: string, taskSlug?: string): string {
  if (!rawTitle) return 'AI System Prompt';

  let clean = rawTitle
    .replace(/\s*\|\s*Promptory.*$/i, '')
    .replace(/\s*—\s*Verified.*$/i, '')
    .replace(/\s*—\s*Production.*$/i, '')
    .replace(/& Architecture Optimizer/gi, 'Optimization')
    .replace(/Architecture Optimizer/gi, 'Optimization')
    .replace(/Performance Audit & Architecture Optimizer/gi, 'Performance Optimization')
    .trim();

  // Strip unsupported superlatives and hype phrases
  clean = clean
    .replace(/\b(Ultimate|Revolutionary|100% Accurate|Zero[- ]Hallucination|Guaranteed)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If already contains "Prompt", return normalized text
  if (clean.toLowerCase().includes('prompt')) {
    return clean;
  }

  const taskSuffixMap: Record<string, string> = {
    database: 'Optimization Prompt',
    debugging: 'Debugging Prompt',
    'code-review': 'Code Review Prompt',
    testing: 'Testing Prompt',
    performance: 'Performance Optimization Prompt',
    security: 'Security Audit Prompt',
    seo: 'SEO Prompt',
    email: 'Outreach Prompt',
    'email-outreach': 'Outreach Prompt',
    'content-writing': 'Writing Prompt',
  };

  const suffix = (taskSlug && taskSuffixMap[taskSlug]) ? taskSuffixMap[taskSlug] : 'Prompt';
  return `${clean} ${suffix}`.replace(/\s+/g, ' ').trim();
}

/**
 * Strips unverified claims from descriptions, titles, and generated copy.
 */
export function sanitizeClaims(text: string): string {
  if (!text) return '';
  return text
    .replace(/\b100%\s*Quality\s*Audited\b/gi, 'Quality-Scored')
    .replace(/\bzero[- ]hallucination\b/gi, 'structured')
    .replace(/\b100%\s*accurate\b/gi, 'high-precision')
    .replace(/\bbattle[- ]tested\b/gi, 'practical')
    .replace(/\bproduction[- ]tested\b/gi, 'production-focused')
    .replace(/\bguaranteed ranking\b/gi, 'search-optimized')
    .replace(/\bguarantees security\b/gi, 'supports security audits')
    .replace(/\bguaranteed\b/gi, 'recommended')
    .replace(/\beliminate hallucinations\b/gi, 'mitigate hallucinations')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates task-specific, realistic FAQs that match visible page content.
 */
export function generateTopicFaqs(
  title: string,
  description: string,
  modelName: string,
  roleName: string,
  taskSlug: string
): Array<{ question: string; answer: string }> {
  const cleanTitle = sanitizeClaims(title);

  if (taskSlug === 'database' || taskSlug === 'performance') {
    return [
      {
        question: `What specific inputs should I provide for ${cleanTitle}?`,
        answer: `Paste your slow SQL query, table DDL, existing indexes, and EXPLAIN (ANALYZE, BUFFERS) execution output directly into the customizer parameters.`,
      },
      {
        question: `Does this prompt evaluate query execution plans?`,
        answer: `Yes. It focuses on identifying costly sequential scans, N+1 patterns, unindexed foreign keys, and memory-locking bottlenecks.`,
      },
      {
        question: `Should I benchmark recommendations before production?`,
        answer: `Always benchmark proposed index additions and query rewrites in a staging environment under realistic traffic before migrating production schemas.`,
      },
      {
        question: `Can I run this with models other than ${modelName}?`,
        answer: `Yes. The prompt instructions and negative constraints work across Claude 3.5 Sonnet, DeepSeek-R1, and GPT-4o.`,
      },
    ];
  }

  if (taskSlug === 'code-review' || taskSlug === 'debugging') {
    return [
      {
        question: `What code context should I provide to the AI?`,
        answer: `Provide the isolated function, stack trace, typing interfaces, runtime environment, and expected behavior.`,
      },
      {
        question: `How does this prompt structure code inspection?`,
        answer: `It enforces line-by-line verification focusing on unhandled edge cases, race conditions, memory leaks, and style violations.`,
      },
      {
        question: `Does it guarantee zero bugs in generated fixes?`,
        answer: `No. AI models can introduce subtle logic regressions. Always validate recommendations using automated unit tests before merging.`,
      },
      {
        question: `Can this prompt review typed languages like TypeScript or Rust?`,
        answer: `Yes. It explicitly adapts to static type checking, memory ownership patterns, and framework conventions.`,
      },
    ];
  }

  if (taskSlug === 'testing') {
    return [
      {
        question: `What test frameworks are supported?`,
        answer: `It generates test suites for Pytest, Playwright, Jest, Vitest, and standard testing libraries based on your stack parameters.`,
      },
      {
        question: `Does this prompt cover edge cases and failure modes?`,
        answer: `Yes. It instructs the model to scaffold happy-path assertions, boundary conditions, null inputs, and expected network exceptions.`,
      },
      {
        question: `How should I run the generated test code?`,
        answer: `Paste the generated test file into your repository test directory and execute your test runner locally or in CI.`,
      },
    ];
  }

  if (taskSlug === 'security') {
    return [
      {
        question: `What vulnerabilities does this audit check for?`,
        answer: `It inspects authentication flows, JWT validation, SQL injection attack vectors, CORS configurations, and sensitive secret exposure risks.`,
      },
      {
        question: `Does this prompt replace dynamic vulnerability scanners?`,
        answer: `No. It functions as a static structural code review assistant. Use automated DAST/SAST scanners alongside this audit.`,
      },
    ];
  }

  if (taskSlug === 'seo') {
    return [
      {
        question: `What inputs produce the best SEO brief?`,
        answer: `Provide the target query, primary entity concepts, search intent, audience profile, and existing ranking URLs.`,
      },
      {
        question: `Does this prompt guarantee top search engine rankings?`,
        answer: `No. Search rankings depend on domain authority, crawl performance, and search satisfaction. This prompt structures content to satisfy user intent.`,
      },
    ];
  }

  return [
    {
      question: `What parameters are required to customize this template?`,
      answer: `Fill in the dynamic brackets in the customizer above with your project context and workflow requirements.`,
    },
    {
      question: `Can this workflow be used with other AI models?`,
      answer: `Yes. You can copy the configured prompt or launch it across Claude, ChatGPT, DeepSeek, and Gemini via the 1-click launcher.`,
    },
  ];
}

/**
 * 4-step pragmatic task execution workflows adapted per task domain.
 */
export function generateContextualSteps(taskSlug: string): Array<{ title: string; detail: string }> {
  switch (taskSlug) {
    case 'database':
    case 'performance':
      return [
        { title: 'Extract Query & Execution Metrics', detail: 'Gather your slow SQL query and run EXPLAIN (ANALYZE, BUFFERS) in staging.' },
        { title: 'Supply Table Schema & Indexes', detail: 'Paste table DDL, row counts, and current index definitions into parameters.' },
        { title: 'Generate Optimization Strategy', detail: 'Run the prompt in your target model to evaluate rewrites and indexing plans.' },
        { title: 'Benchmark Under Load', detail: 'Apply recommendations to staging and compare latency, buffer reads, and write cost.' },
      ];
    case 'code-review':
    case 'debugging':
      return [
        { title: 'Isolate Function & Stack Trace', detail: 'Collect the problematic code snippet, observed exception, and expected behavior.' },
        { title: 'Define Runtime Constraints', detail: 'Specify framework version, typing bounds, and memory constraints.' },
        { title: 'Run Line-by-Line Audit', detail: 'Execute the prompt to receive categorized bug analysis and remediation logic.' },
        { title: 'Verify With Unit Tests', detail: 'Implement automated regression tests to verify the fix before merging.' },
      ];
    case 'testing':
      return [
        { title: 'Input Component Interface', detail: 'Paste your component or API contract and specify test framework conventions.' },
        { title: 'Specify Critical Paths', detail: 'Outline core assertions, external service mocks, and failure scenarios.' },
        { title: 'Generate Test Suite', detail: 'Run the prompt to produce isolated unit, integration, or e2e assertions.' },
        { title: 'Run in Local Test Runner', detail: 'Execute tests locally and check coverage before integrating into CI.' },
      ];
    case 'security':
      return [
        { title: 'Provide Code Surface', detail: 'Supply endpoints, data access logic, and authentication middleware.' },
        { title: 'Set Compliance Criteria', detail: 'State required standards like OWASP Top 10, role-based access control, or token expiries.' },
        { title: 'Synthesize Threat Audit', detail: 'Run analysis to isolate attack vectors, unauthorized leaks, and misconfigurations.' },
        { title: 'Patch & Re-Verify', detail: 'Implement mitigations and verify using integration penetration tests.' },
      ];
    case 'seo':
      return [
        { title: 'Input Target Query & Audience', detail: 'Specify target search query, audience persona, and primary intent.' },
        { title: 'Define Technical Entities', detail: 'List key entities, topical clusters, and competitor structural gaps.' },
        { title: 'Synthesize Content Architecture', detail: 'Generate structural briefs, metadata recommendations, and internal link plans.' },
        { title: 'Validate Against Guidelines', detail: 'Review output to ensure people-first utility without keyword stuffing.' },
      ];
    default:
      return [
        { title: 'Configure Custom Variables', detail: 'Fill in the parameter inputs with your specific project context.' },
        { title: 'Select Format & Constraints', detail: 'Adjust output constraints (e.g., Markdown, Structured Table) to match your workflow.' },
        { title: 'Launch in AI Workspace', detail: 'Copy prompt or launch directly into your preferred AI model interface.' },
        { title: 'Review & Verify Output', detail: 'Audit AI deliverables against production requirements before deploying.' },
      ];
  }
}
