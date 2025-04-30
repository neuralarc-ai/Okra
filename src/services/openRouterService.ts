import { OracleSettings, AnalysisResult, OpenRouterModel } from '../types/oracle';

const API_URL = 'https://api.openai.com/v1';

export const fetchModels = async (): Promise<OpenRouterModel[]> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${API_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const data = await response.json();
    return data.data.map((model: { id: string; description?: string }) => ({
      id: model.id,
      name: model.id,
      description: model.description || model.id
    }));
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};

export const generateAnalysis = async (
  prompt: string, 
  settings: OracleSettings
): Promise<AnalysisResult | null> => {
  try {
    console.log('Generating analysis with prompt:', prompt);
    
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    const systemMessage = `You are Oracle, an AI market research analyst for startups and businesses. Conduct deep research on the business idea provided and deliver comprehensive analysis with real-time market insights. 

    Analyze the business idea thoroughly and provide a structured JSON response with the following:
    1. validationScore (0-100): Calculated based on market potential, uniqueness, feasibility, and timing
    2. competitors (array with name, strengthScore 0-100, and description): Include real competitors in the market
    3. priceSuggestions (array with type, value, and description): Provide evidence-based pricing strategies and include priceTrends array with historical data points for each type:
       - priceTrends: array of objects with date and values for each pricing type over the last 30 days
    4. forecasts (object with bestCase and worstCase scenarios, each containing revenue, marketShare, customers)
    5. timeline (object with phases and criticalPath):
       - phases: array of objects containing:
         * name: phase name
         * duration: estimated duration
         * tasks: array of specific tasks
         * milestone: key milestone for the phase
         * risk: risk level (low/medium/high)
       - totalDuration: total project timeline
       - criticalPath: array of critical tasks/dependencies
    6. goToMarket (object with strategy, channels, and KPIs):
       - strategy: array of objects with name, description, and priority (high/medium/low)
       - channels: array of objects with name, effectiveness (0-100), cost, and timeToROI
       - kpis: array of objects with metric, target, and timeframe
    7. clients (array with potential client name, industry, and useCase): Identify specific target segments
    8. sources: YOU MUST PROVIDE EXACTLY 15 research sources. Each source in the array must include:
       - title: Clear, specific title of the research, report, or analysis
       - relevance: 1-2 sentence explanation of the source's direct relevance to this business analysis
       Note: This is a strict requirement - the response MUST contain exactly 15 unique, relevant sources.
    9. summary (brief analysis, max 250 characters): Clear, actionable assessment
    10. scoreAnalysis (detailed breakdown of the validation score):
        - category: Overall rating category (Excellent/Good/Fair/Needs Improvement)
        - marketPotential: { score: number (0-100), status: string }
        - competition: { level: string, description: string }
        - marketSize: { status: string, trend: string }
        - timing: { status: string, description: string }
        - recommendations: array of specific, actionable recommendations based on the analysis
    
    Format as valid JSON without markdown formatting or explanations. Use realistic data based on current market trends. The response MUST include all required fields, especially the 15 sources requirement.

    IMPORTANT: Ensure the JSON is properly formatted without any syntax errors. Do not use markdown code blocks.`;
    
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: settings.primaryModel || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: `Analyze this business idea and provide deep market research: ${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 3000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API Error: ${errorData.error?.message || 'Failed to generate analysis'}`);
    }

    const data = await response.json();
    console.log('Response from API:', data);
    
    const content = data.choices[0].message.content;
    console.log('Content from API:', content);
    
    try {
      // Clean up the content
      let jsonString = content;
      
      // Remove markdown code blocks if present
      jsonString = jsonString.replace(/```json\n?|\n?```/g, '');
      
      // Remove any trailing commas before closing brackets/braces
      jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
      
      // Fix common syntax errors
      jsonString = jsonString.replace(/([{,]\s*)"(\w+)":\s*([^"{[\d].*?)(?=\s*[,}])/g, '$1"$2": "$3"');
      
      // Fix any duplicate opening braces
      jsonString = jsonString.replace(/\{\s*\{/g, '{');
      
      // Fix any malformed array entries
      jsonString = jsonString.replace(/\[\s*\{/g, '[{');
      
      // Parse the cleaned JSON
      const result = JSON.parse(jsonString);
      
      // Validate the required fields
      if (!result.validationScore || !result.competitors || !result.priceSuggestions || 
          !result.forecasts || !result.timeline || !result.goToMarket || 
          !result.clients || !result.sources || !result.summary || !result.scoreAnalysis) {
        throw new Error('Missing required fields in the analysis result');
      }
      
      // Convert string numbers to actual numbers where needed
      if (result.forecasts) {
        ['bestCase', 'worstCase'].forEach(scenario => {
          if (result.forecasts[scenario]) {
            const { revenue, marketShare, customers } = result.forecasts[scenario];
            result.forecasts[scenario].revenue = Number(revenue.replace(/[^0-9.-]+/g, ''));
            result.forecasts[scenario].marketShare = Number(marketShare.replace(/[^0-9.-]+/g, '')) / 100;
            result.forecasts[scenario].customers = Number(customers.replace(/[^0-9.-]+/g, ''));
          }
        });
      }
      
      return result as AnalysisResult;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Response content:', content);
      
      // Try to extract just the JSON part if there's other content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = jsonMatch[0];
          return JSON.parse(extractedJson) as AnalysisResult;
        } catch (secondError) {
          console.error('Failed to parse extracted JSON:', secondError);
        }
      }
      
      throw new Error('Failed to parse analysis results');
    }
  } catch (error) {
    console.error('Error generating analysis:', error);
    throw error;
  }
};
