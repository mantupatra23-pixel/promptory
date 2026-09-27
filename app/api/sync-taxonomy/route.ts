import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [{ data: profs }, { data: tasks }] = await Promise.all([
      supabase.from('professions').select('id, slug, name'),
      supabase.from('tasks').select('id, slug, name'),
    ]);

    const marketer = (profs || []).find((p) => p.slug === 'digital-marketer' || p.slug.includes('market'));
    const seoSpecialist = (profs || []).find((p) => p.slug === 'seo-specialist' || p.slug.includes('seo')) || marketer;
    const developer = (profs || []).find((p) => p.slug === 'software-developer' || p.slug === 'developer');

    const contentTask = (tasks || []).find((t) => t.slug === 'content-writing' || t.slug.includes('content') || t.slug.includes('market')) || tasks?.[0];
    const emailTask = (tasks || []).find((t) => t.slug.includes('email') || t.slug.includes('outreach')) || contentTask;
    const seoTask = (tasks || []).find((t) => t.slug === 'seo' || t.slug.includes('seo')) || contentTask;

    const report: Record<string, number> = {};

    // 1. Fix SEO prompts (Map to SEO Specialist & SEO Task)
    if (seoSpecialist && seoTask) {
      const { data: seoPrompts } = await supabase
        .from('prompts')
        .select('id, title')
        .or('title.ilike.%SEO Audit%,title.ilike.%SEO Specialist%,title.ilike.%Search Console%');

      for (const p of seoPrompts || []) {
        await supabase
          .from('prompts')
          .update({
            profession_id: seoSpecialist.id,
            task_id: seoTask.id,
            task_slug: seoTask.slug,
          })
          .eq('id', p.id);
      }
      report.seoPromptsFixed = seoPrompts?.length || 0;
    }

    // 2. Fix Marketing prompts
    if (marketer && contentTask) {
      const { data: mPrompts } = await supabase
        .from('prompts')
        .select('id, title')
        .or('title.ilike.%Marketing Manager%,title.ilike.%Content Strategy%');

      for (const p of mPrompts || []) {
        await supabase
          .from('prompts')
          .update({
            profession_id: marketer.id,
            task_id: contentTask.id,
            task_slug: contentTask.slug,
          })
          .eq('id', p.id);
      }
      report.marketingPromptsFixed = mPrompts?.length || 0;
    }

    // 3. Fix Cold Email prompts
    if (marketer && emailTask) {
      const { data: ePrompts } = await supabase
        .from('prompts')
        .select('id, title')
        .or('title.ilike.%Cold Email%,title.ilike.%Email Outreach%');

      for (const p of ePrompts || []) {
        await supabase
          .from('prompts')
          .update({
            profession_id: marketer.id,
            task_id: emailTask.id,
            task_slug: emailTask.slug,
          })
          .eq('id', p.id);
      }
      report.emailPromptsFixed = ePrompts?.length || 0;
    }

    return NextResponse.json({
      success: true,
      message: 'Complete taxonomy realignment finished successfully!',
      details: report,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
