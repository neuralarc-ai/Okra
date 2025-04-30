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
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Total Duration */}
          <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
            <span className="text-gray-400">Total Duration:</span>
            <span className="text-white font-medium">{timeline.totalDuration}</span>
          </div>

          {/* Phases */}
          <div className="space-y-3">
            {timeline.phases.map((phase, index) => (
              <div
                key={index}
                className="relative p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
              >
                {/* Phase header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{phase.name}</span>
                    <Badge variant="outline" className={getRiskColor(phase.risk)}>
                      {phase.risk.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-400">{phase.duration}</span>
                </div>

                {/* Tasks */}
                <ul className="space-y-1 mb-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-sm text-gray-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      {task}
                    </li>
                  ))}
                </ul>

                {/* Milestone */}
                <div className="flex items-center gap-2 text-sm">
                  <Flag className="w-4 h-4 text-blue-300/70" />
                  <span className="text-blue-300/70">{phase.milestone}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Critical Path */}
          {timeline.criticalPath.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-300/70" />
                <span className="text-sm font-medium text-white">Critical Path</span>
              </div>
              <ul className="space-y-1">
                {timeline.criticalPath.map((item, index) => (
                  <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/20" />
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