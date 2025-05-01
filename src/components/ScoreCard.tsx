import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
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
  // Circular progress SVG
  const radius = 95;
  const stroke = 7;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="card-bg hover-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-green-300" />
          <span>Idea Validation Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Top Section: Circular Progress, Badge, and Summary */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 mt-4 p-4 animate-fadeUp">
          {/* Circular Progress with Glow */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-green-400/10 blur-2xl z-0" />
            <svg height={radius * 2} width={radius * 2} className="block z-10">
              <circle
                stroke="#222"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#22c55e"
                fill="transparent"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.7s' }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <span className="text-4xl font-extrabold text-white drop-shadow-lg">{score}</span>
              <span className="text-xs text-gray-300">out of 100</span>
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
        {/* Detailed Analysis (unchanged) */}
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
