export interface WorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  role: string;
  model: string;
  description: string;
  template: string;
  defaultInputs?: Record<string, string>;
}

export interface WorkflowItem {
  slug: string;
  title: string;
  category: string;
  estTime: string;
  description: string;
  steps: WorkflowStep[];
}

export const WORKFLOWS_DATA: WorkflowItem[] = [
  {
    slug: 'b2b-saas-cold-outreach',
    title: 'B2B SaaS Cold Outreach Sequence',
    category: 'Sales & Marketing',
    estTime: '8 mins',
    description: 'Complete multi-touch outbound pipeline: Prospect pain point breakdown, personalized hook email, and 3-step value-first follow-ups.',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Prospect Pain & Value Teardown',
        role: 'Market Strategist',
        model: 'Claude 3.5 Sonnet',
        description: 'Analyze the target ICP and extract high-friction bottlenecks to anchor the outreach pitch.',
        template: `Act as a B2B SaaS Growth Lead. Analyze the target company [COMPANY_NAME] and target persona [PROSPECT_ROLE].\n\nIdentify:\n1. Top 3 urgent operational friction points in their daily workflow\n2. The metric they care most about ([KEY_METRIC])\n3. One compelling angle where our product ([PRODUCT_PITCH]) solves their problem in under 14 days.\n\nKeep bullet points concise and high-impact.`,
        defaultInputs: {
          COMPANY_NAME: 'Acme Cloud',
          PROSPECT_ROLE: 'VP of Engineering',
          KEY_METRIC: 'API Latency & Cloud Costs',
          PRODUCT_PITCH: 'Autonomous caching gateway for FastAPI & PostgreSQL',
        },
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Hyper-Personalized Cold Email Hook',
        role: 'Direct-Response Copywriter',
        model: 'Claude 3.5 Sonnet',
        description: 'Draft a sub-90-word cold email focusing strictly on curiosity, relevance, and low friction.',
        template: `Act as an elite cold email copywriter. Write a 3-sentence outbound cold email to [PROSPECT_ROLE] at [COMPANY_NAME].\n\nGuidelines:\n- Hook referencing their focus on [KEY_METRIC]\n- Clear value proposition: [PRODUCT_PITCH]\n- Low-friction Call To Action (No 30-min call requests; ask for interest or permission to share a 60-sec loom)\n- Tone: Direct, respectful, zero fluff.`,
        defaultInputs: {
          COMPANY_NAME: 'Acme Cloud',
          PROSPECT_ROLE: 'VP of Engineering',
          KEY_METRIC: 'API Latency & Cloud Costs',
          PRODUCT_PITCH: 'Autonomous caching gateway for FastAPI',
        },
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: '3-Touch Value Follow-Up Series',
        role: 'Sales Outreach Specialist',
        model: 'ChatGPT-4o',
        description: 'Generate 3 contextual follow-up emails delivering case study proof and friction-free objection handling.',
        template: `Generate a 3-part follow-up email sequence for the previous cold email sent to [PROSPECT_ROLE] regarding [PRODUCT_PITCH].\n\nStructure:\n- Touch 2 (Day 3): Share a 1-sentence customer benchmark relevant to [KEY_METRIC]\n- Touch 3 (Day 7): Quick observation on industry trend & frictionless question\n- Touch 4 (Day 12): Respectful breakup email closing the thread politely.`,
        defaultInputs: {
          PROSPECT_ROLE: 'VP of Engineering',
          PRODUCT_PITCH: 'Autonomous caching gateway for FastAPI',
          KEY_METRIC: 'API Latency & Cloud Costs',
        },
      },
    ],
  },
  {
    slug: 'programmatic-seo-content-pipeline',
    title: 'Programmatic SEO Content Pipeline',
    category: 'SEO & Content',
    estTime: '10 mins',
    description: '3-step chained workflow to research high-intent keywords, generate comprehensive technical articles, and generate JSON-LD schema with metadata.',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Search Intent & Keyword Architecture',
        role: 'SEO Strategist',
        model: 'Google Gemini 1.5 Pro',
        description: 'Map primary search intent, LSI terms, and structural outline for target programmatic page.',
        template: `Act as a Principal SEO Strategist. Analyze the core topic [PRIMARY_KEYWORD] for target audience [AUDIENCE].\n\nProvide:\n1. Search Intent classification (Informational / Commercial / Transactional)\n2. 5 high-relevance semantic entities (LSI keywords)\n3. Strict H2/H3 article outline designed to rank for featured snippets.`,
        defaultInputs: {
          PRIMARY_KEYWORD: 'Next.js FastAPI Authentication Setup',
          AUDIENCE: 'Full-stack SaaS Developers',
        },
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Comprehensive Technical Long-Form Article',
        role: 'Technical Writer',
        model: 'Claude 3.5 Sonnet',
        description: 'Draft the full technical guide including code examples, configuration caveats, and visual callouts.',
        template: `Act as a Senior Software Engineer and Technical Author. Write a complete, comprehensive guide on [PRIMARY_KEYWORD] for [AUDIENCE].\n\nRequirements:\n- Clear step-by-step implementation\n- Production-ready code blocks\n- Common pitfalls & debugging tips\n- Formatting: Clean GitHub Markdown with callout blocks.`,
        defaultInputs: {
          PRIMARY_KEYWORD: 'Next.js FastAPI Authentication Setup',
          AUDIENCE: 'Full-stack SaaS Developers',
        },
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'JSON-LD Schema & Meta Tags Engine',
        role: 'Technical SEO Engineer',
        model: 'DeepSeek-V3',
        description: 'Generate valid Schema.org TechArticle JSON-LD, OpenGraph tags, and canonical tags.',
        template: `Generate production-ready structured data for the article on [PRIMARY_KEYWORD].\n\nOutput:\n1. Valid Schema.org TechArticle JSON-LD script\n2. SEO Title tag (under 60 chars) and Meta Description (under 155 chars)\n3. OpenGraph tags configuration for Next.js metadata.`,
        defaultInputs: {
          PRIMARY_KEYWORD: 'Next.js FastAPI Authentication Setup',
        },
      },
    ],
  },
];
