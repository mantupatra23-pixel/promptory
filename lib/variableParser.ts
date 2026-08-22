export interface DetectedVariable {
  key: string;
  raw: string;
  label: string;
  inputType: 'text' | 'textarea' | 'select';
  options?: string[];
  defaultValue: string;
}

export function parsePromptVariables(content: string): DetectedVariable[] {
  if (!content) return [];
  
  // Match patterns like [VARIABLE_NAME] or [Variable Name]
  const regex = /\[([A-Z0-9_\s\-]+)\]/g;
  const matches = Array.from(content.matchAll(regex));
  const seen = new Set<string>();
  const variables: DetectedVariable[] = [];

  for (const match of matches) {
    const raw = match[0];
    const key = match[1].trim();

    if (seen.has(key)) continue;
    seen.add(key);

    // Human-readable label: "TARGET_GOAL" -> "Target Goal"
    const label = key
      .toLowerCase()
      .split(/[_\s\-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Smart input type detection
    let inputType: 'text' | 'textarea' | 'select' = 'text';
    let options: string[] | undefined = undefined;
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes('code') || lowerKey.includes('content') || lowerKey.includes('data') || lowerKey.includes('draft') || lowerKey.includes('context')) {
      inputType = 'textarea';
    } else if (lowerKey.includes('tone')) {
      inputType = 'select';
      options = ['Professional', 'Persuasive', 'Concise', 'Technical', 'Friendly', 'Casual', 'Urgent', 'Creative'];
    } else if (lowerKey.includes('language') || lowerKey.includes('lang')) {
      inputType = 'select';
      options = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Mandarin', 'Japanese'];
    } else if (lowerKey.includes('format')) {
      inputType = 'select';
      options = ['Markdown', 'Bullet Points', 'Table', 'Step-by-Step', 'JSON', 'Plain Text'];
    }

    variables.push({
      key,
      raw,
      label,
      inputType,
      options,
      defaultValue: '',
    });
  }

  return variables;
}

export function replacePromptVariables(
  template: string,
  values: Record<string, string>,
  options?: {
    tone?: string;
    format?: string;
    length?: string;
  }
): string {
  let output = template;

  // Replace each detected variable
  Object.entries(values).forEach(([key, val]) => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    output = output.replace(regex, val.trim() ? val : `[${key}]`);
  });

  // Append Tone / Length / Format constraints cleanly if selected
  const additions: string[] = [];
  if (options?.tone && options.tone !== 'Default') {
    additions.push(`Tone: ${options.tone}`);
  }
  if (options?.length && options.length !== 'Default') {
    additions.push(`Output Length: ${options.length}`);
  }
  if (options?.format && options.format !== 'Default') {
    additions.push(`Output Format: ${options.format}`);
  }

  if (additions.length > 0) {
    output += `\n\n---\n**Constraints & Formatting:**\n- ${additions.join('\n- ')}`;
  }

  return output;
}
