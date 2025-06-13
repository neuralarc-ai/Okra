import { AnalysisResult } from '../types/oracle';

interface TavilySearchResult {
  query: string;
  answer?: string;
  results: Array<{
    title: string;
    url: string;
    content: string;
    score: number;
    raw_content?: string;
  }>;
  response_time: number;
}

interface TavilyExtractResult {
  results: Array<{
    url: string;
    raw_content: string;
    images: string[];
  }>;
  failed_results: Array<{
    url: string;
    error: string;
  }>;
  response_time: number;
}

interface MarketData {
  marketSize: string;
  growthRate: string;
  trends: string[];
  competitors: Array<{
    name: string;
    marketShare: string;
    strengths: string[];
  }>;
  pricing: Array<{
    model: string;
    range: string;
    adoption: string;
  }>;
}

class TavilyService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.tavily.com';
  private readonly rateLimiter: Map<string, number> = new Map();
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly MAX_REQUESTS_PER_WINDOW = 10;

  constructor() {
    this.apiKey = import.meta.env.VITE_TAVILY_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Tavily API key not found. Market data enrichment will be limited.');
    }
  }

  /**
   * Check and enforce rate limits
   */
  private async checkRateLimit(endpoint: string): Promise<void> {
    const now = Date.now();
    const windowStart = now - this.RATE_LIMIT_WINDOW;
    
    // Clean up old entries
    for (const [key, timestamp] of this.rateLimiter.entries()) {
      if (timestamp < windowStart) {
        this.rateLimiter.delete(key);
      }
    }

    // Count requests in current window
    const currentRequests = Array.from(this.rateLimiter.values())
      .filter(timestamp => timestamp > windowStart)
      .length;

    if (currentRequests >= this.MAX_REQUESTS_PER_WINDOW) {
      const oldestRequest = Math.min(...Array.from(this.rateLimiter.values()));
      const waitTime = this.RATE_LIMIT_WINDOW - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.rateLimiter.set(`${endpoint}-${now}`, now);
  }

  /**
   * Search for market data using Tavily Search API with advanced options
   */
  async searchMarketData(
    query: string, 
    options: {
      topic?: 'general' | 'news';
      searchDepth?: 'basic' | 'advanced';
      maxResults?: number;
      timeRange?: string;
      includeDomains?: string[];
      excludeDomains?: string[];
    } = {}
  ): Promise<TavilySearchResult> {
    await this.checkRateLimit('search');

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          topic: options.topic || 'general',
          search_depth: options.searchDepth || 'advanced',
          include_answer: true,
          include_raw_content: true,
          max_results: options.maxResults || 5,
          time_range: options.timeRange,
          include_domains: options.includeDomains,
          exclude_domains: options.excludeDomains,
          chunks_per_source: 3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily search failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in Tavily search:', error);
      throw error;
    }
  }

  /**
   * Extract detailed content from specific URLs using Tavily Extract API
   */
  async extractContent(
    urls: string[],
    options: {
      extractDepth?: 'basic' | 'advanced';
      includeImages?: boolean;
    } = {}
  ): Promise<TavilyExtractResult> {
    await this.checkRateLimit('extract');

    try {
      const response = await fetch(`${this.baseUrl}/extract`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls,
          extract_depth: options.extractDepth || 'advanced',
          include_images: options.includeImages || false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily extract failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in Tavily extract:', error);
      throw error;
    }
  }

  /**
   * Extract structured market data from search results
   */
  private extractMarketData(searchResults: TavilySearchResult[]): MarketData {
    const marketData: MarketData = {
      marketSize: '',
      growthRate: '',
      trends: [],
      competitors: [],
      pricing: [],
    };

    // Extract market size and growth rate
    const marketSearch = searchResults.find(r => r.query.includes('market size'));
    if (marketSearch?.answer) {
      const marketInfo = this.parseMarketInfo(marketSearch.answer);
      marketData.marketSize = marketInfo.size;
      marketData.growthRate = marketInfo.growth;
    }

    // Extract trends
    const trendSearch = searchResults.find(r => r.query.includes('trends'));
    if (trendSearch?.results) {
      marketData.trends = trendSearch.results
        .map(r => r.content)
        .filter(content => content.length > 0)
        .slice(0, 5);
    }

    // Extract competitor information
    const competitorSearch = searchResults.find(r => r.query.includes('competitors'));
    if (competitorSearch?.results) {
      marketData.competitors = competitorSearch.results
        .map(r => this.parseCompetitorInfo(r.content))
        .filter(comp => comp.name && comp.marketShare !== '0%');
    }

    // Extract pricing information
    const pricingSearch = searchResults.find(r => r.query.includes('pricing'));
    if (pricingSearch?.results) {
      marketData.pricing = pricingSearch.results
        .map(r => this.parsePricingInfo(r.content))
        .filter(p => p.model && p.range);
    }

    return marketData;
  }

  /**
   * Parse market size and growth rate from text
   */
  private parseMarketInfo(text: string): { size: string; growth: string } {
    const sizeMatch = text.match(/(?:market size|market value|market worth)[^.]*?(\$[\d,.]+(?:B|M|K)?|\d+(?:\.\d+)?\s*(?:billion|million|thousand))/i);
    const growthMatch = text.match(/(?:growth rate|CAGR|compound annual growth)[^.]*?(\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*percent)/i);

    return {
      size: sizeMatch ? sizeMatch[1] : 'Unknown',
      growth: growthMatch ? growthMatch[1] : 'Unknown',
    };
  }

  /**
   * Parse competitor information from text
   */
  private parseCompetitorInfo(text: string): { name: string; marketShare: string; strengths: string[] } {
    const nameMatch = text.match(/(?:company|firm|business)[^.]*?([A-Z][a-zA-Z\s]+(?:Inc\.|LLC|Ltd\.|Corp\.)?)/);
    const shareMatch = text.match(/(?:market share|market presence)[^.]*?(\d+(?:\.\d+)?%)/);
    const strengths = text.match(/(?:strength|advantage|key feature)[^.]*?([^.]*?\.)/g) || [];

    return {
      name: nameMatch ? nameMatch[1].trim() : 'Unknown',
      marketShare: shareMatch ? shareMatch[1] : '0%',
      strengths: strengths.map(s => s.replace(/(?:strength|advantage|key feature)[^.]*?/i, '').trim()),
    };
  }

  /**
   * Parse pricing information from text
   */
  private parsePricingInfo(text: string): { model: string; range: string; adoption: string } {
    const modelMatch = text.match(/(?:pricing model|pricing strategy)[^.]*?([^.]*?\.)/i);
    const rangeMatch = text.match(/(?:price range|pricing range)[^.]*?(\$[\d,.]+(?:-\$[\d,.]+)?|\d+(?:\.\d+)?\s*(?:to|-)\s*\d+(?:\.\d+)?)/i);
    const adoptionMatch = text.match(/(?:adoption rate|market adoption)[^.]*?(\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*percent)/i);

    return {
      model: modelMatch ? modelMatch[1].trim() : 'Unknown',
      range: rangeMatch ? rangeMatch[1] : 'Unknown',
      adoption: adoptionMatch ? adoptionMatch[1] : 'Unknown',
    };
  }

  /**
   * Enrich business analysis with real-time market data
   */
  async enrichAnalysis(businessIdea: string, existingAnalysis: AnalysisResult): Promise<AnalysisResult> {
    if (!this.apiKey) {
      return existingAnalysis;
    }

    try {
      // 1. Search for comprehensive market data
      const marketSearchQueries = [
        `${businessIdea} market size and growth rate 2024`,
        `${businessIdea} top competitors and market share`,
        `${businessIdea} industry trends and future outlook`,
        `${businessIdea} pricing strategies and models`,
        `${businessIdea} target audience and demographics`,
        `${businessIdea} regulatory environment and compliance`,
        `${businessIdea} funding and investment landscape`,
      ];

      const searchResults = await Promise.all(
        marketSearchQueries.map(query => 
          this.searchMarketData(query, {
            searchDepth: 'advanced',
            maxResults: 7,
            timeRange: 'last_3_months',
          })
        )
      );

      // 2. Extract content from competitor websites
      const competitorUrls = existingAnalysis.competitors
        .filter(comp => comp.website)
        .map(comp => comp.website as string);

      const extractedContent = competitorUrls.length > 0 
        ? await this.extractContent(competitorUrls, {
            extractDepth: 'advanced',
            includeImages: false,
          })
        : null;

      // 3. Extract structured market data
      const marketData = this.extractMarketData(searchResults);

      // 4. Update analysis with real-time data
      const enrichedAnalysis = this.updateAnalysisWithMarketData(
        existingAnalysis,
        searchResults,
        extractedContent,
        marketData,
        businessIdea
      );

      return enrichedAnalysis;
    } catch (error) {
      console.error('Error enriching analysis:', error);
      return existingAnalysis;
    }
  }

  /**
   * Update analysis with real-time market data while maintaining the original structure
   */
  private updateAnalysisWithMarketData(
    analysis: AnalysisResult,
    searchResults: TavilySearchResult[],
    extractedContent: TavilyExtractResult | null,
    marketData: MarketData,
    businessIdea: string
  ): AnalysisResult {
    const enrichedAnalysis = JSON.parse(JSON.stringify(analysis)) as AnalysisResult;

    // Update validation score based on market data
      const marketScore = this.calculateMarketScore(marketData);
      enrichedAnalysis.validationScore = Math.min(
        100,
        Math.max(0, enrichedAnalysis.validationScore + marketScore)
      );

    // Update market size and growth rate
    if (marketData.marketSize && marketData.growthRate) {
      enrichedAnalysis.scoreAnalysis.marketSize = {
        status: this.determineMarketStatus(marketData),
        trend: marketData.growthRate,
        value: marketData.marketSize,
      };
    }

    // Update competitors with real-time data
    if (extractedContent) {
      enrichedAnalysis.competitors = enrichedAnalysis.competitors.map(competitor => {
        const extractedData = extractedContent.results.find(
          result => result.url === competitor.website
        );
        const marketCompetitor = marketData.competitors.find(
          c => c.name.toLowerCase().includes(competitor.name.toLowerCase())
        );

        if (extractedData || marketCompetitor) {
          return {
            ...competitor,
            marketShare: marketCompetitor?.marketShare || competitor.marketShare,
            strengthScore: this.calculateStrengthScore(
              marketCompetitor?.strengths || [],
              extractedData?.raw_content || ''
            ),
            detailedAnalysis: {
              ...competitor.detailedAnalysis,
              summary: this.extractCompetitorSummary(
                extractedData?.raw_content || '',
                marketCompetitor?.strengths || []
              ),
            },
          };
        }
        return competitor;
      });
    }

    // Update pricing models with real-time data
    if (marketData.pricing.length > 0) {
      enrichedAnalysis.priceSuggestions = marketData.pricing.map(pricing => ({
        type: pricing.model,
        value: pricing.range,
        description: `Market adoption rate: ${pricing.adoption}`,
        trends: this.generatePricingTrends(pricing),
        detailedAnalysis: {
          summary: this.generatePricingSummary(pricing),
          competitiveAdvantage: this.analyzePricingAdvantage(pricing, marketData),
          revenuePotential: this.calculateRevenuePotential(pricing, marketData),
        },
      }));
    }

    // Update market trends
    if (marketData.trends.length > 0) {
      enrichedAnalysis.scoreAnalysis.marketTrends = marketData.trends
        .map(trend => ({
          trend: this.extractTrendTitle(trend),
          impact: this.analyzeTrendImpact(trend),
        }));
    }

    // Update sources with real-time data
    const newSources = searchResults
      .flatMap(result => result.results)
      .map(result => ({
        title: result.title,
        relevance: this.generateSourceRelevance(result, businessIdea),
      }))
      .slice(0, 15);

    if (newSources.length > 0) {
      enrichedAnalysis.sources = newSources;
    }

    return enrichedAnalysis;
  }

  /**
   * Calculate market score based on comprehensive market data
   */
  private calculateMarketScore(marketData: MarketData): number {
    let score = 0;

    // Market size impact
    const marketSize = this.parseNumericValue(marketData.marketSize);
    if (marketSize > 1000000000) score += 20; // >$1B
    else if (marketSize > 100000000) score += 15; // >$100M
    else if (marketSize > 10000000) score += 10; // >$10M
    else if (marketSize > 1000000) score += 5; // >$1M

    // Growth rate impact
    const growthRate = this.parseNumericValue(marketData.growthRate);
    if (growthRate > 20) score += 20; // >20% growth
    else if (growthRate > 15) score += 15; // >15% growth
    else if (growthRate > 10) score += 10; // >10% growth
    else if (growthRate > 5) score += 5; // >5% growth

    // Competition impact
    const competitorCount = marketData.competitors.length;
    if (competitorCount < 3) score += 15; // Low competition
    else if (competitorCount < 5) score += 10; // Moderate competition
    else if (competitorCount < 10) score += 5; // High competition
    else score -= 5; // Very high competition

    // Trend impact
    const positiveTrends = marketData.trends.filter(trend =>
      /growth|increase|opportunity|innovation|demand/i.test(trend)
    ).length;
    score += positiveTrends * 5;

    // Pricing impact
    const pricingAdoption = marketData.pricing
      .map(p => this.parseNumericValue(p.adoption))
      .reduce((sum, val) => sum + val, 0) / marketData.pricing.length;
    if (pricingAdoption > 30) score += 10; // High adoption
    else if (pricingAdoption > 20) score += 5; // Moderate adoption

    return Math.max(-20, Math.min(20, score));
  }

  /**
   * Parse numeric values from strings
   */
  private parseNumericValue(value: string): number {
    const match = value.match(/(\d+(?:\.\d+)?)/);
    if (!match) return 0;

    const num = parseFloat(match[1]);
    if (value.includes('B') || value.includes('billion')) return num * 1000000000;
    if (value.includes('M') || value.includes('million')) return num * 1000000;
    if (value.includes('K') || value.includes('thousand')) return num * 1000;
    return num;
  }

  /**
   * Determine market status based on market data
   */
  private determineMarketStatus(marketData: MarketData): string {
    const growthRate = this.parseNumericValue(marketData.growthRate);
    const marketSize = this.parseNumericValue(marketData.marketSize);

    if (growthRate > 20 && marketSize > 1000000000) return 'Explosive Growth';
    if (growthRate > 15 && marketSize > 100000000) return 'High Growth';
    if (growthRate > 10 && marketSize > 10000000) return 'Growing';
    if (growthRate > 5) return 'Stable';
    return 'Mature';
  }

  /**
   * Calculate competitor strength score
   */
  private calculateStrengthScore(strengths: string[], content: string): number {
    let score = 0;

    // Analyze strengths
    strengths.forEach(strength => {
      if (/innovation|technology|patent|unique/i.test(strength)) score += 10;
      if (/market leader|dominant|strong/i.test(strength)) score += 8;
      if (/brand|reputation|trust/i.test(strength)) score += 6;
      if (/customer|user|adoption/i.test(strength)) score += 4;
    });

    // Analyze content
    if (content) {
      if (/innovative|cutting-edge|advanced/i.test(content)) score += 5;
      if (/leader|dominant|strong/i.test(content)) score += 4;
      if (/trusted|reliable|established/i.test(content)) score += 3;
      if (/growing|expanding|scaling/i.test(content)) score += 2;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Extract competitor summary from content and strengths
   */
  private extractCompetitorSummary(content: string, strengths: string[]): string {
    const sentences = content
      .split(/[.!?]+/)
      .filter(s => s.length > 50 && s.length < 200)
      .slice(0, 3);
    
    const strengthSummary = strengths
      .slice(0, 2)
      .map(s => s.replace(/(?:strength|advantage|key feature)[^.]*?/i, '').trim())
      .join('. ');

    return `${sentences.join('. ')}. Key strengths: ${strengthSummary}.`;
  }

  /**
   * Generate pricing trends based on market data
   */
  private generatePricingTrends(pricing: { model: string; range: string; adoption: string }): any[] {
    const adoption = this.parseNumericValue(pricing.adoption);
    const baseValue = this.parseNumericValue(pricing.range);
    const trends = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Simulate adoption growth
      const growthFactor = 1 + (adoption / 100) * (i / 30);
      const value = Math.round(baseValue * growthFactor);

      trends.push({
        date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
        value,
      });
    }

    return trends;
  }

  /**
   * Generate pricing summary
   */
  private generatePricingSummary(pricing: { model: string; range: string; adoption: string }): string {
    const adoption = this.parseNumericValue(pricing.adoption);
    const range = pricing.range;

    return `${pricing.model} pricing model with range ${range}. Current market adoption rate is ${adoption}%, indicating ${adoption > 20 ? 'strong' : adoption > 10 ? 'moderate' : 'early'} market acceptance.`;
  }

  /**
   * Analyze pricing advantage
   */
  private analyzePricingAdvantage(
    pricing: { model: string; range: string; adoption: string },
    marketData: MarketData
  ): string {
    const adoption = this.parseNumericValue(pricing.adoption);
    const avgAdoption = marketData.pricing
      .map(p => this.parseNumericValue(p.adoption))
      .reduce((sum, val) => sum + val, 0) / marketData.pricing.length;

    if (adoption > avgAdoption * 1.5) {
      return `Significantly higher adoption rate (${adoption}% vs market average ${avgAdoption.toFixed(1)}%)`;
    } else if (adoption > avgAdoption) {
      return `Above average adoption rate (${adoption}% vs market average ${avgAdoption.toFixed(1)}%)`;
    } else {
      return `Competitive adoption rate (${adoption}% vs market average ${avgAdoption.toFixed(1)}%)`;
    }
  }

  /**
   * Calculate revenue potential
   */
  private calculateRevenuePotential(
    pricing: { model: string; range: string; adoption: string },
    marketData: MarketData
  ): { shortTerm: string; longTerm: string } {
    const adoption = this.parseNumericValue(pricing.adoption);
    const marketSize = this.parseNumericValue(marketData.marketSize);
    const growthRate = this.parseNumericValue(marketData.growthRate);

    const shortTermRevenue = marketSize * (adoption / 100) * 1.2; // 20% growth in 6 months
    const longTermRevenue = marketSize * (adoption / 100) * Math.pow(1 + growthRate / 100, 2); // 2 years

    return {
      shortTerm: `Projected revenue of ${this.formatCurrency(shortTermRevenue)} in 6 months`,
      longTerm: `Projected revenue of ${this.formatCurrency(longTermRevenue)} in 2 years`,
    };
  }

  /**
   * Format currency values
   */
  private formatCurrency(value: number): string {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  }

  /**
   * Extract trend title from content
   */
  private extractTrendTitle(content: string): string {
    const match = content.match(/^([^.]*?\.)/);
    return match ? match[1].trim() : content.substring(0, 100) + '...';
  }

  /**
   * Analyze trend impact
   */
  private analyzeTrendImpact(content: string): string {
    const impact = content.match(/(?:impact|effect|influence)[^.]*?([^.]*?\.)/i);
    return impact ? impact[1].trim() : content.substring(0, 200);
  }

  /**
   * Generate source relevance
   */
  private generateSourceRelevance(result: { title: string; content: string }, businessIdea: string): string {
    const relevance = result.content
      .toLowerCase()
      .includes(businessIdea.toLowerCase())
      ? 'Directly relevant to the business idea'
      : 'Provides valuable market context';

    return `${relevance}: ${result.content.substring(0, 200)}...`;
  }
}

export const tavilyService = new TavilyService(); 