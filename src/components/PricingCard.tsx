import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceSuggestion } from "@/types/oracle";
import { Info, TrendingUp, BarChart2, DollarSign, Check, X, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    <Card className="border-none outline-none bg-white shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-[#202020]" style={{
          fontFamily: 'Fustat',
          fontWeight: 500,
          fontSize: '40px',
          lineHeight: '69px',
          letterSpacing: '-2%',
          verticalAlign: 'middle',
          margin: 0
        }}>
          Pricing Analysis
        </CardTitle>
        <p className="text-[#202020] text-sm mt-2" style={{
          fontFamily: 'Fustat',
          fontWeight: 300,
          fontSize: '20px',
          lineHeight: '28px',
          letterSpacing: '-2%',
          verticalAlign: 'middle',
          margin: 0
        }}>Key pricing models and their projected adoption. Expand for detailed analysis.</p>
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
                className="p-6 border rounded-2xl bg-[#E3E2DF] border-[#CFD2D4] transition-all duration-200 group"
              >
                <div
                  className="flex justify-between items-center mb-2 cursor-pointer"
                  onClick={() => togglePrice(price.type)}
                >
                  <h4 className="text-base font-bold flex items-center gap-2" style={{ color: '#161616' }}>
                    {price.type}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="inline-block p-[4px] rounded-full bg-gradient-to-r from-[#C6AEA3] to-[#2B2521]">
                      <span className="font-sans font-semibold text-[#000000] bg-gradient-to-r from-[#79685D] to-[#D1C2B8] px-[16px] py-[24px] rounded-full text-[28px] leading-none tracking-normal text-center block"> {formatPriceValue(price.value, currency)}</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="text-[#2B2521]" />
                    ) : (
                      <ChevronDown className="text-[#2B2521]" />
                    )}
                  </div>
                </div>
                {/* Collapsed: show only key points */}
                {!isExpanded && (
                  <ul className="list-disc list-inside text-sm text-[#2B2521] ml-2 mt-1 space-y-1">
                    {keyPoints.map((point, i) => <li key={i} className="leading-relaxed">{point}</li>)}
                  </ul>
                )}
                {/* Expanded: show detailed summary/analysis */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#CFD2D4]">
                    <div className="text-base mb-2 font-bold" style={{ color: '#161616' }}>Detailed Analysis</div>
                    <div className="text-sm mb-2" style={{ color: '#2B2521', whiteSpace: 'pre-line' }}>
                      {price.detailedAnalysis?.summary || price.description}
                    </div>
                    {/* Optionally, show a few more details if available */}
                    {price.detailedAnalysis?.revenuePotential?.longTerm && (
                      <div className="mt-2 text-sm" style={{ color: '#2B2521' }}>
                        <span className="font-semibold" style={{ color: '#161616' }}>
                          Long-term Revenue Potential:
                        </span> {price.detailedAnalysis.revenuePotential.longTerm}
                      </div>
                    )}
                    {price.detailedAnalysis?.adoptionBarriers && price.detailedAnalysis.adoptionBarriers.length > 0 && (
                      <div className="mt-2">
                        <span className="font-semibold text-xs" style={{ color: '#161616' }}>
                          Adoption Barriers:
                        </span>
                        <ul className="list-disc list-inside text-sm ml-4" style={{ color: '#2B2521' }}>
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
            <div className="h-[260px] w-full rounded-2xl p-6 border" style={{ background: '#2B2521', borderColor: '#161616' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid stroke="#7D7D7D" />
                  <XAxis
                    dataKey="date"
                    stroke="#CFD2D4"
                    fontSize={12}
                    tickLine={false}
                    tickMargin={5}
                  />
                  <YAxis
                    stroke="#CFD2D4"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={5}
                    label={{ value: 'Users', angle: -90, position: 'insideLeft', fill: '#CFD2D4' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161616',
                      border: '1px solid #B7A694',
                      borderRadius: '6px',
                      color: '#F8F7F3'
                    }}
                    formatter={(value) => value != null ? `${value} users` : ''}
                  />
                  {uniquePriceSuggestions.map((ps, idx) => (
                    <Line
                      key={ps.type}
                      type="monotone"
                      dataKey={ps.type}
                      stroke={idx === 0 ? '#D48EA3' : '#3987BE'}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="6 4"
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-row items-center justify-center w-full px-2 text-base mt-4 gap-6">
              {uniquePriceSuggestions.map((ps, idx) => (
                <div key={ps.type} className="flex items-center gap-2 px-5 py-2 rounded-full border" style={{ background: idx === 0 ? '#D48EA3' : '#3987BE', borderColor: '#161616' }}>
                  <span className="font-semibold text-[#161616]" style={{ color: idx === 0 ? '#161616' : '#F8F7F3' }}>{ps.type}</span>
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
