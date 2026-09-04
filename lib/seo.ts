// lib/seo.ts

/**
 * Normalizes cluttered internal titles into clean, search-intent-aligned titles.
 * Transforms: "Pytest & Playwright Performance Audit & Architecture Optimizer"
 * Into: "Pytest & Playwright Performance Testing Prompt"
 */
export function generateIntentTitle(rawTitle: string, taskSlug?: string): string {
  if (!rawTitle) return 'AI System Prompt';
  
  let clean = rawTitle
    .replace(/\s*\|\s*Promptory.*$/i, '')
    .replace(/\s*—\s*Verified.*$/i, '')
    .replace(/& Architecture Optimizer/gi, '')
    .replace(/Architecture Optimizer/gi, '')
    .trim();

  // If already natural, keep it
  if (/prompt$/i.test(clean)) return clean;

  const taskIntentMap: Record<string, string> = {
    'database': 'Optimization Prompt',
    'debugging': 'Debugging Prompt',
    'code-review': 'Code Review Prompt',
    'testing': 'Testing Prompt',
    'performance': 'Performance Optimization Prompt',
    'security': 'Security Audit Prompt',
    'seo': 'SEO Prompt',
    'email': 'Email Prompt',
    'content-writing': 'Writing Prompt',
  };

  const suffix = (taskSlug && taskIntentMap[taskSlug]) ? taskIntentMap[taskSlug] : 'Prompt';

  // Prevent doubling terms like "Optimization Optimization Prompt"
  if (clean.toLowerCase().includes('prompt')) {
    return clean;
  }

  return `${clean} ${suffix}`.replace(/\s+/g, ' ');
}

/**
 * Generates specific, context-rich FAQs based on the task domain.
 */
export function generateTopicFaqs(
  title: string,
  description: string,
  modelName: string,
  roleName: string,
  taskSlug: string
): Array<{ question: string; answer: string }> {
  const baseFaqs = [
    {
      question: `What specific inputs does this ${title} require?`,
      answer: `To maximize output quality, provide complete contextual code snippets, schema definitions, log traces, and any specific architectural constraints directly into the dynamic parameters.`,
    },
    {
      question: `Can I run this prompt using AI models other than ${modelName}?`,
      answer: `Yes. While optimized and benchmarked for ${modelName}'s system instruction handling, the structural constraints and negative rules transfer cleanly to Claude 3.5 Sonnet, DeepSeek-R1, and GPT-4o.`,
    },
  ];

  if (taskSlug === 'database' || taskSlug === 'performance') {
    return [
      {
        question: `What performance bottlenecks does this audit analyze?`,
        answer: `It evaluates execution query plans (such as EXPLAIN ANALYZE), missing multi-column indexes, costly sequential scans, N+1 ORM patterns, and memory locking bottlenecks.`,
      },
      ...baseFaqs,
      {
        question: `Is it safe to run against production database schemas?`,
        answer: `Yes. The prompt only reviews query design, schema definitions, and read-only diagnostic plans. Never input sensitive credential secrets or unmasked PII into the model.`,
      },
    ];
  }

  if (taskSlug === 'code-review' || taskSlug === 'debugging') {
    return [
      {
        question: `How does this prompt avoid AI hallucinations during code review?`,
        answer: `It enforces strict boundary constraints requiring line-by-line verification, flagging only provable syntax errors, race conditions, edge-case null references, and performance regressions.`,
      },
      ...baseFaqs,
      {
        question: `Does this prompt support typed languages like TypeScript, Rust, or Go?`,
        answer: `Yes. The system constraints adapt to strict static typing, memory lifetimes, concurrency models, and framework-specific idiomatic conventions.`,
      },
    ];
  }

  if (taskSlug === 'seo' || taskSlug === 'content-writing') {
    return [
      {
        question: `How does this prompt address search intent and Google quality guidelines?`,
        answer: `It focuses on entity depth, practical structure, original technical insight, and semantic coverage while prohibiting keyword stuffing and filler introductions.`,
      },
      ...baseFaqs,
    ];
  }

  return [
    {
      question: `Why is this prompt structured with negative constraints?`,
      answer: `Negative constraints eliminate conversational preamble, apologies, and generic intros, ensuring the model delivers direct, deterministic code and actionable answers.`,
    },
    ...baseFaqs,
  ];
}

/**
 * Generates unique 4-step execution guides adapted per task domain.
 */
export function generateContextualSteps(taskSlug: string): Array<{ title: string; detail: string }> {
  switch (taskSlug) {
    case 'database':
    case 'performance':
      return [
        { title: 'Extract Query Plan', detail: 'Generate EXPLAIN (ANALYZE, BUFFERS) or gather your slow query logs.' },
        { title: 'Populate Context', detail: 'Paste table schema DDL, index configurations, and row volume estimates.' },
        { title: 'Execute In Model', detail: 'Run the prompt in your target LLM workspace or API playground.' },
        { title: 'Benchmark & Verify', detail: 'Implement proposed indexes or query rewrites in staging and re-benchmark.' },
      ];
    case 'code-review':
    case 'debugging':
      return [
        { title: 'Isolate Issue', detail: 'Collect the problematic function, stack trace, and expected behavior.' },
        { title: 'Supply Constraints', detail: 'Define framework version, runtime constraints, and typed interfaces.' },
        { title: 'Generate Audit', detail: 'Run prompt to receive categorized bug analysis and zero-hallucination fixes.' },
        { title: 'Apply Unit Tests', detail: 'Incorporate edge-case tests provided by the audit before merging code.' },
      ];
    case 'seo':
      return [
        { title: 'Input Query & Target', detail: 'Specify primary search intent, target audience, and existing URL.' },
        { title: 'Define Entities', detail: 'List core technical entities and semantic topic clusters to cover.' },
        { title: 'Synthesize Outline', detail: 'Generate structural briefs, structured data schemas, and internal links.' },
        { title: 'Publish & Validate', detail: 'Audit output against Rich Results Test before publishing.' },
      ];
    default:
      return [
        { title: 'Copy Prompt', detail: 'Click Copy Prompt or open the interactive variable customizer.' },
        { title: 'Insert Parameters', detail: 'Replace bracketed variables with your repository or project context.' },
        { title: 'Send to AI Model', detail: 'Paste into Claude, ChatGPT, Gemini, or execute via automated API scripts.' },
        { title: 'Review Output', detail: 'Inspect generated architecture against your production requirements.' },
      ];
  }
}
