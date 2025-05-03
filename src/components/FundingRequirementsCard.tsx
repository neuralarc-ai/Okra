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
                    contentStyle={{ background: '#1a1a1a', border: 'none', color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar
                    dataKey="amount"
                    layout="vertical"
                    radius={6}
                    fill="#4ade80"
                    isAnimationActive={false}
                  >
                    <LabelList dataKey="name" position="insideLeft" content={renderCategoryLabel} />
                    {/* <LabelList dataKey="amount" position="right" content={renderValueLabel} /> */}
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