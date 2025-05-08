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
    case "Excellent": return "bg-gradient-to-r from-purple-500/10 to-purple-700/10 text-purple-300 border-purple-500/20";
    case "Good": return "bg-gradient-to-r from-green-500/10 to-green-700/10 text-green-300 border-green-500/20";
    case "Fair": return "bg-gradient-to-r from-yellow-500/10 to-yellow-700/10 text-yellow-300 border-yellow-500/20";
    default: return "bg-gradient-to-r from-gray-500/10 to-gray-700/10 text-gray-300 border-gray-500/20";
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
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
          <Sparkles className="h-7 w-7 text-yellow-300" />
          <span>Idea Validation Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Report Summary Section */}
        <section className="mb-8 mt-4 p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-inner animate-fadeUp">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Arc Progress with Gradient and Knob */}
          <div className="relative flex flex-col items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="block z-10">
              {/* Background arc */}
              <path
                d={describeArc(radius, radius, normalizedRadius, arcStartAngle, arcEndAngle)}
                  stroke="#23272e"
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
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getScoreCategoryColor(scoreAnalysis.category)}`}>{scoreAnalysis.category}</span>
            </div>
          </div>
          {/* Badge and Summary */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 items-center md:items-start">
              <span className={`px-4 py-1 rounded-full text-base font-semibold tracking-wide ${getScoreCategoryColor(scoreAnalysis.category)}`}>{scoreAnalysis.category} Potential</span>
              <p className="text-gray-100 text-xl leading-relaxed font-medium text-center md:text-left break-words">{summary}</p>
            </div>
          </div>
        </section>

        {/* Key Metrics Dashboard */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 tracking-tight">
            <TrendingUp className="h-6 w-6 text-green-300" /> Key Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-white/5 rounded-xl flex flex-col justify-between min-h-[80px] border border-white/10">
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-2 font-semibold">
                <Target className="h-4 w-4 text-gray-400" />
              Market Size
              </div>
              <div className="text-lg font-bold text-white">{scoreAnalysis.keyMetrics.marketSize}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl flex flex-col justify-between min-h-[80px] border border-white/10">
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-2 font-semibold">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                Growth Rate
          </div>
              <div className="text-lg font-bold text-white">{scoreAnalysis.keyMetrics.growthRate}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl flex flex-col justify-between min-h-[80px] border border-white/10">
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-2 font-semibold">
                <Users className="h-4 w-4 text-gray-400" />
              Target Audience
            </div>
              <div className="text-lg font-bold text-white whitespace-pre-line break-words leading-tight">{scoreAnalysis.keyMetrics.targetAudience}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl flex flex-col justify-between min-h-[80px] border border-white/10">
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-2 font-semibold">
                <DollarSign className="h-4 w-4 text-gray-400" />
                Initial Investment
          </div>
              <div className="text-lg font-bold text-white">{scoreAnalysis.keyMetrics.initialInvestment}</div>
            </div>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="mb-8 p-8 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3 tracking-tight">
            <DollarSign className="h-6 w-6 text-yellow-300" /> Executive Summary
          </h3>
          <p className="text-lg text-white leading-relaxed">{scoreAnalysis.executiveSummary}</p>
        </section>

        {/* Detailed Analysis */}
        <section className="mb-8">
           <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 tracking-tight">
             <Target className="h-6 w-6 text-blue-300" /> Detailed Analysis
           </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 mb-1 font-semibold">Market Potential</div>
                <div className="text-base text-white font-bold">{scoreAnalysis.marketPotential.score}% <span className="text-xs text-gray-400 font-normal">{scoreAnalysis.marketPotential.status}</span></div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 mb-1 font-semibold">Competition</div>
                <div className="text-base text-white font-bold">{scoreAnalysis.competition.level}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 mb-1 font-semibold">Market Size</div>
                <div className="text-base text-white font-bold">{scoreAnalysis.marketSize.status} <span className="text-xs text-gray-400 font-normal">({scoreAnalysis.marketSize.trend})</span></div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 mb-1 font-semibold">Timing</div>
                <div className="text-base text-white font-bold">{scoreAnalysis.timing.status}</div>
              </div>
            </div>
            {/* Recommendations */}
            <div className="p-5 border border-green-500/20 bg-green-500/5 rounded-2xl mb-4">
              <div className="text-lg font-bold text-green-300 mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5" /> Key Recommendations</div>
              <ul className="space-y-2">
                {scoreAnalysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-base text-white flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
        </section>

          {/* SWOT Analysis */}
          {scoreAnalysis.swot && (
          <section className="mb-8">
             <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 tracking-tight">
               <Sparkles className="h-6 w-6 text-yellow-300" /> SWOT Analysis
             </h3>
             <div className="grid grid-cols-2 gap-0 relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
               {/* Vertical line separators */}
               <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/10 z-10" />
               <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 z-10" />
               {/* Strengths */}
               <div className="p-6 flex flex-col items-start gap-2 z-20">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-700/30 text-green-300"><TrendingUp className="h-5 w-5" /></span>
                   <h4 className="text-lg font-bold text-green-300">Strengths</h4>
                 </div>
                 <ul className="list-disc list-inside text-base text-white/90 space-y-1 pl-2">
                   {scoreAnalysis.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                 </ul>
               </div>
               {/* Weaknesses */}
               <div className="p-6 flex flex-col items-start gap-2 z-20">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-700/30 text-yellow-300"><Target className="h-5 w-5" /></span>
                   <h4 className="text-lg font-bold text-yellow-300">Weaknesses</h4>
                 </div>
                 <ul className="list-disc list-inside text-base text-white/90 space-y-1 pl-2">
                   {scoreAnalysis.swot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                 </ul>
               </div>
               {/* Opportunities */}
               <div className="p-6 flex flex-col items-start gap-2 z-20">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-700/30 text-blue-300"><Users className="h-5 w-5" /></span>
                   <h4 className="text-lg font-bold text-blue-300">Opportunities</h4>
                 </div>
                 <ul className="list-disc list-inside text-base text-white/90 space-y-1 pl-2">
                   {scoreAnalysis.swot.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                 </ul>
               </div>
               {/* Threats */}
               <div className="p-6 flex flex-col items-start gap-2 z-20">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-700/30 text-red-300"><DollarSign className="h-5 w-5" /></span>
                   <h4 className="text-lg font-bold text-red-300">Threats</h4>
                 </div>
                 <ul className="list-disc list-inside text-base text-white/90 space-y-1 pl-2">
                   {scoreAnalysis.swot.threats.map((t, i) => <li key={i}>{t}</li>)}
                 </ul>
               </div>
             </div>
          </section>
          )}

          {/* Market Trends */}
          {scoreAnalysis.marketTrends && scoreAnalysis.marketTrends.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 tracking-tight">
              <TrendingUp className="h-6 w-6 text-pink-300" /> Market Trends
            </h3>
              <ul className="space-y-2">
                {scoreAnalysis.marketTrends.map((trend, i) => (
                <li key={i} className="text-base text-white/90">
                  <span className="font-semibold text-gray-400">{trend.trend}:</span> {trend.impact}
                  </li>
                ))}
              </ul>
          </section>
          )}

          {/* Regulatory & Risks */}
          {scoreAnalysis.regulatoryAndRisks && scoreAnalysis.regulatoryAndRisks.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 tracking-tight">
              <DollarSign className="h-6 w-6 text-red-300" /> Regulatory & Risks
            </h3>
            <div className="grid gap-6">
                {scoreAnalysis.regulatoryAndRisks.map((risk, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-white">{risk.risk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium">Mitigation:</span>
                    <span className="text-white/90">{risk.mitigation}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          )}

          {/* Competitive Positioning */}
          {scoreAnalysis.competitivePositioning && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 tracking-tight">
              <Target className="h-6 w-6 text-purple-300" /> Competitive Positioning
            </h3>
            <div className="text-white/90 text-lg mb-2">
              <span className="font-semibold text-gray-400">Position:  </span> {scoreAnalysis.competitivePositioning.position}
            </div>
            <div className="text-white/120 text-base">
              <span className="font-semibold text-gray-400">Map:  </span> {scoreAnalysis.competitivePositioning.mapDescription}
            </div>
          </section>
          )}
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
