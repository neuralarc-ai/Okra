import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FundingRequirements } from '@/types/oracle';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList, Tooltip as RechartsTooltip, ResponsiveContainer, LabelProps } from 'recharts';

interface FundingRequirementsCardProps {
  fundingRequirements?: FundingRequirements;
}

const FundingRequirementsCard = ({ fundingRequirements }: FundingRequirementsCardProps) => {
  if (!fundingRequirements) {
    return null;
  }

  // Prepare data for the bar chart
  const useOfFundsData = (fundingRequirements.useOfFunds || []).map(item => ({
    name: item.category,
    amount: item.amount,
    priority: item.priority
  }));

  const priorityColors = {
    high: '#f43f5e',
    medium: '#f59e42',
    low: '#4ade80'
  };

  const GRADIENT_COLORS = [
    { id: "gradPurple", start: "#8b7cf6", end: "#5f3dc4" },
    { id: "gradPink", start: "#FFADDF", end: "#ff3b82" },
    { id: "gradYellow", start: "#FCEC3B", end: "#f59e42" },
    { id: "gradOrange", start: "#fbbf24", end: "#ea580c" },
    { id: "gradGreen", start: "#34d399", end: "#059669" },
    { id: "gradBlue", start: "#60a5fa", end: "#2563eb" },
  ];

  // Custom label for inside left (category) or outside if bar is short
  const renderCategoryLabel = (props: LabelProps) => {
    const { x, y, value, height, width } = props;
    const xNum = Number(x);
    const yNum = Number(y);
    const widthNum = Number(width);
    const heightNum = Number(height);
    const threshold = 120; // px
    if (widthNum < threshold) {
      // Render outside, left of the bar
      return (
        <text x={xNum - 8} y={yNum + heightNum / 2 + 5} fill="#fff" fontSize={13} fontWeight="500" alignmentBaseline="middle" textAnchor="end">
          {value}
        </text>
      );
    }
    // Render inside
    return (
      <text x={xNum + 8} y={yNum + heightNum / 2 + 5} fill="#fff" fontSize={13} fontWeight="500" alignmentBaseline="middle">
        {value}
      </text>
    );
  };

  // Custom label for value (right side)
  const renderValueLabel = (props: LabelProps) => {
    const { x, y, value, width, height } = props;
    const xNum = Number(x);
    const yNum = Number(y);
    const widthNum = Number(width);
    const heightNum = Number(height);
    return (
      <text x={xNum + widthNum + 8} y={yNum + heightNum / 2 + 5} fill="#fff" fontSize={13} fontWeight="600" alignmentBaseline="middle">
        {typeof value === 'number' ? formatCurrency(value) : value}
      </text>
    );
  };

  // Helper for donut chart arc
  function describeArc(cx, cy, r, startAngle, endAngle) {
    const polarToCartesian = (cx, cy, r, angle) => {
      const a = ((angle - 90) * Math.PI) / 180.0;
      return {
        x: cx + r * Math.cos(a),
        y: cy + r * Math.sin(a),
      };
    };
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  }

  return (
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-white">Funding Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-10">
        {/* Total Required */}
        {typeof fundingRequirements.totalRequired === 'number' && (
          <div className="flex flex-col items-center mb-6">
            <span className="text-sm text-gray-400">Total Funding Required</span>
            <span className="text-3xl font-bold text-white mt-1">
              {formatCurrency(fundingRequirements.totalRequired)}
            </span>
          </div>
        )}

        {/* Use of Funds */}
        {useOfFundsData.length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-medium text-white mb-4">Use of Funds</h4>
            <div className="flex flex-col items-center justify-center">
              {/* Donut Chart */}
              <div className="relative flex items-center justify-center" style={{ minHeight: 240 }}>
                <svg width={240} height={240} style={{ display: 'block' }}>
                  <defs>
                    {GRADIENT_COLORS.map((gradient) => (
                      <linearGradient key={gradient.id} id={gradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={gradient.start} />
                        <stop offset="100%" stopColor={gradient.end} />
                      </linearGradient>
                    ))}
                  </defs>
                  {(() => {
                    const total = useOfFundsData.reduce((sum, d) => sum + d.amount, 0);
                    const radius = 90;
                    const stroke = 32;
                    const cx = 120;
                    const cy = 120;
                    const gapAngle = 8;
                    let currentAngle = -90;
                    return useOfFundsData.map((entry, idx) => {
                      const valueAngle = (entry.amount / total) * (360 - gapAngle * useOfFundsData.length);
                      const startAngle = currentAngle + gapAngle / 2;
                      const endAngle = startAngle + valueAngle;
                      const path = describeArc(cx, cy, radius, startAngle, endAngle);
                      currentAngle = endAngle + gapAngle / 2;
                      const gradient = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
                      return (
                        <path
                          key={entry.name}
                          d={path}
                          stroke={`url(#${gradient.id})`}
                          strokeWidth={stroke}
                          fill="none"
                          strokeLinecap="round"
                          filter="drop-shadow(0 0 8px #0003)"
                        />
                      );
                    });
                  })()}
                  {/* Center label */}
                  <circle cx={120} cy={120} r={60} fill="#18181b" />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="1.3rem"
                    fontWeight="bold"
                    fill="#e5e7eb"
                    style={{ fontFamily: 'inherit' }}
                  >
                    {formatCurrency(fundingRequirements.totalRequired)}
                    <tspan fontSize="0.9rem" x="50%" dy="2.0em" fill="#aaa">Total</tspan>
                  </text>
                </svg>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {useOfFundsData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full block" style={{ background: `linear-gradient(90deg, ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start}, ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length].end})` }}></span>
                    <span className="text-xs font-semibold" style={{ color: GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start }}>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Funding Stages */}
        {(fundingRequirements.fundingStages || []).length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-medium text-white mb-2">Funding Stages</h4>
            <div className="space-y-4">
              {fundingRequirements.fundingStages.map((stage, index) => (
                <div key={`stage-${index}`} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">{stage.stage}</span>
                    <span className="text-sm text-gray-400">{formatCurrency(stage.amount)}</span>
                  </div>
                  <div className="text-xs text-gray-400">{stage.timeline}</div>
                  <div className="text-sm text-gray-400">{stage.purpose}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Funding Sources */}
        {(fundingRequirements.fundingSources || []).length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-medium text-white mb-2">Potential Funding Sources</h4>
            <div className="space-y-4">
              {fundingRequirements.fundingSources.map((source, index) => (
                <div key={`source-${index}`} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">{source.type}</span>
                    <span className="text-xs text-gray-400">
                      {source.likelihood}% likelihood
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-green-400">Pros:</span>
                      <ul className="space-y-1 mt-1">
                        {(source.pros || []).map((pro, i) => (
                          <li key={`pro-${index}-${i}`} className="text-sm text-gray-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/20" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-red-400">Cons:</span>
                      <ul className="space-y-1 mt-1">
                        {(source.cons || []).map((con, i) => (
                          <li key={`con-${index}-${i}`} className="text-sm text-gray-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/20" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FundingRequirementsCard; 