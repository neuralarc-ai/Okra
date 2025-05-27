import { AnalysisResult } from '../../types/oracle';

// Export all interfaces
export type {
  MCPContext,
  MCPMessage,
  MCPTool,
  MCPState,
  MCPAnalysisTool,
  MCPValidationTool,
  MCPConsistencyTool,
  MCPError
};

export interface MCPContext {
  conversationId: string;
  history: MCPMessage[];
  tools: MCPTool[];
  state: MCPState;
}

export interface MCPMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export type MCPToolParameters = Record<string, string | boolean>;

export interface MCPTool {
  name: string;
  description: string;
  parameters: MCPToolParameters;
  execute: (params: any, context: MCPContext) => Promise<any>;
}

export interface MCPState {
  currentAnalysis?: AnalysisResult;
  currency?: string;
  lastUpdated: number;
  metadata: {
    skipCurrencyCheck?: boolean;
    retryCount?: number;
    validationStatus?: 'pending' | 'valid' | 'invalid';
    consistencyChecks?: Record<string, boolean>;
  };
}

export interface MCPAnalysisTool {
  name: string;
  description: string;
  parameters: {
    prompt: string;
    skipCurrencyCheck?: boolean;
  };
  execute: (params: { prompt: string; skipCurrencyCheck?: boolean }, context: MCPContext) => Promise<AnalysisResult>;
}

export interface MCPValidationTool {
  name: string;
  description: string;
  parameters: {
    analysis: string;
  };
  execute: (params: { analysis: AnalysisResult }, context: MCPContext) => Promise<{
    isValid: boolean;
    issues: string[];
    correctedAnalysis?: AnalysisResult;
  }>;
}

export interface MCPConsistencyTool {
  name: string;
  description: string;
  parameters: {
    analysis: string;
  };
  execute: (params: { analysis: AnalysisResult }, context: MCPContext) => Promise<{
    isConsistent: boolean;
    issues: string[];
    corrections?: {
      currency?: AnalysisResult;
      forecasts?: AnalysisForecasts;
    };
  }>;
}

export interface ForecastCase {
  revenue: number;
  marketShare: number;
  customers: number;
  period: string;
}

export interface AnalysisForecasts {
  bestCase: ForecastCase;
  averageCase: ForecastCase;
  worstCase: ForecastCase;
}

// Export MCPError as a class
export class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public context: MCPContext,
    public tool?: string,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'MCPError';
  }
} 