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
  summary: string; // Keep summary short and crisp (1-2 sentences)
  scoreAnalysis: ScoreAnalysis;
  financialPlan: FinancialPlan;
  fundingRequirements: FundingRequirements;
  revenueModel: RevenueModel;
  milestones: Milestones;
  currency: string; // The currency used for all monetary values in this analysis
}

export interface Competitor {
  name: string;
  strengthScore: number;
  description: string;
  marketShare?: string;
  primaryAdvantage?: string;
  website?: string;
  detailedAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    marketPosition: string;
    targetAudience: string[];
    pricingStrategy: string;
    uniqueSellingPoints: string[];
    recentDevelopments: string[];
    growthRate: string;
    fundingStatus?: string;
    technologyStack?: string[];
    partnerships?: string[];
    customerFeedback?: {
      positive: string[];
      negative: string[];
    };
    marketReach?: {
      geographic: string[];
      channels: string[];
    };
    summary?: string;
  };
}

export interface PriceSuggestion {
  type: string;
  value: string;
  description: string;
  trends?: PriceTrend[];
  detailedAnalysis?: {
    summary?: string;
    competitiveAdvantage: string;
    revenuePotential: {
      shortTerm: string;
      longTerm: string;
    };
    adoptionBarriers?: string[];
  };
}

export interface PriceTrend {
  date: string;
  value: number;
}

export interface Forecast {
  bestCase: ForecastCase;
  worstCase: ForecastCase;
  averageCase: ForecastCase;
  timeframe?: string;
  currency?: string;
  revenueSummary?: string;
  customerSummary?: string;
}

export interface ForecastCase {
  revenue: string | number;
  marketShare: string | number;
  customers: string | number;
  period?: string;
}

export interface Client {
  name: string;
  industry: string;
  useCase: string;
  targetAudienceType?: string;
  targetAudienceDefinition: {
    demographics: {
      primary: string[];
      secondary?: string[];
    };
    psychographics: {
      needs: string[];
      preferences?: string[];
      lifestyle?: string[];
    };
    geographics: {
      location: string;
      coverage: string;
    };
  };
  segment?: {
    size?: string;
    growth?: string;
    priority: 'high' | 'medium' | 'low';
  };
}

export interface Source {
  title: string;
  relevance: string;
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
    value: string;
  };
  timing: {
    status: string;
    description: string;
  };
  recommendations: string[];
  keyMetrics: {
    marketSize: string;
    growthRate: string;
    targetAudience: string;
    initialInvestment: string;
  };
  executiveSummary: string;
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketTrends?: Array<{
    trend: string;
    impact: string;
  }>;
  regulatoryAndRisks?: Array<{
    risk: string;
    mitigation: string;
  }>;
  competitivePositioning?: {
    position: string;
    mapDescription: string;
  };
}

export interface FinancialPlan {
  startupCosts: Array<{
    category: string;
    amount: number;
    description: string;
  }>;
  monthlyExpenses: Array<{
    category: string;
    amount: number;
    description: string;
  }>;
  revenueStreams: Array<{
    source: string;
    projectedAmount: number;
    timeframe: string;
    assumptions: string[];
  }>;
  breakEvenAnalysis: {
    timeToBreakEven: string;
    monthlyBreakEvenPoint: number;
    assumptions: string[];
  };
  projectedProfitMargin: number;
}

export interface FundingRequirements {
  totalRequired: number;
  fundingStages: Array<{
    stage: string;
    amount: number;
    timeline: string;
    purpose: string;
    milestones: string[];
  }>;
  equityDilution: Array<{
    stage: string;
    percentage: number;
    valuation: number;
  }>;
  fundingSources: Array<{
    type: string;
    likelihood: number;
    requirements: string[];
    pros: string[];
    cons: string[];
  }>;
  useOfFunds: Array<{
    category: string;
    amount: number;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface RevenueModel {
  primaryStreams: Array<{
    name: string;
    description: string;
    percentage: number;
    scalability: 'high' | 'medium' | 'low';
    recurringType: 'one-time' | 'subscription' | 'usage-based' | 'hybrid';
    detailedAnalysis?: {
      targetMarket: string[];
      competitiveAdvantage: string;
      growthPotential: {
        shortTerm: string;
        longTerm: string;
        assumptions: string[];
      };
      implementationRequirements: {
        resources: string[];
        timeline: string;
        dependencies: string[];
      };
      riskFactors: {
        risks: string[];
        mitigations: string[];
      };
      marketConditions: {
        current: string;
        trends: string[];
        opportunities: string[];
      };
      customerValue: {
        valueProposition: string;
        painPoints: string[];
        willingnessToPay: string;
      };
    };
  }>;
  metrics: Array<{
    name: string;
    current: number;
    target: number;
    timeframe: string;
    detailedMetrics?: {
      definition: string;
      calculation: string;
      importance: string;
      industryBenchmark: string;
      improvementStrategy: string;
    };
  }>;
  growthStrategy: Array<{
    phase: string;
    tactics: string[];
    expectedImpact: string;
    timeline: string;
    detailedStrategy?: {
      objectives: string[];
      keyActivities: string[];
      successCriteria: string[];
      resourceRequirements: string[];
      riskAssessment: {
        risks: string[];
        mitigations: string[];
      };
      marketAnalysis: {
        targetSegments: string[];
        competitivePosition: string;
        growthOpportunities: string[];
      };
    };
  }>;
  risks: Array<{
    category: string;
    probability: 'high' | 'medium' | 'low';
    impact: 'high' | 'medium' | 'low';
    mitigationStrategy: string;
    detailedRisk?: {
      description: string;
      triggers: string[];
      earlyWarningSigns: string[];
      contingencyPlans: string[];
      monitoringMetrics: string[];
    };
  }>;
  marketAnalysis?: {
    totalAddressableMarket: string;
    serviceableAddressableMarket: string;
    serviceableObtainableMarket: string;
    marketGrowthRate: string;
    competitiveLandscape: {
      competitors: string[];
      marketShare: string;
      competitiveAdvantages: string[];
    };
    marketTrends: {
      current: string[];
      emerging: string[];
      impact: string;
    };
  };
  financialProjections?: {
    revenueGrowth: {
      year1: string;
      year2: string;
      year3: string;
      assumptions: string[];
    };
    profitMargins: {
      current: string;
      target: string;
      improvementStrategy: string;
    };
    breakEvenAnalysis: {
      point: string;
      timeline: string;
      assumptions: string[];
    };
  };
}

export interface Milestones {
  quarters: Array<{
    quarter: string; // e.g., "Q1 2024"
    objectives: Array<{
      title: string;
      description: string;
      metrics: Array<{
        name: string;
        target: string | number;
      }>;
      status: 'pending' | 'in-progress' | 'completed';
      dependencies: string[];
    }>;
    keyDeliverables: string[];
    budget: number;
  }>;
  criticalMilestones: Array<{
  name: string;
    date: string;
    importance: string;
    successCriteria: string[];
  }>;
}
