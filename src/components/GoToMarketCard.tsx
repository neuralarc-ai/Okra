import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoToMarket } from "@/types/oracle";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, BarChart3 } from "lucide-react";

interface GoToMarketCardProps {
  goToMarket: GoToMarket;
}

const GoToMarketCard = ({ goToMarket }: GoToMarketCardProps) => {
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    }
  };

  const getEffectivenessWidth = (effectiveness: number) => {
    return `${Math.max(5, Math.min(100, effectiveness))}%`;
  };

  const getEffectivenessClass = (effectiveness: number) => {
    if (effectiveness >= 80) return "bg-gradient-to-r from-green-400 via-blue-400 to-pink-400";
    if (effectiveness >= 60) return "bg-gradient-to-r from-blue-400 via-green-400 to-pink-400";
    return "bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600";
  };

  return (
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <Target className="w-5 h-5 text-gray-400" />
          Go-to-Market Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {/* Strategy Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              Strategic Initiatives
            </h3>
            {goToMarket.strategy.map((item, index) => (
              <div
                key={index}
                className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{item.name}</span>
                  <Badge variant="outline" className={getPriorityColor(item.priority)}>
                    {item.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Marketing Channels */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              Marketing Channels
            </h3>
            {goToMarket.channels.map((channel, index) => (
              <div
                key={index}
                className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{channel.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">Cost: {channel.cost}</span>
                    <span className="text-xs text-gray-400">ROI: {channel.timeToROI}</span>
                  </div>
                </div>
                {/* Effectiveness bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getEffectivenessClass(channel.effectiveness)}`}
                    style={{ width: getEffectivenessWidth(channel.effectiveness) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* KPIs */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white mb-3">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 gap-2">
              {goToMarket.kpis.map((kpi, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                >
                  <div>
                    <div className="text-sm text-white">{kpi.metric}</div>
                    <div className="text-xs text-gray-400">{kpi.timeframe}</div>
                  </div>
                  <div className="text-sm font-medium text-white">{kpi.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoToMarketCard; 