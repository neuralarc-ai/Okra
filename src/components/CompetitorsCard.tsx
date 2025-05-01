import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Competitor } from "@/types/oracle";
import { ChartBar, Award } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CompetitorsCardProps {
  competitors: Competitor[];
}

const CompetitorsCard = ({ competitors }: CompetitorsCardProps) => {
  // Prepare data for the pie chart - market share
  const getMarketShareData = () => {
    // Sort competitors by marketShare descending for consistent order
    const filteredCompetitors = competitors
      .filter(comp => comp.marketShare !== undefined && !isNaN(Number(String(comp.marketShare).replace('%', ''))))
      .sort((a, b) => Number(String(b.marketShare).replace('%', '')) - Number(String(a.marketShare).replace('%', '')))
      .slice(0, 5);

    if (filteredCompetitors.length < 2) return null;
    
    return filteredCompetitors.map(comp => ({
      name: comp.name,
      value: Number(String(comp.marketShare).replace('%', ''))
    }));
  };

  const marketShareData = getMarketShareData();
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
  
  // Custom legend for better clarity
  const renderCustomLegend = (data: any[]) => (
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {data.map((entry, idx) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
          <span className="text-xs text-white/80">{entry.name}</span>
        </div>
      ))}
    </div>
  );

  // Helper to clean up primaryAdvantage (remove extra asterisks)
  const cleanAdvantage = (adv?: string) => {
    if (!adv) return '';
    return adv.replace(/^\*+|\*+$/g, '').trim();
  };

  return (
    <Card className="card-bg hover-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <ChartBar size={18} className="text-blue-300" />
          <span>Competitive Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketShareData && marketShareData.length >= 2 && (
            <div className="h-[220px] mb-2 flex flex-col items-center">
              <h4 className="text-sm text-gray-400 mb-2 text-center">Market Share Distribution</h4>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name }) => `${name}`}
                    labelLine={false}
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Market Share']}
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  {/* Hide default legend */}
                </PieChart>
              </ResponsiveContainer>
              {renderCustomLegend(marketShareData)}
            </div>
          )}

          {marketShareData && marketShareData.map((entry, idx) => {
            const competitor = competitors.find(c => c.name === entry.name);
            if (!competitor) return null;
            return (
              <div key={entry.name} className="space-y-2 p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center gap-1">
                    {competitor.name}
                    {competitor.strengthScore > 80 && (
                      <Award size={14} className="text-yellow-300" />
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                      {entry.value}% Share
                    </span>
                    <span className="text-sm">{competitor.strengthScore}/100</span>
                  </div>
                </div>
                <Progress 
                  value={competitor.strengthScore} 
                  className="h-2 bg-gray-800"
                  indicatorClassName={`$${
                    competitor.strengthScore >= 80 ? 'bg-blue-400' : 
                    competitor.strengthScore >= 60 ? 'bg-blue-300' : 
                    'bg-blue-200'
                  }`}
                />
                <p className="text-gray-400 text-xs">{competitor.description}</p>
                {competitor.primaryAdvantage && (
                  <div className="mt-1">
                    <span className="text-xs text-gray-400">Key Advantage:</span>
                    <span className="text-xs text-white ml-1 font-semibold">{cleanAdvantage(competitor.primaryAdvantage)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorsCard;
