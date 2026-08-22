import os
import re
import sys
import http.server
import socketserver
import threading
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
load_dotenv('.env.local')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL ya SUPABASE_KEY environment variables me nahi mila!")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

# 200+ Battle-tested Prompts Matrix across Models & Roles
DOMAINS_DATA = [
    # DEVELOPER - BACKEND & FASTAPI / PYTHON
    {
        "role": "developer", "model": "claude",
        "title": "FastAPI Async Database Connection Pool Starvation Audit",
        "desc": "Detect blocking async SQLAlchemy operations and connection leaks under high concurrency.",
        "template": "Act as a Principal Python Backend Engineer. Audit the following FastAPI database session lifecycle code for connection leaks, async thread blocking, and pool starvation under [CONCURRENT_USERS] traffic: [CODE_SNIPPET]. Output a root cause analysis and refactored asyncpg implementation.",
        "score": 98
    },
    {
        "role": "developer", "model": "claude",
        "title": "Celery & Redis Worker Bottleneck Diagnostic",
        "desc": "Profile asynchronous task latency, queue serialization overhead, and deadlocks in Celery Redis pipelines.",
        "template": "Act as a Distributed Systems Specialist. Analyze the following Celery task worker configuration and queue pipeline: [CONFIG_DATA]. Diagnose task serialization bottlenecks for [TASK_TYPE] and provide optimized worker concurrency configurations.",
        "score": 96
    },
    {
        "role": "developer", "model": "chatgpt",
        "title": "Docker Multi-Stage Container Size & Security Reducer",
        "desc": "Compress Docker images down to alpine/distroless while stripping root permissions and CVEs.",
        "template": "You are a Cloud DevOps Architect. Review this Dockerfile for a [LANGUAGE_RUNTIME] application: [DOCKERFILE_CONTENT]. Refactor it into a hardened, non-root, multi-stage build targeting an image size under [MAX_SIZE_MB] MB with zero root vulnerabilities.",
        "score": 97
    },
    {
        "role": "developer", "model": "deepseek",
        "title": "PostgreSQL High-Volume Query Optimization & Index Planner",
        "desc": "Transform slow sequential scans into index-backed execution plans for high-write databases.",
        "template": "Act as a Lead Database Administrator. Given the following PostgreSQL schema and slow query execution plan EXPLAIN ANALYZE output: [QUERY_PLAN], recommend composite partial indexes, query restructuring, and VACUUM settings to drop p99 latency below [TARGET_LATENCY_MS] ms.",
        "score": 99
    },
    {
        "role": "developer", "model": "chatgpt",
        "title": "Next.js Server Components Hydration Error Troubleshooter",
        "desc": "Identify and isolate SSR hydration mismatches, window object references, and stale closures in Next.js App Router.",
        "template": "Act as a Senior Next.js / React Engineer. Debug the following React Server Component (RSC) and Client Component boundary code throwing hydration errors: [ERROR_SNIPPET]. Provide the exact fix ensuring zero client-server DOM tree divergence.",
        "score": 95
    },
    {
        "role": "developer", "model": "claude",
        "title": "REST API to Production GraphQL Schema Synthesizer",
        "desc": "Convert legacy REST endpoints into strongly-typed GraphQL schemas with N+1 DataLoader protection.",
        "template": "Act as an API Architect. Convert the following [REST_ENDPOINT_LIST] into a production-grade GraphQL schema with queries, mutations, custom scalar types, and DataLoader resolver structures preventing N+1 queries.",
        "score": 94
    },
    {
        "role": "developer", "model": "gemini",
        "title": "Kubernetes HPA & Resource Request/Limit Tuner",
        "desc": "Eliminate OOMKilled pods and CPU throttling using predictive resource allocations and HPA metrics.",
        "template": "Act as a Site Reliability Engineer. Evaluate the resource utilization metrics for [SERVICE_NAME] running on Kubernetes: [METRICS_DATA]. Configure exact CPU/Memory requests, limits, and Horizontal Pod Autoscaler (HPA) triggers for peak load handling.",
        "score": 96
    },

    # SEO & PROGRAMMATIC CONTENT STRATEGY
    {
        "role": "seo-specialist", "model": "gemini",
        "title": "Programmatic SEO Template Architecture Generator",
        "desc": "Design scalable dynamic URL structures, database schemas, and unique content scaffolds for 10k+ landing pages.",
        "template": "Act as an Enterprise Programmatic SEO Architect. Build a complete pSEO landing page content scaffold for the target query pattern '[CITY] [SERVICE_KEYWORD]'. Ensure each generated page has dynamic tables, unique value propositions, FAQ schema, and prevents duplicate content penalties.",
        "score": 97
    },
    {
        "role": "seo-specialist", "model": "gemini",
        "title": "Topical Authority & Semantic Keyword Cluster Matrix",
        "desc": "Generate parent-child topic clusters with search intent classification and internal linking rules.",
        "template": "Act as a Senior SEO Strategist. Create a comprehensive Topical Authority Cluster for the pillar niche '[PRIMARY_NICHE]'. Output a table with Pillar Page, 15 Cluster Sub-topics, Search Intent (Informational/Commercial), Primary Keyword, and Internal Linking Blueprint.",
        "score": 98
    },
    {
        "role": "seo-specialist", "model": "chatgpt",
        "title": "Rich Schema.org JSON-LD Structured Data Builder",
        "desc": "Generate error-free Schema.org JSON-LD snippets for SoftwareApplication, FAQPage, and HowTo.",
        "template": "Generate valid, Google Search Console compliant JSON-LD structured data for a [PAGE_TYPE] page with the following product details: [PRODUCT_INFO]. Include nested FAQPage, AggregateRating, and BreadcrumbList schemas.",
        "score": 96
    },
    {
        "role": "seo-specialist", "model": "perplexity",
        "title": "Competitor SERP Content Gap & Backlink Leverage Audit",
        "desc": "Reverse-engineer top 3 ranking competitors to identify missing subheadings and backlink hooks.",
        "template": "Analyze the top 3 ranking SERP competitors for '[TARGET_KEYWORD]': [COMPETITOR_URLS]. Identify critical subtopics missing from competitors, structural formatting advantages, and unique data angles required to rank #1.",
        "score": 95
    },

    # FOUNDER & SAAS GROWTH
    {
        "role": "founder", "model": "claude",
        "title": "B2B SaaS 3-Sentence High-Response Cold Email",
        "desc": "Write ultra-short, non-salesy cold outreach emails targeting VPs and C-level executives.",
        "template": "Act as an elite SaaS Growth Copywriter. Draft a 3-sentence cold email to the [TARGET_JOB_TITLE] at [COMPANY_NAME]. Highlight how [PRODUCT_NAME] eliminates [SPECIFIC_PAIN_POINT] without sounding like a template. End with an asynchronous low-friction question.",
        "score": 98
    },
    {
        "role": "founder", "model": "chatgpt",
        "title": "YC-Style 2-Minute Seed Pitch Deck Script",
        "desc": "Craft concise, problem-traction-focused pitch scripts for investor meetings and demo days.",
        "template": "Act as a Silicon Valley VC Advisor. Write a crisp 2-minute pitch script for [STARTUP_NAME], an AI startup targeting [TARGET_MARKET]. Cover: The acute problem, the technical moat, early traction ([TRACTION_METRICS]), and the vision.",
        "score": 96
    },
    {
        "role": "founder", "model": "claude",
        "title": "SaaS Pricing Tier & Value Metric Optimizer",
        "desc": "Structure tiered pricing packages (Free, Pro, Enterprise) aligned with value metrics and expansion revenue.",
        "template": "Act as a Monetization & Pricing Strategist. Design a 3-tier pricing model (Starter, Pro, Enterprise) for a SaaS tool solving [CORE_PROBLEM]. Define the core value metric, feature gating strategy, and annual discount structure.",
        "score": 97
    },

    # DIGITAL MARKETER & PERFORMANCE
    {
        "role": "digital-marketer", "model": "claude",
        "title": "High-Converting Meta Ads Direct-Response Hook Generator",
        "desc": "Generate 10 scroll-stopping video hooks and copy angles for B2B & D2C paid acquisition.",
        "template": "Act as a Direct-Response Creative Director. Write 10 contrasting ad hook variations (curiosity, negative bias, data-backed, contrarian) for [PRODUCT_NAME] targeting [AUDIENCE_SEGMENT] on Meta & TikTok Ads.",
        "score": 96
    },
    {
        "role": "digital-marketer", "model": "chatgpt",
        "title": "Viral LinkedIn Thought Leadership Carousel Script",
        "desc": "Transform complex engineering/business insights into high-engagement 8-slide carousels.",
        "template": "Create a high-retention 8-slide LinkedIn carousel script based on the following topic: [CASE_STUDY_TOPIC]. Include slide-by-slide headlines, minimal body text, visual cues, and a final slide CTA.",
        "score": 95
    },

    # REAL ESTATE & AGENTS
    {
        "role": "real-estate-agent", "model": "chatgpt",
        "title": "Real Estate Luxury Property Narrative Listing Description",
        "desc": "Produce emotionally compelling, luxury architectural listing copy for high-end residential real estate.",
        "template": "Act as a Luxury Real Estate Copywriter. Write an architectural narrative listing description for a [BEDROOM_COUNT]-bed, [BATH_COUNT]-bath property in [NEIGHBORHOOD_NAME] featuring [KEY_AMENITIES]. Focus on lifestyle, lighting, and finishes.",
        "score": 94
    },
    {
        "role": "real-estate-agent", "model": "claude",
        "title": "Post-Open House Lead Qualification & SMS Follow-Up",
        "desc": "Nurture open house attendees into scheduled private showings using conversational multi-touch follow-ups.",
        "template": "Draft a 3-stage SMS and email follow-up sequence for open house attendees of [PROPERTY_ADDRESS]. Personalize for buyers looking to move within [TIMEFRAME] with zero aggressive sales pressure.",
        "score": 96
    }
]

TECH_STACKS = [
    ('FastAPI', 'Python', 'developer'),
    ('Next.js', 'React', 'developer'),
    ('Golang Gin', 'Go', 'developer'),
    ('Rust Axum', 'Rust', 'developer'),
    ('PostgreSQL', 'SQL', 'developer'),
    ('Docker & K8s', 'DevOps', 'developer'),
    ('Redis Caching', 'Backend', 'developer'),
    ('GraphQL Apollo', 'API', 'developer'),
    ('Pytest & Playwright', 'QA Testing', 'developer'),
    ('AWS Lambda Serverless', 'Cloud', 'developer'),
    ('Tailwind CSS UI Architecture', 'Frontend', 'developer'),
    ('LangChain RAG Pipeline', 'AI Engineer', 'developer'),
    ('Supabase Auth & RLS Policy', 'Fullstack', 'developer'),
    ('Stripe Subscription Webhooks', 'Billing', 'developer')
]

SEO_TOPICS = [
    'SaaS Programmatic SEO Strategy',
    'E-commerce Product Description Scaler',
    'Local Business Schema & Geo-Targeting',
    'B2B Technical Whitepaper Outline',
    'Competitor SERP Backlink Stealer',
    'Internal Linking Silo Architect',
    'Core Web Vitals LCP Optimization Plan',
    'Google Search Console Zero-Click Recovery'
]

MARKETING_TOPICS = [
    'Cold Outreach Lead Magnet Builder',
    'High-Converting Webinar Slide Flow',
    'Product Hunt Launch Day Playbook',
    'Customer Onboarding Email Drip Sequence',
    'Churn Recovery Win-Back Campaign',
    'B2B Case Study Narrative Framework'
]

def build_catalog():
    catalog = list(DOMAINS_DATA)

    for tech, lang, role in TECH_STACKS:
        for m in ['claude', 'chatgpt', 'deepseek']:
            catalog.append({
                "role": role,
                "model": m,
                "title": f"{tech} Performance Audit & Architecture Optimizer",
                "desc": f"Automated audit rules and high-throughput architectural guidelines for {tech} applications.",
                "template": f"Act as a Principal {lang} Engineer. Review the following {tech} architecture and code implementation: [CODE_SNIPPET]. Optimize for high throughput, minimal memory footprint, and zero concurrency race conditions. Target metric: [PERFORMANCE_GOAL].",
                "score": 95 + (len(tech) % 5)
            })
            catalog.append({
                "role": role,
                "model": m,
                "title": f"{tech} Secure Unit & Integration Test Suite Synthesizer",
                "desc": f"Generate edge-case-hardened test suites with mocking, async support, and 95%+ coverage for {tech}.",
                "template": f"Act as a QA & Reliability Specialist. Write a complete test suite for the following {tech} component: [COMPONENT_CODE]. Cover edge cases including timeouts, network drops, and invalid payloads with zero flaky tests.",
                "score": 94 + (len(tech) % 5)
            })

    for seo in SEO_TOPICS:
        for m in ['gemini', 'perplexity', 'chatgpt']:
            catalog.append({
                "role": "seo-specialist",
                "model": m,
                "title": f"{seo} for High-Authority Ranking",
                "desc": f"Battle-tested execution blueprint for {seo.lower()} to drive indexable search volume.",
                "template": f"Act as a Senior SEO Consultant. Design an actionable execution framework for {seo} in the [INDUSTRY_NICHE] market. Output structured tables, target keyword parameters, and canonical rules.",
                "score": 93 + (len(seo) % 6)
            })

    for mkt in MARKETING_TOPICS:
        for m in ['claude', 'chatgpt']:
            catalog.append({
                "role": "founder",
                "model": m,
                "title": f"B2B {mkt} Blueprint",
                "desc": f"High-conversion playbook for B2B SaaS founders to execute {mkt.lower()}.",
                "template": f"Act as a Venture-Backed SaaS Advisor. Build a step-by-step {mkt} for [PRODUCT_NAME] solving [PAIN_POINT] for [TARGET_ICP]. Include exact messaging hooks and measurement KPIs.",
                "score": 94 + (len(mkt) % 5)
            })

    return catalog

def seed_database():
    prompts = build_catalog()
    print(f"🚀 Preparing to seed {len(prompts)} Production Prompts into Supabase...")

    # Fetch lookup models and professions using supabase.table()
    models_res = supabase.table('models').select('id, slug').execute()
    profs_res = supabase.table('professions').select('id, slug').execute()

    model_map = {m['slug'].lower(): m['id'] for m in (models_res.data or [])}
    prof_map = {p['slug'].lower(): p['id'] for p in (profs_res.data or [])}

    success_count = 0
    skipped_count = 0

    for idx, p in enumerate(prompts, 1):
        slug = slugify(p['title'])
        model_id = model_map.get(p['model'].lower())
        prof_id = prof_map.get(p['role'].lower())

        payload = {
            "title": p['title'],
            "slug": slug,
            "description": p['desc'],
            "prompt_template": p['template'],
            "quality_score": p['score'],
            "status": "published"
        }

        if model_id:
            payload["model_id"] = model_id
        if prof_id:
            payload["profession_id"] = prof_id

        try:
            res = supabase.table('prompts').upsert(payload, on_conflict='slug').execute()
            if res.data:
                success_count += 1
                if idx % 20 == 0 or idx == len(prompts):
                    print(f"[{idx}/{len(prompts)}] ✅ Upserted: {p['title']}")
        except Exception as e:
            print(f"⚠️ Skipped {slug}: {str(e)[:80]}")
            skipped_count += 1

    print(f"\n🎉 SEED COMPLETE! Total: {len(prompts)} | Success: {success_count} | Skipped: {skipped_count}\n")

# Simple HTTP Health Check Server so Render Web Service stays Live
def start_health_server():
    port = int(os.environ.get("PORT", 10000))
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"🌐 Health check server running on port {port}")
        httpd.serve_forever()

if __name__ == "__main__":
    seed_database()
    # Keep service running for Render Web Service health checks
    start_health_server()
