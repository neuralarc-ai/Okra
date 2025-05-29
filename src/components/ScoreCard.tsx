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
    <Card className="border-none outline-none bg-white shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="font-['Fustat'] font-medium text-[40px] leading-[69px] tracking-[-0.02em] align-middle text-[#202020]">
          Idea Validation Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Report Summary Section */}
        <section className="mb-10 mt-4 p-16 rounded-[16px] bg-[#1E342F] border border-[#B0B7BC] shadow-inner animate-fadeUp">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Arc Progress with Gradient and Knob */}
          <div className="relative flex flex-col items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="block z-10">
              {/* Background arc */}
              <path
                d={describeArc(radius, radius, normalizedRadius, arcStartAngle, arcEndAngle)}
                  stroke="#E3E7EA"
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
                fill="#FFFFFF"
                
                strokeWidth={3}
              />
            </svg>
            {/* Centered Score and Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <span className="text-6xl font-bold text-white drop-shadow-lg">{score}</span>
                <span className="mt-2 px-4 py-1 rounded-[8px] text-xs font-medium tracking-wide"
                  style={{ background: 'linear-gradient(90deg, #D0C5C0 0%, #CEF0F5 100%)', color: '#202020', borderRadius: '8px', border: 'none' }}
                >{scoreAnalysis.category}</span>
            </div>
          </div>
          {/* Badge and Summary */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 items-center md:items-start">
              <span className="px-4 py-1 rounded-[8px] text-base font-medium tracking-wide"
                style={{ background: 'linear-gradient(90deg, #D0C5C0 0%, #CEF0F5 100%)', color: '#202020', borderRadius: '8px', border: 'none' }}
              >{scoreAnalysis.category} Potential</span>
              <p className="text-white text-xl leading-relaxed font-normal text-center md:text-left break-words">{summary}</p>
            </div>
          </div>
        </section>

        {/* Key Metrics Dashboard */}
        <section className="mb-10">
          <h3 className="text-2xl font-semibold text-[#202020] mb-4 flex items-center gap-3 tracking-tight">
            Key Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 bg-[#E3E7EA] rounded-[8px] flex flex-col justify-start gap-2 min-h-[80px] border border-[#B0B7BC]">
              <div className="text-xs text-[#202020] mb-1 flex items-center gap-2 font-medium">
                Market Size
              </div>
              <div className="text-lg font-semibold text-[#202020]">{scoreAnalysis.keyMetrics.marketSize}</div>
            </div>
            <div className="p-5 bg-[#E3E7EA] rounded-[8px] flex flex-col justify-start gap-2 min-h-[80px] border border-[#B0B7BC]">
              <div className="text-xs text-[#202020] mb-1 flex items-center gap-2 font-medium">
                Growth Rate
              </div>
              <div className="text-lg font-semibold text-[#202020]">{scoreAnalysis.keyMetrics.growthRate}</div>
            </div>
            <div className="p-5 bg-[#E3E7EA] rounded-[8px] flex flex-col justify-start gap-2 min-h-[80px] border border-[#B0B7BC]">
              <div className="text-xs text-[#202020] mb-1 flex items-center gap-2 font-medium">
                Target Audience
              </div>
              <div className="text-lg font-semibold text-[#202020] whitespace-pre-line break-words leading-tight">{scoreAnalysis.keyMetrics.targetAudience}</div>
            </div>
            <div className="p-5 bg-[#E3E7EA] rounded-[8px] flex flex-col justify-start gap-2 min-h-[80px] border border-[#B0B7BC]">
              <div className="text-xs text-[#202020] mb-1 flex items-center gap-2 font-medium">
                Initial Investment
              </div>
              <div className="text-lg font-semibold text-[#202020]">{scoreAnalysis.keyMetrics.initialInvestment}</div>
            </div>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="mb-10 p-10 bg-[#CFD2D4] rounded-[16px] border border-[#B0B7BC]">
          <h3 className="text-2xl font-semibold text-[#202020] mb-3 flex items-center gap-3 tracking-tight">
            Executive Summary
          </h3>
          <p className="text-lg text-[#202020] leading-relaxed font-normal">{scoreAnalysis.executiveSummary}</p>
        </section>

        {/* Detailed Analysis */}
        <section className="mb-10">
          <h3 className="text-2xl font-semibold text-[#202020] mb-4 flex items-center gap-3 tracking-tight">
            Market Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
            <div className="p-5 bg-[#E3E7EA] rounded-[8px] border border-[#B0B7BC]">
              <div className="text-xs text-[#202020] mb-1 font-medium">Market Potential</div>
              <div className="text-base text-[#202020] font-semibold">{scoreAnalysis.marketPotential.score}% <span className="text-xs text-[#202020] font-normal">{scoreAnalysis.marketPotential.status}</span></div>
            </div>
            <div className="p-5 bg-[#E3E7EA] rounded-[8px] border border-[#B0B7BC]">
              <div className="text-xs text-[#202020] mb-1 font-medium">Competition</div>
              <div className="text-base text-[#202020] font-semibold">{scoreAnalysis.competition.level}</div>
            </div>
            <div className="p-5 bg-[#E3E7EA] rounded-[8px] border border-[#B0B7BC]">
              <div className="text-xs text-[#202020] mb-1 font-medium">Market Size</div>
              <div className="text-base text-[#202020] font-semibold">{scoreAnalysis.marketSize.status} <span className="text-xs text-[#202020] font-normal">({scoreAnalysis.marketSize.trend})</span></div>
            </div>
            <div className="p-5 bg-[#E3E7EA] rounded-[8px] border border-[#B0B7BC]">
              <div className="text-xs text-[#202020] mb-1 font-medium">Timing</div>
              <div className="text-base text-[#202020] font-semibold">{scoreAnalysis.timing.status}</div>
            </div>
          </div>
          {/* Recommendations */}
          <div className="p-6 border border-[#B0B7BC] bg-[#1E342F] rounded-[8px] mb-4">
            <div className="text-lg font-semibold text-white mb-3 flex items-center gap-2">Key Recommendations</div>
            <ul className="space-y-2">
              {scoreAnalysis.recommendations.map((recommendation, index) => (
                <li key={index} className="text-base text-white flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2B5C4F]" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SWOT Analysis */}
        {scoreAnalysis.swot && (
        <section className="mb-8">
           <h3 className="text-2xl font-bold text-[#202020] mb-4 flex items-center gap-3 tracking-tight">
             SWOT Analysis
           </h3>
           <div className="grid grid-cols-2 gap-0 relative bg-[#2B2521] rounded-[16px] border border-[#B0B7BC] overflow-hidden">
             {/* Vertical and horizontal line separators - half length with fade */}
             <div className="absolute top-1/4 bottom-1/4 left-1/2 w-0.5 z-10 -translate-x-1/2" style={{
               background: 'linear-gradient(to bottom, transparent, #7D7D7D 20%, #7D7D7D 80%, transparent)'
             }} />
             <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 z-10 -translate-y-1/2" style={{
               background: 'linear-gradient(to right, transparent, #7D7D7D 20%, #7D7D7D 80%, transparent)'
             }} />
             {/* Strengths */}
             <div className="p-6 flex flex-col items-start gap-2 z-20">
               <div className="flex items-center gap-2 mb-2">
                 <h4 className="text-lg font-bold" style={{ color: '#3987BE' }}>Strengths</h4>
               </div>
               <ul className="list-disc list-outside pl-4 text-base text-white space-y-1">
                 {scoreAnalysis.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
               </ul>
             </div>
             {/* Weaknesses */}
             <div className="p-6 flex flex-col items-start gap-2 z-20">
               <div className="flex items-center gap-2 mb-2">
                 <h4 className="text-lg font-bold" style={{ color: '#D48EA3' }}>Weaknesses</h4>
               </div>
               <ul className="list-disc list-outside pl-4 text-base text-white space-y-1">
                 {scoreAnalysis.swot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
               </ul>
             </div>
             {/* Opportunities */}
             <div className="p-6 flex flex-col items-start gap-2 z-20">
               <div className="flex items-center gap-2 mb-2">
                 <h4 className="text-lg font-bold" style={{ color: '#97A487' }}>Opportunities</h4>
               </div>
               <ul className="list-disc list-outside pl-4 text-base text-white space-y-1">
                 {scoreAnalysis.swot.opportunities.map((o, i) => <li key={i}>{o}</li>)}
               </ul>
             </div>
             {/* Threats */}
             <div className="p-6 flex flex-col items-start gap-2 z-20">
               <div className="flex items-center gap-2 mb-2">
                 <h4 className="text-lg font-bold" style={{ color: '#B7A694' }}>Threats</h4>
               </div>
               <ul className="list-disc list-outside pl-4 text-base text-white space-y-1">
                 {scoreAnalysis.swot.threats.map((t, i) => <li key={i}>{t}</li>)}
               </ul>
             </div>
           </div>
        </section>
        )}

        {/* Market Trends */}
        {scoreAnalysis.marketTrends && scoreAnalysis.marketTrends.length > 0 && (
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-[#202020] mb-4 flex items-center gap-3 tracking-tight">
            Market Trends
          </h3>
            <ul className="space-y-2">
              {scoreAnalysis.marketTrends.map((trend, i) => (
              <li key={i} className="text-base text-black">
                <span className="font-semibold text-gray-600">{trend.trend}:</span> {trend.impact}
                </li>
              ))}
            </ul>
        </section>
        )}

        {/* Regulatory & Risks */}
        {scoreAnalysis.regulatoryAndRisks && scoreAnalysis.regulatoryAndRisks.length > 0 && (
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-[#202020] mb-4 flex items-center gap-3 tracking-tight">
            Regulatory & Risks
          </h3>
          <div className="grid gap-4">
              {scoreAnalysis.regulatoryAndRisks.map((risk, i) => (
              <div
                key={i}
                className="bg-[#E3E7EA] border border-[#B0B7BC] rounded-[8px] p-6 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-[#202020]">{risk.risk}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-black font-medium">Mitigation:</span>
                  <span className="text-[#202020]/90">{risk.mitigation}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Competitive Positioning */}
        {scoreAnalysis.competitivePositioning && (
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-[#202020] mb-4 flex items-center gap-3 tracking-tight">
            Competitive Positioning
          </h3>
          <div className="text-[#202020]/90 text-lg mb-2">
            <span className="font-semibold text-gray-600">Position:  </span> {scoreAnalysis.competitivePositioning.position}
          </div>
          <div className="text-[#202020]/90 text-base">
            <span className="font-semibold text-gray-600">Map:  </span> {scoreAnalysis.competitivePositioning.mapDescription}
          </div>
        </section>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
