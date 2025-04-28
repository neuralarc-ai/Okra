export interface AnalysisResult {
  validationScore: number;
  competitors: Array<{
    name: string;
    strengthScore: number;
    description: string;
  }>;
  priceSuggestions: Array<{
    type: string;
    value: string;
    description: string;
  }>;
  forecasts: {
    bestCase: {
      revenue: string;
      marketShare: string;
      customers: string;
    };
    worstCase: {
      revenue: string;
      marketShare: string;
      customers: string;
    };
  };
  clients: Array<{
    name: string;
    industry: string;
    useCase: string;
  }>;
  sources: Array<{
    title: string;
    url: string;
    relevance: string;
  }>;
  summary: string;
}

export interface Competitor {
  name: string;
  strengthScore: number;
  description: string;
}

export interface PriceSuggestion {
  type: string;
  value: string;
  description: string;
}

export interface Forecast {
  bestCase: ForecastCase;
  worstCase: ForecastCase;
  timeframe: string;
}

export interface ForecastCase {
  revenue: string | number;
  marketShare: string | number;
  customers: string | number;
}

export interface Client {
  name: string;
  industry: string;
  useCase: string;
}

export interface Source {
  title: string;
  url: string;
  relevance: string;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
}

export interface OracleSettings {
  primaryModel: string;
  fallbackModel: string;
}
