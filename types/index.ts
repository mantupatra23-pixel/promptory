export interface AIModel {
  id: string;
  name: string;
  slug: string;
  description: string;
  badgeColor?: string;
}

export interface Profession {
  id: string;
  name: string;
  slug: string;
}

export interface Task {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export interface PromptItem {
  id: string;
  title: string;
  slug: string;
  model: AIModel;
  profession: Profession;
  task: Task;
  description: string;
  promptTemplate: string;
  exampleInput?: string;
  exampleOutput?: string;
  qualityScore: number;
  useCases?: string[];
  commonMistakes?: string[];
  status: 'draft' | 'reviewed' | 'tested' | 'verified' | 'published';
  isFeatured?: boolean;
}
