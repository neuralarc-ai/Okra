import { toast } from 'sonner';
import { generatePromptExpansion } from './geminiService';

interface PromptSuggestion {
  title: string;
  description: string;
  targetAudience: string[];
  uniqueFeatures: string[];
  problemSolution: string;
  marketOpportunity: string;
}

export const expandPrompt = async (basicPrompt: string): Promise<PromptSuggestion> => {
  try {
    const suggestion = await generatePromptExpansion(basicPrompt);
    return suggestion;
  } catch (error) {
    console.error('Error expanding prompt:', error);
    throw new Error('Failed to expand prompt');
  }
};

export const formatExpandedPrompt = (suggestion: PromptSuggestion): string => {
  return `${suggestion.title}

${suggestion.description}

Problem & Solution:
${suggestion.problemSolution}

Market Opportunity:
${suggestion.marketOpportunity}

Who it's for:
${suggestion.targetAudience.map(audience => `• ${audience}`).join('\n')}

What makes it unique:
${suggestion.uniqueFeatures.map(feature => `• ${feature}`).join('\n')}`;
}; 