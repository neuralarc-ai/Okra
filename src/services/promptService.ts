import { toast } from 'sonner';
import { generatePromptExpansion } from './aiService';

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
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }
    
    const suggestion = await generatePromptExpansion(basicPrompt);
    if (!suggestion || !suggestion.title) {
      throw new Error('Invalid response from Gemini service');
    }
    return suggestion;
  } catch (error) {
    console.error('Error expanding prompt:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to expand prompt. Please try again.');
    throw error;
  }
};

export const formatExpandedPrompt = (suggestion: PromptSuggestion): string => {
  if (!suggestion) return '';
  return [
    suggestion.title ? `${suggestion.title}\n` : '',
    suggestion.description ? `\nProblem & Solution:\n${suggestion.description}` : '',
    suggestion.marketOpportunity ? `\n\nMarket Opportunity:\n${suggestion.marketOpportunity}` : '',
    suggestion.targetAudience && suggestion.targetAudience.length
      ? `\n\nWho it's for:\n• ${suggestion.targetAudience.join('\n• ')}`
      : '',
    suggestion.uniqueFeatures && suggestion.uniqueFeatures.length
      ? `\n\nWhat makes it unique:\n• ${suggestion.uniqueFeatures.join('\n• ')}`
      : '',
    suggestion.problemSolution && !(suggestion.description || '').includes(suggestion.problemSolution)
      ? `\n\nAdditional Insight:\n${suggestion.problemSolution}`
      : ''
  ]
    .filter(Boolean)
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}; 