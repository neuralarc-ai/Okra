import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline } from "@/types/oracle";
import { Badge } from "@/components/ui/badge";
import { Clock, Flag, AlertTriangle } from "lucide-react";

interface TimelineCardProps {
  timeline: Timeline;
}

const TimelineCard = ({ timeline }: TimelineCardProps) => {
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'high':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
    }
  };

  return (
    <div>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-[#202020]">
          <Clock className="w-5 h-5 text-[#202020]" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Total Duration */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#B0B7BC] mb-2 bg-[#CFD2D4]">
            <span className="text-base text-[#202020] flex items-center gap-2"><Clock className="w-5 h-5" /> Total Duration</span>
            <span className="text-base text-[#202020] font-semibold">{timeline.totalDuration}</span>
          </div>

          {/* Phases (as minimal cards, not timeline) */}
          <div className="space-y-4">
            {timeline.phases.map((phase, index) => (
              <Card
                key={index}
                className="p-5  bg-white rounded-[8px]  transition-all duration-200 shadow-none"
              >
                {/* Phase header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#202020] font-semibold">{phase.name}</span>
                    <span className={`px-3 py-1 rounded-[8px] text-xs font-bold border border-[#B0B7BC] ${
                      phase.risk === 'low' ? 'bg-[#E3E7EA] text-[#1E7D4B]' :
                      phase.risk === 'medium' ? 'bg-[#FFF4D6] text-[#B68B00]' :
                      'bg-[#FDE7E7] text-[#B8001E]'
                    }`}>{phase.risk.toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-[#202020]">{phase.duration}</span>
                </div>

                {/* Tasks as a clean list */}
                <ul className="space-y-1 mb-3 pl-1">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-sm text-[#202020] flex items-center">
                      {task}
                    </li>
                  ))}
                </ul>

                {/* Milestone */}
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Flag className="w-4 h-4 text-[#202020]" />
                  <span className="text-[#202020] font-medium">{phase.milestone}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Critical Path */}
          {timeline.criticalPath.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#202020]" />
                <span className="text-base text-[#202020] font-semibold">Critical Path</span>
              </div>
              <ul className="space-y-1">
                {timeline.criticalPath.map((item, index) => (
                  <li key={index} className="text-sm text-[#202020] flex items-center">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default TimelineCard; 