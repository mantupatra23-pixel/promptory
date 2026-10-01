import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required.' },
        { status: 400 }
      );
    }

    // Default cursorrules template generated dynamically from requested slug
    const formattedSlug = slug.replace(/-/g, ' ');
    const cursorRulesContent = `# Cursor Rules for ${formattedSlug}
# Generated via Promptory CLI (https://promptory.xyz)

You are an expert production engineer specializing in ${formattedSlug}.

## CORE INSTRUCTIONS
- Adhere strictly to clean architecture, type safety, and zero-trust security.
- Eliminate conversational pleasantries, introductory fluff, and generic boilerplate.
- For all code changes, verify concurrency safety, async non-blocking execution, and resource cleanup.
- If errors or edge cases are possible, provide explicit HTTP error handling with standard status codes.

## CONSTRAINTS
- Zero speculative guessing: ask for missing variables if ambiguous.
- Keep dependencies minimal and use native/async alternatives where available.
`;

    return NextResponse.json({
      success: true,
      slug,
      name: formattedSlug,
      cursorrules: cursorRulesContent,
      rawPrompt: cursorRulesContent,
      updatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to export prompt' },
      { status: 500 }
    );
  }
}
