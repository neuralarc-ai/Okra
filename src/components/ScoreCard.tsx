import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { ScoreAnalysis } from "@/types/oracle";

interface ScoreCardProps {
  score: number;
  summary: string;
  scoreAnalysis: ScoreAnalysis;
}

const ScoreCard = ({ score, summary, scoreAnalysis }: ScoreCardProps) => {
  // Determine the color based on the score
  const getScoreClass = (score: number) => {
    if (score >= 80) return "text-white";
    if (score >= 60) return "text-gray-300";
    return "text-gray-400";
  };
  
  const getProgressClass = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400";
    if (score >= 60) return "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400";
    return "bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600";
  };

  const getScoreCategory = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };
  
  const scoreColor = getScoreClass(score);
  const progressColor = getProgressClass(score);

  return (
    <Card className="card-bg hover-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-300" />
          <span>Idea Validation Score</span>
          <span className={`ml-auto text-3xl font-bold ${scoreColor}`}>{score}/100</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={score} 
              className="h-2 bg-white/5"
              indicatorClassName={progressColor}
            />
          </div>

          {/* Summary Section */}
          <div className="space-y-4">
            {/* Main Summary */}
            <p className="text-gray-300 text-base leading-relaxed">
              {summary}
            </p>

            {/* Detailed Analysis */}
            <div className="space-y-3 mt-4">
              {/* Score Category */}
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-sm text-gray-400">Overall Rating</span>
                <span className={`text-sm font-medium ${scoreColor}`}>
                  {scoreAnalysis.category}
                </span>
              </div>

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
                      <div className="w-1 h-1 rounded-full bg-purple-400" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
