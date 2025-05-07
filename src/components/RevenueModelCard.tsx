import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueModel } from '@/types/oracle';

interface RevenueModelCardProps {
  revenueModel?: RevenueModel;
}

const COLORS =[
    "#8b7cf6", // purple
    "#FFADDF", // pink
    "#FCEC3B", // yellow
    "#fbbf24", // orange
    "#34d399", // green
    "#60a5fa", // blue
  ];

const GRADIENT_COLORS = [
  { id: "gradPurple", start: "#8b7cf6", end: "#5f3dc4" },
  { id: "gradPink", start: "#FFADDF", end: "#ff3b82" },
  { id: "gradYellow", start: "#FCEC3B", end: "#f59e42" },
  { id: "gradOrange", start: "#fbbf24", end: "#ea580c" },
  { id: "gradGreen", start: "#34d399", end: "#059669" },
  { id: "gradBlue", start: "#60a5fa", end: "#2563eb" },
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

const RevenueModelCard = ({ revenueModel }: RevenueModelCardProps) => {
  if (!revenueModel) return null;

  const pieData = revenueModel.primaryStreams.map(stream => ({
    name: stream.name,
    value: stream.percentage,
    color: stream.scalability === 'high' ? COLORS[0] : stream.scalability === 'medium' ? COLORS[1] : COLORS[2],
    recurringType: stream.recurringType
  }));
  const total = pieData.reduce((sum, d) => sum + d.value, 0);
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
        <CardTitle className="text-xl font-medium text-white">Revenue Model</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue Streams Distribution */}
        <div>
          <h4 className="text-sm font-medium text-white mb-4">Revenue Streams</h4>
          <div className="h-[260px] flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center" style={{ minHeight: 2 * (radius + stroke) }}>
              <svg width={2 * (radius + stroke)} height={2 * (radius + stroke)} style={{ display: 'block' }}>
                <defs>
                  {GRADIENT_COLORS.map((gradient) => (
                    <linearGradient key={gradient.id} id={gradient.id} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={gradient.start} />
                      <stop offset="100%" stopColor={gradient.end} />
                    </linearGradient>
                  ))}
                </defs>
                {pieData.map((entry, idx) => {
                  const valueAngle = (entry.value / total) * (chartCircum - gapAngle * pieData.length);
                  const startAngle = currentAngle + gapAngle / 2;
                  const endAngle = startAngle + valueAngle;
                  const path = describeArc(cx, cy, radius, startAngle, endAngle);
                  currentAngle = endAngle + gapAngle / 2;
                  const gradient = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
                  return (
                    <path
                      key={entry.name}
                      d={path}
                      stroke={`url(#${gradient.id})`}
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
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="2.6rem"
                  fontWeight="bold"
                  fill="#e5e7eb"
                  style={{ fontFamily: 'inherit' }}
                >
                  {total}
                  <tspan fontSize="1.1rem" x="50%" dy="2.0em" fill="#aaa">Total</tspan>
                </text>
              </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {pieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start }}></span>
                  <span className="text-xs font-semibold" style={{ color: GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start }}>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {revenueModel.primaryStreams.map((stream, index) => (
              <div key={`stream-${index}`} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: GRADIENT_COLORS[index % GRADIENT_COLORS.length].start }}
                  />
                  <span className="text-sm font-semibold" style={{ color: GRADIENT_COLORS[index % GRADIENT_COLORS.length].start }}>{stream.name}</span>
                </div>
                <div className="text-xs text-gray-400 pl-4">
                  {stream.recurringType} • {stream.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Strategy */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Growth Strategy</h4>
          <div className="space-y-3">
            {revenueModel.growthStrategy.map((strategy, index) => (
              <div key={`strategy-${index}`} className="p-3 border border-white/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">{strategy.phase}</span>
                  <span className="text-xs text-gray-400">{strategy.timeline}</span>
                </div>
                <ul className="space-y-1 mb-2">
                  {strategy.tactics.map((tactic, i) => (
                    <li key={`tactic-${index}-${i}`} className="text-sm text-gray-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      {tactic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Key Metrics</h4>
          <div className="grid gap-2">
            {revenueModel.metrics.map((metric, index) => (
              <div key={`metric-${index}`} className="flex justify-between items-center p-2 border border-white/5 rounded-lg">
                <div>
                  <div className="text-sm text-white">{metric.name}</div>
                  <div className="text-xs text-gray-400">{metric.timeframe}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">{metric.target}</div>
                  <div className="text-xs text-gray-400">Target</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueModelCard; 