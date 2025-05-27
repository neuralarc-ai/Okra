import { MCPServer } from './mcp/server';
import { AnalysisResult } from '../types/oracle';
import { MCPError } from './mcp/types';

// Create a singleton instance of the MCP server
const mcpServer = new MCPServer(import.meta.env.VITE_GEMINI_API_KEY || '');

export class MCPAnalysisService {
  private static instance: MCPAnalysisService;
  private activeContexts: Map<string, string> = new Map(); // Map of sessionId to contextId

  private constructor() {}

  public static getInstance(): MCPAnalysisService {
    if (!MCPAnalysisService.instance) {
      MCPAnalysisService.instance = new MCPAnalysisService();
    }
    return MCPAnalysisService.instance;
  }

  /**
   * Creates a new analysis session
   * @param sessionId Unique identifier for the session
   * @returns The context ID for the new session
   */
  public async createSession(sessionId: string): Promise<string> {
    const context = await mcpServer.createContext({
      metadata: {
        sessionId,
        retryCount: 0
      }
    });

    this.activeContexts.set(sessionId, context.conversationId);
    return context.conversationId;
  }

  /**
   * Generates a business analysis using MCP
   * @param sessionId Session identifier
   * @param prompt Business idea to analyze
   * @param skipCurrencyCheck Optional flag to skip currency consistency check
   * @returns Analysis result
   */
  public async generateAnalysis(
    sessionId: string,
    prompt: string,
    skipCurrencyCheck: boolean = false
  ): Promise<AnalysisResult> {
    try {
      // Get or create context
      let contextId = this.activeContexts.get(sessionId);
      if (!contextId) {
        contextId = await this.createSession(sessionId);
      }

      // Add system message to ensure JSON response
      await mcpServer.addMessage(contextId, {
        role: 'system',
        content: 'You must respond with a valid JSON object only. No markdown, no explanations, just the JSON.'
      });

      // Add user message to context
      await mcpServer.addMessage(contextId, {
        role: 'user',
        content: prompt
      });

      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          // Execute analysis tool
          const analysis = await mcpServer.executeTool(contextId, 'analyzeBusiness', {
            prompt,
            skipCurrencyCheck
          });

          // Validate the analysis
          const validation = await mcpServer.executeTool(contextId, 'validateAnalysis', {
            analysis
          });

          if (!validation.isValid) {
            if (validation.correctedAnalysis) {
              return validation.correctedAnalysis;
            }
            
            if (retryCount < maxRetries) {
              retryCount++;
              console.warn(`Validation failed, attempt ${retryCount} of ${maxRetries}. Retrying...`);
              continue;
            }
            
            throw new Error(`Analysis validation failed after ${maxRetries} attempts: ${validation.issues.join(', ')}`);
          }

          return analysis;
        } catch (error) {
          if (error instanceof MCPError && error.recoverable) {
            if (retryCount < maxRetries) {
              retryCount++;
              console.warn(`MCP error occurred, attempt ${retryCount} of ${maxRetries}. Retrying...`, error);
              continue;
            }
          }
          throw error;
        }
      }

      throw new Error(`Failed to generate valid analysis after ${maxRetries} attempts`);
    } catch (error) {
      if (error instanceof MCPError && error.recoverable) {
        console.warn('Recoverable MCP error:', error);
        throw error;
      }
      
      console.error('Non-recoverable MCP error:', error);
      throw error;
    } finally {
      // Always clean up the session
      await this.endSession(sessionId);
    }
  }

  /**
   * Gets the analysis history for a session
   * @param sessionId Session identifier
   * @returns Array of messages in the session
   */
  public async getSessionHistory(sessionId: string) {
    const contextId = this.activeContexts.get(sessionId);
    if (!contextId) {
      throw new Error('Session not found');
    }

    const context = mcpServer.getContext(contextId);
    if (!context) {
      throw new Error('Context not found');
    }

    return context.history;
  }

  /**
   * Ends a session and cleans up resources
   * @param sessionId Session identifier
   */
  public async endSession(sessionId: string) {
    this.activeContexts.delete(sessionId);
  }
}

// Export a singleton instance
export const mcpAnalysisService = MCPAnalysisService.getInstance(); 