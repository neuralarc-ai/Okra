
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface ScoreCardProps {
  score: number;
  summary: string;
}

const ScoreCard = ({ score, summary }: ScoreCardProps) => {
  // Determine the color based on the score
  const getScoreClass = (score: number) => {
    if (score >= 80) return "text-white";
    if (score >= 60) return "text-gray-300";
    return "text-gray-400";
  };
  
  const getProgressClass = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-white to-purple-300";
    if (score >= 60) return "bg-gradient-to-r from-gray-300 to-gray-400";
    return "bg-gradient-to-r from-gray-500 to-gray-600";
  };
  
  const scoreColor = getScoreClass(score);
  const progressColor = getProgressClass(score);

  return (
    <Card className="card-bg hover-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-300" />
            <span>Idea Validation Score</span>
          </div>
          <span className={`text-3xl font-bold ${scoreColor}`}>{score}/100</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress 
            value={score} 
            className="h-3 bg-gray-800/50 rounded-md"
            indicatorClassName={progressColor}
          />
          <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
