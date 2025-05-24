import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueModel } from '@/types/oracle';
import { ChevronDown, ChevronUp, Target, TrendingUp, Users, BarChart3, AlertCircle, CheckCircle2, XCircle, Calendar, Users2, ArrowUpRight, ArrowDownRight, Lightbulb, Shield, Zap, DollarSign, LineChart, PieChart, Activity, TrendingDown, Building2, Globe, Store } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Tooltip } from 'recharts';

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
    <Card style={{ background: '#FFFFFF', border: '1px solid #CFD2D4' }}>
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold flex items-center gap-3 tracking-tight" style={{ color: '#161616' }}>
          Revenue Model
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Market Analysis Section */}
        {revenueModel.marketAnalysis && (
          <div className="space-y-4">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2 tracking-tight" style={{ color: '#161616' }}><BarChart3 className="h-5 w-5 text-blue-300" /> Market Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market Analysis */}
              <div className="rounded-2xl bg-[#E3E2DF] p-8">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-[#CFD2D4]">
                      <td className="font-bold text-[1.35rem] text-[#161616] py-6">TAM</td>
                      <td className="text-[#161616] text-[1.15rem] text-right py-6">{revenueModel.marketAnalysis.totalAddressableMarket}</td>
                    </tr>
                    <tr className="border-b border-[#CFD2D4]">
                      <td className="font-bold text-[1.35rem] text-[#161616] py-6">SAM</td>
                      <td className="text-[#161616] text-[1.15rem] text-right py-6">{revenueModel.marketAnalysis.serviceableAddressableMarket}</td>
                    </tr>
                    <tr className="border-b border-[#CFD2D4]">
                      <td className="font-bold text-[1.35rem] text-[#161616] py-6">SOM</td>
                      <td className="text-[#161616] text-[1.15rem] text-right py-6">{revenueModel.marketAnalysis.serviceableObtainableMarket}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[1.35rem] text-[#161616] py-6">Growth Rate</td>
                      <td className="text-[#161616] text-[1.15rem] text-right py-6">{revenueModel.marketAnalysis.marketGrowthRate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Competitive Landscape */}
              {revenueModel.marketAnalysis.competitiveLandscape && (
                <div className="rounded-2xl bg-[#E3E2DF] p-8">
                  <div>
                    <div className="text-2xl font-bold text-[#161616] mb-4">Competitive Landscape</div>
                    <hr className="border-t border-[#A8B0B8] mb-8" />
                    <div className="mb-8">
                      <div className="text-xl font-bold text-[#161616] mb-3">Market Share</div>
                      <div className="flex flex-wrap gap-4">
                        {Array.isArray(revenueModel.marketAnalysis.competitiveLandscape.marketShare)
                          ? revenueModel.marketAnalysis.competitiveLandscape.marketShare.map((share, idx) => (
                              <span key={idx} className="px-6 py-3 rounded-full text-lg font-normal" style={{ background: '#CFD2D4', color: '#161616' }}>
                                {share}
                              </span>
                            ))
                          : (
                              <span className="px-6 py-3 rounded-full text-lg font-normal" style={{ background: '#CFD2D4', color: '#161616' }}>
                                {revenueModel.marketAnalysis.competitiveLandscape.marketShare}
                              </span>
                            )}
                      </div>
                    </div>
                    <div className="mb-8">
                      <div className="text-xl font-bold text-[#161616] mb-3">Competitors</div>
                      <div className="flex flex-wrap gap-4">
                        {revenueModel.marketAnalysis.competitiveLandscape.competitors?.map((competitor, idx) => (
                          <span key={idx} className="px-6 py-3 rounded-full text-lg font-normal" style={{ background: '#CFD2D4', color: '#161616' }}>
                            {competitor}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-[#161616] mb-3">Advantages</div>
                      <div className="text-lg text-[#161616]">
                        {Array.isArray(revenueModel.marketAnalysis.competitiveLandscape.competitiveAdvantages)
                          ? revenueModel.marketAnalysis.competitiveLandscape.competitiveAdvantages.join(', ')
                          : revenueModel.marketAnalysis.competitiveLandscape.competitiveAdvantages}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Market Trends */}
            {revenueModel.marketAnalysis.marketTrends && (
              <div className="rounded-2xl border p-0 overflow-hidden mt-4" style={{ borderColor: '#CFD2D4', background: '#F8F7F3' }}>
                <div className="px-5 py-4">
                  <h5 className="text-base font-bold flex items-center gap-2 mb-4" style={{ color: '#3987BE' }}><TrendingUp className="h-4 w-4" /> Market Trends</h5>
                  <div className="flex flex-col space-y-2">
                    <div className="text-[#161616] text-sm"><span className="font-semibold">Current:</span> {revenueModel.marketAnalysis.marketTrends.current?.join(', ')}</div>
                    <div className="text-[#161616] text-sm"><span className="font-semibold">Emerging:</span> {revenueModel.marketAnalysis.marketTrends.emerging?.join(', ')}</div>
                    <div className="text-[#161616] text-sm"><span className="font-semibold">Impact:</span> {revenueModel.marketAnalysis.marketTrends.impact}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financial Projections */}
        {revenueModel.financialProjections && (
          <div className="space-y-4">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2 tracking-tight" style={{ color: '#161616' }}><TrendingUp className="h-5 w-5 text-green-300" /> Financial Projections</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Revenue Growth */}
              <div className="rounded-2xl border p-0 overflow-hidden" style={{ borderColor: '#CFD2D4', background: '#B7BEAE' }}>
                <table className="w-full text-left">
                  <tbody>
                    {revenueModel.financialProjections.revenueGrowth && (
                      <>
                        <tr className="border-b" style={{ borderColor: '#CFD2D4' }}>
                          <td className="px-5 py-2 text-green-300 font-semibold text-sm">Year 1</td>
                          <td className="px-5 py-2 text-[#161616] text-sm font-semibold">{revenueModel.financialProjections.revenueGrowth?.year1 || 'N/A'}</td>
                        </tr>
                        <tr className="border-b" style={{ borderColor: '#CFD2D4' }}>
                          <td className="px-5 py-2 text-green-300 font-semibold text-sm">Year 2</td>
                          <td className="px-5 py-2 text-[#161616] text-sm font-semibold">{revenueModel.financialProjections.revenueGrowth?.year2 || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2 text-green-300 font-semibold text-sm">Year 3</td>
                          <td className="px-5 py-2 text-[#161616] text-sm font-semibold">{revenueModel.financialProjections.revenueGrowth?.year3 || 'N/A'}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                {revenueModel.financialProjections.revenueGrowth?.assumptions && (
                  <div className="px-5 py-2 text-xs text-[#161616] border-t" style={{ borderColor: '#CFD2D4' }}>
                    <AlertCircle className="inline h-3 w-3 mr-1 text-yellow-300" />
                    {revenueModel.financialProjections.revenueGrowth.assumptions.join(', ')}
                  </div>
                )}
              </div>
              {/* Profit Margins */}
              <div className="rounded-2xl border p-0 overflow-hidden" style={{ borderColor: '#CFD2D4', background: '#B7BEAE' }}>
                <table className="w-full text-left">
                  <tbody>
                    {revenueModel.financialProjections.profitMargins && (
                      <>
                        <tr className="border-b" style={{ borderColor: '#CFD2D4' }}>
                          <td className="px-5 py-2 flex items-center gap-2 text-green-300 font-semibold text-sm"><LineChart className="h-4 w-4" /> Current</td>
                          <td className="px-5 py-2 text-[#161616] text-sm font-semibold">{revenueModel.financialProjections.profitMargins?.current || 'N/A'}</td>
                        </tr>
                        <tr className="border-b" style={{ borderColor: '#CFD2D4' }}>
                          <td className="px-5 py-2 flex items-center gap-2 text-green-300 font-semibold text-sm"><Target className="h-4 w-4" /> Target</td>
                          <td className="px-5 py-2 text-[#161616] text-sm font-semibold">{revenueModel.financialProjections.profitMargins?.target || 'N/A'}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                {revenueModel.financialProjections.profitMargins?.improvementStrategy && (
                  <div className="px-5 py-2 text-xs text-[#161616] border-t" style={{ borderColor: '#CFD2D4' }}>
                    <Lightbulb className="inline h-3 w-3 mr-1 text-green-300" />
                    {revenueModel.financialProjections.profitMargins.improvementStrategy}
                  </div>
                )}
              </div>
              {/* Break-Even Analysis */}
              <div className="rounded-2xl border p-0 overflow-hidden" style={{ borderColor: '#CFD2D4', background: '#B7BEAE' }}>
                <table className="w-full text-left">
                  <tbody>
                    {revenueModel.financialProjections.breakEvenAnalysis && (
                      <>
                        <tr className="border-b" style={{ borderColor: '#CFD2D4' }}>
                          <td className="px-5 py-2 flex items-center gap-2 text-green-300 font-semibold text-sm"><Target className="h-4 w-4" /> Point</td>
                          <td className="px-5 py-2 text-[#161616] text-sm font-semibold">{revenueModel.financialProjections.breakEvenAnalysis?.point || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2 flex items-center gap-2 text-green-300 font-semibold text-sm"><Calendar className="h-4 w-4" /> Timeline</td>
                          <td className="px-5 py-2 text-[#161616] text-sm font-semibold">{revenueModel.financialProjections.breakEvenAnalysis?.timeline || 'N/A'}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                {revenueModel.financialProjections.breakEvenAnalysis?.assumptions && (
                  <div className="px-5 py-2 text-xs text-[#161616] border-t" style={{ borderColor: '#CFD2D4' }}>
                    <AlertCircle className="inline h-3 w-3 mr-1 text-yellow-300" />
                    {revenueModel.financialProjections.breakEvenAnalysis.assumptions.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Streams Distribution */}
        <div className="rounded-2xl p-6 mt-8" style={{ background: '#2B2521', border: '1px solid #2B2521' }}>
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2 tracking-tight" style={{ color: '#F8F7F3' }}>
            Revenue Streams
          </h4>
          <div className="flex flex-row items-center justify-center gap-8 w-full">
            {/* Chart on the left */}
            <div className="relative flex items-center justify-center mt-0" style={{ minHeight: 320, minWidth: 320 }}>
              <ResponsiveContainer width={320} height={320}>
                <RechartsPieChart>
                  <Pie
                    data={pieData.map((entry, idx) => ({
                      name: entry.name,
                      value: entry.value,
                      fill: ["#A8B0B8", "#D48EA3", "#97A487"][idx % 3]
                    }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={90}
                    outerRadius={120}
                    stroke="#2B2521"
                    strokeWidth={2}
                    label={false}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              {/* Center number */}
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1 }}>{total}</span>
              </div>
            </div>
            {/* Legend on the right */}
            <div className="flex flex-col gap-3 min-w-[220px]">
              <h4 className="text-lg font-semibold mb-2" style={{ color: '#F8F7F3' }}>Revenue Stream Distribution</h4>
              {pieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-3 px-4 py-3 rounded-lg border" style={{ borderColor: '#393532', background: '#161616' }}>
                  <span
                    className="w-4 h-4 rounded block border"
                    style={{ background: ["#A8B0B8", "#D48EA3", "#97A487"][idx % 3], borderColor: '#2B2521' }}
                  ></span>
                  <span className="text-base font-medium" style={{ color: '#F8F7F3' }}>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simple Revenue Streams List */}
        <div className="space-y-4 mt-6">
          {revenueModel.primaryStreams.map((stream, index) => (
            <div key={`stream-${index}`} className="border rounded-xl p-5 group" style={{ borderColor: '#CFD2D4', background: '#F8F7F3' }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stream.scalability === 'high' ? '#3987BE' : stream.scalability === 'medium' ? '#D48EA3' : '#97A487' }}
                  />
                  <span className="text-base font-bold" style={{ color: '#161616' }}>{stream.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full border" style={{ background: '#CFD2D4', borderColor: '#B7A694', color: '#161616' }}>{stream.recurringType} • {stream.percentage}%</span>
                </div>
              </div>
              <div className="mt-2 text-sm" style={{ color: '#2B2521' }}>{stream.description}</div>
            </div>
          ))}
        </div>

        {/* Key Metrics */}
        <div>
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2 tracking-tight" style={{ color: '#161616' }}><Target className="h-5 w-5 text-purple-300" /> Key Metrics</h4>
          <div className="grid gap-4">
            {revenueModel.metrics.map((metric, index) => (
              <div key={`metric-${index}`} className="border rounded-2xl p-5 group" style={{ borderColor: '#CFD2D4', background: '#D0C3B5' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-base font-bold" style={{ color: '#161616' }}>{metric.name}</div>
                    <div className="text-xs" style={{ color: '#2B2521' }}>{metric.timeframe}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs px-3 py-1 rounded-full border" style={{ background: '#CFD2D4', borderColor: '#B7A694', color: '#161616' }}>{formatMetricValue(metric.name, metric.target, currency)}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm" style={{ color: '#2B2521' }}>Current: {metric.current} | Target: {metric.target}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueModelCard; 