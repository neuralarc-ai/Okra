import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceSuggestion } from "@/types/oracle";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Users } from 'lucide-react';

interface PricingCardProps {
  priceSuggestions: PriceSuggestion[];
}

const PricingCard = ({ priceSuggestions }: PricingCardProps) => {
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

  // Assign a color to each unique price type (avoid duplicates)
  const uniqueTypes = Array.from(new Set(priceSuggestions.map(ps => ps.type)));
  const colorPalette = ["#4ade80", "#FFADDF", "#6366f1", "#f59e42", "#38bdf8", "#f472b6", "#a3e635", "#facc15"];
  const typeColors: Record<string, string> = {};
  uniqueTypes.forEach((type, idx) => {
    typeColors[type] = colorPalette[idx % colorPalette.length];
  });

  // Only use the first occurrence of each type for chart lines and legend
  const uniquePriceSuggestions = uniqueTypes.map(type => priceSuggestions.find(ps => ps.type === type)!);

  const strategies = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      title: "Market Penetration",
      description: "Initial lower pricing to gain market share and user adoption"
    },
    {
      icon: <Target className="w-4 h-4" />,
      title: "Value-Based Pricing",
      description: "Premium features aligned with user-perceived value"
    },
    {
      icon: <Users className="w-4 h-4" />,
      title: "User Segmentation",
      description: "Tailored pricing tiers for different user segments"
    }
  ];

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
          {priceSuggestions.map((price, index) => (
            <div 
              key={index} 
              className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium text-gray-300">{price.type}</h4>
                <span className=" font-bold text-white bg-white/10 px-2 py-0.5 rounded">{price.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{price.description}</p>
            </div>
          ))}

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
              <span className="italic"></span>
            </div>
          </div>

          {/* Pricing Strategy Section */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Pricing Strategy</h3>
            <div className="grid gap-3">
              {strategies.map((strategy, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
                >
                  <div className="p-2 bg-white/10 rounded-lg text-white">
                    {strategy.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">{strategy.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{strategy.description}</p>
                  </div>
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
