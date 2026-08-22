export interface ScoreBreakdown {
  total: number;
  specificity: number;
  context: number;
  structure: number;
  actionability: number;
  clarity: number;
}

export function calculateQualityScore(content: string, existingScore?: number): ScoreBreakdown {
  if (!content) {
    return { total: 0, specificity: 0, context: 0, structure: 0, actionability: 0, clarity: 0 };
  }

  const text = content.toLowerCase();
  const wordCount = content.trim().split(/\s+/).length;

  // 1. Specificity (0-20): Clear task constraints, variables, parameters
  let specificity = 12;
  if (/\[[a-z0-9_\s-]+\]/i.test(content)) specificity += 4;
  if (text.includes('must') || text.includes('do not') || text.includes('never') || text.includes('only')) specificity += 2;
  if (wordCount >= 40) specificity += 2;
  specificity = Math.min(20, specificity);

  // 2. Context (0-20): Persona definition, role, objective background
  let context = 12;
  if (text.startsWith('act as') || text.includes('you are a') || text.includes('role:') || text.includes('as an expert')) context += 4;
  if (text.includes('target audience') || text.includes('goal:') || text.includes('context:')) context += 2;
  if (text.includes('background') || text.includes('scenario')) context += 2;
  context = Math.min(20, context);

  // 3. Structure (0-20): Headings, steps, markdown blocks, bullets
  let structure = 12;
  if (/(\d+\.|\-|\*|\#\#)/.test(content)) structure += 4;
  if (text.includes('format') || text.includes('table') || text.includes('json') || text.includes('output:')) structure += 2;
  if (content.includes('\n\n')) structure += 2;
  structure = Math.min(20, structure);

  // 4. Actionability (0-20): Direct instruction verbs
  let actionability = 13;
  const actionVerbs = ['generate', 'analyze', 'review', 'create', 'audit', 'optimize', 'write', 'extract', 'evaluate'];
  const hasVerb = actionVerbs.some(v => text.includes(v));
  if (hasVerb) actionability += 4;
  if (text.includes('step-by-step') || text.includes('deliverable')) actionability += 3;
  actionability = Math.min(20, actionability);

  // 5. Clarity (0-20): Readability & length discipline
  let clarity = 14;
  if (wordCount >= 25 && wordCount <= 400) clarity += 3;
  if (!text.includes('etc.') && !text.includes('stuff') && !text.includes('things like that')) clarity += 3;
  clarity = Math.min(20, clarity);

  const calculatedTotal = specificity + context + structure + actionability + clarity;

  // Preserve existing curated score if supplied, proportionally scaling factors
  if (existingScore && existingScore > 0 && existingScore !== calculatedTotal) {
    const ratio = existingScore / calculatedTotal;
    return {
      total: existingScore,
      specificity: Math.min(20, Math.round(specificity * ratio)),
      context: Math.min(20, Math.round(context * ratio)),
      structure: Math.min(20, Math.round(structure * ratio)),
      actionability: Math.min(20, Math.round(actionability * ratio)),
      clarity: Math.min(20, Math.max(0, existingScore - (Math.min(20, Math.round(specificity * ratio)) * 4))),
    };
  }

  return {
    total: calculatedTotal,
    specificity,
    context,
    structure,
    actionability,
    clarity,
  };
}
