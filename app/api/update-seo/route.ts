import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const upgradedTemplate = `Act as an Enterprise SEO Content Architect and Semantic Search Strategist. Your objective is to engineer a comprehensive, mathematically rigorous, and search-intent-aligned content blueprint for a long-form article targeting:

- Primary Keyword: {{PRIMARY_KEYWORD}}
- Secondary / LSI Keywords: {{SECONDARY_KEYWORDS}}
- Target Search Intent: {{SEARCH_INTENT}}
- Target Audience: {{TARGET_AUDIENCE}}

### MANDATORY OUTLINE ARCHITECTURE

1. SEARCH INTENT & SERP POSITIONING
- Primary User Journey & Intent Classification (Informational / Commercial Investigation / Solution-Seeking).
- Core SERP Competitive Gap: Identify 3 critical technical details competitors omit.
- Hook Blueprint: Angle, emotional/technical trigger, and first 150 words problem statement.

2. HIERARCHICAL CONTENT SKELETON (H1, H2, H3, H4)
Structure each section with explicit directives:
- [H1]: High-CTR Title incorporating {{PRIMARY_KEYWORD}} (under 60 chars).
- [H2 / H3 Sections]:
  * Exact Heading Title.
  * Target Word Count budget.
  * Target Subtopics & specific {{SECONDARY_KEYWORDS}} to naturally integrate.
  * Visual Breakout / UI Element requirement (Code block, Comparative Markdown Table, Callout Box, Infographic diagram description).

3. PEOPLE ALSO ASK (PAA) & LONG-TAIL QUERY INTEGRATION
- Map 4-6 highest-frequency Google "People Also Ask" questions into natural FAQ or section H3 headers.
- Provide direct, concise answer briefs (under 50 words each) engineered for Featured Snippet capture.

4. SEMANTIC ENTITIES & INTERNAL LINKING MATRIX
- List 10 mandatory Wikidata / Knowledge Graph entities related to {{PRIMARY_KEYWORD}} that must appear in the copy.
- Recommend 3 contextual internal link anchor placeholders pointing to relevant hub categories or tools.

5. SCHEMA.ORG & ON-PAGE TECHNICAL SPECS
- Prescribed Schema types (Article, FAQPage, HowTo).
- Meta Description blueprint: Strict 145-155 character count containing the primary keyword with an active CTA.

### STRICT NEGATIVE CONSTRAINTS
- NEVER generate fluff sections like "Why [Topic] is Important in 2026".
- Zero generic boilerplate; every heading must solve a specific micro-intent query.
- Use explicit markdown formatting ready for immediate editorial assignment.`;

    // Database me existing prompt ko find aur update karein
    const { data, error } = await supabase
      .from('prompts')
      .update({
        quality_score: 99,
        prompt_template: upgradedTemplate,
        prompt_text: upgradedTemplate,
        description: 'Enterprise semantic SEO content blueprint. Engineers search-intent architecture, PAA featured snippet capture, LSI entity matrices, and editorial sprint assignments.',
        category: 'SEO Specialist',
        target_role: 'SEO Content Architect'
      })
      .ilike('title', '%SEO-Optimized Content Outline%')
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Agar title se exact match na mile toh slug match try karein
    if (!data || data.length === 0) {
      const { data: slugData, error: slugErr } = await supabase
        .from('prompts')
        .update({
          quality_score: 99,
          prompt_template: upgradedTemplate,
          prompt_text: upgradedTemplate,
          description: 'Enterprise semantic SEO content blueprint. Engineers search-intent architecture, PAA featured snippet capture, LSI entity matrices, and editorial sprint assignments.',
          category: 'SEO Specialist',
          target_role: 'SEO Content Architect'
        })
        .ilike('slug', '%content-outline%')
        .select();

      if (slugErr) return NextResponse.json({ error: slugErr.message }, { status: 500 });
      return NextResponse.json({ success: true, updatedBy: 'slug', count: slugData?.length, data: slugData });
    }

    return NextResponse.json({ success: true, updatedBy: 'title', count: data.length, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
