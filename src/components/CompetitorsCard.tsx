import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Competitor } from "@/types/oracle";
import { ChartBar, Award, ChevronDown, ChevronUp, MapPin, Users, TrendingUp, Building2, Star, ThumbsDown, Globe, Store, DollarSign, Zap, Users2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Label } from "recharts";

interface CompetitorsCardProps {
  competitors: Competitor[];
}

const CHART_COLORS = [
  "#C6AEA3", // Descript
  "#D48EA3", // Midjourney/DALLE/Stable Diffusion
  "#A8B0B8", // Jasper AI
  "#97A487", // RunwayML
];

const CHART_LABEL_COLORS = [
  "#F8F7F3", // for text/labels
  "#CFD2D4",
  "#E3E2DF",
  "#B7A694"
];

function getMarketShareData(competitors: Competitor[]) {
  return competitors
    .filter(
      (comp) =>
        comp.marketShare !== undefined &&
        !isNaN(Number(String(comp.marketShare).replace("%", "")))
    )
    .sort(
      (a, b) =>
        Number(String(b.marketShare).replace("%", "")) -
        Number(String(a.marketShare).replace("%", ""))
    )
    .slice(0, 5)
    .map((comp) => ({
      name: comp.name,
      value: Number(String(comp.marketShare).replace("%", "")),
    }));
}

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
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
  ].join(" ");
}

// Helper for progress bar gradient
const getProgressGradient = () => {
  return "bg-gradient-to-r from-green-400 via-blue-400 to-pink-400";
};

const CompetitorsCard = ({ competitors }: CompetitorsCardProps) => {
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);
  const marketShareData = getMarketShareData(competitors);
  const total = marketShareData.reduce((sum, d) => sum + d.value, 0);
  const radius = 90;
  const stroke = 22;
  const gapAngle = 16; // degrees between segments
  const cx = radius + stroke;
  const cy = radius + stroke;
  const chartCircum = 360;
  let currentAngle = -90; // Start at top

  // Helper to clean up primaryAdvantage (remove extra asterisks)
  const cleanAdvantage = (adv?: string) => {
    if (!adv) return '';
    return adv.replace(/^\*+|\*+$/g, '').trim();
  };

  const toggleCompetitor = (name: string) => {
    setExpandedCompetitor(expandedCompetitor === name ? null : name);
  };

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
    <div>
      {/* Chart and Legend Section */}
      <div className="rounded-[8px] p-6 mb-8" style={{ background: '#2B2521', border: '1px solid #B7A694' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2" style={{ color: '#F8F7F3' }}>
            <ChartBar size={18} className="text-[#CFD2D4]" />
            <span>Competitive Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pie Chart Card */}
          <div className="p-6 flex flex-col items-center justify-center" style={{ background: '#161616', borderRadius: '0.5rem' }}>
            <div className="w-full" style={{ minHeight: 300 }}>
              {marketShareData && marketShareData.length >= 2 && (
                <ResponsiveContainer width="100%" height={380}>
                  <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                    <Tooltip
                      cursor={false}
                      contentStyle={{ 
                        background: '#2B2521',
                        border: '1px solid #B7A694',
                        color: '#F8F7F3',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                      }}
                      formatter={(value: number) => `${value}%`}
                    />
                    <Pie
                      data={marketShareData.map((entry, idx) => ({
                        name: entry.name,
                        value: entry.value,
                        fill: CHART_COLORS[idx % CHART_COLORS.length]
                      }))}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      outerRadius="90%"
                      stroke="#2B2521"
                      className="overflow-visible"
                      strokeWidth={2}
                      label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                        const RADIAN = Math.PI / 180;
                        const labelRadiusOffset = 30; // Increased offset from 25
                        // The label's anchor point is calculated from the center of the pie,
                        // extending beyond the outer radius of the slice.
                        const effectiveOuterRadius = outerRadius; 
                        const labelPositionRadius = effectiveOuterRadius + labelRadiusOffset;

                        const x = cx + labelPositionRadius * Math.cos(-midAngle * RADIAN);
                        const y = cy + labelPositionRadius * Math.sin(-midAngle * RADIAN);

                        let currentTextAnchor = x > cx ? 'start' : 'end';
                        // If the label is (nearly) vertically aligned with the center, use 'middle' anchor for better centering.
                        if (Math.abs(x - cx) < 1.0) { // Check if x is very close to cx
                          currentTextAnchor = 'middle';
                        }

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#fff"
                            textAnchor={currentTextAnchor}
                            dominantBaseline="central"
                            fontWeight={400}
                            fontSize={14}
                            className="overflow-visible"
                          >
                            {`${Number(value).toFixed(1)}%`}
                          </text>
                        );
                      }}
                      labelLine={{ stroke: '#B7A694', strokeWidth: 1 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Legend Card */}
          <div className="p-6" style={{ background: '#161616', borderRadius: '0.5rem' }}>
            <h4 className="text-base font-semibold mt-4 mb-4" style={{ color: '#F8F7F3' }}>Market Share Distribution</h4>
            <div className="flex flex-col gap-3">
              {marketShareData && marketShareData.map((entry, idx) => (
                <div 
                  key={entry.name} 
                  className="flex items-center justify-between gap-3 px-4 py-3 mb-2 rounded-lg border" 
                  style={{ borderColor: '#FFFFFF40', background: '#2B2521' }}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-4 h-4 rounded block border" 
                      style={{ 
                        background: CHART_COLORS[idx % CHART_COLORS.length], 
                        borderColor: '#B7A694' 
                      }}
                    />
                    <span className="text-base font-medium" style={{ color: '#F8F7F3' }}>
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-base font-medium" style={{ color: '#F8F7F3' }}>
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      </div>
      {/* Competitor Cards Section */}
      <div className="flex flex-col gap-4 ">
        {marketShareData && marketShareData.map((entry, idx) => {
          const competitor = competitors.find(c => c.name === entry.name);
          if (!competitor) return null;
          const isExpanded = expandedCompetitor === competitor.name;
          return (
            <section key={entry.name} className="border-none outline-none shadow-none rounded-[8px]" style={{
              backgroundImage: "url('/card-bg-9.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              {/* Section Header */}
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-6 py-5 cursor-pointer group"
                onClick={() => toggleCompetitor(competitor.name)}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-semibold" style={{ color: '#161616' }}>
                    {competitor.name}
                  </span>
                  {competitor.primaryAdvantage && (
                    <span className="text-sm font-medium mt-0.5" style={{ color: '#2B2521' }}>
                      Key Advantage: <span className="font-semibold">{cleanAdvantage(competitor.primaryAdvantage)}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>{isExpanded ? <ChevronUp size={18} className="text-[#2B2521]" /> : <ChevronDown size={18} className="text-[#2B2521]" />}</span>
                </div>
              </div>
              {/* Progress Bar and Metrics */}
              <div className="px-6 pb-2 flex items-stretch gap-4 h-[120px]">
                {/* Progress Bar Card */}
                <div className="relative px-4 py-3 rounded-lg border border-[#202020]/10 bg-[#F8F8F773] shadow-sm flex-1 flex flex-col justify-center">
                  <div className="w-full space-y-3">
                    <div className="w-full h-2 bg-[#CFD4C9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${competitor.strengthScore}%`, background: '#97A487' }}
                      />
                    </div>
                    {competitor.description && (
                      <p className="text-sm text-[#2B2521]  line-clamp-2">
                        {competitor.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Market Share Card */}
                <div className="flex flex-col items-center justify-center px-4 py-3 rounded-lg border border-[#202020]/10 bg-[#F8F8F7] shadow-sm" style={{ minWidth: '120px' }}>
                  <div className="text-xs text-[#2B2521] mb-1">Market Share</div>
                  <div className="font-fustat font-normal text-4xl text-center" style={{ letterSpacing: '0%' }}>
                    {Number(entry.value).toFixed(1)}%
                  </div>
                </div>

                {/* Strength Score Card */}
                <div className="flex flex-col items-center justify-center px-4 py-3 rounded-lg border border-[#202020]/10 bg-[#F8F8F7] shadow-sm" style={{ minWidth: '120px' }}>
                  <div className="text-xs text-[#2B2521] mb-1">Strength Score</div>
                  <div className="font-fustat font-normal text-4xl text-center" style={{ letterSpacing: '0%' }}>
                    {competitor.strengthScore}/100
                  </div>
                </div>
              </div>
              {/* Expanded Details */}
              {isExpanded && competitor.detailedAnalysis && (
                <div className="mt-3 pt-3 mx-6 mb-4 rounded-[8px] border-t bg-[#F8F8F773]" style={{ borderColor: '#CFD4C9' }}>
                  <div className="px-6">
                  <div className="text-base mb-2 font-semibold" style={{ color: '#161616' }}>Summary</div>
                  <div className="text-sm mb-2" style={{ color: '#2B2521', whiteSpace: 'pre-line' }}>
                    {competitor.detailedAnalysis.summary || competitor.description}
                  </div>
                  <div className="flex flex-col gap-1 text-sm" style={{ color: '#2B2521' }}>
                    {competitor.detailedAnalysis.marketPosition && (
                      <div><span className="font-semibold" style={{ color: '#20202073' }}>Market Position:</span> {competitor.detailedAnalysis.marketPosition}</div>
                    )}
                    {competitor.primaryAdvantage && (
                      <div><span className="font-semibold" style={{ color: '#20202073' }}>Key Advantage:</span> {cleanAdvantage(competitor.primaryAdvantage)}</div>
                    )}
                    {competitor.website && (
                      <div className="flex items-center gap-1 mb-3">
                        <span className="font-semibold" style={{ color: '#20202073' }}>Website:</span>
                        <a 
                          href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-[#4a65da]"
                          style={{ color: '#4a65da' }}
                        >
                          {competitor.website}
                        </a>
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default CompetitorsCard;
