import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueModel } from '@/types/oracle';
import { ChevronDown, ChevronUp, Target, TrendingUp, Users, BarChart3, AlertCircle, CheckCircle2, XCircle, Calendar, Users2, ArrowUpRight, ArrowDownRight, Lightbulb, Shield, Zap, DollarSign, LineChart, PieChart, Activity, TrendingDown, Building2, Globe, Store } from 'lucide-react';

interface RevenueModelCardProps {
  revenueModel?: RevenueModel;
}

const COLORS = [
  "#8b7cf6", // purple
  "#FFADDF", // pink
  "#FCEC3B", // yellow
  "#fbbf24", // orange
  "#34d399", // green
  "#60a5fa", // blue
];

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
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
}

const RevenueModelCard = ({ revenueModel }: RevenueModelCardProps) => {
  const [expandedStream, setExpandedStream] = useState<string | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  if (!revenueModel) return null;

  const pieData = revenueModel.primaryStreams.map(stream => ({
    name: stream.name,
    value: stream.percentage,
    color: stream.scalability === 'high' ? COLORS[0] : stream.scalability === 'medium' ? COLORS[1] : COLORS[2],
    recurringType: stream.recurringType
  }));

  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  const radius = 90;
  const stroke = 22;
  const gapAngle = 16;
  const cx = radius + stroke;
  const cy = radius + stroke;
  const chartCircum = 360;
  let currentAngle = -90;

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
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-white">Revenue Model</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Analysis Section */}
        {revenueModel.marketAnalysis && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Market Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-white/5 rounded-lg">
                <div className="space-y-2">
                  {renderDetailItem(<DollarSign size={14} />, "Total Addressable Market (TAM)", revenueModel.marketAnalysis.totalAddressableMarket)}
                  {renderDetailItem(<Target size={14} />, "Serviceable Addressable Market (SAM)", revenueModel.marketAnalysis.serviceableAddressableMarket)}
                  {renderDetailItem(<TrendingUp size={14} />, "Serviceable Obtainable Market (SOM)", revenueModel.marketAnalysis.serviceableObtainableMarket)}
                  {renderDetailItem(<Activity size={14} />, "Market Growth Rate", revenueModel.marketAnalysis.marketGrowthRate)}
                </div>
              </div>
              <div className="p-3 border border-white/5 rounded-lg">
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-gray-400">Competitive Landscape</h5>
                  {renderDetailItem(<Users2 size={14} />, "Competitors", revenueModel.marketAnalysis.competitiveLandscape.competitors)}
                  {renderDetailItem(<PieChart size={14} />, "Market Share", revenueModel.marketAnalysis.competitiveLandscape.marketShare)}
                  {renderDetailItem(<Lightbulb size={14} />, "Competitive Advantages", revenueModel.marketAnalysis.competitiveLandscape.competitiveAdvantages)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Projections */}
        {revenueModel.financialProjections && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Financial Projections</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border border-white/5 rounded-lg">
                <h5 className="text-xs font-medium text-gray-400 mb-2">Revenue Growth</h5>
                {renderDetailItem(<TrendingUp size={14} />, "Year 1", revenueModel.financialProjections.revenueGrowth.year1)}
                {renderDetailItem(<TrendingUp size={14} />, "Year 2", revenueModel.financialProjections.revenueGrowth.year2)}
                {renderDetailItem(<TrendingUp size={14} />, "Year 3", revenueModel.financialProjections.revenueGrowth.year3)}
                {renderDetailItem(<AlertCircle size={14} />, "Assumptions", revenueModel.financialProjections.revenueGrowth.assumptions)}
              </div>
              <div className="p-3 border border-white/5 rounded-lg">
                <h5 className="text-xs font-medium text-gray-400 mb-2">Profit Margins</h5>
                {renderDetailItem(<LineChart size={14} />, "Current", revenueModel.financialProjections.profitMargins.current)}
                {renderDetailItem(<Target size={14} />, "Target", revenueModel.financialProjections.profitMargins.target)}
                {renderDetailItem(<Lightbulb size={14} />, "Improvement Strategy", revenueModel.financialProjections.profitMargins.improvementStrategy)}
              </div>
              <div className="p-3 border border-white/5 rounded-lg">
                <h5 className="text-xs font-medium text-gray-400 mb-2">Break-Even Analysis</h5>
                {renderDetailItem(<Target size={14} />, "Break-Even Point", revenueModel.financialProjections.breakEvenAnalysis.point)}
                {renderDetailItem(<Calendar size={14} />, "Timeline", revenueModel.financialProjections.breakEvenAnalysis.timeline)}
                {renderDetailItem(<AlertCircle size={14} />, "Assumptions", revenueModel.financialProjections.breakEvenAnalysis.assumptions)}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Streams Distribution */}
        <div>
          <h4 className="text-sm font-medium text-white mb-4">Revenue Streams</h4>
          <div className="h-[260px] flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center" style={{ minHeight: 2 * (radius + stroke) }}>
              <svg width={2 * (radius + stroke)} height={2 * (radius + stroke)} style={{ display: 'block' }}>
                {pieData.map((entry, idx) => {
                  const valueAngle = (entry.value / total) * (chartCircum - gapAngle * pieData.length);
                  const startAngle = currentAngle + gapAngle / 2;
                  const endAngle = startAngle + valueAngle;
                  const path = describeArc(cx, cy, radius, startAngle, endAngle);
                  currentAngle = endAngle + gapAngle / 2;
                  return (
                    <path
                      key={entry.name}
                      d={path}
                      stroke={entry.color}
                      strokeWidth={stroke}
                      fill="none"
                      strokeLinecap="round"
                      filter="drop-shadow(0 0 8px #0003)"
                    />
                  );
                })}
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="2.6rem"
                  fontWeight="bold"
                  fill="#e5e7eb"
                  style={{ fontFamily: 'inherit' }}
                >
                  {total}
                  <tspan fontSize="1.1rem" x="50%" dy="2.0em" fill="#aaa">Total</tspan>
                </text>
              </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {pieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-xs text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Revenue Streams */}
          <div className="space-y-4 mt-4">
            {revenueModel.primaryStreams.map((stream, index) => {
              const isExpanded = expandedStream === stream.name;
              return (
                <div key={`stream-${index}`} className="border border-white/5 rounded-lg p-3">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedStream(isExpanded ? null : stream.name)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: stream.scalability === 'high' ? COLORS[0] : stream.scalability === 'medium' ? COLORS[1] : COLORS[2] }}
                      />
                      <span className="text-sm text-white">{stream.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{stream.recurringType} • {stream.percentage}%</span>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  {isExpanded && stream.detailedAnalysis && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
                      {renderDetailItem(<Users2 size={14} />, "Target Market", stream.detailedAnalysis.targetMarket)}
                      {renderDetailItem(<Lightbulb size={14} />, "Competitive Advantage", stream.detailedAnalysis.competitiveAdvantage)}
                      
                      {stream.detailedAnalysis.growthPotential && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-400">Growth Potential</h5>
                          {renderDetailItem(<ArrowUpRight size={14} />, "Short Term", stream.detailedAnalysis.growthPotential.shortTerm)}
                          {renderDetailItem(<ArrowUpRight size={14} />, "Long Term", stream.detailedAnalysis.growthPotential.longTerm)}
                          {renderDetailItem(<AlertCircle size={14} />, "Assumptions", stream.detailedAnalysis.growthPotential.assumptions)}
                        </div>
                      )}

                      {stream.detailedAnalysis.implementationRequirements && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-400">Implementation Requirements</h5>
                          {renderDetailItem(<Users size={14} />, "Resources", stream.detailedAnalysis.implementationRequirements.resources)}
                          {renderDetailItem(<Calendar size={14} />, "Timeline", stream.detailedAnalysis.implementationRequirements.timeline)}
                          {renderDetailItem(<AlertCircle size={14} />, "Dependencies", stream.detailedAnalysis.implementationRequirements.dependencies)}
                        </div>
                      )}

                      {stream.detailedAnalysis.riskFactors && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-400">Risk Factors</h5>
                          {renderDetailItem(<XCircle size={14} />, "Risks", stream.detailedAnalysis.riskFactors.risks)}
                          {renderDetailItem(<Shield size={14} />, "Mitigations", stream.detailedAnalysis.riskFactors.mitigations)}
                        </div>
                      )}

                      {stream.detailedAnalysis.marketConditions && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-400">Market Conditions</h5>
                          {renderDetailItem(<BarChart3 size={14} />, "Current State", stream.detailedAnalysis.marketConditions.current)}
                          {renderDetailItem(<TrendingUp size={14} />, "Trends", stream.detailedAnalysis.marketConditions.trends)}
                          {renderDetailItem(<Lightbulb size={14} />, "Opportunities", stream.detailedAnalysis.marketConditions.opportunities)}
                        </div>
                      )}

                      {stream.detailedAnalysis.customerValue && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-400">Customer Value</h5>
                          {renderDetailItem(<Lightbulb size={14} />, "Value Proposition", stream.detailedAnalysis.customerValue.valueProposition)}
                          {renderDetailItem(<AlertCircle size={14} />, "Pain Points", stream.detailedAnalysis.customerValue.painPoints)}
                          {renderDetailItem(<DollarSign size={14} />, "Willingness to Pay", stream.detailedAnalysis.customerValue.willingnessToPay)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Key Metrics</h4>
          <div className="grid gap-2">
            {revenueModel.metrics.map((metric, index) => {
              const isExpanded = expandedMetric === metric.name;
              return (
                <div key={`metric-${index}`} className="border border-white/5 rounded-lg p-3">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedMetric(isExpanded ? null : metric.name)}
                  >
                    <div>
                      <div className="text-sm text-white">{metric.name}</div>
                      <div className="text-xs text-gray-400">{metric.timeframe}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-white">{metric.target}</div>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  {isExpanded && metric.detailedMetrics && (
                    <div className="mt-4 space-y-2 pt-4 border-t border-white/5">
                      {renderDetailItem(<AlertCircle size={14} />, "Definition", metric.detailedMetrics.definition)}
                      {renderDetailItem(<BarChart3 size={14} />, "Calculation", metric.detailedMetrics.calculation)}
                      {renderDetailItem(<Lightbulb size={14} />, "Importance", metric.detailedMetrics.importance)}
                      {renderDetailItem(<Target size={14} />, "Industry Benchmark", metric.detailedMetrics.industryBenchmark)}
                      {renderDetailItem(<TrendingUp size={14} />, "Improvement Strategy", metric.detailedMetrics.improvementStrategy)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Strategy */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Growth Strategy</h4>
          <div className="space-y-3">
            {revenueModel.growthStrategy.map((strategy, index) => {
              const isExpanded = expandedStrategy === strategy.phase;
              return (
                <div key={`strategy-${index}`} className="border border-white/5 rounded-lg p-3">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedStrategy(isExpanded ? null : strategy.phase)}
                  >
                    <span className="text-sm font-medium text-white">{strategy.phase}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{strategy.timeline}</span>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  {isExpanded && strategy.detailedStrategy && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
                      {renderDetailItem(<Target size={14} />, "Objectives", strategy.detailedStrategy.objectives)}
                      {renderDetailItem(<Zap size={14} />, "Key Activities", strategy.detailedStrategy.keyActivities)}
                      {renderDetailItem(<CheckCircle2 size={14} />, "Success Criteria", strategy.detailedStrategy.successCriteria)}
                      {renderDetailItem(<Users size={14} />, "Resource Requirements", strategy.detailedStrategy.resourceRequirements)}

                      {strategy.detailedStrategy.riskAssessment && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-400">Risk Assessment</h5>
                          {renderDetailItem(<XCircle size={14} />, "Risks", strategy.detailedStrategy.riskAssessment.risks)}
                          {renderDetailItem(<Shield size={14} />, "Mitigations", strategy.detailedStrategy.riskAssessment.mitigations)}
                        </div>
                      )}

                      {strategy.detailedStrategy.marketAnalysis && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-400">Market Analysis</h5>
                          {renderDetailItem(<Users2 size={14} />, "Target Segments", strategy.detailedStrategy.marketAnalysis.targetSegments)}
                          {renderDetailItem(<BarChart3 size={14} />, "Competitive Position", strategy.detailedStrategy.marketAnalysis.competitivePosition)}
                          {renderDetailItem(<Lightbulb size={14} />, "Growth Opportunities", strategy.detailedStrategy.marketAnalysis.growthOpportunities)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Risks */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Risk Analysis</h4>
          <div className="space-y-3">
            {revenueModel.risks.map((risk, index) => {
              const isExpanded = expandedRisk === risk.category;
              return (
                <div key={`risk-${index}`} className="border border-white/5 rounded-lg p-3">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedRisk(isExpanded ? null : risk.category)}
                  >
                    <div>
                      <span className="text-sm font-medium text-white">{risk.category}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          risk.probability === 'high' ? 'bg-red-500/20 text-red-300' :
                          risk.probability === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {risk.probability} probability
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          risk.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                          risk.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {risk.impact} impact
                        </span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>

                  {isExpanded && risk.detailedRisk && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
                      {renderDetailItem(<AlertCircle size={14} />, "Description", risk.detailedRisk.description)}
                      {renderDetailItem(<XCircle size={14} />, "Triggers", risk.detailedRisk.triggers)}
                      {renderDetailItem(<AlertCircle size={14} />, "Early Warning Signs", risk.detailedRisk.earlyWarningSigns)}
                      {renderDetailItem(<Shield size={14} />, "Contingency Plans", risk.detailedRisk.contingencyPlans)}
                      {renderDetailItem(<BarChart3 size={14} />, "Monitoring Metrics", risk.detailedRisk.monitoringMetrics)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueModelCard; 