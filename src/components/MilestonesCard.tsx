import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Milestones } from '@/types/oracle';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface MilestonesCardProps {
  milestones?: Milestones;
  currency: string;
}

const MilestonesCard = ({ milestones, currency }: MilestonesCardProps) => {
  if (!milestones) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCriticalColor = (importance: string) => {
    switch ((importance || '').toLowerCase()) {
      case 'low':
        return {
          border: 'border-emerald-300/20',
          bg: 'bg-emerald-400/5',
          badge: 'bg-emerald-300/10 text-emerald-400',
          text: 'text-emerald-300',
        };
      case 'medium':
        return {
          border: 'border-amber-300/20',
          bg: 'bg-amber-400/5',
          badge: 'bg-amber-300/10 text-amber-400',
          text: 'text-amber-300',
        };
      case 'high':
        return {
          border: 'border-orange-400/20',
          bg: 'bg-orange-400/5',
          badge: 'bg-orange-400/10 text-orange-400',
          text: 'text-orange-400',
        };
      case 'critical':
        return {
          border: 'border-rose-400/20',
          bg: 'bg-rose-400/5',
          badge: 'bg-rose-400/10 text-rose-400',
          text: 'text-rose-400',
        };
      default:
        return {
          border: 'border-amber-300/20',
          bg: 'bg-amber-400/5',
          badge: 'bg-amber-300/10 text-amber-400',
          text: 'text-amber-300',
        };
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#202020] flex items-center gap-3 tracking-tight">
          <CheckCircle2 className="w-6 h-6 text-[#202020]" /> Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Quarterly Milestones */}
        <div className="space-y-8">
          {milestones.quarters.map((quarter, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-bold text-[#202020]">{quarter.quarter}</h4>
                <span className="text-xs text-[#202020] bg-white/10 px-3 py-1 rounded-full">Budget: {formatCurrency(quarter.budget, currency)}</span>
              </div>
              {/* Objectives */}
              {Array.isArray(quarter.objectives) && quarter.objectives.length > 0 ? (
                quarter.objectives.map((objective, i) => (
                  <div 
                    key={`obj-${idx}-${i}`}
                    className="p-4 border border-[#202020]/10 rounded-xl flex flex-col gap-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(objective.status)}
                      <span className="text-base font-semibold text-[#202020]">{objective.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold border border-[#202020]/10 bg-white/10 text-[#202020] ml-auto">{objective.status.replace('-', ' ').toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-[#202020] leading-relaxed">{objective.description}</p>
                    {/* Metrics */}
                    {objective.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {objective.metrics.map((metric, metricIndex) => (
                          <div 
                            key={`metric-${idx}-${i}-${metricIndex}`}
                            className="px-2 py-1 bg-white/10 rounded text-xs flex items-center gap-1"
                          >
                            <span className="text-[#202020] font-semibold">{metric.name}:</span>
                            <span className="text-[#202020] ml-1">
                              {typeof metric.target === 'number' 
                                ? formatCurrency(metric.target, currency)
                                : metric.target}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-[#202020] italic">No objectives listed for this quarter.</div>
              )}
              {/* Key Deliverables */}
              <div className="pl-2 border-l-4 border-[#202020]/20 mt-2">
                <h5 className="text-xs font-semibold text-[#202020] mb-2">Key Deliverables</h5>
                <ul className="space-y-1">
                  {quarter.keyDeliverables.map((deliverable, delIndex) => (
                    <li 
                      key={`del-${idx}-${delIndex}`}
                      className="text-sm text-[#202020] flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#202020]" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Critical Milestones */}
        <div>
          <h4 className="text-lg font-bold text-[#202020] mb-4 flex items-center gap-2 tracking-tight">
            <AlertCircle className="h-5 w-5 text-[#202020]" /> Critical Milestones
          </h4>
          <div className="space-y-4">
            {milestones.criticalMilestones.map((milestone, index) => {
              const color = getCriticalColor(milestone.importance);
              return (
                <div key={`critical-${index}`} className={`p-4 border ${color.border} rounded-xl flex flex-col gap-2 shadow-sm`}>
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="text-base font-semibold text-[#202020]">{milestone.name}</h5>
                    <span className="text-xs text-[#202020] bg-white/10 px-2 py-0.5 rounded-full">{milestone.date}</span>
                  </div>
                  {milestone.importance && (
                    <span className={`inline-block px-2 py-0.5 rounded-full ${color.badge} text-xs font-semibold w-fit`}>
                      {milestone.importance}
                    </span>
                  )}
                  {milestone.successCriteria && milestone.successCriteria.length > 0 && (
                    <ul className="list-disc list-inside text-xs ml-4 mt-1 text-[#202020]">
                      {milestone.successCriteria.map((crit, i) => (
                        <li key={i}>{crit}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default MilestonesCard; 