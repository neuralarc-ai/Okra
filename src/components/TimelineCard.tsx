import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline } from "@/types/oracle";
import { Badge } from "@/components/ui/badge";
import { Clock, Flag, AlertTriangle, Calendar } from "lucide-react";

interface TimelineCardProps {
  timeline: Timeline;
}

const TimelineCard = ({ timeline }: TimelineCardProps) => {
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return { bg: '#97A487', text: '#F8F7F3', border: '#B7A694' };
      case 'medium':
        return { bg: '#A8B0B8', text: '#F8F7F3', border: '#B7A694' };
      case 'high':
        return { bg: '#D48EA3', text: '#F8F7F3', border: '#B7A694' };
    }
  };

  return (
    <Card className="border-none outline-none bg-white shadow-none">
      <CardContent className="p-0">
        <div className="p-6">
          {/* Header Section */}
          <div className="rounded-[8px] p-6 mb-8" style={{ background: '#2B2521', border: '1px solid #B7A694' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center gap-2" style={{ color: '#F8F7F3' }}>
                <Calendar size={18} className="text-[#CFD2D4]" />
                <span>Project Timeline</span>
              </CardTitle>
            </CardHeader>
          </div>

          {/* Total Duration Card */}
          <div className="rounded-[8px] p-6 mb-8" style={{ background: '#E3E2DFBF' }}>
            <div className="flex items-center justify-between p-4 rounded-[8px] border" 
              style={{ 
                background: '#F8F8F773',
                borderColor: '#20202010',
                backgroundImage: "url('/card-bg-9.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
              <span className="text-lg font-semibold flex items-center gap-2" style={{ color: '#161616' }}>
                <Clock size={18} className="text-[#2B2521]" />
                Total Duration
              </span>
              <span className="font-['Fustat'] font-normal text-[32px] leading-[36px] tracking-[-0.02em]" style={{ color: '#202020' }}>
                {timeline.totalDuration}
              </span>
            </div>
          </div>

          {/* Phases Section */}
          <div className="rounded-[8px] p-6 mb-8" style={{ background: '#E3E2DFBF' }}>
            <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-6">
              Project Phases
            </h3>
            <div className="space-y-4">
              {timeline.phases.map((phase, index) => (
                <div
                  key={index}
                  className="p-6 rounded-[8px] border transition-all duration-200"
                  style={{ 
                    background: '#F8F8F773',
                    borderColor: '#20202010',
                    backgroundImage: "url('/card-bg-9.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Phase header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold" style={{ color: '#161616' }}>{phase.name}</span>
                      <Badge 
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                          background: getRiskColor(phase.risk).bg,
                          color: getRiskColor(phase.risk).text,
                          border: `1px solid ${getRiskColor(phase.risk).border}`
                        }}
                      >
                        {phase.risk.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-base font-medium" style={{ color: '#2B2521' }}>{phase.duration}</span>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2 mb-4">
                    {phase.tasks.map((task, taskIndex) => (
                      <div 
                        key={taskIndex} 
                        className="flex items-center gap-2 pl-4 py-1.5 rounded-[4px]"
                        style={{ background: '#2B252110' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#2B2521' }} />
                        <span className="text-sm" style={{ color: '#2B2521' }}>{task}</span>
                      </div>
                    ))}
                  </div>

                  {/* Milestone */}
                  <div className="flex items-center gap-2 p-3 rounded-[8px] mt-4" style={{ background: '#2B2521' }}>
                    <Flag size={16} className="text-[#CFD2D4]" />
                    <span className="text-sm font-medium" style={{ color: '#F8F7F3' }}>{phase.milestone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Path Section */}
          {timeline.criticalPath.length > 0 && (
            <div className="rounded-[8px] p-6" style={{ background: '#2B2521', border: '1px solid #B7A694' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2" style={{ color: '#F8F7F3' }}>
                  <AlertTriangle size={18} className="text-[#CFD2D4]" />
                  <span>Critical Path</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 mt-4">
                  {timeline.criticalPath.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 p-3 rounded-[8px]"
                      style={{ background: '#161616', border: '1px solid #B7A694' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#D48EA3' }} />
                      <span className="text-sm" style={{ color: '#F8F7F3' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineCard; 