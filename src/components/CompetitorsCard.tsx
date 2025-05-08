import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Competitor } from "@/types/oracle";
import { ChartBar, Award, ChevronDown, ChevronUp, MapPin, Users, TrendingUp, Building2, Star, ThumbsDown, Globe, Store, DollarSign, Zap, Users2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Label } from "recharts";

interface CompetitorsCardProps {
  competitors: Competitor[];
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
  { id: "gradPurple", start: "#c084fc", end: "#6b21a8" },    // Soft purple to deep purple
  { id: "gradPink", start: "#f9a8d4", end: "#be185d" },      // Soft pink to deep rose
  { id: "gradYellow", start: "#fde047", end: "#854d0e" },    // Soft yellow to amber
  { id: "gradOrange", start: "#fdba74", end: "#9a3412" },    // Soft orange to deep orange
  { id: "gradGreen", start: "#4ade80", end: "#166534" },     // Soft green to forest
  { id: "gradBlue", start: "#93c5fd", end: "#1e40af" },      // Soft blue to navy
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
    <Card className="card-bg hover-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <ChartBar size={18} className="text-gray-400" />
          <span>Competitive Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-4">
          {marketShareData && marketShareData.length >= 2 && (
            <div className="mt-8">
              <div className="flex flex-row items-center justify-center gap-8 w-full">
                {/* Chart on the left */}
                <div className="relative flex items-center justify-center" style={{ minHeight: 240 }}>
                  <ResponsiveContainer width={320} height={320}>
                    <PieChart>
                      <defs>
                        {GRADIENT_COLORS.map((gradient, idx) => (
                          <linearGradient key={gradient.id} id={gradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={gradient.start} />
                            <stop offset="100%" stopColor={gradient.end} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Tooltip
                        cursor={false}
                        contentStyle={{ 
                          background: 'rgba(255, 255, 255, 0.95)', 
                          border: 'none', 
                          color: '#1a1a1a', 
                          borderRadius: '10px',
                          padding: '8px 12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                        formatter={(value: number) => `${value}%`}
                      />
                      <Pie
                        data={marketShareData.map((entry, idx) => ({
                          name: entry.name,
                          value: entry.value,
                          fill: `url(#${GRADIENT_COLORS[idx % GRADIENT_COLORS.length].id})`
                        }))}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={110}
                        stroke="none"
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-2xl font-bold"
                                  >
                                    {total}%
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 18}
                                    className="fill-muted-foreground text-base"
                                  >
                                    Total
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Labels/Legend on the right */}
                <div className="flex flex-col gap-3 min-w-[140px]">
                  {marketShareData.map((entry, idx) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full block" 
                        style={{ background: `linear-gradient(90deg, ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start}, ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length].end})` }}
                      ></span>
                      <span className="text-xs font-semibold" style={{ color: GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <h4 className="text-base font-semibold text-white tracking-wide">Market Share Distribution</h4>
              </div>
            </div>
          )}

          {marketShareData && marketShareData.map((entry, idx) => {
            const competitor = competitors.find(c => c.name === entry.name);
            if (!competitor) return null;
            const isExpanded = expandedCompetitor === competitor.name;
            return (
              <section key={entry.name} className="bg-white/2 rounded-lg border border-white/10 shadow-inner">
                {/* Section Header */}
                <div 
                  className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-4 py-3 cursor-pointer group"
                  onClick={() => toggleCompetitor(competitor.name)}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-lg font-semibold text-white flex items-center gap-1">
                      {competitor.name}
                      {competitor.strengthScore > 80 && (
                        <Award size={15} className="text-yellow-300 ml-1" />
                      )}
                    </span>
                    {competitor.primaryAdvantage && (
                      <span className="text-xs text-gray-400 font-medium mt-0.5">
                        Key Advantage: <span className="text-white font-semibold">{cleanAdvantage(competitor.primaryAdvantage)}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400">Market Share</span>
                      <span className="text-base font-semibold text-white">{entry.value}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400" title="Strength Score is a 0-100 rating of this competitor's overall market strength, brand, and execution.">Strength Score</span>
                      <span className="text-base font-semibold text-white">{competitor.strengthScore}/100</span>
                    </div>
                    <span>{isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="px-4 pb-2">
                  <Progress 
                    value={competitor.strengthScore} 
                    className="h-1.5 bg-gray-800 rounded-full"
                    indicatorClassName={getProgressGradient()}
                  />
                </div>
                {/* Description */}
                <div className="px-4 pb-2">
                  <p className="text-gray-400 text-xs italic">{competitor.description}</p>
                </div>
                {/* Expanded Details */}
                {isExpanded && competitor.detailedAnalysis && (
                  <div className="mt-3 pt-3 mx-3 border-t border-white/10">
                    <div className="text-sm text-white mb-2 font-semibold">Summary</div>
                    <div className="text-xs text-gray-200 whitespace-pre-line mb-2">
                      {competitor.detailedAnalysis.summary || competitor.description}
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-gray-300">
                      {competitor.detailedAnalysis.marketPosition && (
                        <div><span className="font-semibold text-white">Market Position:</span> {competitor.detailedAnalysis.marketPosition}</div>
                      )}
                      {competitor.primaryAdvantage && (
                        <div><span className="font-semibold text-white">Key Advantage:</span> {cleanAdvantage(competitor.primaryAdvantage)}</div>
                      )}
                      {competitor.website && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-white">Website:</span>
                          <a 
                            href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            {competitor.website}
                            <ExternalLink size={12} className="inline" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorsCard;
