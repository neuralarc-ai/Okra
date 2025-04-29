import { OracleSettings, AnalysisResult } from '../types/oracle';

const API_URL = 'https://api.openai.com/v1';

export const fetchModels = async (): Promise<any[]> => {
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
      throw new Error('Failed to fetch OpenAI models');
    }

    const data = await response.json();
    return data.data.map((model: any) => ({
      id: model.id,
      name: model.id,
      description: model.description || model.id
    }));
  } catch (error) {
    console.error('Error fetching OpenAI models:', error);
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
    
    const systemMessage = `You are Oracle, an AI market research analyst for startups and businesses. Conduct deep and in depth research on the business idea provided and deliver comprehensive analysis with real-time market insights. 

    Analyze the business idea thoroughly and provide a structured JSON response with the following:
    1. validationScore (0-100): Calculated based on market potential, uniqueness, feasibility, and timing
    2. competitors (array with name, strengthScore 0-100, and description): Include real competitors in the market
    3. priceSuggestions (array with type, value, and description): Provide evidence-based pricing strategies
    4. forecasts (object with bestCase and worstCase scenarios, each containing revenue, marketShare, customers)
    5. clients (array with potential client name, industry, and useCase): Identify specific target segments
    6. sources (array with title, url, and relevance): Include research sources that would be relevant for this analysis
    7. summary (brief analysis, max 250 characters): Clear, actionable assessment
    
    Format as valid JSON without markdown formatting or explanations. Use realistic data based on current market trends.`;
    
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
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Failed to generate analysis'}`);
    }

    const data = await response.json();
    console.log('Response from OpenAI API:', data);
    
    const content = data.choices[0].message.content;
    console.log('Content from OpenAI API:', content);
    
    try {
      // Find JSON in the response
      const jsonMatch = content.match(/(\{.*\})/s);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      
      // Parse the JSON
      const result = JSON.parse(jsonString);
      return result as AnalysisResult;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Response content:', content);
      throw new Error('Failed to parse analysis results');
    }
  } catch (error) {
    console.error('Error generating analysis:', error);
    throw error;
  }
};
