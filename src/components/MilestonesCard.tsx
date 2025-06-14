import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Milestones } from '@/types/oracle';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, Calendar, Target } from 'lucide-react';

interface MilestonesCardProps {
  milestones?: Milestones;
  currency: string;
}

const MilestonesCard = ({ milestones, currency }: MilestonesCardProps) => {
  if (!milestones) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: '#97A487', text: '#F8F7F3', border: '#B7A694' };
      case 'in-progress':
        return { bg: '#A8B0B8', text: '#F8F7F3', border: '#B7A694' };
      default:
        return { bg: '#D48EA3', text: '#F8F7F3', border: '#B7A694' };
    }
  };

  const getCriticalColor = (importance: string) => {
    switch ((importance || '').toLowerCase()) {
      case 'low':
        return { bg: '#97A487', text: '#F8F7F3', border: '#B7A694' };
      case 'medium':
        return { bg: '#A8B0B8', text: '#F8F7F3', border: '#B7A694' };
      case 'high':
        return { bg: '#D48EA3', text: '#F8F7F3', border: '#B7A694' };
      case 'critical':
        return { bg: '#D48EA3', text: '#F8F7F3', border: '#B7A694' };
      default:
        return { bg: '#A8B0B8', text: '#F8F7F3', border: '#B7A694' };
    }
  };

  return (
    <Card className="border-none outline-none bg-white shadow-none">
      <CardContent className="p-0">
        <div className="p-4">
          {/* Header Section */}


          {/* Quarterly Milestones Section */}
          <div className="mb-8">
            <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-6">
              Quarterly Milestones
            </h3>
            <div className="space-y-8">
              {milestones.quarters.map((quarter, idx) => (
                <div
                  key={idx}
                  className="rounded-[8px] p-6 relative overflow-hidden shadow"
                  style={{
                    backgroundImage: "url('/Effect 5.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    marginBottom: '16px',
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-semibold" style={{ color: '#161616' }}>{quarter.quarter}</h4>
                    <span className="p-4 rounded-[8px] text-[24px] font-medium"
                      style={{
                        background: '#32323440',
                        color: '#FFFFFF',
                      }}>
                      <span style={{ color: '#FFFFFF', fontSize: '18px' }}> Budget: </span> {formatCurrency(quarter.budget, currency)}
                    </span>
                  </div>
                  {/* Objectives */}
                  {Array.isArray(quarter.objectives) && quarter.objectives.length > 0 ? (
                    <div className="space-y-4">
                      {quarter.objectives.map((objective, i) => (
                        <div
                          key={`obj-${idx}-${i}`}
                          className="p-6 rounded-[8px] border transition-all duration-200"
                          style={{
                            background: '#FFFFFFBF',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              {/* <CheckCircle2 size={18} className="text-[#2B2521]" /> */}
                              <span className="text-lg font-semibold" style={{ color: '#161616' }}>{objective.title}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium ml-auto"
                              style={{
                                background: getStatusColor(objective.status).bg,
                                color: getStatusColor(objective.status).text,
                              }}
                            >
                              {objective.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm mb-4" style={{ color: '#2B2521' }}>{objective.description}</p>
                          {/* Metrics */}
                          {objective.metrics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {objective.metrics.map((metric, metricIndex) => (
                                <div
                                  key={`metric-${idx}-${i}-${metricIndex}`}
                                  className="px-3 py-1.5 rounded-[8px] text-sm flex items-center gap-2"
                                  style={{
                                    background: '#F8F8F7',
                                    color: '#000000',
                                  }}
                                >
                                  <span className="font-medium">{metric.name}:</span>
                                  <span>
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
                  ) : (
                    <div className="text-sm italic" style={{ color: '#2B2521' }}>No objectives listed for this quarter.</div>
                  )}
                  {/* Key Deliverables */}
                  <div className="mt-6 p-4 rounded-[8px]" style={{ background: '#FFFFFF80' }}>
                    <h5 className="text-sm font-medium mb-3" style={{ color: '#202020' }}>Key Deliverables</h5>
                    <div className="space-y-2">
                      {quarter.keyDeliverables.map((deliverable, delIndex) => (
                        <div
                          key={`del-${idx}-${delIndex}`}
                          className="flex items-center gap-2 p-2 rounded-[4px]"
                        >
                          <CheckCircle2 size={14} className="text-[#000000]" />
                          <span className="text-sm" style={{ color: '#000000' }}>{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Milestones Section */}
          <div className="rounded-[8px] p-6" style={{ background: '#CDCECB' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center gap-2" style={{ color: '#F8F7F3' }}>
                <span>Critical Milestones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 mt-4">
                {milestones.criticalMilestones.map((milestone, index) => {
                  const color = getCriticalColor(milestone.importance);
                  return (
                    <div
                      key={`critical-${index}`}
                      className="p-6 rounded-[8px] border transition-all duration-200"
                      style={{
                        background: '#FFFFFFBF',
                        border: 'none'
                      }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-4">
                          <h5 className="text-lg font-semibold " style={{ color: '#000000' }}>{milestone.name}</h5>
                          {milestone.importance && (
                            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium"
                              style={{
                                background: color.bg,
                                color: color.text,
                                border: `1px solid ${color.border}`
                              }}
                            >
                              {milestone.importance.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            background: '#FFFFFF',
                            color: '#000000',
                            // border: `1px solid ${color.border}`
                          }}
                        >
                          {milestone.date}
                        </span>
                      </div>
                      {milestone.successCriteria && milestone.successCriteria.length > 0 && (
                        <div className="space-y-2 mt-4">
                          {milestone.successCriteria.map((crit, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-2 rounded-[4px]"

                            >
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#282828' }} />
                              <span className="text-sm" style={{ color: '#000000' }}>{crit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestonesCard; 