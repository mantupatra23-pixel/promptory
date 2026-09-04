/**
 * Normalizes cluttered internal titles into clean, search-intent-aligned titles
 * without altering canonical database slugs or record IDs.
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

  // Strip unverified superlatives and hype terms
  clean = clean
    .replace(/\b(Ultimate|Revolutionary|100% Accurate|Zero[- ]Hallucination|Guaranteed)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If the title already ends with or naturally contains "Prompt", return as is
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
    .replace(/\bzero[- ]hallucination\b/gi, 'deterministic')
    .replace(/\b100%\s*accurate\b/gi, 'high-precision')
    .replace(/\bguaranteed ranking\b/gi, 'search-optimized')
    .replace(/\bguarantees security\b/gi, 'supports security audits')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates task-specific, realistic FAQs matching visible page content.
 */
export function generateTopicFaqs(
  title: string,
  description: string,
  modelName: string,
  roleName: string,
  taskSlug: string
): Array<{ question: string; answer: string }> {
  const cleanTitle = sanitizeClaims(title);

  const baseFaqs = [
    {
      question: `What specific inputs does this ${cleanTitle} require?`,
      answer: `Provide your exact code snippets, runtime schemas, or domain variables into the dynamic parameters. Supplying concrete technical context produces direct, actionable results.`,
    },
    {
      question: `Can I execute this prompt with AI models other than ${modelName}?`,
      answer: `Yes. While calibrated for ${modelName}'s system instruction handling, the structural constraints, negative rules, and parameters operate reliably in Claude 3.5 Sonnet, DeepSeek-R1, and GPT-4o.`,
    },
  ];

  if (taskSlug === 'database' || taskSlug === 'performance') {
    return [
      {
        question: `What performance diagnostics does this prompt analyze?`,
        answer: `It evaluates EXPLAIN query plans, sequential scan risks, missing multi-column indexes, N+1 ORM patterns, and table locking bottlenecks.`,
      },
      ...baseFaqs,
      {
        question: `Should suggested database changes be tested before production deployment?`,
        answer: `Always benchmark query rewrites and index creation scripts in a staging environment under realistic workload concurrency before migrating production databases.`,
      },
    ];
  }

  if (taskSlug === 'code-review' || taskSlug === 'debugging') {
    return [
      {
        question: `How does this prompt structure code inspection?`,
        answer: `It specifies boundary constraints requiring line-by-line verification, highlighting verifiable syntax regressions, unhandled exceptions, race conditions, and edge-case null states.`,
      },
      ...baseFaqs,
      {
        question: `Does this prompt support typed languages like TypeScript, Rust, or Go?`,
        answer: `Yes. The system constraints adapt to strict static typing, memory lifetimes, concurrency models, and framework-specific idiomatic standards.`,
      },
    ];
  }

  if (taskSlug === 'seo' || taskSlug === 'content-writing') {
    return [
      {
        question: `How does this prompt address search intent and quality guidelines?`,
        answer: `It enforces entity depth, practical structure, and technical coverage while eliminating repetitive keyword stuffing and generic introductory boilerplate.`,
      },
      ...baseFaqs,
    ];
  }

  return [
    {
      question: `Why is this prompt structured with negative constraints?`,
      answer: `Negative constraints remove conversational preambles, apologies, and generic intros, ensuring the model delivers direct, deterministic code and actionable answers.`,
    },
    ...baseFaqs,
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
        { title: 'Gather Query Metrics', detail: 'Extract your query syntax along with EXPLAIN (ANALYZE, BUFFERS) execution outputs.' },
        { title: 'Supply Table Schema', detail: 'Paste table DDL, row counts, and current index configurations into parameters.' },
        { title: 'Execute In Model', detail: 'Launch prompt into Claude, ChatGPT, or DeepSeek-R1 via 1-click launcher.' },
        { title: 'Benchmark In Staging', detail: 'Validate proposed query optimizations under simulated workload before merging.' },
      ];
    case 'code-review':
    case 'debugging':
      return [
        { title: 'Isolate Problem Area', detail: 'Collect the problematic function, stack trace, and observed runtime behavior.' },
        { title: 'State Technical Bounds', detail: 'Define framework version, typing interfaces, and memory limits.' },
        { title: 'Run Analysis', detail: 'Receive line-by-line diagnostic audits with explicit reasoning and fixes.' },
        { title: 'Verify With Tests', detail: 'Run automated regression unit tests before merging changes into main.' },
      ];
    case 'seo':
      return [
        { title: 'Input Target Query', detail: 'Specify primary search intent, target audience, and existing URL.' },
        { title: 'Define Entities', detail: 'List core technical entities and semantic topic clusters to cover.' },
        { title: 'Generate Brief', detail: 'Synthesize structural briefs, structured data schemas, and internal links.' },
        { title: 'Validate Output', detail: 'Audit output against Google Rich Results standards before publishing.' },
      ];
    default:
      return [
        { title: 'Configure Variables', detail: 'Replace bracketed parameters in the interactive builder with your project details.' },
        { title: 'Select Format', detail: 'Choose output constraints like Markdown, Structured Table, or Technical Brief.' },
        { title: 'Run in Workspace', detail: 'Copy the prompt or launch directly into your target AI model interface.' },
        { title: 'Inspect Output', detail: 'Review AI response against your system acceptance criteria and deploy.' },
      ];
  }
}
