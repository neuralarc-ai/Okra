import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Competitor } from "@/types/oracle";
import { ChartBar, Award } from "lucide-react";

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

  return (
    <Card className="card-bg hover-card shadow-lg max-h-[810px] overflow-y-auto hide-scrollbar">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <ChartBar size={18} className="text-blue-300" />
          <span>Competitive Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-4">
          {marketShareData && marketShareData.length >= 2 && (
            <div className="h-[260px] mb-2 flex flex-col items-center justify-center">
             
              <div className="relative flex items-center justify-center" style={{ minHeight: 2 * (radius + stroke) }}>
                <svg width={2 * (radius + stroke)} height={2 * (radius + stroke)} style={{ display: 'block' }}>
                  {marketShareData.map((entry, idx) => {
                    const valueAngle = (entry.value / total) * (chartCircum - gapAngle * marketShareData.length);
                    const startAngle = currentAngle + gapAngle / 2;
                    const endAngle = startAngle + valueAngle;
                    const path = describeArc(cx, cy, radius, startAngle, endAngle);
                    currentAngle = endAngle + gapAngle / 2;
                    return (
                      <path
                        key={entry.name}
                        d={path}
                        stroke={COLORS[idx % COLORS.length]}
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
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {marketShareData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="text-xs text-white/80">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {marketShareData && marketShareData.map((entry, idx) => {
            const competitor = competitors.find(c => c.name === entry.name);
            if (!competitor) return null;
            return (
              <div key={entry.name} className="space-y-2 p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
              <div className="flex justify-between items-center">
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
                    <span className="text-xs text-white ml-1 font-semibold">{cleanAdvantage(competitor.primaryAdvantage)}</span>
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
