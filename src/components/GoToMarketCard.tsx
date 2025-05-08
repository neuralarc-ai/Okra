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
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <Target className="w-6 h-6 text-blue-300" /> Go-to-Market Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Strategy Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2 tracking-tight">
              <TrendingUp className="w-5 h-5 text-green-300" /> Strategic Initiatives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goToMarket.strategy.map((item, index) => (
                <div
                  key={index}
                  className="p-5 border border-white/10 rounded-xl bg-white/5 transition-all duration-200 hover:border-green-400/30 hover:bg-green-400/5 shadow-sm flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-semibold text-white">{item.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(item.priority)}`}>{item.priority.toUpperCase()}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Channels */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2 tracking-tight">
              <BarChart3 className="w-5 h-5 text-yellow-300" /> Marketing Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goToMarket.channels.map((channel, index) => (
                <div
                  key={index}
                  className="p-5 border border-white/10 rounded-xl bg-white/5 transition-all duration-200 hover:border-yellow-400/30 hover:bg-yellow-400/5 shadow-sm flex flex-col gap-2"
                >
                  <div className="flex flex-col items-start justify-between mb-2">
                    <span className="text-base font-semibold mb-2 text-white">{channel.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">Cost: {channel.cost}</span>
                      <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">ROI: {channel.timeToROI}</span>
                    </div>
                  </div>
                  {/* Effectiveness bar */}
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getEffectivenessClass(channel.effectiveness)}`}
                      style={{ width: getEffectivenessWidth(channel.effectiveness) }}
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-400">Effectiveness: {channel.effectiveness}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goToMarket.kpis.map((kpi, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 shadow-sm"
                >
                  <div>
                    <div className="text-base font-semibold text-white">{kpi.metric}</div>
                    <div className="text-xs text-gray-400">{kpi.timeframe}</div>
                  </div>
                  <div className="text-base font-bold text-blue-300">{kpi.target}</div>
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