import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Competitor } from "@/types/oracle";
import { ChartBar, Award, ChevronDown, ChevronUp, MapPin, Users, TrendingUp, Building2, Star, ThumbsDown, Globe, Store } from "lucide-react";
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
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <ChartBar size={18} className="text-gray-400" />
          <span>Competitive Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-4">
          {marketShareData && marketShareData.length >= 2 && (
            <div className="h-[260px] mb-2 flex flex-col items-center justify-center">
              <h4 className="text-sm text-gray-400 mb-2 text-center">Market Share Distribution</h4>
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
              <div className="flex flex-wrap justify-center gap-4 mt-4"> {/* Increased mt for better spacing */}
                {marketShareData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full block" 
                      style={{ backgroundColor: GRADIENT_COLORS[idx % GRADIENT_COLORS.length].start }}
                    ></span>
                    <span className="text-xs text-white/80">{entry.name}</span>
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
              <div key={entry.name} className="space-y-2 p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCompetitor(competitor.name)}
                >
                  <span className="font-medium flex items-center gap-1">
                    {competitor.name}
                    {competitor.strengthScore > 80 && (
                      <Award size={14} className="text-yellow-300" />
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                      {entry.value}% Share
                    </span>
                    <span className="text-sm">{competitor.strengthScore}/100</span>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                <Progress 
                  value={competitor.strengthScore} 
                  className="h-2 bg-gray-800"
                  indicatorClassName={getProgressGradient()}
                />
                <p className="text-gray-400 text-xs">{competitor.description}</p>
                {competitor.primaryAdvantage && (
                  <div className="mt-1">
                    <span className="text-xs text-gray-400">Key Advantage:</span>
                    <span className="text-xs text-white ml-1 font-medium">{cleanAdvantage(competitor.primaryAdvantage)}</span>
                  </div>
                )}

                {isExpanded && competitor.detailedAnalysis && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
                    {renderDetailItem(<TrendingUp size={14} />, "Market Position", competitor.detailedAnalysis.marketPosition)}
                    {renderDetailItem(<Users size={14} />, "Target Audience", competitor.detailedAnalysis.targetAudience)}
                    {renderDetailItem(<Building2 size={14} />, "Pricing Strategy", competitor.detailedAnalysis.pricingStrategy)}
                    {renderDetailItem(<Star size={14} />, "Strengths", competitor.detailedAnalysis.strengths)}
                    {renderDetailItem(<ThumbsDown size={14} />, "Weaknesses", competitor.detailedAnalysis.weaknesses)}
                    {renderDetailItem(<Globe size={14} />, "Geographic Reach", competitor.detailedAnalysis.marketReach?.geographic)}
                    {renderDetailItem(<Store size={14} />, "Distribution Channels", competitor.detailedAnalysis.marketReach?.channels)}
                    {renderDetailItem(<MapPin size={14} />, "Recent Developments", competitor.detailedAnalysis.recentDevelopments)}
                    
                    {competitor.detailedAnalysis.customerFeedback && (
                      <div className="space-y-2">
                        {renderDetailItem(<Star size={14} />, "Positive Feedback", competitor.detailedAnalysis.customerFeedback.positive)}
                        {renderDetailItem(<ThumbsDown size={14} />, "Negative Feedback", competitor.detailedAnalysis.customerFeedback.negative)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorsCard;
