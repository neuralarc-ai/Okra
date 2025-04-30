import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface TrendingPrompt {
  title: string;
  description: string;
  category: string;
  trendScore: number;
}

export const getTrendingPrompts = async (): Promise<TrendingPrompt[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate 6 trending startup/business ideas that are currently hot in the market. 
    Format the response as a JSON array with objects containing:
    - title (short name)
    - description (2-3 sentences about the idea)
    - category (e.g., AI, Health, Fintech)
    - trendScore (a number between 80-99 indicating how trending it is)
    
    Focus on innovative, tech-forward ideas that solve real problems. Return ONLY the JSON array, no markdown formatting or other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text to handle potential markdown formatting
    const cleanJson = text.replace(/^```json\n?/, '')  // Remove opening ```json
                         .replace(/^```\n?/, '')       // Remove opening ``` if no language specified
                         .replace(/\n?```$/, '')       // Remove closing ```
                         .trim();                      // Remove any extra whitespace
    
    // Parse the cleaned JSON response
    const prompts: TrendingPrompt[] = JSON.parse(cleanJson);
    
    return prompts;
  } catch (error) {
    console.error('Error fetching trending prompts:', error);
    return [];
  }
};

export const generatePromptExpansion = async (basicPrompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Given this basic product/service idea: "${basicPrompt}"

Please analyze and expand it into a comprehensive business idea description. Structure your response in the following JSON format:

{
  "title": "The name/title of the product/service",
  "description": "A detailed 2-3 sentence description explaining what it is and the main problem it solves",
  "targetAudience": [
    "List 4-5 specific target user segments"
  ],
  "uniqueFeatures": [
    "List 5-6 key unique features or differentiators"
  ],
  "problemSolution": "One sentence explaining the core problem and how this solves it",
  "marketOpportunity": "Brief description of the market opportunity and timing"
}

Make the response creative, specific to the idea, and market-relevant. Don't use generic features unless they're truly relevant.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}; 