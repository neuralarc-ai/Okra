
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Competitor } from "@/types/oracle";

interface CompetitorsCardProps {
  competitors: Competitor[];
}

const CompetitorsCard = ({ competitors }: CompetitorsCardProps) => {
  return (
    <Card className="card-bg hover-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Competitive Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competitors.map((competitor, index) => (
            <div key={index} className="space-y-2 p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
              <div className="flex justify-between items-center">
                <span className="font-medium">{competitor.name}</span>
                <span className="text-sm">{competitor.strengthScore}/100</span>
              </div>
              <Progress 
                value={competitor.strengthScore} 
                className="h-2 bg-gray-800"
                indicatorClassName={`${
                  competitor.strengthScore >= 80 ? 'bg-gray-300' : 
                  competitor.strengthScore >= 60 ? 'bg-gray-400' : 
                  'bg-white'
                }`}
              />
              <p className="text-gray-400 text-xs">{competitor.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorsCard;
