import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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