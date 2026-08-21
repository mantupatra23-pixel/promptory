export interface PromptVariable {
  key: string;
  raw: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  defaultValue?: string;
}

export function extractVariables(template: string): PromptVariable[] {
  const regex = /\[([A-Z0-9_\s\/\-]+)\]/g;
  const matches = Array.from(template.matchAll(regex));
  const seen = new Set<string>();
  const variables: PromptVariable[] = [];

  for (const match of matches) {
    const raw = match[0];
    const key = match[1].trim();

    if (seen.has(key)) continue;
    seen.add(key);

    // Agar options slash (/) se separated hain to Select dropdown banayenge
    if (key.includes('/')) {
      const options = key.split('/').map(opt => opt.trim());
      variables.push({
        key,
        raw,
        label: formatLabel(options[0]),
        type: 'select',
        options,
        defaultValue: options[0]
      });
      continue;
    }

    // Agar multi-line text ya code expected hai to textarea
    const isMultiline = /CODE|CONTENT|MESSAGE|INTERACTION|DESCRIPTION|OUTLINE|QUERY/i.test(key);

    variables.push({
      key,
      raw,
      label: formatLabel(key),
      type: isMultiline ? 'textarea' : 'text',
      defaultValue: ''
    });
  }

  return variables;
}

function formatLabel(key: string): string {
  return key
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function replaceVariables(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    if (value && value.trim() !== '') {
      result = result.split(`[${key}]`).join(value);
    }
  }
  return result;
}
