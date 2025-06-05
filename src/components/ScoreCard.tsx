import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, TrendingUp, Users, DollarSign, ChartBar } from "lucide-react";
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
  const arcStartAngle = 225;
  const arcEndAngle = 495;
  const arcAngle = arcEndAngle - arcStartAngle;
  const arcLength = (arcAngle / 360) * 2 * Math.PI * normalizedRadius;
  const progress = Math.max(0, Math.min(100, score));
  const progressLength = (progress / 100) * arcLength;

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const a = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  };

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };
  
  const progressAngle = arcStartAngle + (arcAngle * progress) / 100;
  const progressPath = describeArc(radius, radius, normalizedRadius, arcStartAngle, progressAngle);
  const knob = polarToCartesian(radius, radius, normalizedRadius, progressAngle);

  return (
    <Card className="border-none outline-none bg-white shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="font-['Fustat'] font-medium text-[40px] leading-[69px] tracking-[-0.02em] align-middle text-[#202020] flex items-center gap-3">
          
          Idea Validation Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Score Overview Section */}
        <div 
          className="rounded-[8px] p-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('/card-bg-3.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-[#2B2521]/90" />
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Arc Progress */}
            <div className="relative flex flex-col items-center justify-center overflow-visible">
              <svg height={radius * 2} width={radius * 2} className="block z-10 overflow-visible">
                <path
                  d={describeArc(radius, radius, normalizedRadius, arcStartAngle, arcEndAngle)}
                  stroke="#E3E2DF"
                  strokeWidth={stroke}
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="arc-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#A8B0B8" />
                    <stop offset="50%" stopColor="#D48EA3" />
                    <stop offset="100%" stopColor="#97A487" />
                  </linearGradient>
                </defs>
                <path
                  d={progressPath}
                  stroke="url(#arc-gradient)"
                  strokeWidth={stroke}
                  fill="none"
                  strokeLinecap="round"
                />
                <circle
                  cx={knob.x}
                  cy={knob.y}
                  r={stroke / 1.5}
                  fill="#F8F7F3"
                  stroke="#B7A694"
                  strokeWidth={2}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <span className="text-6xl font-bold text-[#F8F7F3]">{score}</span>
                <span className="mt-2 px-4 py-1 rounded-[8px] text-xs font-medium tracking-wide bg-[#FFFFFF3D] text-[#F8F7F3] border border-[#B7A694]">
                  {scoreAnalysis.category}
                </span>
              </div>
            </div>
            {/* Summary */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1 rounded-[8px] text-base font-medium tracking-wide bg-[#FFFFFF] text-[#161616] border border-[#B7A694]">
                  {scoreAnalysis.category} Potential
                </span>
              </div>
              <p className="text-[#F8F7F3] text-xl leading-relaxed font-normal">{summary}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div 
          className="rounded-[8px] p-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('/card-bg-8.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-[#D8CDBB]" />
          <div className="relative z-10">
            <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-6">
              Key Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Market Size', value: scoreAnalysis.keyMetrics.marketSize },
                { label: 'Growth Rate', value: scoreAnalysis.keyMetrics.growthRate },
                { label: 'Target Audience', value: scoreAnalysis.keyMetrics.targetAudience },
                { label: 'Initial Investment', value: scoreAnalysis.keyMetrics.initialInvestment }
              ].map((metric, index) => (
                <div key={index} className="p-5 rounded-[8px] bg-[#F8F8F773] border border-[#20202010]">
                  <div className="text-sm text-[#00000080] mb-2 font-medium">{metric.label}</div>
                  <div className="text-lg font-semibold text-[#202020]">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div 
          className="rounded-[8px] p-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('/card-bg-9.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-[#E3E2DFBF]" />
          <div className="relative z-10">
            <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-4">
              Executive Summary
            </h3>
            <p className="text-lg text-[#202020] leading-relaxed font-normal">{scoreAnalysis.executiveSummary}</p>
          </div>
        </div>

        {/* Market Analysis */}
        <div 
          className="rounded-[8px] p-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('/card-bg-3.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-[#D8CDBB]" />
          <div className="relative z-10">
            <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-6">
              Market Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {[
                { label: 'Market Potential', value: `${scoreAnalysis.marketPotential.score}%`, subtext: scoreAnalysis.marketPotential.status },
                { label: 'Competition', value: scoreAnalysis.competition.level },
                { label: 'Market Size', value: scoreAnalysis.marketSize.status, subtext: scoreAnalysis.marketSize.trend },
                { label: 'Timing', value: scoreAnalysis.timing.status }
              ].map((metric, index) => (
                <div key={index} className="p-5 rounded-[8px] bg-[#F8F8F773] border border-[#20202010]">
                  <div className="text-sm text-[#00000080] mb-2 font-medium">{metric.label}</div>
                  <div className="text-lg font-semibold text-[#202020]">
                    {metric.value}
                    {metric.subtext && <span className="text-sm font-normal ml-2">({metric.subtext})</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="rounded-[8px] p-6 relative overflow-hidden" style={{ background: '#F8F8F773', border: '1px solid #20202010' }}>
              <div className="text-lg font-semibold text-[#202020] mb-4">Key Recommendations</div>
              <ul className="space-y-3">
                {scoreAnalysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-lg text-[#202020] flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D48EA3] mt-2 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SWOT Analysis */}
        {scoreAnalysis.swot && (
          <div 
            className="rounded-[8px] p-6 relative overflow-hidden"
            style={{
              backgroundColor: "#2B2521",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-[#2B2521]" />
            <div className="relative z-10">
              <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#F8F7F3] mb-6">
                SWOT Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Strengths', items: scoreAnalysis.swot.strengths, color: '#A8B0B8' },
                  { title: 'Weaknesses', items: scoreAnalysis.swot.weaknesses, color: '#D48EA3' },
                  { title: 'Opportunities', items: scoreAnalysis.swot.opportunities, color: '#97A487' },
                  { title: 'Threats', items: scoreAnalysis.swot.threats, color: '#B7A694' }
                ].map((section, index) => (
                  <div key={index} className="p-4 rounded-[8px] py-8 " style={{ background: '#0000003B', border: '1px solid #0000003B' }}>
                    <h4 className="text-[24px] font-semibold mb-4 mt-2 mb-"  style={{ color: section.color }}>{section.title}</h4>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-[#F8F7F3] text-[18px]  flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: section.color }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Market Trends */}
        {scoreAnalysis.marketTrends && scoreAnalysis.marketTrends.length > 0 && (
          <div 
            className="rounded-[8px] p-6 relative overflow-hidden"
            style={{
              backgroundImage: "url('/card-bg-9.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-[#C9C8CE]" />
            <div className="relative z-10">
              <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-6">
                Market Trends
              </h3>
              <div className="space-y-4">
                {scoreAnalysis.marketTrends.map((trend, i) => (
                  <div key={i} className="p-4 rounded-[8px] bg-[#F8F8F773] border border-[#20202010]">
                    <div className="font-medium text-[24px] text-[#202020] mb-1">{trend.trend}</div>
                    <div className="text-[18px] text-[#202020]">{trend.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regulatory & Risks */}
        {scoreAnalysis.regulatoryAndRisks && scoreAnalysis.regulatoryAndRisks.length > 0 && (
          <div 
            className="rounded-[8px] p-6 relative overflow-hidden"
            style={{
              backgroundImage: "url('/card-bg-3.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-[#D8CDBB]" />
            <div className="relative z-10">
              <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-6">
                Regulatory & Risks
              </h3>
              <div className="space-y-4">
                {scoreAnalysis.regulatoryAndRisks.map((risk, i) => (
                  <div key={i} className="p-5 rounded-[8px] bg-[#F8F8F773] border border-[#20202010]">
                    <div className="font-semibold text-[24px] text-[#202020] mb-2">{risk.risk}</div>
                    <div className="text-[18px] text-[#202020]">
                      <span className="font-medium">Mitigation:</span> {risk.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Competitive Positioning */}
        {scoreAnalysis.competitivePositioning && (
          <div 
            className="rounded-[8px] p-6 relative overflow-hidden"
            style={{
              backgroundImage: "url('/card-bg-8.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-[#E3E2DFBF]" />
            <div className="relative z-10">
              <h3 className="font-['Fustat'] font-medium text-[32px] leading-[36px] tracking-[-0.02em] text-[#202020] mb-6">
                Competitive Positioning
              </h3>
              <div className="space-y-4">
                <div className="p-5 rounded-[8px] bg-[#F8F8F773] border border-[#20202010]">
                  <div className="font-semibold text-[24px] text-[#202020] mb-2">Position</div>
                  <div className="text-[18px] text-[#202020]">{scoreAnalysis.competitivePositioning.position}</div>
                </div>
                <div className="p-5 rounded-[8px] bg-[#F8F8F773] border border-[#20202010]">
                  <div className="font-semibold text-[24px] text-[#202020] mb-2">Market Map</div>
                  <div className="text-[18px] text-[#202020]">{scoreAnalysis.competitivePositioning.mapDescription}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
