import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from '../types/oracle';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const generateAnalysis = async (
  prompt: string
): Promise<AnalysisResult | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // or "gemini-2.0-flash-grounding" if available
    
    const systemPrompt = `You are Oracle, an AI market research analyst for startups and businesses. Conduct deep research on the business idea provided and deliver comprehensive analysis with real-time market insights. Spend 2-3 minutes on deep market analysis before responding. \n\n    Analyze the business idea thoroughly and provide a structured JSON response with the following:\n    1. validationScore (0-100): Calculated based on market potential, uniqueness, feasibility, and timing\n    2. competitors (array): For each competitor, include:\n       - name: Competitor name\n       - strengthScore: 0-100\n       - description: 1-2 sentence description\n       - marketShare: Percentage of market share (number, e.g. 45 for 45%)\n       - primaryAdvantage: Short, bold key advantage (e.g. 'Extensive network and brand recognition')\n    3. priceSuggestions (array): For each price suggestion, include:\n       - type: Pricing type (e.g., Commission-Based, Subscription, etc.)\n       - value: Suggested price or range\n       - description: Description of the pricing model\n       - trends: REQUIRED. An array of 30 objects, each with:\n         - date: Date string (MM/DD or YYYY-MM-DD)\n         - value: Numeric value for that day\n       This trends array must be present for every price suggestion, and all arrays must cover the same 30-day period.\n    4. forecasts (object with bestCase and worstCase scenarios, each containing revenue, marketShare, customers, and a period field such as 'per year' or 'per month' for each value. Always specify the period in the JSON, and prefer annual (per year) unless the business is typically monthly):\n       - bestCase: { revenue, marketShare, customers, period }\n       - worstCase: { revenue, marketShare, customers, period }\n    5. timeline (object with phases and criticalPath):\n       - phases: array of objects containing:\n         * name: phase name\n         * duration: estimated duration\n         * tasks: array of specific tasks\n         * milestone: key milestone for the phase\n         * risk: risk level (low/medium/high)\n       - totalDuration: total project timeline\n       - criticalPath: array of critical tasks/dependencies\n    6. goToMarket (object with strategy, channels, and KPIs):\n       - strategy: array of objects with name, description, and priority (high/medium/low)\n       - channels: array of objects with name, effectiveness (0-100), cost, and timeToROI\n       - kpis: array of objects with metric, target, and timeframe\n    7. targetAudienceType: The overall target audience type for this business (B2B, B2C, B2E, etc.).\n    8. clients (array): Identify specific target segments. For each client, include:
       - name: Potential client name/segment name
       - industry: Industry or sector
       - useCase: How they will use the product/service
       - targetAudienceType: The type of audience (B2B, B2C, etc.)
       - targetAudienceDefinition: An object with:
         * demographics: { 
             primary: string[] (main demographic characteristics),
             secondary?: string[] (optional additional demographics)
           }
         * psychographics: {
             needs: string[] (key needs and pain points),
             preferences?: string[] (optional preferences),
             lifestyle?: string[] (optional lifestyle traits)
           }
         * geographics: {
             location: string (primary location type),
             coverage: string (geographic reach)
           }
       - segment?: {
           size?: string (potential segment size),
           growth?: string (growth rate),
           priority: 'high' | 'medium' | 'low' (segment priority)
         }
    9. sources: YOU MUST PROVIDE EXACTLY 15 research sources. Each source in the array must include:\n       - title: Clear, specific title of the research, report, or analysis\n       - relevance: 1-2 sentence explanation of the source's direct relevance to this business analysis\n       Note: This is a strict requirement - the response MUST contain exactly 15 unique, relevant sources.\n    10. summary (brief analysis, max 250 characters): Clear, actionable assessment\n    11. scoreAnalysis (detailed breakdown of the validation score):\n        - category: Overall rating category (Excellent/Good/Fair/Needs Improvement)\n        - marketPotential: { score: number (0-100), status: string }\n        - competition: { level: string, description: string }\n        - marketSize: { status: string, trend: string, value: string }\n        - timing: { status: string, description: string }\n        - recommendations: array of specific, actionable recommendations based on the analysis\n        - keyMetrics: object with:\n          * marketSize: string (e.g., "$120M")\n          * growthRate: string (e.g., "14.5% CAGR")\n          * targetAudience: string (e.g., "2.4M")\n          * initialInvestment: string (e.g., "$85,000")\n        - executiveSummary: string (2-3 sentences describing the business idea and its target market)\n    12. financialPlan (object with detailed financial projections):\n        - startupCosts: array of objects with { category: string, amount: number, description: string }\n        - monthlyExpenses: array of objects with { category: string, amount: number, description: string }\n        - revenueStreams: array of objects with { source: string, projectedAmount: number, timeframe: string, assumptions: string[] }\n        - breakEvenAnalysis: object with { timeToBreakEven: string, monthlyBreakEvenPoint: number, assumptions: string[] }\n        - projectedProfitMargin: number (percentage)\n    13. fundingRequirements (object with funding details):\n        - totalRequired: number\n        - fundingStages: array of objects with { stage: string, amount: number, timeline: string, purpose: string, milestones: string[] }\n        - equityDilution: array of objects with { stage: string, percentage: number, valuation: number }\n        - fundingSources: array of objects with { type: string, likelihood: number, requirements: string[], pros: string[], cons: string[] }\n        - useOfFunds: array of objects with { category: string, amount: number, description: string, priority: 'high' | 'medium' | 'low' }\n    14. revenueModel (object with revenue stream details):\n        - primaryStreams: array of objects with:\n          * name: string\n          * description: string\n          * percentage: number (percentage of total revenue)\n          * scalability: 'high' | 'medium' | 'low'\n          * recurringType: 'one-time' | 'subscription' | 'usage-based' | 'hybrid'\n        - metrics: array of objects with:\n          * name: string\n          * current: number\n          * target: number\n          * timeframe: string\n        - growthStrategy: array of objects with:\n          * phase: string\n          * tactics: string[]\n          * expectedImpact: string\n          * timeline: string\n        - risks: array of objects with:\n          * category: string\n          * probability: 'high' | 'medium' | 'low'\n          * impact: 'high' | 'medium' | 'low'\n          * mitigationStrategy: string\n    15. milestones (object with quarterly objectives and critical milestones):\n        - quarters: array of objects with:\n          * quarter: string (e.g., "Q1 2024")\n          * objectives: array of objects with:\n            - title: string\n            - description: string\n            - metrics: array of objects with { name: string, target: string | number }\n            - status: 'pending' | 'in-progress' | 'completed'\n            - dependencies: string[]\n          * keyDeliverables: string[]\n          * budget: number\n        - criticalMilestones: array of objects with:\n          * name: string\n          * date: string\n          * importance: string\n          * successCriteria: string[]\n\n    Format as valid JSON without markdown formatting or explanations. Use realistic data based on current market trends. The response MUST include all required fields, especially the 15 sources requirement.\n\n    IMPORTANT: Ensure the JSON is properly formatted without any syntax errors. Do not use markdown code blocks.`;

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
