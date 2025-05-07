import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceSuggestion } from "@/types/oracle";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Users, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, XCircle, BarChart3, Calendar, Users2, ArrowUpRight, ArrowDownRight, Lightbulb, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

interface PricingCardProps {
  priceSuggestions: PriceSuggestion[];
}

const PricingCard = ({ priceSuggestions }: PricingCardProps) => {
  const [expandedPrice, setExpandedPrice] = useState<string | null>(null);

  // Build dynamic trend data from priceSuggestions
  const allDates = Array.from(new Set(priceSuggestions.flatMap(ps => (ps.trends || []).map(t => t.date)))).sort();
  type TrendEntry = { date: string } & { [type: string]: number | null | string };
  const trendData: TrendEntry[] = allDates.map(date => {
    const entry: TrendEntry = { date };
    priceSuggestions.forEach(ps => {
      const trend = (ps.trends || []).find(t => t.date === date);
      entry[ps.type] = trend ? trend.value : null;
    });
    return entry;
  });

  // Assign a color to each unique price type
  const uniqueTypes = Array.from(new Set(priceSuggestions.map(ps => ps.type)));
  const colorPalette = ["#4ade80", "#FFADDF", "#6366f1", "#f59e42", "#38bdf8", "#f472b6", "#a3e635", "#facc15"];
  const typeColors: Record<string, string> = {};
  uniqueTypes.forEach((type, idx) => {
    typeColors[type] = colorPalette[idx % colorPalette.length];
  });

  const uniquePriceSuggestions = uniqueTypes.map(type => priceSuggestions.find(ps => ps.type === type)!);

  const togglePrice = (type: string) => {
    setExpandedPrice(expandedPrice === type ? null : type);
  };

  const renderDetailItem = (icon: React.ReactNode, title: string, content: string | string[]) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;
    
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-gray-400">
          {icon}
          <span className="text-xs font-medium">{title}</span>
        </div>
        {Array.isArray(content) ? (
          <ul className="list-disc list-inside space-y-1">
            {content.map((item, idx) => (
              <li key={idx} className="text-xs text-white/80 ml-4">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-white/80 ml-6">{content}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">User Adoption by Price Model</CardTitle>
        <p className="text-gray-400 text-xs mt-1">
          Predicted number of users/customers for each pricing model over time.
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Price suggestions */}
          {priceSuggestions.map((price, index) => {
            const isExpanded = expandedPrice === price.type;
            return (
              <div 
                key={index} 
                className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
              >
                <div 
                  className="flex justify-between items-center mb-1 cursor-pointer"
                  onClick={() => togglePrice(price.type)}
                >
                  <h4 className="text-sm font-medium text-gray-300">{price.type}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded text-[10px] md:text-xs">{price.value}</span>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{price.description}</p>

                {isExpanded && price.detailedAnalysis && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
                    {renderDetailItem(<Users2 size={14} />, "Target Segment", price.detailedAnalysis.targetSegment)}
                    {renderDetailItem(<Lightbulb size={14} />, "Competitive Advantage", price.detailedAnalysis.competitiveAdvantage)}
                    
                    {price.detailedAnalysis.revenuePotential && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-400">Revenue Potential</h5>
                        {renderDetailItem(<ArrowUpRight size={14} />, "Short Term", price.detailedAnalysis.revenuePotential.shortTerm)}
                        {renderDetailItem(<ArrowUpRight size={14} />, "Long Term", price.detailedAnalysis.revenuePotential.longTerm)}
                        {renderDetailItem(<AlertCircle size={14} />, "Assumptions", price.detailedAnalysis.revenuePotential.assumptions)}
                      </div>
                    )}

                    {renderDetailItem(<AlertCircle size={14} />, "Adoption Barriers", price.detailedAnalysis.adoptionBarriers)}
                    
                    {price.detailedAnalysis.successMetrics && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-400">Success Metrics</h5>
                        {renderDetailItem(<BarChart3 size={14} />, "Key Metrics", price.detailedAnalysis.successMetrics.keyMetrics)}
                        {renderDetailItem(<Target size={14} />, "Targets", price.detailedAnalysis.successMetrics.targets)}
                      </div>
                    )}

                    {price.detailedAnalysis.implementationStrategy && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-400">Implementation Strategy</h5>
                        {renderDetailItem(<Zap size={14} />, "Phases", price.detailedAnalysis.implementationStrategy.phases)}
                        {renderDetailItem(<Calendar size={14} />, "Timeline", price.detailedAnalysis.implementationStrategy.timeline)}
                        {renderDetailItem(<Users size={14} />, "Resources", price.detailedAnalysis.implementationStrategy.resources)}
                      </div>
                    )}

                    {price.detailedAnalysis.riskAnalysis && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-400">Risk Analysis</h5>
                        {renderDetailItem(<XCircle size={14} />, "Risks", price.detailedAnalysis.riskAnalysis.risks)}
                        {renderDetailItem(<Shield size={14} />, "Mitigations", price.detailedAnalysis.riskAnalysis.mitigations)}
                      </div>
                    )}

                    {price.detailedAnalysis.marketFit && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-400">Market Fit</h5>
                        {renderDetailItem(<Users2 size={14} />, "Ideal Customers", price.detailedAnalysis.marketFit.idealCustomers)}
                        {renderDetailItem(<TrendingUp size={14} />, "Market Conditions", price.detailedAnalysis.marketFit.marketConditions)}
                        {renderDetailItem(<BarChart3 size={14} />, "Competitive Landscape", price.detailedAnalysis.marketFit.competitiveLandscape)}
                      </div>
                    )}

                    {price.pricingStrategy && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-400">Pricing Strategy</h5>
                        {renderDetailItem(<Lightbulb size={14} />, "Approach", price.pricingStrategy.approach)}
                        {renderDetailItem(<AlertCircle size={14} />, "Rationale", price.pricingStrategy.rationale)}
                        {renderDetailItem(<CheckCircle2 size={14} />, "Key Considerations", price.pricingStrategy.keyConsiderations)}
                        {renderDetailItem(<Zap size={14} />, "Flexibility", price.pricingStrategy.flexibility)}
                        {renderDetailItem(<TrendingUp size={14} />, "Scalability", price.pricingStrategy.scalability)}
                      </div>
                    )}

                    {price.customerFeedback && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-400">Customer Feedback</h5>
                        {renderDetailItem(<Users2 size={14} />, "Expected Reactions", price.customerFeedback.expectedReactions)}
                        {renderDetailItem(<Lightbulb size={14} />, "Value Proposition", price.customerFeedback.valueProposition)}
                        {renderDetailItem(<XCircle size={14} />, "Potential Objections", price.customerFeedback.objections)}
                        {renderDetailItem(<CheckCircle2 size={14} />, "Response Strategy", price.customerFeedback.responses)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Price trends graph */}
          <div className="space-y-2">
            <div className="h-[180px] w-full bg-black/20 rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={10}
                    tickLine={false}
                    tickMargin={5}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={5}
                    label={{ value: 'Users', angle: -90, position: 'insideLeft', fill: '#fff' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: 'white'
                    }}
                    formatter={(value) => value != null ? `${value} users` : ''}
                  />
                  {uniquePriceSuggestions.map((ps) => (
                    <Line
                      key={ps.type}
                      type="monotone"
                      dataKey={ps.type}
                      stroke={typeColors[ps.type]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col items-center w-full px-2 text-xs text-gray-400 mt-2">
              <div className="flex items-center gap-4 mb-1">
                {uniquePriceSuggestions.map((ps) => (
                  <div key={ps.type} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[ps.type] }} />
                    <span>{ps.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
