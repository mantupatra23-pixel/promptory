import { PromptItem, AIModel, Profession, Task } from '@/types';

export const models: AIModel[] = [
  { id: '1', name: 'ChatGPT', slug: 'chatgpt', description: 'OpenAI GPT-4o & reasoning models' },
  { id: '2', name: 'Claude', slug: 'claude', description: 'Anthropic Claude 3.5 Sonnet' },
  { id: '3', name: 'Gemini', slug: 'gemini', description: 'Google Multimodal & Long Context' },
  { id: '4', name: 'DeepSeek', slug: 'deepseek', description: 'DeepSeek-R1 & V3 reasoning' },
  { id: '5', name: 'Midjourney', slug: 'midjourney', description: 'Photorealistic image generation' }
];

export const professions: Profession[] = [
  { id: '1', name: 'Developer', slug: 'developer' },
  { id: '2', name: 'SEO Specialist', slug: 'seo-specialist' },
  { id: '3', name: 'Real Estate Agent', slug: 'real-estate' },
  { id: '4', name: 'Digital Marketer', slug: 'marketer' },
  { id: '5', name: 'Founder', slug: 'founder' }
];

export const tasks: Task[] = [
  { id: '1', name: 'Client Follow-Up', slug: 'client-follow-up', category: 'Sales' },
  { id: '2', name: 'Code Review', slug: 'code-review', category: 'Engineering' },
  { id: '3', name: 'Content Outline', slug: 'content-outline', category: 'SEO' },
  { id: '4', name: 'Bug Debugging', slug: 'debug-python', category: 'Engineering' }
];

export const samplePrompts: PromptItem[] = [
  {
    id: 'p1',
    title: 'Real Estate Client Follow-Up Message',
    slug: 'client-follow-up',
    model: models[0],
    profession: professions[2],
    task: tasks[0],
    description: 'Create a non-pushy, high-converting follow-up message after a property viewing.',
    promptTemplate: `You are an experienced real estate sales advisor. Write a professional follow-up message for:

Client Name: [CLIENT_NAME]
Property: [PROPERTY_NAME]
Last Interaction: [LAST_INTERACTION]
Client Interest Level: [INTEREST_LEVEL]
Next Step: [NEXT_STEP]
Tone: [PROFESSIONAL / FRIENDLY / URGENT]

Keep the message concise, empathetic, and focused on value rather than a hard pitch.`,
    exampleInput: `Client Name: Rajesh Sharma\nProperty: Emerald Heights 3BHK\nLast Interaction: Saturday tour\nInterest Level: High\nNext Step: Price negotiation call\nTone: Friendly`,
    exampleOutput: `Hi Rajesh,\n\nGreat meeting you during Saturday's tour at Emerald Heights. I remembered how much you liked the open balcony view.\n\nI’m speaking with the builder today regarding the price bracket. Are you free for a 5-minute call at 11:30 AM tomorrow?\n\nBest regards,\nMantu Patra`,
    qualityScore: 95,
    status: 'published',
    isFeatured: true,
    useCases: ['Post-viewing follow-ups', 'Re-engaging cold property leads'],
    commonMistakes: ['Sounding too aggressive', 'Not citing specifics from the site visit']
  },
  {
    id: 'p2',
    title: 'Senior Python & FastAPI Code Review',
    slug: 'code-review',
    model: models[1],
    profession: professions[0],
    task: tasks[1],
    description: 'Deep audit for concurrency bugs, async bottlenecks, and security vulnerabilities.',
    promptTemplate: `Act as a Principal Backend Engineer. Perform a rigorous code review of the following FastAPI endpoint:

Code:
\`\`\`python
[INSERT_CODE]
\`\`\`

Analyze for:
1. Concurrency and Async/Await misuse
2. Database connection leaks
3. Input validation & security flaws (Pydantic/OWASP)
4. Performance optimizations

Provide refactored production-ready code with explanations.`,
    exampleInput: `@app.post("/users")\ndef create_user(user: dict):\n    db.execute(f"INSERT INTO users VALUES ('{user['name']}')")`,
    exampleOutput: `### Vulnerabilities Detected:\n1. SQL Injection vulnerability due to string formatting.\n2. Synchronous def blocking async event loop.\n\n### Refactored Code:\n\`\`\`python\n@app.post("/users", response_model=UserResponse)\nasync def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):\n    # parameterized query...\n\`\`\``,
    qualityScore: 98,
    status: 'published',
    isFeatured: true,
    useCases: ['Pre-merge PR reviews', 'Security audits'],
    commonMistakes: ['Ignoring async event loop blocks', 'Overlooking parameterized queries']
  }
];
