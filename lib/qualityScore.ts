export interface QualityScoreBreakdown {
  total: number;
  specificity: number;
  context: number;
  structure: number;
  actionability: number;
  clarity: number;
}

export function calculateQualityScore(
  template: string = '',
  fallbackScore?: number
): QualityScoreBreakdown {
  if (!template || template.trim() === '') {
    const base = fallbackScore || 90;
    const perFactor = Math.floor(base / 5);
    const remainder = base % 5;
    return {
      total: base,
      specificity: perFactor + remainder,
      context: perFactor,
      structure: perFactor,
      actionability: perFactor,
      clarity: perFactor,
    };
  }

  let specificity = 12;
  let context = 12;
  let structure = 12;
  let actionability = 12;
  let clarity = 14;

  // Specificity: check variables & specific placeholders
  if (/\[[A-Z0-9_]+\]/.test(template)) specificity += 6;
  if (template.length > 80) specificity += 2;

  // Context: check role framing
  if (/act as|you are|role|expert|specialist|engineer|strategist/i.test(template)) context += 6;
  if (/audience|scenario|context|company|domain/i.test(template)) context += 2;

  // Structure: check format constraints & lists
  if (/\n- |\n\d+\. |\n\* |markdown|json|table|bullet/i.test(template)) structure += 6;
  if (template.includes('\n')) structure += 2;

  // Actionability: check imperative verbs
  if (/provide|generate|create|analyze|output|write|review|optimize|draft/i.test(template)) actionability += 6;
  if (/step|criteria|guidelines|format/i.test(template)) actionability += 2;

  // Clarity: conciseness & cleanliness
  if (template.length > 50 && template.length < 1500) clarity += 4;
  if (!/etc\.|and so on|whatever/i.test(template)) clarity += 2;

  specificity = Math.min(20, Math.max(0, specificity));
  context = Math.min(20, Math.max(0, context));
  structure = Math.min(20, Math.max(0, structure));
  actionability = Math.min(20, Math.max(0, actionability));
  clarity = Math.min(20, Math.max(0, clarity));

  const total = specificity + context + structure + actionability + clarity;

  return {
    total,
    specificity,
    context,
    structure,
    actionability,
    clarity,
  };
}
