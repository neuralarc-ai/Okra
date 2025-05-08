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

  return (
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-white">Milestones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quarterly Milestones */}
        <div className="space-y-6">
          {milestones.quarters.map((quarter, index) => (
            <div key={`quarter-${index}`} className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-white">{quarter.quarter}</h4>
                <span className="text-xs text-gray-400">
                  Budget: {formatCurrency(quarter.budget, currency)}
                </span>
              </div>
              
              {/* Objectives */}
              <div className="space-y-2">
                {quarter.objectives.map((objective, objIndex) => (
                  <div 
                    key={`obj-${index}-${objIndex}`}
                    className="p-3 border border-white/5 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(objective.status)}
                        <span className="text-sm font-medium text-white">
                          {objective.title}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{objective.description}</p>
                    
                    {/* Metrics */}
                    {objective.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {objective.metrics.map((metric, metricIndex) => (
                          <div 
                            key={`metric-${index}-${objIndex}-${metricIndex}`}
                            className="px-2 py-1 bg-white/5 rounded text-xs flex items-center gap-1"
                          >
                            <span className="text-gray-400">{metric.name}:</span>
                            <span className="text-white ml-1">
                              {typeof metric.target === 'number' 
                                ? formatCurrency(metric.target, currency)
                                : metric.target}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Deliverables */}
              <div className="pl-4 border-l border-white/10">
                <h5 className="text-xs font-medium text-gray-400 mb-2">Key Deliverables</h5>
                <ul className="space-y-1">
                  {quarter.keyDeliverables.map((deliverable, delIndex) => (
                    <li 
                      key={`del-${index}-${delIndex}`}
                      className="text-sm text-gray-400 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400/20" />
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
          <h4 className="text-sm font-medium text-white mb-3">Critical Milestones</h4>
          <div className="space-y-4">
            {milestones.criticalMilestones.map((milestone, index) => (
              <div key={`critical-${index}`} className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h5 className="text-sm font-medium text-white">{milestone.name}</h5>
                    <span className="text-xs text-gray-400">{milestone.date}</span>
                  </div>
                  {milestone.importance && (
                    <span className="inline-block mt-1 mb-1 px-2 py-0.5 rounded-full bg-blue-900/40 text-xs text-blue-300 font-semibold">
                      {milestone.importance}
                    </span>
                  )}
                  {milestone.successCriteria && milestone.successCriteria.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-gray-300 ml-4 mt-1">
                      {milestone.successCriteria.map((crit, i) => (
                        <li key={i}>{crit}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestonesCard; 