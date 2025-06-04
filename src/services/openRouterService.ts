import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from '../types/oracle';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

/**
 * Generates a business analysis using Google's Gemini API
 * @param prompt The business idea to analyze
 * @param skipCurrencyCheck Optional flag to skip currency consistency check
 * @returns Structured analysis result or null
 */
export const generateAnalysis = async (
  prompt: string,
  skipCurrencyCheck: boolean = false
): Promise<AnalysisResult | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });
    
    const systemPrompt = `You are Oracle, an AI market research analyst for startups and businesses. Conduct deep research on the business idea provided and deliver comprehensive analysis with real-time market insights. Spend 2-3 minutes on deep market analysis before responding.

    Analyze the business idea thoroughly and provide a structured JSON response with the following:
    1. validationScore (0-100): Calculated based on market potential, uniqueness, feasibility, and timing
    2. competitors (array): For each competitor, include:
       - name: Competitor name
       - strengthScore: 0-100
       - description: 1-2 sentence description
       - marketShare: Percentage of market share (number, e.g. 45 for 45%)
       - primaryAdvantage: Short, bold key advantage (e.g. 'Extensive network and brand recognition')
       - website: Company website URL (if available)
       - detailedAnalysis: {
           summary: string (2-3 sentence summary of the competitor's strengths, market position, and key risks)
           marketPosition: string (e.g., "Market Leader", "Challenger", "Niche Player")
         }
    3. priceSuggestions (array): For each price suggestion, include:
       - type: Pricing type (e.g., Commission-Based, Subscription, etc.)
       - value: Suggested price or range
       - description: Description of the pricing model
       - trends: REQUIRED. An array of 30 objects, each with:
         - date: Date string (MM/DD) for each of the next 30 consecutive days starting from today
         - value: Numeric value for that day (predicted number of users/customers)
       - detailedAnalysis: {
           summary: string (2-3 sentence summary of the pricing model's strengths, adoption, and risks)
           competitiveAdvantage: string (how this pricing model differentiates from competitors)
           revenuePotential: {
             shortTerm: string (3-6 months projection)
             longTerm: string (1-2 years projection)
           }
         }
    4. forecasts (object with bestCase, averageCase, and worstCase scenarios, each containing revenue, marketShare, customers, and a period field such as 'per year' or 'per month' for each value. Always specify the period in the JSON, and prefer annual (per year) unless the business is typically monthly):
       - bestCase: { revenue, marketShare, customers, period }
       - averageCase: { revenue, marketShare, customers, period }
       - worstCase: { revenue, marketShare, customers, period }
       - revenueSummary: string (1-2 sentence summary of the revenue forecast, key drivers, and risks)
       - customerSummary: string (1-2 sentence summary of the customer forecast, growth drivers, and risks)
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
    7. targetAudienceType: The overall target audience type for this business (B2B, B2C, B2E, etc.).
    8. clients (array): Identify specific target segments. For each client, include:
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
    9. sources: YOU MUST PROVIDE EXACTLY 15 research sources. Each source in the array must include:
       - title: Clear, specific title of the research, report, or analysis
       - relevance: 1-2 sentence explanation of the source's direct relevance to this business analysis
       Note: This is a strict requirement - the response MUST contain exactly 15 unique, relevant sources.
    10. summary (brief analysis, max 250 characters): Clear, actionable assessment
    11. scoreAnalysis (detailed breakdown of the validation score):
        - category: Overall rating category (Excellent/Good/Fair/Needs Improvement)
        - marketPotential: { score: number (0-100), status: string }
        - competition: { level: string, description: string }
        - marketSize: { status: string, trend: string, value: string }
        - timing: { status: string, description: string }
        - recommendations: array of specific, actionable recommendations based on the analysis
        - keyMetrics: object with:
          * marketSize: string (e.g., "$120M")
          * growthRate: string (e.g., "14.5% CAGR")
          * targetAudience: string (e.g., "B2B clients, B2C consumers,  individuals & businesses, B2B Buyers (Importers, Wholesalers, Processors), Initial target VR users") only 2-3 target audiences
          * initialInvestment: string (e.g., "$85,000")
        - executiveSummary: string (2-3 sentences describing the business idea and its target market)
        - swot: object with:
          * strengths: array of strings
          * weaknesses: array of strings
          * opportunities: array of strings
          * threats: array of strings
        - marketTrends: array of objects with:
          * trend: string
          * impact: string
        - regulatoryAndRisks: array of objects with:
          * risk: string
          * mitigation: string
        - competitivePositioning: object with:
          * position: string (describe the business's position vs. main competitors)
          * mapDescription: string (describe the axes and where the business sits)
    12. financialPlan (object with detailed financial projections):
        - startupCosts: array of objects with { category: string, amount: number, description: string }
        - monthlyExpenses: array of objects with { category: string, amount: number, description: string }
        - revenueStreams: array of objects with { source: string, projectedAmount: number, timeframe: string, assumptions: string[] }
        - breakEvenAnalysis: object with { timeToBreakEven: string, monthlyBreakEvenPoint: number, assumptions: string[] }
        - projectedProfitMargin: number (percentage)
    13. fundingRequirements (object with funding details):
        - totalRequired: number
        - fundingStages: array of objects with { stage: string, amount: number, timeline: string, purpose: string, milestones: string[] }
        - equityDilution: array of objects with { stage: string, percentage: number, valuation: number }
        - fundingSources: array of objects with { type: string, likelihood: number, requirements: string[], pros: string[], cons: string[] }
        - useOfFunds: array of objects with { category: string, amount: number, description: string, priority: 'high' | 'medium' | 'low' }
    14. revenueModel (object with revenue stream details):
        - primaryStreams: array of objects with:
          * name: string
          * description: string
          * percentage: number (percentage of total revenue)
          * scalability: 'high' | 'medium' | 'low'
          * recurringType: 'one-time' | 'subscription' | 'usage-based' | 'hybrid'
        - metrics: array of objects with:
          * name: string
          * current: number
          * target: number
          * timeframe: string
        - marketAnalysis: {
            totalAddressableMarket: string (TAM)
            serviceableAddressableMarket: string (SAM)
            serviceableObtainableMarket: string (SOM)
            marketGrowthRate: string
            competitiveLandscape: {
              competitors: string[] (key competitors)
              marketShare: string (your market share)
              competitiveAdvantages: string[] (your advantages)
            }
            marketTrends: {
              current: string[] (current trends)
              emerging: string[] (emerging trends)
              impact: string (impact on revenue)
            }
          }
        - financialProjections: {
            revenueGrowth: {
              year1: string
              year2: string
              year3: string
              assumptions: string[]
            }
            profitMargins: {
              current: string
              target: string
              improvementStrategy: string
            }
            breakEvenAnalysis: {
              point: string
              timeline: string
              assumptions: string[]
            }
          }
    15. milestones (object with quarterly objectives and critical milestones):
        - quarters: array of objects with:
          * quarter: string (e.g., "Q1 2024")
          * objectives: array of objects with:
            - title: string
            - description: string
            - metrics: array of objects with { name: string, target: string | number }
            - status: 'pending' | 'in-progress' | 'completed'
            - dependencies: string[]
          * keyDeliverables: string[]
          * budget: number
        - criticalMilestones: array of objects with:
          * name: string
          * date: string
          * importance: string
          * successCriteria: string[]
    16. currency: string (e.g., "INR" or "USD") — The currency CODE used for all monetary values in this report. All monetary values in this report must use the currency CODE (e.g., "INR", "USD", "AED") specified here, and must be consistent throughout. NEVER use currency symbols (such as $, ₹, €) in the JSON. Only use the currency code (e.g., "USD", "INR", "AED"). Never mix currencies. If the business is in India, use INR; if in the US, use USD; etc. If the user prompt mentions a country, always use that country's currency. State the currency at the top of the JSON as: currency: "INR" (or "USD", etc.).

    IMPORTANT CURRENCY RULES:
    1. If the business is in India, ALL monetary values MUST use INR only. This includes:
       - Pricing analysis
       - Financial plans
       - Milestones and budgets
       - Revenue forecasts
       - Investment requirements
       - Break-even analysis
       - All other monetary values
    2. If the business is in the US, ALL monetary values MUST use USD only.
    3. NEVER mix currencies within the same report.
    4. If you find any value in another currency, convert it to the specified currency using current exchange rates and explain the conversion in the consistencyCheck.
    5. For Indian businesses:
       - Use the code "INR" for all monetary values in the JSON (never the ₹ symbol)
       - Format large numbers with commas (e.g., 1,00,00,000)
       - Use lakhs and crores for large numbers (e.g., 1 crore instead of 10,000,000)
    6. For US businesses:
       - Use the code "USD" for all monetary values in the JSON (never the $ symbol)
       - Format large numbers with commas (e.g., 1,000,000)
       - Use millions and billions for large numbers (e.g., 1M instead of 1,000,000)
    7. NEVER use currency symbols in the JSON. Only use the currency code (e.g., "USD", "INR", "AED").

    17. For every chart (including price trends, revenue, customer, and market share), you MUST include axis labels and units in the JSON. For example, add fields like "xAxisLabel": "Date (MM/DD)", "yAxisLabel": "Number of Users", "yAxisUnit": "users". If any chart is missing axis labels or units, regenerate the JSON.

    18. Segment revenue breakdown: For every customer segment, provide a revenue contribution estimate, and ensure that segment priorities match their revenue contribution. If a segment is marked high priority but has low revenue, or vice versa, correct the priorities or revenue breakdown so they are consistent.

    19. Consistency Check (STRICT):
        - investmentVsStartupCosts: Confirm that the initial investment matches the sum of startup costs. If not, CORRECT the numbers so they match, and explain the correction.
        - revenueVsMarketShare: Confirm that the projected revenue aligns with the stated market share and total market size. If not, CORRECT the numbers so they match, and explain the correction.
        - timelineVsRevenue: Confirm that the revenue forecast starts only after the business is operational (e.g., after first harvest or product launch). If not, CORRECT the timeline or revenue forecast, and explain the correction.
        - chartAxes: For every chart, specify the units and axis labels. If missing, REGENERATE the JSON.
        - revenueBySegment: Provide a breakdown of revenue by customer segment, and ensure segment priorities match their revenue contribution. If not, CORRECT the priorities or revenue breakdown.
        - valueAddedJustification: If value-added products are a small share despite high margin, explain why, or adjust the share to match the business logic.
        - currencyAndUnits: Ensure all monetary values use the same currency CODE and units throughout the report. If not, CORRECT them. NEVER use currency symbols in the JSON.
        - currencyConsistency: Confirm that all monetary values use the specified currency CODE. If not, CORRECT and flag. Specifically check:
          * All pricing models use the same currency CODE
          * All financial plans use the same currency CODE
          * All milestones and budgets use the same currency CODE
          * All revenue forecasts use the same currency CODE
          * All investment requirements use the same currency CODE
          * All break-even analysis uses the same currency CODE
          * If any currency is mixed, convert ALL values to the specified currency CODE
        - forecastConsistency: Ensure the averageCase is a realistic middle ground based on market analysis, not a simple mathematical average. The averageCase should:
          * Be higher than worstCase but lower than bestCase
          * Consider market conditions, competition, and historical data
          * Have consistent units and currency CODE with other cases
          * Align with the business timeline and market entry strategy
        - If ANY inconsistency is found, DO NOT return the JSON. Instead, REGENERATE and CORRECT the data until ALL checks pass. Only return the JSON if ALL consistency checks pass and all numbers, currencies, and logic are aligned.
    Format as valid JSON without markdown formatting or explanations. Use realistic data based on current market trends. The response MUST include all required fields, especially the 15 sources requirement.

    IMPORTANT: Before finalizing the JSON, perform a strict consistency check as described above. If any numbers, currencies, or logic do not align, correct them and regenerate the JSON. All monetary values in this report must use the currency CODE specified in the 'currency' field, and must be consistent throughout. NEVER use currency symbols in the JSON. Ensure the JSON is properly formatted without any syntax errors. Do not use markdown code blocks.

    IMPORTANT: All string values must be concise (max 200 characters). Never return incomplete or truncated JSON. Always close all brackets and quotes.`;

    const fullPrompt = `${systemPrompt}\n\nAnalyze this business idea and provide deep market research: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = await response.text();

    return parseAndCleanResponse(text, skipCurrencyCheck);
  } catch (error) {
    console.error('Error generating analysis (Gemini):', error);
    throw error;
  }
};

/**
 * Parses and cleans the Gemini API response text
 * @param text Raw response text from Gemini API
 * @param skipCurrencyCheck Optional flag to skip currency consistency check
 * @returns Cleaned and parsed AnalysisResult object
 */
function parseAndCleanResponse(text: string, skipCurrencyCheck: boolean = false): AnalysisResult | null {
  // Step 1: Extract JSON content (removing markdown code blocks if present)
  let jsonString = extractJsonContent(text);
  
  // Step 2: Clean the JSON string
  jsonString = cleanJsonString(jsonString);
  
  // Step 3: Try parsing with increasingly aggressive recovery techniques
  return parseWithRecovery(jsonString, text, skipCurrencyCheck);
}

/**
 * Extracts JSON content from text that might contain markdown
 */
function extractJsonContent(text: string): string {
  // First remove markdown code blocks if present
  let content = text.replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/m, '$1').trim();
  
  // If that didn't work, try to find a JSON object directly
  if (!content.startsWith('{') && !content.endsWith('}')) {
    const jsonMatch = text.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
  }
  
  return content;
}

/**
 * Cleans common JSON formatting issues
 */
function cleanJsonString(jsonString: string): string {
  let cleaned = jsonString;
  
  // Fix trailing commas before closing brackets
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
  
  // Remove double commas
  cleaned = cleaned.replace(/,,+/g, ',');
  
  // Convert newlines in string values to spaces
  cleaned = cleaned.replace(/"([^"\\]*(?:\\.[^"\\]*)*)\n([^"\\]*)"/g, (_, p1, p2) => {
    return `"${p1} ${p2}"`;
  });
  
  // Replace control characters that can break JSON
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, ' ');
  
  return cleaned;
}

/**
 * Attempts to parse JSON with increasingly aggressive recovery techniques
 */
function parseWithRecovery(jsonString: string, originalText: string, skipCurrencyCheck: boolean): AnalysisResult | null {
  let result = null;
  let lastError = null;
  
  // First attempt: Parse as-is
  try {
    result = JSON.parse(jsonString);
    // Only apply currency consistency if not skipped
    return skipCurrencyCheck ? result : applyCurrencyConsistency(result);
  } catch (err) {
    lastError = err;
    console.warn('Initial JSON parse failed, attempting recovery:', err);
  }

  // Second attempt: Auto-close brackets and quotes
  try {
    const fixedJson = autoCloseJson(jsonString);
    result = JSON.parse(fixedJson);
    console.info('Recovered JSON using auto-close');
    return skipCurrencyCheck ? result : applyCurrencyConsistency(result);
  } catch (err) {
    lastError = err;
    console.warn('Auto-close JSON recovery failed:', err);
  }

  // Third attempt: Perform chunk-based recovery
  try {
    const recoveredJson = chunkBasedRecovery(jsonString);
    if (recoveredJson) {
      result = JSON.parse(recoveredJson);
      console.info('Recovered JSON using chunk-based recovery');
      return skipCurrencyCheck ? result : applyCurrencyConsistency(result);
    }
  } catch (err) {
    lastError = err;
    console.warn('Chunk-based recovery failed:', err);
  }

  // Final attempt: Use regex to extract the largest valid JSON object
  try {
    const largestValidJson = findLargestValidJson(jsonString);
    if (largestValidJson) {
      result = JSON.parse(largestValidJson);
      console.info('Recovered partial JSON using regex extraction');
      return skipCurrencyCheck ? result : applyCurrencyConsistency(result);
    }
  } catch (err) {
    console.error('All JSON recovery methods failed');
  }

  // If all recovery attempts failed
  console.error('Gemini JSON parse error. Original string:', originalText);
  console.error('Last JSON parsing error:', lastError);
  throw new Error('Failed to parse AI-generated analysis. Please try again with a clearer business description.');
}

/**
 * Auto-closes unbalanced brackets and quotes in JSON
 */
function autoCloseJson(str: string): string {
  let fixed = str;
  
  // Check for and fix unterminated strings
  const quoteCount = (fixed.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    // Find the last valid position for each string
    let inString = false;
    let escaped = false;
    let lastOpenQuote = -1;
    
    for (let i = 0; i < fixed.length; i++) {
      const char = fixed[i];
      
      if (char === '\\' && !escaped) {
        escaped = true;
        continue;
      }
      
      if (char === '"' && !escaped) {
        if (!inString) {
          lastOpenQuote = i;
          inString = true;
        } else {
          inString = false;
        }
      }
      
      escaped = false;
    }
    
    // If we're still in a string at the end, close it
    if (inString && lastOpenQuote !== -1) {
      fixed += '"';
    }
  }
  
  // Count and fix unbalanced brackets
  const openCurly = (fixed.match(/\{/g) || []).length;
  const closeCurly = (fixed.match(/\}/g) || []).length;
  const openSquare = (fixed.match(/\[/g) || []).length;
  const closeSquare = (fixed.match(/\]/g) || []).length;
  
  // Add missing closing brackets
  if (openCurly > closeCurly) fixed += '}'.repeat(openCurly - closeCurly);
  if (openSquare > closeSquare) fixed += ']'.repeat(openSquare - closeSquare);
  
  return fixed;
}

/**
 * Chunk-based recovery strategy that removes problematic sections
 */
function chunkBasedRecovery(json: string): string | null {
  const chunks = json.split(/,(?=\s*["{\[])/);
  
  // Try removing one chunk at a time from the end
  for (let i = chunks.length - 1; i > 0; i--) {
    const reducedJson = chunks.slice(0, i).join(',') + '}';
    
    try {
      // Just testing if it's valid - we'll parse it later
      JSON.parse(reducedJson);
      return reducedJson;
    } catch (err) {
      // Keep going with fewer chunks
    }
  }
  
  return null;
}

/**
 * Finds the largest valid JSON object in the string
 */
function findLargestValidJson(text: string): string | null {
  // Look for JSON objects that start with { and end with }
  const jsonObjRegex = /\{(?:[^{}]|(?:\{[^{}]*\}))*\}/g;
  let match;
  let largestMatch = '';
  
  while ((match = jsonObjRegex.exec(text)) !== null) {
    try {
      const jsonStr = match[0];
      // Test if it's valid JSON
      JSON.parse(jsonStr);
      
      // Keep track of the largest valid match
      if (jsonStr.length > largestMatch.length) {
        largestMatch = jsonStr;
      }
    } catch (e) {
      // Not valid JSON, continue
    }
  }
  
  return largestMatch || null;
}

/**
 * Ensures currency consistency throughout the result
 */
function applyCurrencyConsistency(obj: any): AnalysisResult {
  if (!obj || !obj.currency) {
    return obj;
  }

  // Normalize the currency code
  const normalizedCurrency = obj.currency.toUpperCase().replace(/[₹$€]/g, '');
  obj.currency = normalizedCurrency; // Store the normalized currency code

  function fixCurrency(item: any, currency: string): any {
    if (typeof item === 'string') {
      // Only replace currency symbols in display strings, not in currency codes
      if (currency === 'INR') {
        // Replace currency symbols but preserve currency codes
        return item
          .replace(/\$|USD|usd|A\.?E\.?D\.?|aed/gi, (match) => {
            // If it's a currency code, keep it as INR
            return match.toUpperCase() === 'USD' ? 'INR' : '₹';
          })
          .replace(/INR/gi, 'INR'); // Keep INR as is
      } else if (currency === 'USD') {
        return item
          .replace(/₹|INR|inr|A\.?E\.?D\.?|aed/gi, (match) => {
            return match.toUpperCase() === 'INR' ? 'USD' : '$';
          })
          .replace(/USD/gi, 'USD'); // Keep USD as is
      } else if (currency === 'AED') {
        return item
          .replace(/\$|USD|usd|INR|inr|₹/gi, (match) => {
            const upper = match.toUpperCase();
            if (upper === 'USD') return 'USD';
            if (upper === 'INR') return 'INR';
            return 'AED';
          })
          .replace(/AED/gi, 'AED'); // Keep AED as is
      }
    } else if (Array.isArray(item)) {
      return item.map(element => fixCurrency(element, currency));
    } else if (typeof item === 'object' && item !== null) {
      const newObj: Record<string, any> = {};
      for (const key in item) {
        // Don't modify currency codes in property names
        if (key === 'currency') {
          newObj[key] = currency;
        } else {
          newObj[key] = fixCurrency(item[key], currency);
        }
      }
      return newObj;
    }
    return item;
  }

  return fixCurrency(obj, normalizedCurrency) as AnalysisResult;
}
