export interface PromptVariable {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  defaultValue?: string;
}

export interface FormatConstraints {
  tone?: string;
  format?: string;
  length?: string;
}

export function parsePromptVariables(template: string): PromptVariable[] {
  if (!template) return [];

  const regex = /\[([A-Z0-9_]+)\]/g;
  const matches = new Set<string>();
  let match;

  while ((match = regex.exec(template)) !== null) {
    matches.add(match[1]);
  }

  return Array.from(matches).map((key) => {
    const label = key
      .toLowerCase()
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const isLong = key.includes('CODE') || key.includes('TEXT') || key.includes('CONTENT') || key.includes('PROMPT') || key.includes('DATA');

    return {
      key,
      label,
      type: isLong ? 'textarea' : 'text',
    };
  });
}

export function replacePromptVariables(
  template: string,
  values: Record<string, string>,
  constraints?: FormatConstraints
): string {
  if (!template) return '';

  let result = template.replace(/\[([A-Z0-9_]+)\]/g, (match, key) => {
    return values[key] && values[key].trim() !== '' ? values[key].trim() : match;
  });

  const constraintLines: string[] = [];
  if (constraints?.tone && constraints.tone !== 'Default') {
    constraintLines.push(`- Tone: ${constraints.tone}`);
  }
  if (constraints?.length && constraints.length !== 'Default') {
    constraintLines.push(`- Output Length: ${constraints.length}`);
  }
  if (constraints?.format && constraints.format !== 'Default') {
    constraintLines.push(`- Output Format: ${constraints.format}`);
  }

  if (constraintLines.length > 0) {
    result += `\n\n---\n**Constraints & Formatting:**\n${constraintLines.join('\n')}`;
  }

  return result;
}
