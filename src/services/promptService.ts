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
  
  // Combine all summary fields
  const combined = `${suggestion.title}. ${suggestion.description} ${suggestion.problemSolution} ${suggestion.marketOpportunity}`.replace(/\s+/g, ' ').trim();
  // Extract the first 2 sentences only
  const sentences = combined.match(/[^.!?]+[.!?]+/g) || [combined];
  return sentences.slice(0, 2).join(' ').trim();
}; 