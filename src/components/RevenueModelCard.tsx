import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueModel } from '@/types/oracle';
import { ChevronDown, ChevronUp, Target, TrendingUp, Users, BarChart3, AlertCircle, CheckCircle2, XCircle, Calendar, Users2, ArrowUpRight, ArrowDownRight, Lightbulb, Shield, Zap, DollarSign, LineChart, PieChart, Activity, TrendingDown, Building2, Globe, Store } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface RevenueModelCardProps {
  revenueModel?: RevenueModel;
  currency: string;
}

const COLORS = [
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

// Helper to format metric values with units
const formatMetricValue = (name: string, value: number | string, currency: string = 'INR') => {
  const lower = name.toLowerCase();
  if (lower.includes('tvl') || lower.includes('revenue') || lower.includes('locked') || lower.includes('arpu') || lower.includes('amount') || lower.includes('profit')) {
    // Treat as currency
    return formatCurrency(Number(value), currency);
  }
  if (lower.includes('user')) {
    return `${value} users`;
  }
  if (lower.includes('audience')) {
    return `${value} people`;
  }
  if (lower.includes('rate') || lower.includes('growth')) {
    return `${value}%`;
  }
  return value;
};

const RevenueModelCard = ({ revenueModel, currency }: RevenueModelCardProps) => {
  const [expandedStream, setExpandedStream] = useState<string | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

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

  const renderDetailItem = (icon: React.ReactNode, title: string, content: string | string[]) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;
    
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-gray-400">
          {icon}
          <span className="text-xs font-medium">{title}</span>
        </div>
        {Array.isArray(content) ? (
          <ul className="list-disc list-inside space-y-1">
            {content.map((item, idx) => (
              <li key={idx} className="text-xs text-white/80 ml-4">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-white/80 ml-6">{content}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-white flex items-center gap-3 tracking-tight">
          <PieChart className="h-6 w-6 text-yellow-300" /> Revenue Model
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Market Analysis Section */}
        {revenueModel.marketAnalysis && (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2 tracking-tight"><BarChart3 className="h-5 w-5 text-blue-300" /> Market Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Market Metrics */}
              <div className="rounded-2xl bg-white/5 border border-blue-400/10 p-0 overflow-hidden">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="px-5 py-3 flex items-center gap-2 text-blue-300 font-semibold text-sm"><DollarSign className="h-4 w-4" /> TAM</td>
                      <td className="px-5 py-3 text-white text-sm font-semibold">{revenueModel.marketAnalysis?.totalAddressableMarket ?? 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="px-5 py-3 flex items-center gap-2 text-green-300 font-semibold text-sm"><Target className="h-4 w-4" /> SAM</td>
                      <td className="px-5 py-3 text-white text-sm font-semibold">{revenueModel.marketAnalysis?.serviceableAddressableMarket ?? 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="px-5 py-3 flex items-center gap-2 text-yellow-300 font-semibold text-sm"><TrendingUp className="h-4 w-4" /> SOM</td>
                      <td className="px-5 py-3 text-white text-sm font-semibold">{revenueModel.marketAnalysis?.serviceableObtainableMarket ?? 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 flex items-center gap-2 text-pink-300 font-semibold text-sm"><Activity className="h-4 w-4" /> Growth Rate</td>
                      <td className="px-5 py-3 text-white text-sm font-semibold">{revenueModel.marketAnalysis?.marketGrowthRate ?? 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Competitive Landscape */}
              {revenueModel.marketAnalysis?.competitiveLandscape && (
                <div className="rounded-xl bg-white/5 border border-blue-400/10 p-0 overflow-hidden">
                  <div className="px-5 py-4">
                    <h5 className="text-base font-bold text-blue-400 flex items-center gap-2 mb-4"><Users2 className="h-4 w-4" /> Competitive Landscape</h5>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start gap-2 text-white/90 text-sm"><PieChart className="h-4 w-4 " /> <span className="font-semibold">Market Share:</span> <span className="font-bold text-white">{revenueModel.marketAnalysis?.competitiveLandscape?.marketShare ?? 'N/A'}</span></div>
                      <div className="flex items-start gap-2 text-white/90 text-sm"><Users2 className="h-4 w-4 " /> <span className="font-semibold">Competitors:</span> <span className="font-bold text-white">{revenueModel.marketAnalysis?.competitiveLandscape?.competitors?.join(', ') ?? 'N/A'}</span></div>
                      <div className="flex items-start gap-2 text-white/90 text-sm"><Lightbulb className="h-4 w-4 " /> <span className="font-semibold">Advantages:</span> <span className="font-bold text-white">{revenueModel.marketAnalysis?.competitiveLandscape?.competitiveAdvantages?.join(', ') ?? 'N/A'}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Market Trends */}
            {revenueModel.marketAnalysis?.marketTrends && (
              <div className="rounded-xl bg-white/5 border border-blue-400/10 p-0 overflow-hidden mt-4">
                <div className="px-5 py-4">
                  <h5 className="text-base font-bold text-blue-400 flex items-center gap-2 mb-4"><TrendingUp className="h-4 w-4" /> Market Trends</h5>
                  <div className="flex flex-col space-y-2">
                    <div className="text-white/90 text-sm"><span className="font-semibold">Current:</span> {revenueModel.marketAnalysis?.marketTrends?.current?.join(', ') ?? 'N/A'}</div>
                    <div className="text-white/90 text-sm"><span className="font-semibold">Emerging:</span> {revenueModel.marketAnalysis?.marketTrends?.emerging?.join(', ') ?? 'N/A'}</div>
                    <div className="text-white/90 text-sm"><span className="font-semibold">Impact:</span> {revenueModel.marketAnalysis?.marketTrends?.impact ?? 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financial Projections */}
        {revenueModel.financialProjections && (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2 tracking-tight"><TrendingUp className="h-5 w-5 text-green-300" /> Financial Projections</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Revenue Growth */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-0 overflow-hidden">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="px-5 py-2 text-green-300 font-semibold text-sm">Year 1</td>
                      <td className="px-5 py-2 text-white text-sm font-semibold">{revenueModel.financialProjections?.revenueGrowth?.year1 ?? 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="px-5 py-2 text-green-300 font-semibold text-sm">Year 2</td>
                      <td className="px-5 py-2 text-white text-sm font-semibold">{revenueModel.financialProjections?.revenueGrowth?.year2 ?? 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-2 text-green-300 font-semibold text-sm">Year 3</td>
                      <td className="px-5 py-2 text-white text-sm font-semibold">{revenueModel.financialProjections?.revenueGrowth?.year3 ?? 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
                {revenueModel.financialProjections?.revenueGrowth?.assumptions && (
                  <div className="px-5 py-2 text-xs text-gray-400 border-t border-white/10"><AlertCircle className="inline h-3 w-3 mr-1 text-yellow-300" /> {revenueModel.financialProjections?.revenueGrowth?.assumptions?.join(', ')}</div>
                )}
              </div>
              {/* Profit Margins */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-0 overflow-hidden">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="px-5 py-2 flex items-center gap-2 text-green-300 font-semibold text-sm"><LineChart className="h-4 w-4" /> Current</td>
                      <td className="px-5 py-2 text-white text-sm font-semibold">{revenueModel.financialProjections?.profitMargins?.current ?? 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="px-5 py-2 flex items-center gap-2 text-green-300 font-semibold text-sm"><Target className="h-4 w-4" /> Target</td>
                      <td className="px-5 py-2 text-white text-sm font-semibold">{revenueModel.financialProjections?.profitMargins?.target ?? 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
                {revenueModel.financialProjections?.profitMargins?.improvementStrategy && (
                  <div className="px-5 py-2 text-xs text-gray-400 border-t border-white/10"><Lightbulb className="inline h-3 w-3 mr-1 text-green-300" /> {revenueModel.financialProjections?.profitMargins?.improvementStrategy}</div>
                )}
              </div>
              {/* Break-Even Analysis */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-0 overflow-hidden">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="px-5 py-2 flex items-center gap-2 text-green-300 font-semibold text-sm"><Target className="h-4 w-4" /> Point</td>
                      <td className="px-5 py-2 text-white text-sm font-semibold">{revenueModel.financialProjections?.breakEvenAnalysis?.point ?? 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-2 flex items-center gap-2 text-green-300 font-semibold text-sm"><Calendar className="h-4 w-4" /> Timeline</td>
                      <td className="px-5 py-2 text-white text-sm font-semibold">{revenueModel.financialProjections?.breakEvenAnalysis?.timeline ?? 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
                {revenueModel.financialProjections?.breakEvenAnalysis?.assumptions && (
                  <div className="px-5 py-2 text-xs text-gray-400 border-t border-white/10"><AlertCircle className="inline h-3 w-3 mr-1 text-yellow-300" /> {revenueModel.financialProjections?.breakEvenAnalysis?.assumptions?.join(', ')}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Streams Distribution */}
        <div>
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2 tracking-tight"><PieChart className="h-5 w-5 text-yellow-300" /> Revenue Streams</h4>
          <div className="flex flex-row items-center justify-center gap-8 w-full">
            {/* Chart on the left */}
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
            {/* Legend on the right */}
            <div className="flex flex-col gap-3 min-w-[140px]">
              {pieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start }}></span>
                  <span className="text-xs font-semibold" style={{ color: GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start }}>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <h5 className="text-base font-semibold text-white tracking-wide">Revenue Streams Distribution</h5>
          </div>

          {/* Simple Revenue Streams List */}
          <div className="space-y-4 mt-6">
            {revenueModel.primaryStreams.map((stream, index) => (
              <div key={`stream-${index}`} className="border border-white/10 rounded-xl p-5 bg-white/5 transition-all duration-200 hover:border-yellow-400/30 hover:bg-yellow-400/5 shadow-sm group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: stream.scalability === 'high' ? COLORS[0] : stream.scalability === 'medium' ? COLORS[1] : COLORS[2] }}
                    />
                    <span className="text-base font-bold text-white">{stream.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-yellow-700 bg-yellow-200/80 px-3 py-1 rounded-full shadow-sm border border-yellow-300/40">{stream.recurringType} • {stream.percentage}%</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-300">{stream.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2 tracking-tight"><Target className="h-5 w-5 text-purple-300" /> Key Metrics</h4>
          <div className="grid gap-4">
            {revenueModel.metrics.map((metric, index) => (
              <div key={`metric-${index}`} className="border border-white/10 rounded-2xl p-5 bg-white/5 transition-all duration-200 hover:border-purple-400/30 hover:bg-purple-400/5 shadow-sm group">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-base font-bold text-white">{metric.name}</div>
                    <div className="text-xs text-gray-400">{metric.timeframe}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-purple-700 bg-purple-200/80 px-3 py-1 rounded-full shadow-sm border border-purple-300/40">{formatMetricValue(metric.name, metric.target, currency)}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-300">Current: {metric.current} | Target: {metric.target}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Analysis */}
        {revenueModel.riskAnalysis && revenueModel.riskAnalysis.length > 0 && (
          <div className="mt-8">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2 tracking-tight"><AlertCircle className="h-5 w-5 text-red-300" /> Risk Analysis</h4>
            <div className="space-y-4">
              {revenueModel.riskAnalysis.map((risk, index) => (
                <div key={`risk-${index}`} className="border border-white/10 rounded-2xl p-5 bg-white/5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-base font-bold text-white">{risk.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      risk.probability === 'high' ? 'bg-red-500/20 text-red-300' :
                      risk.probability === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {risk.probability} probability
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      risk.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                      risk.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {risk.impact} impact
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-xs ml-4 mt-1 text-gray-300">
                    {risk.summaryPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueModelCard; 