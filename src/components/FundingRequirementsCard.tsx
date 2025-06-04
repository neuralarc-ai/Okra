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
      <Card 
        className="rounded-[8px] p-6 overflow-hidden relative"
        style={{
          backgroundImage: "url('/card-bg-5.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#1E342F', // Fallback color
          backgroundBlendMode: 'overlay'
        }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <TrendingUp className="h-6 w-6 text-white" /> Funding Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-10 p-6">
          {/* Total Required */}
          {typeof fundingRequirements.totalRequired === 'number' && (
            <div className="bg-[#FFFFFF]/5 rounded-xl p-6 flex items-center justify-between mb-6">
              <span className="text-base text-white font-semibold">Total Funding Required</span>
              <span className="text-3xl font-bold text-[#202020] bg-gradient-to-r from-[#C6AEA3] to-[#8EE3F0] px-16 py-2 rounded-full ">
                {formatCurrency(fundingRequirements.totalRequired, currency)}
              </span>
            </div>
          )}

          {/* Use of Funds */}
          {useOfFundsData.length > 0 && (
            <div className="bg-[#FFFFFF0D] rounded-[8px] p-6">
              <h4 className="text-[26px] font-semibold text-white mb-4 flex items-center gap-2 tracking-tight">Use of Funds</h4>
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
                        tick={{ fill: 'white', fontSize: 14, }}
                        width={150}
                        className="max-w-[100px]"
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
                    <div key={entry.name} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full shadow-sm border border-[#202020]/10">
                      
                      <span className="text-xs font-semibold text-[#FFFFFF]">
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
        <div 
          className="mt-8 rounded-[8px] p-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('/card-bg-6.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-[#D0C3B5]/55 "></div>
          <div className="relative z-10">
            <h4 className="font-fustat font-medium text-[40px] leading-[69px] tracking-[-0.02em] align-middle text-[#202020] mb-6">Funding Stages</h4>
            <div className="flex flex-col gap-6">
              {fundingRequirements.fundingStages.map((stage, index) => (
                <div 
                  key={`stage-${index}`} 
                  className="relative"
                >
                  <div className="flex flex-col gap-2 p-4 bg-[#F8F8F899] rounded-lg">
                    <div className="flex justify-between items-center">
                      <h5 className="font-fustat font-medium text-[26px] leading-[69px] tracking-[-0.02em] align-middle text-[#202020]">{stage.stage}</h5>
                      <span className="text-3xl font-bold text-[#FFFFFF] bg-gradient-to-r from-[#79685D] to-[#2B2521] px-12 py-3 rounded-full ">
                        {formatCurrency(stage.amount, currency)}
                      </span>
                    </div>
                    <div className="text-[16px] text-[#202020]">{stage.timeline}</div>
                    <div className="text-[16px] text-[#202020] leading-5 mt-1">{stage.purpose}</div>
                  </div>
                  {index < (fundingRequirements.fundingStages?.length || 0) - 1 && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#8B8B8B]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Funding Sources */}
      {(fundingRequirements.fundingSources || []).length > 0 && (
        <div className="mt-8">
          <h4 className="font-fustat font-medium text-[40px] leading-[69px] tracking-[-0.02em] align-middle text-[#202020] mb-6">Potential Funding Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fundingRequirements.fundingSources.map((source, index) => (
              <div 
                key={`source-${index}`}
                className="relative p-6 rounded-[8px] overflow-hidden"
                style={{
                  backgroundImage: "url('/card-bg-7.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="absolute inset-0 bg-[#FFFFFF]/20"></div>
                <div className="relative z-10 bg-[#FFFFFF59] p-6 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                    <h5 className="text-[24px] font-fustat font-medium text-[#202020] break-words">{source.type}</h5>
                    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#332C27] to-[#332C27] text-white text-sm font-medium whitespace-nowrap self-start sm:self-auto">
                      {source.likelihood}% likelihood
                    </span>
                  </div>
                  <div className="w-full h-[1.5px] bg-[#202020]/10 mb-4"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pros Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2">
                        <span className="text-2xl font-semibold text-[#028242] tracking-tight">Pros</span>
                      </div>
                      <ul className="space-y-2 pl-1.5">
                        {(source.pros || []).map((pro, i) => (
                          <li key={`pro-${index}-${i}`} className="flex items-start gap-3 group">
                            <div className="w-2 h-2 rounded-full bg-[#028242] mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                            <span className="text-[17px] leading-relaxed text-gray-800">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Cons Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-1">
                        <span className="text-2xl font-semibold text-[#A91414] tracking-tight">Cons</span>
                      </div>
                      <ul className="space-y-2 pl-1.5">
                        {(source.cons || []).map((con, i) => (
                          <li key={`con-${index}-${i}`} className="flex items-start gap-3 group">
                            <div className="w-2 h-2 rounded-full bg-[#A91414] mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                            <span className="text-[17px] leading-relaxed text-gray-800">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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