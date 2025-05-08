import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from '../types/oracle';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const generateAnalysis = async (
  prompt: string
): Promise<AnalysisResult | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" }); // or "gemini-2.0-flash-grounding" if available
    
    const systemPrompt = `You are Oracle, an AI market research analyst for startups and businesses. Conduct deep research on the business idea provided and deliver comprehensive analysis with real-time market insights. Spend 2-3 minutes on deep market analysis before responding.

    Analyze the business idea thoroughly and provide a structured JSON response with the following:
    1. validationScore (0-100): Calculated based on market potential, uniqueness, feasibility, and timing
    2. competitors (array): For each competitor, include:
       - name: Competitor name
       - strengthScore: 0-100
       - description: 1-2 sentence description
       - marketShare: Percentage of market share (number, e.g. 45 for 45%)
       - primaryAdvantage: Short, bold key advantage (e.g. 'Extensive network and brand recognition')
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
          * targetAudience: string (e.g., "2.4M")
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
          * detailedAnalysis: {
              targetMarket: string[] (specific market segments)
              competitiveAdvantage: string (how this revenue stream differentiates)
              growthPotential: {
                shortTerm: string (3-6 months projection)
                longTerm: string (1-2 years projection)
                assumptions: string[] (key assumptions)
              }
              implementationRequirements: {
                resources: string[] (required resources)
                timeline: string (implementation timeline)
                dependencies: string[] (prerequisites)
              }
              riskFactors: {
                risks: string[] (potential risks)
                mitigations: string[] (risk mitigation strategies)
              }
              marketConditions: {
                current: string (current market state)
                trends: string[] (market trends affecting this stream)
                opportunities: string[] (growth opportunities)
              }
              customerValue: {
                valueProposition: string (customer benefits)
                painPoints: string[] (problems solved)
                willingnessToPay: string (customer price sensitivity)
              }
            }
        - metrics: array of objects with:
          * name: string
          * current: number
          * target: number
          * timeframe: string
          * detailedMetrics: {
              definition: string (metric definition)
              calculation: string (how it's calculated)
              importance: string (why it matters)
              industryBenchmark: string (industry standard)
              improvementStrategy: string (how to improve)
            }
        - growthStrategy: array of objects with:
          * phase: string
          * tactics: string[]
          * expectedImpact: string
          * timeline: string
          * detailedStrategy: {
              objectives: string[] (specific goals)
              keyActivities: string[] (required actions)
              successCriteria: string[] (how to measure success)
              resourceRequirements: string[] (needed resources)
              riskAssessment: {
                risks: string[] (potential risks)
                mitigations: string[] (risk mitigation strategies)
              }
              marketAnalysis: {
                targetSegments: string[] (focus areas)
                competitivePosition: string (market position)
                growthOpportunities: string[] (expansion possibilities)
              }
            }
        - risks: array of objects with:
          * category: string
          * probability: 'high' | 'medium' | 'low'
          * impact: 'high' | 'medium' | 'low'
          * mitigationStrategy: string
          * detailedRisk: {
              description: string (detailed risk description)
              triggers: string[] (risk triggers)
              earlyWarningSigns: string[] (indicators)
              contingencyPlans: string[] (backup plans)
              monitoringMetrics: string[] (metrics to track)
            }
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
    16. currency: string (e.g., "INR" or "USD") — The currency used for all monetary values in this report. All monetary values in this report must use the currency specified here, and must be consistent throughout. Never mix currencies. If the business is in India, use INR (₹); if in the US, use USD ($); etc. If the user prompt mentions a country, always use that country's currency. State the currency at the top of the JSON as: currency: "INR" (or "USD", etc.).

    IMPORTANT CURRENCY RULES:
    1. If the business is in India, ALL monetary values MUST use INR (₹) only. This includes:
       - Pricing analysis
       - Financial plans
       - Milestones and budgets
       - Revenue forecasts
       - Investment requirements
       - Break-even analysis
       - All other monetary values
    2. If the business is in the US, ALL monetary values MUST use USD ($) only.
    3. NEVER mix currencies within the same report.
    4. If you find any value in another currency, convert it to the specified currency using current exchange rates and explain the conversion in the consistencyCheck.
    5. For Indian businesses:
       - Use ₹ symbol for INR
       - Format large numbers with commas (e.g., ₹1,00,00,000)
       - Use lakhs and crores for large numbers (e.g., ₹1 crore instead of ₹10,000,000)
    6. For US businesses:
       - Use $ symbol for USD
       - Format large numbers with commas (e.g., $1,000,000)
       - Use millions and billions for large numbers (e.g., $1M instead of $1,000,000)

    17. For every chart (including price trends, revenue, customer, and market share), you MUST include axis labels and units in the JSON. For example, add fields like "xAxisLabel": "Date (MM/DD)", "yAxisLabel": "Number of Users", "yAxisUnit": "users". If any chart is missing axis labels or units, regenerate the JSON.

    18. Segment revenue breakdown: For every customer segment, provide a revenue contribution estimate, and ensure that segment priorities match their revenue contribution. If a segment is marked high priority but has low revenue, or vice versa, correct the priorities or revenue breakdown so they are consistent.

    19. Consistency Check (STRICT):
        - investmentVsStartupCosts: Confirm that the initial investment matches the sum of startup costs. If not, CORRECT the numbers so they match, and explain the correction.
        - revenueVsMarketShare: Confirm that the projected revenue aligns with the stated market share and total market size. If not, CORRECT the numbers so they match, and explain the correction.
        - timelineVsRevenue: Confirm that the revenue forecast starts only after the business is operational (e.g., after first harvest or product launch). If not, CORRECT the timeline or revenue forecast, and explain the correction.
        - chartAxes: For every chart, specify the units and axis labels. If missing, REGENERATE the JSON.
        - revenueBySegment: Provide a breakdown of revenue by customer segment, and ensure segment priorities match their revenue contribution. If not, CORRECT the priorities or revenue breakdown.
        - valueAddedJustification: If value-added products are a small share despite high margin, explain why, or adjust the share to match the business logic.
        - currencyAndUnits: Ensure all monetary values use the same currency and units throughout the report. If not, CORRECT them.
        - currencyConsistency: Confirm that all monetary values use the specified currency. If not, CORRECT and flag. Specifically check:
          * All pricing models use the same currency
          * All financial plans use the same currency
          * All milestones and budgets use the same currency
          * All revenue forecasts use the same currency
          * All investment requirements use the same currency
          * All break-even analysis uses the same currency
          * If any currency is mixed, convert ALL values to the specified currency
        - forecastConsistency: Ensure the averageCase is a realistic middle ground based on market analysis, not a simple mathematical average. The averageCase should:
          * Be higher than worstCase but lower than bestCase
          * Consider market conditions, competition, and historical data
          * Have consistent units and currency with other cases
          * Align with the business timeline and market entry strategy
        - If ANY inconsistency is found, DO NOT return the JSON. Instead, REGENERATE and CORRECT the data until ALL checks pass. Only return the JSON if ALL consistency checks pass and all numbers, currencies, and logic are aligned.
    Format as valid JSON without markdown formatting or explanations. Use realistic data based on current market trends. The response MUST include all required fields, especially the 15 sources requirement.

    IMPORTANT: Before finalizing the JSON, perform a strict consistency check as described above. If any numbers, currencies, or logic do not align, correct them and regenerate the JSON. All monetary values in this report must use the currency specified in the 'currency' field, and must be consistent throughout. Never mix currencies. Ensure the JSON is properly formatted without any syntax errors. Do not use markdown code blocks.

    IMPORTANT: All string values must be concise (max 200 characters). Never return incomplete or truncated JSON. Always close all brackets and quotes.`;

    const fullPrompt = `${systemPrompt}\n\nAnalyze this business idea and provide deep market research: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = await response.text();

    // Clean up the response text to handle potential markdown formatting
    let jsonString = text.replace(/^```json\n?/, '')
      .replace(/^```\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    // Remove any trailing commas before closing brackets/braces (robust)
    jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');
    // Remove double commas
    jsonString = jsonString.replace(/,,+/g, ',');
    // Remove newlines in string values (between quotes)
    jsonString = jsonString.replace(/"([^"\\]*(?:\\.[^"\\]*)*)\n([^"\\]*)"/g, (match, p1, p2) => {
      return `"${p1} ${p2}"`;
    });

    // Try to extract just the JSON part if there's other content
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
    // Auto-close brackets/braces and unterminated strings if the output is truncated (last-resort hack)
    function autoCloseJson(str) {
      let fixed = str;
      // Fix unterminated strings
      const quoteCount = (fixed.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        // If there's an odd number of quotes, try to find the last unescaped quote
        // and see if the string ends right after it or with a comma/bracket missing a quote
        let lastQuoteIndex = -1;
        let inString = false;
        for (let i = 0; i < fixed.length; i++) {
          if (fixed[i] === '"' && (i === 0 || fixed[i-1] !== '\\')) {
            inString = !inString;
            if (!inString) lastQuoteIndex = i;
          }
        }
        // If the string ends while inString is true, or the last quote is very near the end
        // and the content looks like a truncated string value.
        if (inString || (fixed.length - lastQuoteIndex < 5 && !fixed.substring(lastQuoteIndex+1).match(/[\[\],:]/)) ) {
            // Check if the string looks like it's cut off: "key": "value...
            // Basic check: ends with alphanumeric or space, not a quote
            if (/[a-zA-Z0-9\s]$/.test(fixed)) {
                 fixed += '"'; 
            }
        } else if (quoteCount % 2 !== 0 && !inString) { 
            // Odd number of quotes, but we are not currently "inString"
            // This can happen if the truncation occurred like: "key": "value" , "anotherKey": "value...
            // Or if a quote is genuinely missing. A simple fix is to append one,
            // hoping the rest of the structure is fine or will be fixed by bracket closing.
            if (/[a-zA-Z0-9\s]$/.test(fixed)) {
                 fixed += '"';
            }
        }
      }

      const openCurly = (fixed.match(/\{/g) || []).length;
      const closeCurly = (fixed.match(/\}/g) || []).length;
      const openSquare = (fixed.match(/\[/g) || []).length;
      const closeSquare = (fixed.match(/\]/g) || []).length;
      
      if (openCurly > closeCurly) fixed += '}'.repeat(openCurly - closeCurly);
      if (openSquare > closeSquare) fixed += ']'.repeat(openSquare - closeSquare);
      return fixed;
    }

    let lastError = null;
    let resultObj = null;
    
    // Apply auto-closing early, before the first parse attempt in the robust error handling
    jsonString = autoCloseJson(jsonString);

    // --- Currency Consistency Post-Processing ---
    // Define fixCurrencyConsistency in a scope accessible by both try/catch blocks below
    function fixCurrencyConsistency(obj, currency) {
      if (typeof obj === 'string') {
        if (currency === 'INR') {
          const fixed = obj.replace(/\$|USD|usd|A\.?E\.?D\.?|aed/gi, '₹').replace(/INR/gi, '₹');
          return fixed;
        } else if (currency === 'USD') {
          const fixed = obj.replace(/₹|INR|inr|A\.?E\.?D\.?|aed/gi, '$').replace(/\$/g, '$');
          return fixed;
        } else if (currency === 'AED') {
          const fixed = obj.replace(/\$|USD|usd|INR|inr|₹/gi, 'AED');
          return fixed;
        }
      } else if (Array.isArray(obj)) {
        return obj.map((item) => fixCurrencyConsistency(item, currency));
      } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj) {
          newObj[key] = fixCurrencyConsistency(obj[key], currency);
        }
        return newObj;
      }
      return obj;
    }

    try {
      resultObj = JSON.parse(jsonString);
      if (resultObj && resultObj.currency) {
        const fixedResult = fixCurrencyConsistency(resultObj, resultObj.currency);
        return fixedResult as AnalysisResult;
      }
      return resultObj as AnalysisResult;
    } catch (err) {
      lastError = err;
      // Try to recover: find the largest valid JSON substring
      let attempt = 0;
      let recovered = false;
      // No need to re-assign jsonString to cleaned if it's already processed by autoCloseJson once.
      // let cleaned = jsonString; 
      while (attempt < 2 && !recovered) {
        try {
          // We already tried parsing jsonString once. If it failed, now try more recovery.
          if (attempt > 0 || !resultObj) { // resultObj would be null if first parse failed
            jsonString = autoCloseJson(jsonString); // Re-apply in case previous fix was insufficient for complex cases
            resultObj = JSON.parse(jsonString);
          }
          recovered = true;
          // Currency consistency logic was here, it's fine to keep it after successful parse
          if (resultObj && resultObj.currency) {
            const fixedResult = fixCurrencyConsistency(resultObj, resultObj.currency);
            return fixedResult as AnalysisResult;
          }
          return resultObj as AnalysisResult;
        } catch (e) {
          lastError = e;
          // Try to find the largest valid JSON substring by removing the last unterminated part
          const lastCurly = jsonString.lastIndexOf('}');
          const lastSquare = jsonString.lastIndexOf(']');
          
          let cutIndex = Math.max(lastCurly, lastSquare);

          if (cutIndex > 0) {
            // Check if the cut point is inside a string
            let tempStr = jsonString.substring(0, cutIndex + 1);
            let quoteCountCheck = (tempStr.match(/"/g) || []).length;
            if(quoteCountCheck % 2 !== 0){
                //If odd number of quotes, try to find previous valid ending.
                const lastComma = tempStr.lastIndexOf(',');
                if(lastComma > 0) tempStr = tempStr.substring(0, lastComma);
            }
            jsonString = tempStr;

          } else {
            // No more structural elements to cut back to.
            break; 
          }
        }
        attempt++;
      }
      // If still failing, log and throw user-friendly error
      console.error('Gemini JSON parse error. Original string:', text);
      // console.error('Gemini JSON parse error. Cleaned string for final attempt:', jsonString); // Log the state of jsonString before the last throw
      throw new Error('Sorry, the AI-generated analysis could not be parsed due to a formatting error (even after recovery attempts). Please try again or rephrase your idea.');
    }

    return resultObj as AnalysisResult;
  } catch (error) {
    console.error('Error generating analysis (Gemini):', error);
    throw error;
  }
};
