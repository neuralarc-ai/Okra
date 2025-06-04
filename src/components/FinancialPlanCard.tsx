import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialPlan } from '@/types/oracle';
import { formatCurrency } from '@/lib/utils';
import { RadarChart, Radar, PolarAngleAxis, PolarGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface FinancialPlanCardProps {
  financialPlan?: FinancialPlan;
  currency: string;
}

const GRADIENT_COLORS = [
  { id: "gradPurple", start: "#8b7cf6", end: "#5f3dc4" },
  { id: "gradPink", start: "#FFADDF", end: "#ff3b82" },
  { id: "gradYellow", start: "#FCEC3B", end: "#f59e42" },
  { id: "gradOrange", start: "#fbbf24", end: "#ea580c" },
  { id: "gradGreen", start: "#34d399", end: "#059669" },
  { id: "gradBlue", start: "#60a5fa", end: "#2563eb" },
];

const RADIAL_COLORS = [
  "#8b7cf6", // purple
  "#FFADDF", // pink
  "#FCEC3B", // yellow
  "#fbbf24", // orange
  "#34d399", // green
  "#60a5fa", // blue
];

const RADAR_COLOR = "#8b7cf6"; // Use a visually distinct app color (purple)

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const a = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  };
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
}

const FinancialPlanCard = ({ financialPlan, currency }: FinancialPlanCardProps) => {
  if (!financialPlan) {
    return null;
  }

  // Prepare data for the doughnut chart
  const expenseData = financialPlan.monthlyExpenses?.map((expense) => ({
    category: expense.category,
    value: expense.amount,
  })) || [];
  const total = expenseData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className=" bg-white border-none outline-none">
      <CardContent className="p-0">
        <div className=" p-6 rounded-lg">
          <div className="rounded-[8px] p-6" style={{ backgroundColor: '#E3E2DFBF' }}>
            <CardHeader className="p-0 mb-3">
              <CardTitle className="font-fustat font-medium text-[40px] leading-[69px] tracking-[-0.02em] align-middle text-[#202020] flex items-center gap-3">
                Financial Plan
              </CardTitle>
            </CardHeader>
            
            {/* Startup Costs */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(financialPlan.startupCosts || []).map((cost, index) => (
                  <div key={`startup-${index}`} className="flex items-center justify-between p-4 rounded-[8px] bg-[#C6AEA399] border border-[#000000]/10 shadow-sm">
                    <span className="text-base text-[#000000]  flex items-center px-1 gap-2">
                      {cost.category}
                    </span>
                    <span
                      style={{
                        background: '#9A7D70',
                        borderRadius: '8px',
                        padding: '0.5rem 1.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        border: '4px solid #9A7D70',
                      }}
                    >
                      <span className="text-[#FFFFFF] text-lg font-semibold" style={{background: 'transparent'}}>
                        {formatCurrency(cost.amount, currency)}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      
      <div className="p-6">
        {/* Monthly Expenses Breakdown */}
        {expenseData.length > 0 && (
          <div className="bg-cover bg-center rounded-[8px] p-6" style={{ backgroundColor: '#2B2521' }}>
            <h4 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] align-middle text-white mb-6">Monthly Expenses Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar Chart Card */}
              <div className="bg-[#0000003B] rounded-[8px] p-6 flex flex-col items-center justify-center">
                <div className="w-full max-w-[500px] h-[355px] mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={expenseData}>
                      <defs>
                        <radialGradient id="customRadarGradient" cx="50%" cy="50%" r="80%">
                          <stop offset="0%" stopColor="#262626" stopOpacity="0.5" />
                          <stop offset="30%" stopColor="#3987BE" stopOpacity="0.3" />
                          <stop offset="80%" stopColor="#D48EA3" stopOpacity="0.2" />
                        </radialGradient>
                      </defs>
                      <PolarGrid stroke="#8B8B8BAB" />
                      <PolarAngleAxis dataKey="category" width={100} tick={{ fill: '#8B8B8B', fontSize: 12  }}  />
                      <Radar
                        dataKey="value"
                        fill="url(#customRadarGradient)"
                        fillOpacity={1}
                        stroke="#D48EA3"
                        dot={{ r: 1, fill: '#D48EA3', fillOpacity: 1 }}
                      />
                      <RechartsTooltip
                        cursor={false}
                        contentStyle={{ background: '#ffffff', border: 'none', color: '#202020' }}
                        formatter={(value: number) => formatCurrency(value, currency)}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table Card */}
              <div className="bg-[#0000003B] rounded-[8px] p-6">
                <h4 className="font-['Fustat'] font-normal text-[22px] leading-[49.04px] tracking-[-0.8%] text-center text-[#DCDCDC] mb-7 mt-5">Monthly expenses by category and total</h4>
                <div className="space-y-2">
                  {expenseData.map((expense, idx) => (
                    <div key={expense.category} className="flex justify-between items-center bg-[#2B2521] rounded-[8px] border border-[#FFFFFF25] p-4">
                      <span className="text-white text-sm">{expense.category}</span>
                      <span className="text-white text-sm font-semibold">{formatCurrency(expense.value, currency)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center bg-[#FFFFFF1A] rounded-[8px] border border-[#FFFFFF25] p-4 mt-4">
                    <span className="text-white text-base font-bold">Total</span>
                    <span className="text-white text-base font-bold">{formatCurrency(total, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#E3E2DFBF] p-5 rounded-[8px] mt-4">
          {/* Break-even Analysis */}
          {financialPlan.breakEvenAnalysis && (
            <div>
              <h4 className="font-['Fustat'] font-medium text-[40px] leading-[69px] tracking-[-2%] align-middle text-[#202020] mb-3">Break-even Analysis</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Time to Break-even Card */}
                <div className="relative rounded-[8px] overflow-hidden" style={{ backgroundImage: "url('/Effect 1.png')", backgroundSize: 'cover' }}>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-5">
                      <img src="/icons/hourglass.svg" alt="Time" className="w-10 h-10" />
                      <span className="text-[22px] font-normal text-[#202020]">Time to Break-even</span>
                    </div>
                    <div className="bg-[#F8F8F773] rounded-[8px] px-8 py-10 text-center">
                      <span className="font-['Fustat'] font-normal text-[40px] leading-6 tracking-[-1%] text-center align-middle text-gray-900">
                        {financialPlan.breakEvenAnalysis.timeToBreakEven}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly Break-even Point Card */}
                <div className="relative rounded-[8px] overflow-hidden" style={{ backgroundImage: "url('/Effect 1.png')", backgroundSize: 'cover' }}>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-5">
                      <img src="/icons/calender.svg" alt="Money" className="w-10 h-10" />
                      <span className="text-[22px] font-normal text-[#202020]">Monthly Break-even Point</span>
                    </div>
                    <div className="bg-[#F8F8F773] rounded-[8px] px-8 py-10 mb-3 text-center">
                      <span className="font-['Fustat'] font-normal text-[40px] leading-6 tracking-[-1%] text-center align-middle text-gray-900">{formatCurrency(financialPlan.breakEvenAnalysis.monthlyBreakEvenPoint, currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <span className="text-[20px]  text-[#202020]  font-semibold">Key Assumptions:</span>
                <ul className="space-y-1 mt-6">
                  {(financialPlan.breakEvenAnalysis.assumptions || []).map((assumption, index) => (
                    <li key={`assumption-${index}`} className="text-sm text-[#0000007D] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0000007D]" />
                      {assumption}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Projected Profit Margin */}
          {typeof financialPlan.projectedProfitMargin === 'number' && (
            <div 
              className="flex justify-between items-center rounded-[8px] border border-[#202020]/10 px-6 py-8 mt-6 overflow-hidden relative"
              style={{
                backgroundImage: "url('/card-bg-4.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <span className="text-[32px] text-[#202020] font-semibold">Projected Profit Margin</span>
              <span className="text-[40px] font-semibold text-[#202020] bg-[#F8F8F773] px-4 py-1 rounded-[8px]">
                {financialPlan.projectedProfitMargin}%
              </span>
            </div>
          )}
        </div>
      </div>
      </CardContent>
    </Card>
  );
};

export default FinancialPlanCard; 