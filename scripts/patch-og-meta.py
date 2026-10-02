import re

file_path = 'app/prompts/[slug]/page.tsx'
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Dynamic OG URL snippet
    og_snippet = '''
    const ogUrl = new URL('https://www.promptory.xyz/api/og');
    if (prompt?.title) ogUrl.searchParams.set('title', prompt.title);
    if (prompt?.category) ogUrl.searchParams.set('category', prompt.category);
    if (prompt?.target_role) ogUrl.searchParams.set('role', prompt.target_role);
    if (prompt?.quality_score) ogUrl.searchParams.set('score', String(prompt.quality_score));

    return {
      title: `${prompt?.title || 'Prompt Blueprint'} | Promptory`,
      description: prompt?.description || 'Production AI prompt blueprint and boundary constraints.',
      openGraph: {
        title: `${prompt?.title} | Promptory`,
        description: prompt?.description,
        url: `https://www.promptory.xyz/prompts/${params.slug}`,
        siteName: 'Promptory',
        images: [
          {
            url: ogUrl.toString(),
            width: 1200,
            height: 630,
            alt: prompt?.title,
          },
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: prompt?.title,
        description: prompt?.description,
        images: [ogUrl.toString()],
      },
    };'''

    if 'openGraph' not in content:
        print("Injecting openGraph metadata into page...")
        # Replace return statement in generateMetadata if exists
        content = re.sub(
            r'return\s*\{\s*title:.*?\};',
            og_snippet.strip(),
            content,
            flags=re.DOTALL
        )
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated app/prompts/[slug]/page.tsx with dynamic OG tags!")
    else:
        print("openGraph metadata already present.")
except Exception as e:
    print(f"Notice: {e}")
