import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoToMarket } from "@/types/oracle";
import { Badge } from "@/components/ui/badge";

interface GoToMarketCardProps {
  goToMarket: GoToMarket;
}

const GoToMarketCard = ({ goToMarket }: GoToMarketCardProps) => {
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getEffectivenessWidth = (effectiveness: number) => {
    return `${Math.max(5, Math.min(100, effectiveness))}%`;
  };

  const getEffectivenessClass = (effectiveness: number) => {
    if (effectiveness >= 80) return "bg-gradient-to-r from-[#3987BE] to-[#D48EA3]";
    if (effectiveness >= 60) return "bg-gradient-to-r from-[#D48EA3] to-[#3987BE]";
    return "bg-gradient-to-r from-[#D48EA3] to-[#3987BE]";
  };

  return (
    <Card className="bg-gray-50 rounded-xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
          Go-to-Market Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Strategy Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Strategic Initiatives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goToMarket.strategy.map((item, index) => (
                <div
                  key={index}
                  className="p-5 border border-gray-200 rounded-xl bg-[#CCCBCA] transition-all duration-200 hover:shadow-md hover:border-gray-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-medium text-gray-900">{item.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`px-2.5 py-0.5 text-xs font-medium border ${getPriorityColor(item.priority)}`}
                    >
                      {item.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Channels */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Marketing Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goToMarket.channels.map((channel, index) => (
                <div
                  key={index}
                  className="p-5 border border-[#CFD4C9] bg-[#B7BEAE] rounded-[8px]  transition-all duration-200"
                >
                  <div className="flex flex-col items-start justify-between mb-3">
                    <span className="text-base font-medium text-gray-900 mb-2">{channel.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 bg-[#A7B897] px-2.5 py-1 rounded-full">
                        Cost: {channel.cost}
                      </span>
                      <span className="text-xs text-gray-600 bg-[#A7B897] px-2.5 py-1 rounded-full">
                        ROI: {channel.timeToROI}
                      </span>
                    </div>
                  </div>
                  {/* Effectiveness bar */}
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getEffectivenessClass(channel.effectiveness)}`}
                        style={{ width: getEffectivenessWidth(channel.effectiveness) }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Effectiveness</span>
                      <span className="text-xs font-medium text-gray-900">{channel.effectiveness}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Key Performance Indicators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goToMarket.kpis.map((kpi, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-xl"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{kpi.metric}</div>
                    <div className="text-xs text-gray-500">{kpi.timeframe}</div>
                  </div>
                  <div className="text-base font-semibold text-gray-900">{kpi.target}</div>
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