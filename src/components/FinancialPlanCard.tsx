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
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <RadarChart width={24} height={24} className="text-purple-300" /> Financial Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Startup Costs */}
        <div>
          <h4 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2 tracking-tight">Initial Startup Costs</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(financialPlan.startupCosts || []).map((cost, index) => (
              <div key={`startup-${index}`} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-purple-400/10 shadow-sm">
                <span className="text-base text-gray-300 flex items-center gap-2">
                  {/* Optionally, you could add an icon here based on category */}
                  {cost.category}
                </span>
                <span className="px-4 py-1 rounded-full bg-purple-400/10 text-purple-300 font-bold text-sm shadow-sm border border-purple-400/20">
                  {formatCurrency(cost.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Expenses Breakdown */}
        {expenseData.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2 tracking-tight">Monthly Expenses Breakdown</h4>
            <div className="w-full max-w-[800px] mx-auto flex flex-col md:flex-row items-center justify-center gap-8" style={{ overflow: 'visible' }}>
              <div className="flex-1 min-w-[260px]">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={expenseData}>
                    <PolarGrid stroke="#222" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#fff', fontSize: 12, fontWeight: 500 }} />
                    <Radar
                      dataKey="value"
                      fill={RADAR_COLOR}
                      fillOpacity={0.6}
                      stroke={RADAR_COLOR}
                      dot={{ r: 4, fill: RADAR_COLOR, fillOpacity: 1 }}
                    />
                    <RechartsTooltip
                      cursor={false}
                      contentStyle={{ background: '#18181b', border: 'none', color: '#f9fafb' }}
                      formatter={(value: number) => formatCurrency(value, currency)}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 min-w-[220px]">
                <div className="rounded-xl bg-white/5 border border-purple-400/10 p-0 overflow-hidden">
                  <table className="w-full text-left">
                    <tbody>
                      {expenseData.map((expense, idx) => (
                        <tr key={expense.category} className="border-b border-white/10 last:border-b-0">
                          <td className="px-5 py-3 text-gray-300 text-sm">{expense.category}</td>
                          <td className="px-5 py-3 text-white text-sm font-semibold text-right">{formatCurrency(expense.value, currency)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="px-5 py-3 text-purple-300 text-base font-bold">Total</td>
                        <td className="px-5 py-3 text-white text-base font-bold text-right">{formatCurrency(total, currency)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="block text-xs text-gray-400">Monthly expenses by category and total</span>
            </div>
          </div>
        )}

        {/* Break-even Analysis */}
        {financialPlan.breakEvenAnalysis && (
          <div>
            <h4 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2 tracking-tight">Break-even Analysis</h4>
            <div className="rounded-xl bg-white/5 border border-purple-400/10 p-0 overflow-hidden mb-2">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="px-5 py-3 text-gray-300 text-sm">Time to Break-even</td>
                    <td className="px-5 py-3 text-white text-sm font-semibold text-right">{financialPlan.breakEvenAnalysis.timeToBreakEven}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-gray-300 text-sm">Monthly Break-even Point</td>
                    <td className="px-5 py-3 text-white text-sm font-semibold text-right">{formatCurrency(financialPlan.breakEvenAnalysis.monthlyBreakEvenPoint, currency)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-400 font-semibold">Key Assumptions:</span>
              <ul className="space-y-1 mt-1">
                {(financialPlan.breakEvenAnalysis.assumptions || []).map((assumption, index) => (
                  <li key={`assumption-${index}`} className="text-sm text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400/20" />
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Projected Profit Margin */}
        {typeof financialPlan.projectedProfitMargin === 'number' && (
          <div className="flex justify-between items-center rounded-xl bg-white/5 border border-purple-400/10 px-5 py-4 mt-2">
            <span className="text-base text-purple-300 font-bold">Projected Profit Margin</span>
            <span className="text-lg font-bold text-white bg-purple-400/10 px-4 py-1 rounded-full">
              {financialPlan.projectedProfitMargin}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialPlanCard; 