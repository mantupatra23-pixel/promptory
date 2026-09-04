import { sanitizeClaims, generateSeoTitle } from './prompts/normalizePrompt';

export { sanitizeClaims, generateSeoTitle, generateSeoTitle as generateIntentTitle };

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
        question: `What information should I provide for ${cleanTitle}?`,
        answer: `Provide your slow SQL query, table DDL, row counts, existing index configurations, and EXPLAIN (ANALYZE, BUFFERS) query plan outputs.`,
      },
      {
        question: `Can this prompt analyze query plans and execution bottlenecks?`,
        answer: `Yes. It focuses on identifying costly sequential scans, N+1 query patterns, unindexed foreign keys, and memory locking issues.`,
      },
      {
        question: `Should I test recommended indexes before production deployment?`,
        answer: `Always benchmark proposed index additions and rewritten queries in a staging environment under realistic traffic before migrating production schemas.`,
      },
      {
        question: `Can I use this workflow with another AI model?`,
        answer: `Yes. While structured around ${modelName}'s system instruction handling, the imperative rules operate reliably in Claude 3.5 Sonnet, DeepSeek-R1, and GPT-4o.`,
      },
    ];
  }

  if (taskSlug === 'code-review') {
    return [
      {
        question: `What code context should I provide for this review?`,
        answer: `Provide the isolated function or module, static typing interfaces, framework version, runtime constraints, and expected behavior.`,
      },
      {
        question: `What issues can this prompt help identify?`,
        answer: `It highlights boundary regressions, race conditions, memory leaks, unhandled exceptions, and framework idiomatic anti-patterns.`,
      },
      {
        question: `Can it review large pull requests?`,
        answer: `For optimal accuracy, break large pull requests into logical functions or files rather than pasting multi-thousand-line diffs at once.`,
      },
      {
        question: `How should I verify recommendations?`,
        answer: `Validate all proposed refactors against existing automated unit and regression test suites before merging into the main branch.`,
      },
    ];
  }

  if (taskSlug === 'debugging') {
    return [
      {
        question: `What debugging inputs produce the best diagnostic output?`,
        answer: `Provide the observed stack trace, error logs, problematic function code, and any reproducible trigger conditions.`,
      },
      {
        question: `How does this prompt approach root-cause analysis?`,
        answer: `It isolates the fault mechanism, identifies environmental assumptions, and generates targeted remediations with minimal changes.`,
      },
      {
        question: `Does this prompt replace runtime debuggers or APM tools?`,
        answer: `No. It serves as an analytical assistant. Combine its analysis with APM tracing tools and reproduction unit tests.`,
      },
    ];
  }

  if (taskSlug === 'testing') {
    return [
      {
        question: `What test frameworks are supported?`,
        answer: `It scaffolds test suites for Pytest, Playwright, Jest, Vitest, and standard testing libraries based on your configured parameters.`,
      },
      {
        question: `Does this prompt cover edge cases and failure modes?`,
        answer: `Yes. It instructs the model to scaffold happy-path assertions, boundary conditions, null inputs, and expected network exceptions.`,
      },
      {
        question: `How should I execute the generated tests?`,
        answer: `Paste the generated test file into your repository test directory and execute your test runner locally or in CI.`,
      },
    ];
  }

  if (taskSlug === 'security') {
    return [
      {
        question: `What security vectors does this audit evaluate?`,
        answer: `It reviews authentication flows, token expiration, SQL injection vulnerabilities, CORS settings, input sanitization, and secret leaks.`,
      },
      {
        question: `Does this audit replace professional penetration testing?`,
        answer: `No. It functions as a static structural code review assistant. Use automated DAST/SAST scanners alongside this audit.`,
      },
    ];
  }

  if (taskSlug === 'seo') {
    return [
      {
        question: `What information should I provide for an SEO workflow?`,
        answer: `Supply your primary search query intent, target audience profile, topical cluster themes, and competitor reference URLs.`,
      },
      {
        question: `Does this prompt guarantee top search engine rankings?`,
        answer: `No. Rankings depend on domain authority, crawl performance, and search satisfaction. This prompt structures content to satisfy user intent.`,
      },
    ];
  }

  if (taskSlug === 'email' || taskSlug === 'email-outreach') {
    return [
      {
        question: `What information should I supply for outbound copy?`,
        answer: `Provide your target audience persona, specific value proposition, proof metrics, and a low-friction call to action.`,
      },
      {
        question: `Should I send generated cold outreach without review?`,
        answer: `Always review and personalize generated emails with prospect-specific details before sending.`,
      },
    ];
  }

  return [
    {
      question: `What inputs are required to customize this template?`,
      answer: `Fill in the dynamic brackets in the customizer above with your specific repository or operational details.`,
    },
    {
      question: `Can this workflow be executed on multiple AI models?`,
      answer: `Yes. You can copy the configured prompt or launch it across Claude, ChatGPT, DeepSeek, and Gemini via the 1-click launcher.`,
    },
  ];
}

export function generateContextualSteps(taskSlug: string): Array<{ title: string; detail: string }> {
  switch (taskSlug) {
    case 'database':
    case 'performance':
      return [
        { title: 'Provide Query & Schema', detail: 'Paste your slow SQL query, table DDL, row counts, and existing index definitions.' },
        { title: 'Add EXPLAIN / Target', detail: 'Include EXPLAIN ANALYZE execution output and define your latency SLA target.' },
        { title: 'Generate Plan', detail: 'Run the prompt to receive query rewrite suggestions and indexing recommendations.' },
        { title: 'Benchmark In Staging', detail: 'Apply recommendations to a staging replica and compare execution times under workload.' },
      ];
    case 'code-review':
      return [
        { title: 'Paste Code & Context', detail: 'Provide the function or module along with framework and language versions.' },
        { title: 'Define Constraints', detail: 'Specify architecture conventions, memory boundaries, and typing standards.' },
        { title: 'Run the Review', detail: 'Generate line-by-line inspection highlighting regressions, security risks, and style.' },
        { title: 'Validate With Tests', detail: 'Verify suggested improvements against automated unit tests before merging.' },
      ];
    case 'debugging':
      return [
        { title: 'Isolate Error Trace', detail: 'Collect the exception message, stack trace, runtime logs, and trigger inputs.' },
        { title: 'Supply Code Context', detail: 'Provide the function boundary where the failure manifests.' },
        { title: 'Generate Analysis', detail: 'Execute the prompt to identify root-cause mechanics and targeted fixes.' },
        { title: 'Write Regression Test', detail: 'Add a targeted automated test to ensure the bug cannot regress in production.' },
      ];
    case 'testing':
      return [
        { title: 'Provide Code & Context', detail: 'Paste the interface contract, component code, or endpoint specification.' },
        { title: 'Define Framework', detail: 'Specify your target testing framework (e.g., Pytest, Playwright, Jest).' },
        { title: 'Generate Test Cases', detail: 'Scaffold assertions covering happy paths, edge cases, and unexpected errors.' },
        { title: 'Run and Review Tests', detail: 'Execute test suites locally and verify code coverage before deployment.' },
      ];
    case 'security':
      return [
        { title: 'Define Attack Surface', detail: 'Supply API routes, authentication middleware, and input ingestion handlers.' },
        { title: 'Set Compliance Criteria', detail: 'Specify required standards such as OWASP Top 10, sanitized inputs, or RBAC.' },
        { title: 'Synthesize Threat Audit', detail: 'Run analysis to isolate injection risks, broken auth, and sensitive data leaks.' },
        { title: 'Apply and Patch', detail: 'Implement remediation logic and verify against automated security regression tests.' },
      ];
    case 'seo':
      return [
        { title: 'Provide Topic & Audience', detail: 'Specify primary keyword intent, audience persona, and existing page URL.' },
        { title: 'Define Search Intent', detail: 'Map out informational vs. transactional search intent and entity concepts.' },
        { title: 'Generate Content Structure', detail: 'Synthesize structural briefs, metadata tags, and internal link suggestions.' },
        { title: 'Validate Against SERP', detail: 'Audit output against top-ranking search results to ensure technical completeness.' },
      ];
    case 'email':
    case 'email-outreach':
      return [
        { title: 'Provide Prospect Context', detail: 'Enter prospect industry, role pain points, and target outcome.' },
        { title: 'Define Offer & Goal', detail: 'Specify your core value proposition and a low-friction single call-to-action.' },
        { title: 'Generate Outreach', detail: 'Execute the prompt to produce concise, relevant outreach copy.' },
        { title: 'Personalize Before Sending', detail: 'Review output and insert verified individual personalization before delivery.' },
      ];
    default:
      return [
        { title: 'Configure Variables', detail: 'Fill in the bracketed inputs with your specific project details.' },
        { title: 'Set Constraints', detail: 'Choose output constraints (e.g., Markdown, Structured Table) to match your workflow.' },
        { title: 'Launch in Workspace', detail: 'Copy prompt or launch directly into your preferred AI model interface.' },
        { title: 'Review & Verify', detail: 'Audit AI deliverables against production requirements before deploying.' },
      ];
  }
}
