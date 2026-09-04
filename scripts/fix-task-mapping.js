const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixTaskMappings() {
  console.log("Starting intelligent task remapping for all prompts...");

  const { data: tasks, error: tErr } = await supabase.from("tasks").select("id, slug, name");
  if (tErr) {
    console.error("Failed to fetch tasks:", tErr.message);
    return;
  }

  const taskMap = new Map(tasks.map(t => [t.slug, t.id]));

  const { data: prompts, error: pErr } = await supabase
    .from("prompts")
    .select("id, title, description, prompt_template, prompt, content, task_id, task_slug");

  if (pErr) {
    console.error("Failed to fetch prompts:", pErr.message);
    return;
  }

  let updated = 0;

  for (const p of prompts) {
    const text = `${p.title || ""} ${p.description || ""} ${p.prompt_template || p.prompt || p.content || ""}`.toLowerCase();
    
    let targetSlug = "coding"; // default fallback

    if (text.includes("debug") || text.includes("stack trace") || text.includes("crash") || text.includes("error log")) {
      targetSlug = "debugging";
    } else if (text.includes("postgres") || text.includes("database") || text.includes("sql") || text.includes("redis") || text.includes("mongodb") || text.includes("migration")) {
      targetSlug = "database";
    } else if (text.includes("test") || text.includes("pytest") || text.includes("playwright") || text.includes("jest") || text.includes("vitest") || text.includes("coverage")) {
      targetSlug = "testing";
    } else if (text.includes("performance") || text.includes("latency") || text.includes("throughput") || text.includes("caching") || text.includes("asyncio")) {
      targetSlug = "performance";
    } else if (text.includes("seo") || text.includes("search engine") || text.includes("keyword") || text.includes("serp") || text.includes("schema.org")) {
      targetSlug = "seo";
    } else if (text.includes("review code") || text.includes("pull request") || text.includes("code review") || text.includes("refactor")) {
      targetSlug = "code-review";
    } else if (text.includes("security") || text.includes("vulnerability") || text.includes("auth") || text.includes("jwt") || text.includes("owasp")) {
      targetSlug = "security";
    } else if (text.includes("email") || text.includes("outreach") || text.includes("cold email") || text.includes("sequence")) {
      targetSlug = "email-outreach";
    } else if (text.includes("ad copy") || text.includes("marketing") || text.includes("conversion") || text.includes("meta ads")) {
      targetSlug = "marketing";
    } else if (text.includes("blog") || text.includes("article") || text.includes("writing") || text.includes("content outline")) {
      targetSlug = "content-writing";
    } else {
      targetSlug = "coding";
    }

    const targetId = taskMap.get(targetSlug);

    if (targetId && (p.task_slug !== targetSlug || p.task_id !== targetId)) {
      await supabase
        .from("prompts")
        .update({ task_id: targetId, task_slug: targetSlug })
        .eq("id", p.id);
      updated++;
    }
  }

  console.log(`Successfully remapped and synced ${updated} prompts to their correct tasks.`);
}

fixTaskMappings();
