import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FundingRequirements } from '@/types/oracle';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from "lucide-react";

interface FundingRequirementsCardProps {
  fundingRequirements?: FundingRequirements;
  currency: string;
}

const FundingRequirementsCard = ({ fundingRequirements, currency }: FundingRequirementsCardProps) => {
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
    <div>
      <Card className="bg-[#1E342F] rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <TrendingUp className="h-6 w-6 text-white" /> Funding Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-10 p-6">
          {/* Total Required */}
          {typeof fundingRequirements.totalRequired === 'number' && (
            <div className="bg-[#FFFFFF0D] rounded-xl p-6 flex items-center justify-between mb-6">
              <span className="text-base text-white font-bold">Total Funding Required</span>
              <span className="text-3xl font-bold text-[#202020] bg-gradient-to-r from-[#7B8B85] to-[#4DE1E6] px-6 py-2 rounded-full border-0 shadow-sm">
                {formatCurrency(fundingRequirements.totalRequired, currency)}
              </span>
            </div>
          )}

          {/* Use of Funds */}
          {useOfFundsData.length > 0 && (
            <div className="bg-[#FFFFFF0D] rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-tight">Use of Funds</h4>
              <div className="flex flex-col items-center justify-center">
                <div className="w-full" style={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={useOfFundsData}
                      layout="vertical"
                      margin={{
                        left: 0,
                        right: 60,
                        top: 20,
                        bottom: 20,
                      }}
                    >
                      <defs>
                        <linearGradient id="customBarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#293E39" />
                          <stop offset="30%" stopColor="#B3BBAD" />
                          <stop offset="100%" stopColor="#97A487" />
                        </linearGradient>
                      </defs>
                      <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fill: 'white', fontSize: 14 }}
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
                          background: '#ffffff',
                          border: 'none',
                          color: '#202020',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                        formatter={(value: number) => formatCurrency(value, currency)}
                      />
                      <Bar
                        dataKey="value"
                        layout="vertical"
                        radius={5}
                        label={{
                          position: 'right',
                          fill: 'white',
                          fontSize: 14,
                          fontWeight: 500,
                          formatter: (value: number) => formatCurrency(value, currency)
                        }}
                      >
                        {useOfFundsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="url(#customBarGradient)" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {useOfFundsData.map((entry, idx) => (
                    <div key={entry.name} className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full shadow-sm border border-[#202020]/10">
                      <span
                        className="w-3 h-3 rounded-full block"
                        style={{ background: `linear-gradient(90deg, ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start}, ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length].end})` }}
                      ></span>
                      <span className="text-xs font-semibold text-[#202020]">
                        {entry.name} ({formatCurrency(entry.value, currency)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Funding Stages */}
      {(fundingRequirements.fundingStages || []).length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-[#202020] mb-4 flex items-center gap-2 tracking-tight">Funding Stages</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fundingRequirements.fundingStages.map((stage, index) => (
              <div key={`stage-${index}`} className="p-4 rounded-xl bg-[#CFD2D4] border border-[#202020]/10 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-semibold text-[#202020]">{stage.stage}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[#202020] font-bold text-sm border border-[#202020]/20">{formatCurrency(stage.amount, currency)}</span>
                </div>
                <div className="text-xs text-[#202020] mb-1">{stage.timeline}</div>
                <div className="text-sm text-[#202020]">{stage.purpose}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funding Sources */}
      {(fundingRequirements.fundingSources || []).length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-[#202020] mb-4 flex items-center gap-2 tracking-tight">Potential Funding Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fundingRequirements.fundingSources.map((source, index) => (
              <div key={`source-${index}`} className="p-4 rounded-xl bg-[#CFD2D4] border border-[#202020]/10 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-semibold text-[#202020]">{source.type}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[#202020] font-bold text-xs border border-[#202020]/20">{source.likelihood}% likelihood</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-black font-semibold">Pros:</span>
                    <ul className="space-y-1 mt-1">
                      {(source.pros || []).map((pro, i) => (
                        <li key={`pro-${index}-${i}`} className="text-sm text-[#202020] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#202020]/20" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-black font-semibold">Cons:</span>
                    <ul className="space-y-1 mt-1">
                      {(source.cons || []).map((con, i) => (
                        <li key={`con-${index}-${i}`} className="text-sm text-[#202020] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#202020]/20" />
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
    </div>
  );
};

export default FundingRequirementsCard;