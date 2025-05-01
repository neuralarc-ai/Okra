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
  // Combine all summary fields
  const combined = `${suggestion.title}. ${suggestion.description} ${suggestion.problemSolution} ${suggestion.marketOpportunity}`.replace(/\s+/g, ' ').trim();
  // Extract the first 2 sentences only
  const sentences = combined.match(/[^.!?]+[.!?]+/g) || [combined];
  return sentences.slice(0, 2).join(' ').trim();
}; 