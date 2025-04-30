export interface AnalysisResult {
  validationScore: number;
  competitors: Competitor[];
  priceSuggestions: PriceSuggestion[];
  forecasts: {
    bestCase: {
      revenue: number;
      marketShare: number;
      customers: number;
    };
    worstCase: {
      revenue: number;
      marketShare: number;
      customers: number;
    };
  };
  timeline: Timeline;
  goToMarket: GoToMarket;
  clients: Client[];
  sources: Source[];
  summary: string;
  scoreAnalysis: ScoreAnalysis;
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
  trends?: PriceTrend[];
}

export interface PriceTrend {
  date: string;
  value: number;
}

export interface Forecast {
  bestCase: ForecastCase;
  worstCase: ForecastCase;
  timeframe?: string;
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

export interface Timeline {
  phases: Array<{
    name: string;
    duration: string;
    tasks: string[];
    milestone: string;
    risk: 'low' | 'medium' | 'high';
  }>;
  totalDuration: string;
  criticalPath: string[];
}

export interface GoToMarket {
  strategy: Array<{
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  channels: Array<{
    name: string;
    effectiveness: number;
    cost: string;
    timeToROI: string;
  }>;
  kpis: Array<{
    metric: string;
    target: string;
    timeframe: string;
  }>;
}

export interface ScoreAnalysis {
  category: string;
  marketPotential: {
    score: number;
    status: string;
  };
  competition: {
    level: string;
    description: string;
  };
  marketSize: {
    status: string;
    trend: string;
  };
  timing: {
    status: string;
    description: string;
  };
  recommendations: string[];
}
