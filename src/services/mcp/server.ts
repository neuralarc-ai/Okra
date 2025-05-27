import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  MCPContext, 
  MCPMessage, 
  MCPTool, 
  MCPError,
  MCPAnalysisTool,
  MCPValidationTool,
  MCPConsistencyTool,
  MCPToolParameters
} from './types';
import { AnalysisResult } from '../../types/oracle';
import { parseAndCleanResponse, applyCurrencyConsistency } from '../openRouterService';

// Define parameter types for tools
interface AnalysisToolParams {
  prompt: string;
  skipCurrencyCheck?: boolean;
}

interface ValidationToolParams {
  analysis: AnalysisResult;
}

interface ConsistencyToolParams {
  analysis: AnalysisResult;
}

interface ConsistencyCorrections {
  currency?: AnalysisResult;
  forecasts?: {
    bestCase: { revenue: number; marketShare: number; customers: number; period: string };
    averageCase: { revenue: number; marketShare: number; customers: number; period: string };
    worstCase: { revenue: number; marketShare: number; customers: number; period: string };
  };
}

export class MCPServer {
  private contexts: Map<string, MCPContext>;
  private tools: Map<string, MCPTool>;
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.contexts = new Map();
    this.tools = new Map();
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.initializeTools();
  }

  private initializeTools() {
    // Register the analysis tool
    const analysisTool: MCPAnalysisTool = {
      name: 'analyzeBusiness',
      description: 'Analyzes a business idea using Gemini AI',
      parameters: {
        prompt: 'string',
        skipCurrencyCheck: false
      },
      execute: async (params: { prompt: string; skipCurrencyCheck?: boolean }, context: MCPContext) => {
        try {
          const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });
          
          // Get the system prompt
          const systemPrompt = this.getSystemPrompt(context);
          
          // Add explicit JSON request to the prompt
          const fullPrompt = `${systemPrompt}

IMPORTANT: Respond with a valid JSON object ONLY. No markdown, no explanations, just the JSON.

Analyze this business idea and provide deep market research: ${params.prompt}

Remember: Return ONLY the JSON object, nothing else.`;

          const result = await model.generateContent(fullPrompt);
          const response = await result.response;
          const text = await response.text();

          // Pre-validate the response
          const validationIssues = this.validateJsonResponse(text);
          if (validationIssues.length > 0) {
            throw new Error(`Invalid JSON response: ${validationIssues.join(', ')}`);
          }

          // Parse and clean the response
          const analysis = parseAndCleanResponse(text, params.skipCurrencyCheck);
          
          // Post-validate the parsed analysis
          const analysisIssues = this.validateAnalysisStructure(analysis);
          if (analysisIssues.length > 0) {
            throw new Error(`Invalid analysis structure: ${analysisIssues.join(', ')}`);
          }
          
          // Update context
          this.updateContext(context, {
            currentAnalysis: analysis,
            lastUpdated: Date.now(),
            metadata: {
              ...context.state.metadata,
              validationStatus: 'pending'
            }
          });

          return analysis;
        } catch (error) {
          throw new MCPError(
            error instanceof Error ? error.message : 'Analysis failed',
            'ANALYSIS_FAILED',
            context,
            'analyzeBusiness'
          );
        }
      }
    };

    // Register the validation tool
    const validationTool: MCPValidationTool = {
      name: 'validateAnalysis',
      description: 'Validates the analysis result for completeness and correctness',
      parameters: {
        analysis: 'AnalysisResult'
      },
      execute: async (params: { analysis: AnalysisResult }, context: MCPContext) => {
        try {
          const analysis = params.analysis;
          const issues: string[] = [];

          // Check required fields
          const requiredFields = [
            'validationScore', 'competitors', 'priceSuggestions', 
            'forecasts', 'timeline', 'goToMarket', 'targetAudienceType',
            'clients', 'sources', 'summary', 'scoreAnalysis'
          ];

          for (const field of requiredFields) {
            if (!analysis[field]) {
              issues.push(`Missing required field: ${field}`);
            }
          }

          // Check sources count
          if (analysis.sources && analysis.sources.length !== 15) {
            issues.push(`Invalid number of sources: ${analysis.sources.length}. Expected exactly 15.`);
          }

          // Check currency consistency if not skipped
          if (!context.state.metadata.skipCurrencyCheck) {
            const currencyCheck = await this.tools.get('checkConsistency')?.execute({ analysis }, context);
            if (currencyCheck && !currencyCheck.isConsistent) {
              issues.push(...currencyCheck.issues);
            }
          }

          const isValid = issues.length === 0;

          // Update context
          this.updateContext(context, {
            metadata: {
              ...context.state.metadata,
              validationStatus: isValid ? 'valid' : 'invalid'
            }
          });

          return {
            isValid,
            issues,
            correctedAnalysis: isValid ? analysis : undefined
          };
        } catch (error) {
          throw new MCPError(
            error instanceof Error ? error.message : 'Validation failed',
            'VALIDATION_FAILED',
            context,
            'validateAnalysis'
          );
        }
      }
    };

    // Register the consistency tool
    const consistencyTool: MCPConsistencyTool = {
      name: 'checkConsistency',
      description: 'Checks currency and data consistency in the analysis',
      parameters: {
        analysis: 'AnalysisResult'
      },
      execute: async (params: { analysis: AnalysisResult }, context: MCPContext) => {
        try {
          const analysis = params.analysis;
          const issues: string[] = [];
          const corrections: {
            currency?: AnalysisResult;
            forecasts?: AnalysisForecasts;
          } = {};

          // Check currency consistency
          if (analysis.currency) {
            const normalizedAnalysis = applyCurrencyConsistency(analysis);
            if (JSON.stringify(normalizedAnalysis) !== JSON.stringify(analysis)) {
              issues.push('Currency inconsistency detected');
              corrections.currency = normalizedAnalysis;
            }
          }

          // Check forecast consistency
          if (analysis.forecasts) {
            const { bestCase, averageCase, worstCase } = analysis.forecasts as AnalysisForecasts;
            if (averageCase?.revenue <= worstCase.revenue || averageCase?.revenue >= bestCase.revenue) {
              issues.push('Forecast cases are not properly ordered');
              corrections.forecasts = {
                bestCase: {
                  ...bestCase,
                  period: bestCase.period || '12 months'
                },
                averageCase: {
                  revenue: (bestCase.revenue + worstCase.revenue) / 2,
                  marketShare: (bestCase.marketShare + worstCase.marketShare) / 2,
                  customers: (bestCase.customers + worstCase.customers) / 2,
                  period: bestCase.period || '12 months'
                },
                worstCase: {
                  ...worstCase,
                  period: worstCase.period || '12 months'
                }
              };
            }
          }

          // Update context
          this.updateContext(context, {
            metadata: {
              ...context.state.metadata,
              consistencyChecks: {
                ...context.state.metadata.consistencyChecks,
                currency: issues.length === 0
              }
            }
          });

          return {
            isConsistent: issues.length === 0,
            issues,
            corrections: Object.keys(corrections).length > 0 ? corrections : undefined
          };
        } catch (error) {
          throw new MCPError(
            error instanceof Error ? error.message : 'Consistency check failed',
            'CONSISTENCY_CHECK_FAILED',
            context,
            'checkConsistency'
          );
        }
      }
    };

    // Register all tools
    this.tools.set(analysisTool.name, analysisTool);
    this.tools.set(validationTool.name, validationTool);
    this.tools.set(consistencyTool.name, consistencyTool);
  }

  private getSystemPrompt(context: MCPContext): string {
    // Get the last system message from history or use default
    const systemMessage = context.history
      .filter(msg => msg.role === 'system')
      .pop()?.content;

    return systemMessage || `You are Oracle, an AI market research analyst for startups and businesses. Your task is to analyze business ideas and provide structured market research.

CRITICAL OUTPUT FORMAT RULES:
1. DO NOT use markdown formatting (no \`\`\`json or \`\`\` blocks)
2. DO NOT include any text before or after the JSON
3. DO NOT include any explanations or comments
4. DO NOT use code blocks or formatting
5. DO NOT use backticks or any other markdown syntax
6. DO NOT include any line breaks outside of string values
7. DO NOT include any whitespace before or after the JSON object
8. DO NOT include any headers or titles
9. DO NOT include any section markers
10. DO NOT include any decorative characters

THE RESPONSE MUST BE:
- A single, raw JSON object
- Starting with { and ending with }
- No markdown formatting
- No code blocks
- No explanations
- No additional text

EXAMPLE OF CORRECT OUTPUT:
{"validationScore":85,"competitors":[...]}

EXAMPLE OF INCORRECT OUTPUT:
\`\`\`json
{"validationScore":85,"competitors":[...]}
\`\`\`

Here is the exact JSON structure you must return (as a single, raw JSON object with no markdown or formatting):

{
  "validationScore": number (0-100),
  // ... rest of the structure as before ...
}

VALIDATION REQUIREMENTS:
1. The response MUST be a single, raw JSON object
2. NO markdown formatting of any kind
3. NO code blocks or backticks
4. NO text before or after the JSON
5. NO explanations or comments
6. NO decorative characters
7. NO section markers
8. NO headers or titles
9. NO whitespace before or after the JSON
10. NO line breaks outside of string values

If you include ANY markdown formatting, code blocks, or text outside the JSON object, the response will be rejected and you will need to regenerate it.

IMPORTANT: Before returning the response, verify that:
1. There are NO markdown code blocks
2. There is NO text before or after the JSON
3. The response is a single, raw JSON object
4. There are NO backticks or formatting
5. There are NO explanations or comments

If ANY of these requirements are not met, regenerate the response until they are.`;
  }

  private updateContext(context: MCPContext, updates: Partial<MCPContext['state']>) {
    const newContext = {
      ...context,
      state: {
        ...context.state,
        ...updates
      }
    };
    this.contexts.set(context.conversationId, newContext);
  }

  private createMCPError(code: string, error: Error, context: MCPContext, tool?: string): MCPError {
    return new MCPError(
      error.message,
      code,
      context,
      tool,
      true // recoverable by default
    );
  }

  // Public API methods

  public async createContext(initialState?: Partial<MCPContext['state']>): Promise<MCPContext> {
    const context: MCPContext = {
      conversationId: uuidv4(),
      history: [],
      tools: Array.from(this.tools.values()),
      state: {
        lastUpdated: Date.now(),
        metadata: {},
        ...initialState
      }
    };

    this.contexts.set(context.conversationId, context);
    return context;
  }

  public async executeTool<T>(
    contextId: string,
    toolName: string,
    params: Record<string, unknown>
  ): Promise<T> {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new MCPError(
        'Context not found',
        'CONTEXT_NOT_FOUND',
        { conversationId: contextId } as MCPContext
      );
    }

    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new MCPError(
        `Tool ${toolName} not found`,
        'TOOL_NOT_FOUND',
        context
      );
    }

    try {
      // Add tool call to history
      context.history.push({
        role: 'tool',
        content: `Executing ${toolName}`,
        timestamp: Date.now(),
        metadata: { params }
      });

      const result = await tool.execute(params, context);

      // Strip any markdown formatting from the result
      let cleanedResult = result;
      if (typeof result === 'string') {
        // Remove markdown code blocks
        cleanedResult = result.replace(/```(?:json)?\s*\n?([\s\S]*?)\n?```/g, '$1');
        // Remove any text before or after JSON
        const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedResult = jsonMatch[0];
        }
        // Clean whitespace
        cleanedResult = cleanedResult.trim();
      }

      // Add result to history
      context.history.push({
        role: 'assistant',
        content: typeof cleanedResult === 'string' ? cleanedResult : JSON.stringify(cleanedResult),
        timestamp: Date.now(),
        metadata: { tool: toolName }
      });

      return cleanedResult;
    } catch (error) {
      throw new MCPError(
        error instanceof Error ? error.message : 'Tool execution failed',
        'TOOL_EXECUTION_FAILED',
        context,
        toolName
      );
    }
  }

  public getContext(contextId: string): MCPContext | undefined {
    return this.contexts.get(contextId);
  }

  public async addMessage(contextId: string, message: Omit<MCPMessage, 'timestamp'>): Promise<void> {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw this.createMCPError('CONTEXT_NOT_FOUND', new Error('Context not found'), { conversationId: contextId } as MCPContext);
    }

    context.history.push({
      ...message,
      timestamp: Date.now()
    });

    this.contexts.set(contextId, context);
  }

  // Add new validation methods
  private validateJsonResponse(text: string): string[] {
    const issues: string[] = [];
    
    // First, try to clean the text of markdown
    let cleanedText = text;
    
    // Remove markdown code blocks
    cleanedText = cleanedText.replace(/```(?:json)?\s*\n?([\s\S]*?)\n?```/g, '$1');
    
    // Remove any text before or after JSON
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    // Clean whitespace
    cleanedText = cleanedText.trim();
    
    // If the original text contained markdown but we successfully extracted JSON, just warn
    if (text.includes('```') && jsonMatch) {
      console.warn('Response contained markdown formatting but was successfully cleaned');
      return [];
    }
    
    // If we couldn't find a JSON object at all
    if (!jsonMatch) {
      issues.push('No valid JSON object found in response');
      return issues;
    }
    
    // Check for common JSON syntax issues in the cleaned text
    if (cleanedText.includes(',]') || cleanedText.includes(',}')) {
      issues.push('Response contains trailing commas');
    }
    
    if (cleanedText.includes('undefined') || cleanedText.includes('null,')) {
      issues.push('Response contains undefined or null values');
    }
    
    // Check for unescaped quotes in strings
    const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let match;
    while ((match = stringRegex.exec(cleanedText)) !== null) {
      const str = match[1];
      if (str.includes('"') && !str.includes('\\"')) {
        issues.push('Response contains unescaped quotes in strings');
        break;
      }
    }
    
    // Check for line breaks in strings (but be more lenient)
    const hasUnescapedNewlines = cleanedText.split('"').some((part, index) => {
      // Only check parts that are inside strings (odd indices)
      return index % 2 === 1 && part.includes('\n') && !part.includes('\\n');
    });
    
    if (hasUnescapedNewlines) {
      issues.push('Response contains unescaped line breaks in strings');
    }
    
    // Try to parse the cleaned JSON to validate it
    try {
      JSON.parse(cleanedText);
    } catch (e) {
      issues.push(`Invalid JSON syntax: ${e.message}`);
    }
    
    return issues;
  }

  private validateAnalysisStructure(analysis: AnalysisResult): string[] {
    const issues: string[] = [];
    
    // Check required fields
    const requiredFields = [
      'validationScore', 'competitors', 'priceSuggestions', 
      'forecasts', 'timeline', 'goToMarket', 'targetAudienceType',
      'clients', 'sources', 'summary', 'scoreAnalysis', 'currency'
    ];
    
    for (const field of requiredFields) {
      if (!(field in analysis)) {
        issues.push(`Missing required field: ${field}`);
      }
    }
    
    // Validate arrays
    if (analysis.competitors && !Array.isArray(analysis.competitors)) {
      issues.push('competitors must be an array');
    }
    if (analysis.priceSuggestions && !Array.isArray(analysis.priceSuggestions)) {
      issues.push('priceSuggestions must be an array');
    }
    if (analysis.clients && !Array.isArray(analysis.clients)) {
      issues.push('clients must be an array');
    }
    if (analysis.sources && !Array.isArray(analysis.sources)) {
      issues.push('sources must be an array');
    }
    
    // Validate sources count
    if (analysis.sources && analysis.sources.length !== 15) {
      issues.push(`Invalid number of sources: ${analysis.sources.length}. Expected exactly 15.`);
    }
    
    // Validate validationScore
    if (analysis.validationScore !== undefined) {
      const score = Number(analysis.validationScore);
      if (isNaN(score) || score < 0 || score > 100) {
        issues.push('validationScore must be a number between 0 and 100');
      }
    }
    
    // Validate currency
    if (analysis.currency && typeof analysis.currency !== 'string') {
      issues.push('currency must be a string');
    }
    
    return issues;
  }
} 