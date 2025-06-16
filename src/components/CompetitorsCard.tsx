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

// Custom label component for the PieChart
const CustomPieChartLabel = ({ cx, cy, midAngle, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const lineOuterRadius = outerRadius + 20; // Extend line further out
  const textOuterRadius = outerRadius + 40; // Text position even further

  const startPointX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
  const startPointY = cy + outerRadius * Math.sin(-midAngle * RADIAN);

  const midPointX = cx + lineOuterRadius * Math.cos(-midAngle * RADIAN);
  const midPointY = cy + lineOuterRadius * Math.sin(-midAngle * RADIAN);

  const endPointX = cx + textOuterRadius * Math.cos(-midAngle * RADIAN);
  const endPointY = cy + textOuterRadius * Math.sin(-midAngle * RADIAN);

  // Adjust text anchor based on position to keep the box centered
  const textAnchor = endPointX > cx ? 'start' : 'end';
  const labelBoxWidth = 55; // Approximate width of "25%" box
  const labelBoxHeight = 30; // Approximate height of "25%" box

  const labelX = endPointX + (textAnchor === 'start' ? 5 : -labelBoxWidth - 5); // Add small offset
  const labelY = endPointY - labelBoxHeight / 2; // Vertically center the box

  return (
    <g>
      {/* Line connecting to the label box */}
      <path
        d={`M ${startPointX} ${startPointY} L ${midPointX} ${midPointY}`}
        stroke="#FFFFFF" // White dotted line
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      {/* Label Box Background */}
      <rect
        x={labelX}
        y={labelY}
        width={labelBoxWidth}
        height={labelBoxHeight}
        rx={5} // Rounded corners
        ry={5}
        fill="#29241E" // Dark background from Menu.svg inner circle
        opacity={0.9} // Slight opacity
      />
      {/* Percentage Text */}
      <text
        x={labelX + labelBoxWidth / 2}
        y={labelY + labelBoxHeight / 2}
        fill="#F8F8F8" // White text
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight={500}
        fontSize={14}
      >
        {`${Number(value).toFixed(0)}%`}
      </text>
    </g>
  );
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
      <div className="rounded-[8px] p-6 mb-8"  style={{
              backgroundImage: "url('/background/background-3.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
        <CardHeader className="pb-2 p-0">
          <CardTitle className="text-[40px] pb-2 font-bold flex items-center gap-2" style={{ color: '#111111' }}>
            <span>Competitive Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pie Chart Card */}
          <div className="p-6 flex flex-col items-center justify-center" style={{ background: '#FFFFFFBF', borderRadius: '0.5rem' }}>
            <div className="relative flex items-center justify-center w-full" style={{ height: '420px' }}>
              {marketShareData && marketShareData.length >= 2 && (
                <ResponsiveContainer width={520} height={420} className="flex items-center justify-center w-full">
                  <PieChart margin={{ top: 40, right: 30, bottom: 40, left: 30 }}>
                    <Tooltip
                      cursor={false}
                      contentStyle={{
                        background: '#E5E0D5',
                        border: '1px solid #B7A694',
                        color: '#000000',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                      }}
                      formatter={(value: number) => `${value}%`}
                    />
                    {/* Background circles */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r={80}
                      stroke="#00000050"
                      strokeWidth={1}
                      fill="none"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r={150}
                      stroke="#00000070"
                      strokeWidth={1}
                      fill="none"
                    />

                    {/* Center circle (now innermost) */}
                    <circle cx="50%" cy="50%" r={35} fill="#8E8E8E" />

                    {/* Axes */}
                    <line
                      x1="0%"
                      y1="50%"
                      x2="100%"
                      y2="50%"
                      stroke="#00000070"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="50%"
                      y1="0%"
                      x2="50%"
                      y2="100%"
                      stroke="#00000070"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    {/* Positive Y-axis line */}
                    <line
                      x1="50%"
                      y1="50%"
                      x2="50%"
                      y2="0%"
                      stroke="#00000070"
                      strokeWidth={1}
                    />
                    <Pie
                      data={marketShareData.map((entry, idx) => ({
                        name: entry.name,
                        value: entry.value,
                        fill: CHART_COLORS[idx % CHART_COLORS.length]
                      }))}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={90} // Adjusted for thicker pie
                      outerRadius={140} // Kept same
                      stroke="transparent"
                      className="overflow-visible"
                      strokeWidth={2}
                      paddingAngle={1.5}
                      cornerRadius={6}
                      label={({ value, cx, cy, midAngle, outerRadius, percent }) => {
                        const RADIAN = Math.PI / 180;
                        const sin = Math.sin(-RADIAN * midAngle);
                        const cos = Math.cos(-RADIAN * midAngle);

                        const lineOffset = 10;
                        const textOffset = 26;
                        const boxWidth = 54;
                        const boxHeight = 29;

                        const sx = cx + outerRadius * cos;
                        const sy = cy + outerRadius * sin;

                        const ex = cx + (outerRadius + lineOffset) * cos;
                        const ey = cy + (outerRadius + lineOffset) * sin;

                        const textX = cx + (outerRadius + textOffset) * cos;
                        const textY = cy + (outerRadius + textOffset) * sin;

                        const isLeft = cos < 0;
                        const labelBoxX = textX + (isLeft ? -boxWidth - 5 : 5);
                        const labelBoxY = textY - boxHeight / 2;

                        return (
                          <g>
                            <rect
                              x={labelBoxX}
                              y={labelBoxY}
                              width={boxWidth}
                              height={boxHeight}
                              rx={4}
                              ry={4}
                              fill="#FFFFFF"
                              stroke="#00000045"
                              strokeWidth={1}
                            />
                            <text
                              x={labelBoxX + boxWidth / 2}
                              y={labelBoxY + boxHeight / 2}
                              fill="#0A0A0A"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontWeight={500}
                              fontSize={14}
                            >
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          </g>
                        );
                      }}
                      labelLine={false}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Legend Card */}
          <div className="p-6" style={{ background: '#FFFFFFBF', borderRadius: '0.5rem' }}>
            <h4 className="text-base font-semibold mt-4 mb-4" style={{ color: '#000000' }}>Market Share Distribution</h4>
            <div className="flex flex-col gap-3">
              {marketShareData && marketShareData.map((entry, idx) => (
                <div 
                  key={entry.name} 
                  className="flex items-center justify-between gap-3 px-4 py-3 mb-2 rounded-lg border border-[#3B3B3B73] bg-white/75" 
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-4 h-4 rounded block border flex-shrink-0" 
                      style={{ 
                        background: CHART_COLORS[idx % CHART_COLORS.length], 
                        borderColor: '#B7A694' 
                      }}
                    />
                    <span className="text-base font-medium" style={{ color: '#000000' }}>
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-base font-medium" style={{ color: '#000000' }}>
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
              backgroundImage: "url('/background/background-2.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              {/* Section Header */}
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-8 py-5 cursor-pointer group"
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
              <div className="px-6 pb-2 mb-4 flex items-stretch gap-4 h-[120px]">
                {/* Progress Bar Card */}
                <div className="relative px-4 py-3 rounded-lg bg-[#FFFFFFBF] flex-1 flex flex-col justify-center">
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
                <div className="flex flex-col items-center justify-center px-4 py-3  rounded-lg bg-[#FFFFFFBF]" style={{ minWidth: '120px' }}>
                  <div className="text-xs text-[#2B2521] mb-1">Market Share</div>
                  <div className="font-fustat font-normal text-4xl text-center" style={{ letterSpacing: '0%' }}>
                    {Number(entry.value).toFixed(1)}%
                  </div>
                </div>

                {/* Strength Score Card */}
                <div className="flex flex-col items-center justify-center px-4 py-3 rounded-lg bg-[#FFFFFFBF]" style={{ minWidth: '120px' }}>
                  <div className="text-xs text-[#2B2521] mb-1">Strength Score</div>
                  <div className="font-fustat font-normal text-4xl text-center" style={{ letterSpacing: '0%' }}>
                    {competitor.strengthScore}/100
                  </div>
                </div>
              </div>
              {/* Expanded Details */}
              {isExpanded && competitor.detailedAnalysis && (
                <div className="mt-3 py-3 mx-6 mb-4 rounded-[8px] bg-[#FFFFFFBF]">
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
