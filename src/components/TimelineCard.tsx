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
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Total Duration */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-blue-400/10 mb-2">
            <span className="text-base text-blue-300 flex items-center gap-2"><Clock className="w-5 h-5" /> Total Duration</span>
            <span className="text-base text-white font-semibold">{timeline.totalDuration}</span>
          </div>

          {/* Phases (as minimal cards, not timeline) */}
          <div className="space-y-4">
            {timeline.phases.map((phase, index) => (
              <div
                key={index}
                className="p-5 border border-white/10 rounded-xl bg-white/5 transition-all duration-200 hover:border-blue-400/30 hover:bg-blue-400/5 shadow-sm"
              >
                {/* Phase header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-white font-semibold">{phase.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(phase.risk)}`}>{phase.risk.toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-gray-400">{phase.duration}</span>
                </div>

                {/* Tasks as a clean list */}
                <ul className="space-y-1 mb-3 pl-1">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-sm text-gray-300 flex items-center">
                      {task}
                    </li>
                  ))}
                </ul>

                {/* Milestone */}
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Flag className="w-4 h-4 text-blue-300" />
                  <span className="text-blue-200 font-medium">{phase.milestone}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Critical Path */}
          {timeline.criticalPath.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <span className="text-base text-amber-200 font-semibold">Critical Path</span>
              </div>
              <ul className="space-y-1">
                {timeline.criticalPath.map((item, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-center">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineCard; 