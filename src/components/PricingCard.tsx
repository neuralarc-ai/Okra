import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceSuggestion } from "@/types/oracle";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Users } from 'lucide-react';

interface PricingCardProps {
  priceSuggestions: PriceSuggestion[];
}

const PricingCard = ({ priceSuggestions }: PricingCardProps) => {
  // Generate sample trend data if not provided
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
      freemium: Math.round(0 + (Math.random() * 2 - 1)),
      subscription: Math.round(7.5 + (Math.random() * 5 - 2.5)),
    };
  });

  const colors = {
    freemium: "#4ade80",
    subscription: "#f43f5e"
  };

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
        <CardTitle className="text-xl font-medium">Suggested Price Points</CardTitle>
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
                <span className="text-xl font-bold text-white bg-white/10 px-2 py-0.5 rounded">{price.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{price.description}</p>
            </div>
          ))}

          {/* Price trends graph */}
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: 'white'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="freemium"
                  stroke={colors.freemium}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="subscription"
                  stroke={colors.subscription}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
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
