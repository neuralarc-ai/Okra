import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceSuggestion } from "@/types/oracle";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Users, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, XCircle, BarChart3, Calendar, Users2, ArrowUpRight, ArrowDownRight, Lightbulb, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface PricingCardProps {
  priceSuggestions: PriceSuggestion[];
  currency?: string;
}

// Helper to robustly format price values, including objects
const formatPriceValue = (value: any, currency: string): string => {
  if (typeof value === 'number') return formatCurrency(value, currency);
  if (typeof value === 'string') {
    // Remove currency codes and non-numeric characters except for .,- (for ranges)
    const cleaned = value.replace(/(USD|INR|AED|EUR|GBP|\$|₹|€|£)/gi, '').replace(/[^0-9.,\-]/g, '');
    // Handle ranges like "5000-15000"
    if (cleaned.includes('-')) {
      const [low, high] = cleaned.split('-').map(v => v.replace(/,/g, '').trim());
      const lowNum = parseFloat(low);
      const highNum = parseFloat(high);
      if (!isNaN(lowNum) && !isNaN(highNum)) {
        return `${formatCurrency(lowNum, currency)} - ${formatCurrency(highNum, currency)}`;
      }
    }
    // Single value
    const num = parseFloat(cleaned.replace(/,/g, ''));
    if (!isNaN(num)) {
      return formatCurrency(num, currency);
    }
    // If still not a number, just return the original string
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    // Recursively format each key-value pair
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${formatPriceValue(v, currency)}`)
      .join(', ');
  }
  return '';
};

const PricingCard = ({ priceSuggestions, currency = 'USD' }: PricingCardProps) => {
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
        <CardTitle className="text-2xl font-extrabold text-white flex items-center gap-3 tracking-tight">
          <BarChart3 className="h-6 w-6 text-blue-300" /> Pricing Analysis
        </CardTitle>
        <p className="text-gray-400 text-sm mt-2">Key pricing models and their projected adoption. Expand for detailed analysis.</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {priceSuggestions.map((price, index) => {
            const isExpanded = expandedPrice === price.type;
            // Only show 2-3 key points in collapsed view
            const keyPoints = [
              price.description,
              price.detailedAnalysis?.competitiveAdvantage,
              price.detailedAnalysis?.revenuePotential?.shortTerm
            ].filter(Boolean).slice(0, 3);
            return (
            <div 
              key={index}
              className="p-5 border border-white/10 rounded-2xl bg-white/5 transition-all duration-200 hover:border-blue-400/30 hover:bg-blue-400/5 shadow-sm group"
            >
                <div 
                  className="flex justify-between items-center mb-2 cursor-pointer"
                  onClick={() => togglePrice(price.type)}
                >
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-300" /> {price.type}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-700 bg-blue-200/80 px-3 py-1 rounded-full text-xs shadow-sm border border-blue-300/40">{formatPriceValue(price.value, currency)}</span>
                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>
                {/* Collapsed: show only key points */}
                {!isExpanded && (
                  <ul className="list-disc list-inside text-xs text-gray-300 ml-2 mt-1 space-y-1">
                    {keyPoints.map((point, i) => <li key={i} className="leading-relaxed">{point}</li>)}
                  </ul>
                )}
                {/* Expanded: show detailed summary/analysis */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-blue-400/10">
                    <div className="text-base text-white mb-2 font-bold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-300" /> Detailed Analysis</div>
                    <div className="text-sm text-gray-200 whitespace-pre-line mb-2">
                      {price.detailedAnalysis?.summary || price.description}
                    </div>
                    {/* Optionally, show a few more details if available */}
                    {price.detailedAnalysis?.revenuePotential?.longTerm && (
                      <div className="mt-2 text-xs text-gray-400">
                        <span className="font-semibold text-white">Long-term Revenue Potential:</span> {price.detailedAnalysis.revenuePotential.longTerm}
                      </div>
                    )}
                    {price.detailedAnalysis?.adoptionBarriers && price.detailedAnalysis.adoptionBarriers.length > 0 && (
                      <div className="mt-2">
                        <span className="font-semibold text-white text-xs">Adoption Barriers:</span>
                        <ul className="list-disc list-inside text-xs text-gray-300 ml-4">
                          {price.detailedAnalysis.adoptionBarriers.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {/* Price trends graph */}
          <div className="space-y-2">
            <div className="h-[200px] w-full bg-gradient-to-br from-blue-900/30 to-blue-400/10 rounded-2xl p-4 shadow-inner border border-blue-400/10">
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
            <div className="flex flex-row items-center justify-center w-full px-2 text-xs text-gray-400 mt-3 gap-6">
              {uniquePriceSuggestions.map((ps) => (
                <div key={ps.type} className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full shadow-sm border border-white/10">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[ps.type] }} />
                  <span className="font-semibold text-white">{ps.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
