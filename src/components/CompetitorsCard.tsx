import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Competitor } from "@/types/oracle";
import { ChartBar, Award, ChevronDown, ChevronUp, MapPin, Users, TrendingUp, Building2, Star, ThumbsDown, Globe, Store, DollarSign, Zap, Users2 } from "lucide-react";
import { useState } from "react";

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
  { id: "gradPurple", start: "#8b7cf6", end: "#a99ff7" },
  { id: "gradPink", start: "#FFADDF", end: "#ffc7e8" },
  { id: "gradYellow", start: "#FCEC3B", end: "#fdf38d" },
  { id: "gradOrange", start: "#fbbf24", end: "#fcd26d" },
  { id: "gradGreen", start: "#34d399", end: "#6fe3b5" },
  { id: "gradBlue", start: "#60a5fa", end: "#8ac0fb" },
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
            <div className="h-[260px] mb-2 flex flex-col items-center justify-center">
              <h4 className="text-base font-semibold text-white mb-2 text-center tracking-wide">Market Share Distribution</h4>
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
                  {marketShareData.map((entry, idx) => {
                    const valueAngle = (entry.value / total) * (chartCircum - gapAngle * marketShareData.length);
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
                    fontSize="3.0rem"
                    fontWeight="bold"
                    fill="#e5e7eb"
                    style={{ fontFamily: 'inherit' }}
                  >
                    {total}
                    <tspan fontSize="1.1rem" x="50%" dy="2.5em" fill="#aaa">Total</tspan>
                  </text>
                </svg>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {marketShareData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full block" 
                      style={{ backgroundColor: GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start }}
                    ></span>
                    <span className="text-xs text-white/80 font-medium">{entry.name}</span>
                  </div>
                ))}
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
                  <div className="flex flex-col gap-1 md:gap-0 md:flex-row md:items-center">
                    <span className="text-lg font-semibold text-white flex items-center gap-1">
                      {competitor.name}
                      {competitor.strengthScore > 80 && (
                        <Award size={15} className="text-yellow-300 ml-1" />
                      )}
                    </span>
                    <span className="ml-0 md:ml-4 text-xs text-gray-400 font-medium">Key Advantage: <span className="text-white font-semibold">{cleanAdvantage(competitor.primaryAdvantage)}</span></span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400">Market Share</span>
                      <span className="text-base font-semibold text-white">{entry.value}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400">Score</span>
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
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-sm text-white mb-2 font-semibold">Detailed Summary</div>
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
