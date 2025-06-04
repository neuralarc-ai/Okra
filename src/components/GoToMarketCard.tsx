import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoToMarket } from "@/types/oracle";
import { Badge } from "@/components/ui/badge";
import { ChartBar, Target, TrendingUp, Users, Zap } from "lucide-react";

interface GoToMarketCardProps {
  goToMarket: GoToMarket;
}

const GoToMarketCard = ({ goToMarket }: GoToMarketCardProps) => {
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return { bg: '#D48EA3', text: '#F8F7F3', border: '#B7A694' };
      case 'medium':
        return { bg: '#A8B0B8', text: '#F8F7F3', border: '#B7A694' };
      case 'low':
        return { bg: '#97A487', text: '#F8F7F3', border: '#B7A694' };
    }
  };

  const getEffectivenessClass = (effectiveness: number) => {
    return "bg-gradient-to-r from-[#262626] via-[#1E342F] to-[#5D7143]";
  };

  return (
    <Card className="border-none outline-none bg-white shadow-none">
      <CardContent className="p-2">
        <div className="px-5">
          {/* Header Section */}
          <div className="rounded-[8px]  ">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center" style={{
                color: '#000000',
                fontFamily: 'Fustat',
                fontWeight: 500,
                fontSize: '40px',
                lineHeight: '69px',
                letterSpacing: '-2%',
                verticalAlign: 'middle'
              }}>
                <span>Go-to-Market Strategy</span>
              </CardTitle>
            </CardHeader>
          </div>

          {/* Strategy Section */}
          <div className="space-y-6">
            <div className="rounded-[8px] p-6"  style={{ 
                      background: '#F8F8F773',
                      borderColor: '#20202010',
                      backgroundImage: "url('/card-bg-9.png')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}>
              <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-6">
                Strategic Initiatives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goToMarket.strategy.map((item, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-[8px] border transition-all duration-200"
                    style={{ 
                      background: '#F8F8F773',
                      borderColor: '#20202010',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold" style={{ color: '#161616' }}>{item.name}</span>
                      <Badge 
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                          background: getPriorityColor(item.priority).bg,
                          color: getPriorityColor(item.priority).text,
                          
                        }}
                      >
                        {item.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm" style={{ color: '#2B2521' }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing Channels */}
            <div className="rounded-[8px] p-6 "
             style={{ 
                      background: '#F8F8F773',
                      borderColor: '#20202010',
                      backgroundImage: "url('/card-bg-9.png')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}>
              <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-6">
                Marketing Channels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goToMarket.channels.map((channel, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-[8px] border transition-all duration-200"
                    style={{ 
                      background: '#F8F8F773',
                      borderColor: '#20202010',
                      
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <span style={{ 
                          color: '#161616',
                          fontFamily: 'Fustat',
                          fontWeight: 500,
                          fontSize: '21px',
                          lineHeight: '35px',
                          letterSpacing: '-0.4%',
                          verticalAlign: 'middle'
                        }}>{channel.name}</span>
                        <div className="flex items-center gap-2 mb-2 mt-2">
                          <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#AD92814D', color: '#000000' }}>
                            Cost: {channel.cost}
                          </span>
                          <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#AD92814D', color: '#000000' }}>
                            ROI: {channel.timeToROI}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-[#CFD2D4] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getEffectivenessClass(channel.effectiveness)}`}
                            style={{ width: `${Math.max(5, Math.min(100, channel.effectiveness))}%` }}
                          />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm" style={{ color: '#2B2521' }}>Effectiveness</span>
                          <span className="text-sm font-medium" style={{ color: '#161616' }}>{channel.effectiveness}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs Section */}
            <div className="rounded-[8px] p-6" style={{ background: '#2B2521', border: '1px solid #B7A694' }}>
              <CardHeader className="pb-2">
                <CardTitle className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em]" style={{ color: '#F8F7F3' }}>
                  
                  <span>Key Performance Indicators</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {goToMarket.kpis.map((kpi, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-[8px] border"
                      style={{ 
                        background: '#161616',
                        borderColor: '#161616',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div style={{
                            color: '#F8F7F3',
                            fontFamily: 'Fustat',
                            fontWeight: 300,
                            fontSize: '16px',
                            lineHeight: '28px',
                            letterSpacing: '0%',
                            verticalAlign: 'middle'
                          }}>{kpi.metric}</div>
                          <div className="text-sm mt-2" style={{ color: '#CFD2D4' }}>{kpi.timeframe}</div>
                        </div>
                        <div style={{
                          color: '#F8F7F3',
                          fontFamily: 'Fustat',
                          fontWeight: 500,
                          fontSize: '24px',
                          lineHeight: '32px',
                          letterSpacing: '0%',
                          verticalAlign: 'middle'
                        }}>{kpi.target}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoToMarketCard; 