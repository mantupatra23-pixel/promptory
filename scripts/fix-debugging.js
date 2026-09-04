const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Service role key bypasses Supabase RLS policies
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

async function fixDebugging() {
  console.log("Fetching tasks from Supabase...");
  
  // 1. Get or find the exact 'debugging' task
  const { data: tasks } = await supabase.from("tasks").select("id, slug, name");
  let debugTask = tasks.find(t => t.slug === "debugging" || t.slug === "bug-debugging");

  if (!debugTask) {
    console.error("Debugging task not found in database.");
    return;
  }

  console.log(`Target Debug Task ID: ${debugTask.id} | Slug: ${debugTask.slug}`);

  // 2. Fetch all prompts to find debugging/error/fix workflows
  const { data: prompts } = await supabase
    .from("prompts")
    .select("id, title, description, prompt_template, prompt, content");

  const debugKeywords = [
    "debug", "bug", "error", "stack trace", "exception", "crash",
    "troubleshoot", "root cause", "memory leak", "fix", "issue", "diagnostic"
  ];

  const matchedPrompts = prompts.filter(p => {
    const text = `${p.title || ""} ${p.description || ""} ${p.prompt_template || p.prompt || p.content || ""}`.toLowerCase();
    return debugKeywords.some(k => text.includes(k));
  });

  console.log(`Found ${matchedPrompts.length} prompts matching debugging workflows.`);

  let updated = 0;
  for (const p of matchedPrompts) {
    const { error } = await supabase
      .from("prompts")
      .update({
        task_id: debugTask.id,
        task_slug: "debugging"
      })
      .eq("id", p.id);

    if (!error) {
      updated++;
      console.log(`✔ [Debugging] ${p.title.slice(0, 45)}`);
    } else {
      console.error(`✖ Error updating ${p.id}:`, error.message);
    }
  }

  console.log(`\nSuccessfully mapped ${updated} prompts to 'debugging'!`);
}

fixDebugging();
