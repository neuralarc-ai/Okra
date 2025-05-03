import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialPlan } from '@/types/oracle';
import { formatCurrency } from '@/lib/utils';

interface FinancialPlanCardProps {
  financialPlan?: FinancialPlan;
}

const COLORS = [
    "#8b7cf6", // purple
    "#FFADDF", // pink
    "#FCEC3B", // yellow
    "#fbbf24", // orange
    "#34d399", // green
    "#60a5fa", // blue
  ];

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
  const expenseData = financialPlan.monthlyExpenses?.map((expense, idx) => ({
    name: expense.category,
    value: expense.amount,
    color: COLORS[idx % COLORS.length],
  })) || [];
  const total = expenseData.reduce((sum, d) => sum + d.value, 0);
  const radius = 90;
  const stroke = 22;
  const gapAngle = 16;
  const cx = radius + stroke;
  const cy = radius + stroke;
  const chartCircum = 360;
  let currentAngle = -90;

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
            <div className="h-[260px] flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center" style={{ minHeight: 2 * (radius + stroke) }}>
                <svg width={2 * (radius + stroke)} height={2 * (radius + stroke)} style={{ display: 'block' }}>
                  {expenseData.map((entry, idx) => {
                    const valueAngle = (entry.value / total) * (chartCircum - gapAngle * expenseData.length);
                    const startAngle = currentAngle + gapAngle / 2;
                    const endAngle = startAngle + valueAngle;
                    const path = describeArc(cx, cy, radius, startAngle, endAngle);
                    currentAngle = endAngle + gapAngle / 2;
                    return (
                      <path
                        key={entry.name}
                        d={path}
                        stroke={entry.color}
                        strokeWidth={stroke}
                        fill="none"
                        strokeLinecap="round"
                        filter="drop-shadow(0 0 8px #0003)"
                      />
                    );
                  })}
                  {/* Center label */}
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="2.0rem"
                    fontWeight="bold"
                    fill="#e5e7eb"
                    style={{ fontFamily: 'inherit' }}
                  >
                    {formatCurrency(total)}
                    <tspan fontSize="1.1rem" x="50%" dy="2.0em"  fill="#aaa">Total</tspan>
                  </text>
                </svg>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {expenseData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: entry.color }}></span>
                    <span className="text-xs text-gray-400">{entry.name}</span>
                  </div>
                ))}
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