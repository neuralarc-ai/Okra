import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, TrendingUp, Users, DollarSign } from "lucide-react";
import { ScoreAnalysis } from "@/types/oracle";

interface ScoreCardProps {
  score: number;
  summary: string;
  scoreAnalysis: ScoreAnalysis;
}

const getScoreCategoryColor = (category: string) => {
  switch (category) {
    case "Excellent": return "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md";
    case "Good": return "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md";
    case "Fair": return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md";
    default: return "bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-md";
  }
  };
  
const ScoreCard = ({ score, summary, scoreAnalysis }: ScoreCardProps) => {
  // Arc Progress SVG (2/3 circle)
  const radius = 95;
  const stroke = 14;
  const normalizedRadius = radius - stroke / 2;
  const arcStartAngle = 225; // rotated so open ends are at the bottom
  const arcEndAngle = 495; // 225 + 270 (2/3 circle)
  const arcAngle = arcEndAngle - arcStartAngle; // 270 degrees
  const arcLength = (arcAngle / 360) * 2 * Math.PI * normalizedRadius;
  const progress = Math.max(0, Math.min(100, score));
  const progressLength = (progress / 100) * arcLength;

  // Helper to convert polar to cartesian
  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const a = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  };

  // Arc path for background
  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };
  
  // Arc path for progress
  const progressAngle = arcStartAngle + (arcAngle * progress) / 100;
  const progressPath = describeArc(radius, radius, normalizedRadius, arcStartAngle, progressAngle);

  // Knob position
  const knob = polarToCartesian(radius, radius, normalizedRadius, progressAngle);

  return (
    <Card className="card-bg hover-card shadow-lg max-h-[810px] overflow-y-auto hide-scrollbar">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-green-300" />
            <span>Idea Validation Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Top Section: Arc Progress, Badge, and Summary */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 mt-4 p-4 animate-fadeUp">
          {/* Arc Progress with Gradient and Knob */}
          <div className="relative flex flex-col items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="block z-10">
              {/* Background arc */}
              <path
                d={describeArc(radius, radius, normalizedRadius, arcStartAngle, arcEndAngle)}
                stroke="#3a3b3c"
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
              />
              {/* Progress arc with gradient */}
              <defs>
                <linearGradient id="arc-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2B5C4F" />
                  <stop offset="60%" stopColor="#FCEC3B" />
                  <stop offset="100%" stopColor="#FFADDF" />
                </linearGradient>
              </defs>
              <path
                d={progressPath}
                stroke="url(#arc-gradient)"
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 8px #090101aa)' }}
              />
              {/* Knob at the end of the arc */}
              <circle
                cx={knob.x}
                cy={knob.y}
                r={stroke / 1.5}
                fill="#fff"
                stroke="#070101"
                strokeWidth={3}
                
              />
            </svg>
            {/* Centered Score and Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <span className="text-6xl font-extrabold text-white drop-shadow-lg">{score}</span>
              <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${getScoreCategoryColor(scoreAnalysis.category)}`}>{scoreAnalysis.category}</span>
            </div>
          </div>
          {/* Badge and Summary */}
          <div className="flex-1 flex flex-col gap-3 min-w-0 items-center md:items-start">
            <span className={`px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-lg ${getScoreCategoryColor(scoreAnalysis.category)}`}>{scoreAnalysis.category} Potential</span>
            <p className="text-gray-100 text-lg leading-relaxed font-medium text-center md:text-left break-words">
              {summary}
            </p>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="p-3 bg-white/5 rounded-lg flex flex-col justify-between min-h-[70px]">
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              Market Size
            </div>
            <div className="text-lg md:text-xl font-bold text-white">{scoreAnalysis.keyMetrics.marketSize}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg flex flex-col justify-between min-h-[70px]">
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Growth Rate
            </div>
            <div className="text-lg md:text-xl font-bold text-white">{scoreAnalysis.keyMetrics.growthRate}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg flex flex-col justify-between min-h-[70px]">
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-400" />
              Target Audience
            </div>
            <div className="text-lg md:text-xl font-bold text-white whitespace-pre-line break-words leading-tight">
              {scoreAnalysis.keyMetrics.targetAudience}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg flex flex-col justify-between min-h-[70px]">
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              Initial Investment
            </div>
            <div className="text-lg md:text-xl font-bold text-white">{scoreAnalysis.keyMetrics.initialInvestment}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-6 p-4 bg-black/40 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Executive Summary</h3>
          <p className="text-white text-sm leading-relaxed">
            {scoreAnalysis.executiveSummary}
          </p>
        </div>

        {/* Detailed Analysis */}
        <div className="space-y-3 mt-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Market Potential</div>
              <div className="text-sm text-white font-medium">
                {scoreAnalysis.marketPotential.score}% {scoreAnalysis.marketPotential.status}
              </div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Competition</div>
              <div className="text-sm text-white font-medium">
                {scoreAnalysis.competition.level}
              </div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Market Size</div>
              <div className="text-sm text-white font-medium">
                {scoreAnalysis.marketSize.status}
                <span className="text-xs text-gray-400 ml-1">({scoreAnalysis.marketSize.trend})</span>
              </div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Timing</div>
              <div className="text-sm text-white font-medium">
                {scoreAnalysis.timing.status}
              </div>
            </div>
          </div>
          {/* Recommendations */}
          <div className="p-3 border border-white/5 rounded-lg">
            <div className="text-sm font-medium text-white mb-2">Key Recommendations</div>
            <ul className="space-y-1">
              {scoreAnalysis.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-400" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
