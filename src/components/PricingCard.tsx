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

// Helper to robustly format price values
const formatPriceValue = (value: string | number, currency: string) => {
  if (typeof value === 'number') return formatCurrency(value, currency);
  if (typeof value !== 'string') return value;

  // If already contains a currency symbol, show as-is
  if (value.includes('$') || value.includes('₹') || value.includes('€')) return value;

  // If it's a range (e.g., '500k - 2M+')
  if (value.includes('-')) {
    const [low, high] = value.split('-').map(v => v.trim());
    const formatPart = (part: string) => {
      if (part.toLowerCase().includes('k')) {
        return formatCurrency(parseFloat(part) * 1e3, currency);
      }
      if (part.toLowerCase().includes('m')) {
        return formatCurrency(parseFloat(part) * 1e6, currency);
      }
      const num = parseFloat(part.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? part : formatCurrency(num, currency);
    };
    return `${formatPart(low)} - ${formatPart(high)}`;
  }

  // Try to parse as number with k/M
  if (value.toLowerCase().includes('k')) {
    return formatCurrency(parseFloat(value) * 1e3, currency);
  }
  if (value.toLowerCase().includes('m')) {
    return formatCurrency(parseFloat(value) * 1e6, currency);
  }
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? value : formatCurrency(num, currency);
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
        <CardTitle className="text-xl font-semibold">Pricing Analysis</CardTitle>
        <p className="text-gray-400 text-xs mt-1">Key pricing models and their projected adoption. Expand for detailed analysis.</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
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
              className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
            >
                <div 
                  className="flex justify-between items-center mb-1 cursor-pointer"
                  onClick={() => togglePrice(price.type)}
                >
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">{price.type}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded text-xs">{formatPriceValue(price.value, currency)}</span>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                {/* Collapsed: show only key points */}
                {!isExpanded && (
                  <ul className="list-disc list-inside text-xs text-gray-300 ml-2 mt-1 space-y-1">
                    {keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                )}
                {/* Expanded: show detailed summary/analysis */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-sm text-white mb-2 font-semibold">Detailed Analysis</div>
                    <div className="text-xs text-gray-200 whitespace-pre-line">
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
