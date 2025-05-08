import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FundingRequirements } from '@/types/oracle';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from "lucide-react";

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
    value: item.amount,
    priority: item.priority
  }));

  const GRADIENT_COLORS = [
    { id: "gradGreen1", start: "#dcfce7", end: "#22c55e" },     // Very light green to medium green
    { id: "gradGreen2", start: "#bbf7d0", end: "#16a34a" },     // Pale green to green
    { id: "gradGreen3", start: "#86efac", end: "#15803d" },     // Mint to emerald
    { id: "gradGreen4", start: "#a7f3d0", end: "#059669" },     // Mint to teal
    { id: "gradGreen5", start: "#d1fae5", end: "#10b981" },     // Light mint to emerald
    { id: "gradGreen6", start: "#ecfdf5", end: "#34d399" },     // Almost white to teal
  ];

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
              <div className="w-full" style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={useOfFundsData}
                    layout="vertical"
                    margin={{
                      left: 0,
                      right: 20,
                      top: 20,
                      bottom: 20,
                    }}
                  >
                    <defs>
                      {GRADIENT_COLORS.map((gradient, idx) => (
                        <linearGradient key={gradient.id} id={gradient.id} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={gradient.start} />
                          <stop offset="100%" stopColor={gradient.end} />
                        </linearGradient>
                      ))}
                    </defs>
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tick={{ fill: '#fff', fontSize: 12 }}
                      width={150}
                    />
                    <XAxis
                      dataKey="value"
                      type="number"
                      hide
                    />
                    <Tooltip
                      cursor={false}
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        color: '#1a1a1a',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar
                      dataKey="value"
                      layout="vertical"
                      radius={5}
                      label={{
                        position: 'right',
                        fill: '#fff',
                        fontSize: 12,
                        fontWeight: 500,
                        formatter: (value: number) => formatCurrency(value)
                      }}
                    >
                      {useOfFundsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#${GRADIENT_COLORS[index % GRADIENT_COLORS.length].id})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {useOfFundsData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full block" 
                      style={{ background: `linear-gradient(90deg, ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start}, ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length].end})` }}
                    ></span>
                    <span className="text-xs font-semibold" style={{ color: GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start }}>
                      {entry.name} ({formatCurrency(entry.value)})
                    </span>
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