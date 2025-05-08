import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialPlan } from '@/types/oracle';
import { formatCurrency } from '@/lib/utils';
import { RadarChart, Radar, PolarAngleAxis, PolarGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface FinancialPlanCardProps {
  financialPlan?: FinancialPlan;
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

const FinancialPlanCard = ({ financialPlan }: FinancialPlanCardProps) => {
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
        <CardTitle className="text-xl font-medium text-white">Financial Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Startup Costs */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Initial Startup Costs</h4>
          <div className="space-y-2">
            {(financialPlan.startupCosts || []).map((cost, index) => (
              <div key={`startup-${index}`} className="flex justify-between items-center text-sm">
                <span className="text-sm text-gray-400">{cost.category}</span>
                <span className="text-sm text-white">{formatCurrency(cost.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Expenses Breakdown */}
        {expenseData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Monthly Expenses Breakdown</h4>
            <div className="w-full max-w-[800px] mx-auto flex flex-col items-center justify-center" style={{ overflow: 'visible' }}>
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
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-2 text-center">
                <span className="text-lg font-bold text-white">{formatCurrency(total)}</span>
                <span className="block text-xs text-gray-400">Total Monthly Expenses</span>
              </div>
            </div>
          </div>
        )}

        {/* Break-even Analysis */}
        {financialPlan.breakEvenAnalysis && (
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Break-even Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Time to Break-even</span>
                <span className="text-sm text-white">{financialPlan.breakEvenAnalysis.timeToBreakEven}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Monthly Break-even Point</span>
                <span className="text-sm text-white">{formatCurrency(financialPlan.breakEvenAnalysis.monthlyBreakEvenPoint)}</span>
              </div>
            </div>
            <div className="mt-2">
              <strong className="text-xs text-gray-400">Key Assumptions:</strong>
              <ul className="space-y-1 mt-1">
                {(financialPlan.breakEvenAnalysis.assumptions || []).map((assumption, index) => (
                  <li key={`assumption-${index}`} className="text-sm text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/20" />
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Projected Profit Margin */}
        {typeof financialPlan.projectedProfitMargin === 'number' && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Projected Profit Margin</span>
            <span className="text-lg font-semibold text-white">
              {financialPlan.projectedProfitMargin}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialPlanCard; 