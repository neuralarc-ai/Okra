import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FundingRequirements } from '@/types/oracle';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList, Tooltip as RechartsTooltip, ResponsiveContainer, LabelProps, Cell } from 'recharts';

interface FundingRequirementsCardProps {
  fundingRequirements?: FundingRequirements;
}

// Purple gradient from dark to light
const PURPLE_GRADIENT = [
  '#7C3AED', // darkest
  '#8B5CF6',
  '#A78BFA',
  '#C4B5FD',
  '#DDD6FE',
  '#EDE9FE', // lightest
];

const FundingRequirementsCard = ({ fundingRequirements }: FundingRequirementsCardProps) => {
  if (!fundingRequirements) {
    return null;
  }

  // Prepare data for the bar chart, sorted descending by amount
  const useOfFundsData = [...(fundingRequirements.useOfFunds || [])]
    .sort((a, b) => b.amount - a.amount)
    .map((item, idx) => ({
      name: item.category,
      amount: item.amount,
      priority: item.priority,
      color: PURPLE_GRADIENT[idx % PURPLE_GRADIENT.length],
    }));

  // Custom label for inside right, truncate if too long
  const renderCategoryLabel = (props: LabelProps) => {
    const { x, y, value, width, height } = props;
    const xNum = Number(x);
    const yNum = Number(y);
    const widthNum = Number(width);
    const heightNum = Number(height);
    const maxLabelWidth = widthNum - 24; // px, more padding from right
    let label = String(value);
    // Truncate if too long
    const context = document.createElement('canvas').getContext('2d');
    if (context) {
      context.font = '500 15px sans-serif';
      while (context.measureText(label).width > maxLabelWidth && label.length > 3) {
        label = label.slice(0, -2) + '...';
      }
    }
    return (
      <text
        x={xNum + widthNum - 12}
        y={yNum + heightNum / 2}
        fill="#fff"
        fontSize={15}
        fontWeight="600"
        alignmentBaseline="middle"
        textAnchor="end"
        style={{ pointerEvents: 'none', dominantBaseline: 'middle' }}
      >
        {label}
      </text>
    );
  };

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
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={useOfFundsData}
                  layout="vertical"
                  barCategoryGap={0}
                  margin={{ right: 16, left: 0, top: 0, bottom: 0 }}
                >
                  <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#222" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={false}
                    hide
                  />
                  <XAxis dataKey="amount" type="number" hide />
                  <RechartsTooltip
                    cursor={false}
                    contentStyle={{ background: '#7d8edc', border: 'none', color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar
                    dataKey="amount"
                    layout="vertical"
                    radius={6}
                    isAnimationActive={false}
                    barSize={38}
                  >
                    {useOfFundsData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                    <LabelList dataKey="name" position="insideRight" content={renderCategoryLabel} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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