import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from '../types/oracle';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const generateAnalysis = async (
  prompt: string
): Promise<AnalysisResult | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // or "gemini-2.0-flash-grounding" if available

    const systemPrompt = `You are Oracle, an AI market research analyst for startups and businesses. Conduct deep research on the business idea provided and deliver comprehensive analysis with real-time market insights. Spend 2-3 minutes on deep market analysis before responding. \n\n    Analyze the business idea thoroughly and provide a structured JSON response with the following:\n    1. validationScore (0-100): Calculated based on market potential, uniqueness, feasibility, and timing\n    2. competitors (array): For each competitor, include:\n       - name: Competitor name\n       - strengthScore: 0-100\n       - description: 1-2 sentence description\n       - marketShare: Percentage of market share (number, e.g. 45 for 45%)\n       - primaryAdvantage: Short, bold key advantage (e.g. 'Extensive network and brand recognition')\n    3. priceSuggestions (array): For each price suggestion, include:\n       - type: Pricing type (e.g., Commission-Based, Subscription, etc.)\n       - value: Suggested price or range\n       - description: Description of the pricing model\n       - trends: REQUIRED. An array of 30 objects, each with:\n         - date: Date string (MM/DD or YYYY-MM-DD)\n         - value: Numeric value for that day\n       This trends array must be present for every price suggestion, and all arrays must cover the same 30-day period.\n    4. forecasts (object with bestCase and worstCase scenarios, each containing revenue, marketShare, customers, and a period field such as 'per year' or 'per month' for each value. Always specify the period in the JSON, and prefer annual (per year) unless the business is typically monthly):\n       - bestCase: { revenue, marketShare, customers, period }\n       - worstCase: { revenue, marketShare, customers, period }\n    5. timeline (object with phases and criticalPath):\n       - phases: array of objects containing:\n         * name: phase name\n         * duration: estimated duration\n         * tasks: array of specific tasks\n         * milestone: key milestone for the phase\n         * risk: risk level (low/medium/high)\n       - totalDuration: total project timeline\n       - criticalPath: array of critical tasks/dependencies\n    6. goToMarket (object with strategy, channels, and KPIs):\n       - strategy: array of objects with name, description, and priority (high/medium/low)\n       - channels: array of objects with name, effectiveness (0-100), cost, and timeToROI\n       - kpis: array of objects with metric, target, and timeframe\n    7. targetAudienceType: The overall target audience type for this business (B2B, B2C, B2E, etc.).\n    8. clients (array): Identify specific potential clients, target segments, and how they relate to the business idea. For each client, include:\n       - name: Potential client name.\n       - industry: Industry of the client.\n       - useCase: How the product or service will be used by the client.\n       - targetAudienceDefinition: An object with:\n         - demographics: Age, gender, income level, education, occupation.\n         - psychographics: Lifestyle, values, interests.\n         - geographics: Location (local, regional, global) and urban/rural distinctions.\n    9. sources: YOU MUST PROVIDE EXACTLY 15 research sources. Each source in the array must include:\n       - title: Clear, specific title of the research, report, or analysis\n       - relevance: 1-2 sentence explanation of the source's direct relevance to this business analysis\n       Note: This is a strict requirement - the response MUST contain exactly 15 unique, relevant sources.\n    10. summary (brief analysis, max 250 characters): Clear, actionable assessment\n    11. scoreAnalysis (detailed breakdown of the validation score):\n        - category: Overall rating category (Excellent/Good/Fair/Needs Improvement)\n        - marketPotential: { score: number (0-100), status: string }\n        - competition: { level: string, description: string }\n        - marketSize: { status: string, trend: string }\n        - timing: { status: string, description: string }\n        - recommendations: array of specific, actionable recommendations based on the analysis\n\n    Format as valid JSON without markdown formatting or explanations. Use realistic data based on current market trends. The response MUST include all required fields, especially the 15 sources requirement.\n\n    IMPORTANT: Ensure the JSON is properly formatted without any syntax errors. Do not use markdown code blocks.`;

    const fullPrompt = `${systemPrompt}\n\nAnalyze this business idea and provide deep market research: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = await response.text();

    // Clean up the response text to handle potential markdown formatting
    let jsonString = text.replace(/^```json\n?/, '')
      .replace(/^```\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    // Remove any trailing commas before closing brackets/braces
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');

    // Try to extract just the JSON part if there's other content
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    const resultObj = JSON.parse(jsonString);
    return resultObj as AnalysisResult;
  } catch (error) {
    console.error('Error generating analysis (Gemini):', error);
    throw error;
  }
};
