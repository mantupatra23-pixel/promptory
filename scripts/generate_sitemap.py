import os
import re
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
load_dotenv('.env.local')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

BASE_URL = "https://www.promptory.xyz"
TODAY = datetime.utcnow().strftime('%Y-%m-%d')

static_paths = [
    ("", "1.0", "daily"),
    ("/directory", "0.9", "daily"),
    ("/workflows", "0.8", "weekly"),
    ("/saved", "0.6", "monthly"),
    ("/submit", "0.7", "monthly"),
    ("/about", "0.5", "monthly"),
    ("/privacy", "0.4", "monthly"),
    ("/terms", "0.4", "monthly"),
    ("/contact", "0.5", "monthly"),
]

print("🔍 Fetching all prompts from Supabase for sitemap...")
res = supabase.table('prompts').select('slug, model:models(slug), profession:professions(slug)').eq('status', 'published').execute()
prompts = res.data or []

xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
]

# Static pages
for path, priority, freq in static_paths:
    xml_lines.append(f"""  <url>
    <loc>{BASE_URL}{path}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

# Dynamic 265+ Prompts pages
for p in prompts:
    model_slug = (p.get('model') or {}).get('slug', 'chatgpt')
    role_slug = (p.get('profession') or {}).get('slug', 'developer')
    prompt_slug = p.get('slug')
    
    if prompt_slug:
        xml_lines.append(f"""  <url>
    <loc>{BASE_URL}/prompts/{model_slug}/{role_slug}/{prompt_slug}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

xml_lines.append('</urlset>')

os.makedirs("public", exist_ok=True)
with open("public/sitemap.xml", "w", encoding="utf-8") as f:
    f.write("\n".join(xml_lines))

print(f"✅ Successfully generated public/sitemap.xml with {len(static_paths) + len(prompts)} indexable URLs!")
