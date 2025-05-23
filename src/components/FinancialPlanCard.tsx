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
    <Card className="bg-[#FFFFFF] shadow-lg">
      <CardHeader>
        <CardTitle className="text-[40px] font-bold text-[#202020] flex items-center gap-3 tracking-tight">
           Financial Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Startup Costs */}
        <div>
          <h4 className="text-lg font-bold text-[#202020] mb-3 flex items-center gap-2 tracking-tight">Initial Startup Costs</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(financialPlan.startupCosts || []).map((cost, index) => (
              <div key={`startup-${index}`} className="flex items-center justify-between p-4 rounded-[4px] bg-[#CFD2D4] border border-[#000000]/10 shadow-sm">
                <span className="text-base text-[#000000] flex items-center gap-2">
                  {/* Optionally, you could add an icon here based on category */}
                  {cost.category}
                </span>
                <span
                  style={{
                    background: 'linear-gradient(90deg, #D0C5C0 0%, #CEF0F5 100%)',
                    borderRadius: '100px',
                    padding: '0.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    border: '4px solid linear-gradient(90deg, #D0C5C0 0%, #CEF0F5 100%)',
    
                  }}
                >
                  <span className="text-[#202020] text-lg font-bold" style={{background: 'transparent'}}>
                    {formatCurrency(cost.amount, currency)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Expenses Breakdown */}
        {expenseData.length > 0 && (
          <div className="bg-[#2B2521] rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2 tracking-tight">Monthly Expenses Breakdown</h4>
            <div className="w-full  mx-auto flex flex-col items-center justify-center">
              <div className="w-full bg-[#FFFFFF0D]  rounded-xl p-6 flex flex-col md:flex-row items-center justify-center gap-8" style={{ overflow: 'visible' }}>
                <div className="flex-1 min-w-[260px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={expenseData}>
                      <defs>
                        <radialGradient id="customRadarGradient" cx="50%" cy="50%" r="80%">
                          <stop offset="0%" stopColor="#262626" stopOpacity="0.5" />
                          <stop offset="50%" stopColor="#3987BE" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#D48EA3" stopOpacity="0.2" />
                        </radialGradient>
                      </defs>
                      <PolarGrid stroke="#8B8B8B" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#fff', fontSize: 12, fontWeight: 500 }} />
                      <Radar
                        dataKey="value"
                        fill="url(#customRadarGradient)"
                        fillOpacity={1}
                        stroke="#D48EA3"
                        dot={{ r: 4, fill: '#D48EA3', fillOpacity: 1 }}
                      />
                      <RechartsTooltip
                        cursor={false}
                        contentStyle={{ background: '#ffffff', border: 'none', color: '#202020' }}
                        formatter={(value: number) => formatCurrency(value, currency)}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 min-w-[220px]">
                  <div className="rounded-xl  border border-[#8B8B8B] p-0 overflow-hidden">
                    <table className="w-full text-left">
                      <tbody>
                        {expenseData.map((expense, idx) => (
                          <tr key={expense.category} className="border-b border-[#8B8B8B] last:border-b-0">
                            <td className="px-5 py-3 text-white text-sm">{expense.category}</td>
                            <td className="px-5 py-3 text-white text-sm font-semibold text-right">{formatCurrency(expense.value, currency)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="px-5 py-3 text-white text-base font-bold">Total</td>
                          <td className="px-5 py-3 text-white text-base font-bold text-right">{formatCurrency(total, currency)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-6 w-full flex justify-center">
                <span className="block text-2xl font-semibold text-white text-center">Monthly expenses by category and total</span>
              </div>
            </div>
          </div>
        )}

        {/* Break-even Analysis */}
        {financialPlan.breakEvenAnalysis && (
          <div>
            <h4 className="text-lg font-bold text-[#202020] mb-3 flex items-center gap-2 tracking-tight">Break-even Analysis</h4>
            <div className="rounded-xl overflow-hidden mb-2">
              <table className="w-full text-left">
                <tbody>
                  <tr className="bg-[#D8DCDF]">
                    <td className="px-5 py-3 text-sm" style={{ color: '#0000007D' }}>Time to Break-even</td>
                    <td className="px-5 py-3 text-sm font-semibold text-right" style={{ color: '#000000' }}>{financialPlan.breakEvenAnalysis.timeToBreakEven}</td>
                  </tr>
                  <tr className="bg-[#D8DCDF]">
                    <td className="px-5 py-3 text-sm" style={{ color: '#0000007D' }}>Monthly Break-even Point</td>
                    <td className="px-5 py-3 text-sm font-semibold text-right" style={{ color: '#000000' }}>{formatCurrency(financialPlan.breakEvenAnalysis.monthlyBreakEvenPoint, currency)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <span className="text-xs text-[#202020] font-semibold">Key Assumptions:</span>
              <ul className="space-y-1 mt-1">
                {(financialPlan.breakEvenAnalysis.assumptions || []).map((assumption, index) => (
                  <li key={`assumption-${index}`} className="text-sm text-[#202020] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#202020]/20" />
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Projected Profit Margin */}
        {typeof financialPlan.projectedProfitMargin === 'number' && (
          <div className="flex justify-between items-center rounded-xl bg-[#A8B0B8] border border-[#202020]/10 px-5 py-4 mt-2">
            <span className="text-base text-[#202020] font-bold">Projected Profit Margin</span>
            <span className="text-lg font-bold text-[#202020] bg-white/10 px-4 py-1 rounded-full">
              {financialPlan.projectedProfitMargin}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialPlanCard; 