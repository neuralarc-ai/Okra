import OpenAI from 'openai';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file');
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface TrendingPrompt {
  title: string;
  description: string;
  category: string;
  trendScore: number;
}

export const getTrendingPrompts = async (): Promise<TrendingPrompt[]> => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a startup trend analyst. Generate trending business ideas in JSON format."
        },
        {
          role: "user",
          content: `Generate 6 trending startup/business ideas that are currently hot in the market. 
          Return a JSON object with a 'prompts' array containing objects with these fields:
          - title (short name)
          - description (2-3 sentences about the idea)
          - category (e.g., AI, Health, Fintech)
          - trendScore (a number between 80-99 indicating how trending it is)
          
          Example format:
          {
            "prompts": [
              {
                "title": "AI Health Assistant",
                "description": "An AI-powered health monitoring system that provides personalized wellness recommendations.",
                "category": "Health",
                "trendScore": 95
              }
            ]
          }
          
          Focus on innovative, tech-forward ideas that solve real problems.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    try {
      const data = JSON.parse(content);
      if (!data.prompts || !Array.isArray(data.prompts)) {
        throw new Error("Invalid response format: missing or invalid prompts array");
      }

      // Validate each prompt has required fields
      const validPrompts = data.prompts.filter((prompt: any) => {
        return (
          typeof prompt.title === 'string' &&
          typeof prompt.description === 'string' &&
          typeof prompt.category === 'string' &&
          typeof prompt.trendScore === 'number' &&
          prompt.trendScore >= 80 &&
          prompt.trendScore <= 99
        );
      });

      if (validPrompts.length === 0) {
        throw new Error("No valid prompts found in response");
      }

      return validPrompts;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error("Failed to parse OpenAI response");
    }
  } catch (error) {
    console.error('Error fetching trending prompts:', error);
    throw error;
  }
};

export const generatePromptExpansion = async (basicPrompt: string) => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a business idea analyst. Expand basic ideas into comprehensive business descriptions."
        },
        {
          role: "user",
          content: `Given this basic product/service idea: "${basicPrompt}"

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

Make the response creative, specific to the idea, and market-relevant. Don't use generic features unless they're truly relevant.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const data = JSON.parse(content);
    if (!data.title || !data.description) {
      throw new Error("Invalid response format from OpenAI");
    }
    return data;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}; 