import React, { useEffect, useState } from 'react';
import { Sparkles, BarChart, Network, Globe, Search, Gauge, Users, Brain, Clock, Target, DollarSign, Calendar } from 'lucide-react';
import AnalystConversation from './AnalystConversation';
import ScoreCard from './ScoreCard';
import ClientsCard from './ClientsCard';
import CompetitorsCard from './CompetitorsCard';
import PricingCard from './PricingCard';
import ForecastCard from './ForecastCard';
import GoToMarketCard from './GoToMarketCard';
import MilestonesCard from './MilestonesCard';
import FinancialPlanCard from './FinancialPlanCard';
import FundingRequirementsCard from './FundingRequirementsCard';
import RevenueModelCard from './RevenueModelCard';
import SourcesCard from './SourcesCard';
import { AnalysisResult } from '@/types/oracle';

// Import SVG icons
import MarketResearchIcon from '@/icons/market-research.svg';
import CompetitorAnalysisIcon from '@/icons/competitor-analysis.svg';
import TargetAudienceIcon from '@/icons/target-audience.svg';
import BusinessModelIcon from '@/icons/business-model.svg';
import RevenueProjectionsIcon from '@/icons/revenue-projections.svg';
import RiskAssessmentIcon from '@/icons/risk-assessment.svg';
import ProjectTimelineIcon from '@/icons/project-timeline.svg';
import GoToMarketIcon from '@/icons/go-to-market.svg';
import FundingRequirementsIcon from '@/icons/funding-requirements.svg';
import FinancialPlanIcon from '@/icons/financial-plan.svg';
import MilestonesIcon from '@/icons/milestones.svg';
import CompilingReportIcon from '@/icons/compiling-report.svg';

interface AnalysisProgressProps {
  progress: number;
  source: string;
  userInput?: string;
  result?: AnalysisResult | null;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ progress, source, userInput, result }) => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, size: number, speed: number, opacity: number, color: string}>>([]);
  
  // Generate random particles for the animation
  useEffect(() => {
    const particleCount = 25;
    const colors = ['#ffffff', '#9b87f5', '#7E69AB', '#61dafb'];
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setParticles(newParticles);
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: (particle.x + particle.speed) % 100
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Analysis steps with icons
  const analysisSteps = [
    { name: 'Market research', icon: '/icons/market-research.svg' },
    { name: 'Competitor analysis', icon: '/icons/competitor-analysis.svg' },
    { name: 'Target audience', icon: '/icons/target-audience.svg' },
    { name: 'Business model validation', icon: '/icons/business-model.svg' },
    { name: 'Revenue projections', icon: '/icons/revenue-projections.svg' },
    { name: 'Risk assessment', icon: '/icons/risk-assessment.svg' },
    { name: 'Project timeline', icon: '/icons/project-timeline.svg' },
    { name: 'Go-to-market strategy', icon: '/icons/gtm-strategy.svg' },
    { name: 'Funding requirements', icon: '/icons/funding-requirements.svg' },
    { name: 'Financial plan', icon: '/icons/financial-plan.svg' },
    { name: 'Milestones', icon: '/icons/milestones.svg' },
    { name: 'Compiling report', icon: '/icons/revenue-model.svg' },
  ];

  return (
    <>
      {progress < 100 ? (
        <div className="w-full min-h-[600px] flex flex-col md:flex-row gap-6 animate-fadeUp mt-8 items-stretch justify-center">
          {/* Left: Progress UI */}
          <div className="flex-1 max-w-2xl p-8 rounded-2xl   h-full flex flex-col  ">
            <div className="mb-5 flex items-center gap-2">
              <div className="p-2 bg-[#B7BEAE40] rounded-full">
                <Search className="text-[#2B2521] h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl text-[#2B2521] font-semibold tracking-wide">Deep analysis in progress</h3>
                <p className="text-base text-[#2B2521]/80">{source}</p>
              </div>
            </div>
            {/* Progress bar card */}
            <div
              className="w-full rounded-[8px] p-4 mb-8"
              style={{
                backgroundImage: "url('/Effect2.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                boxShadow: '0 2px 16px 0 rgba(30,30,30,0.07)'
              }}
            >
              <div className="w-full rounded-[8px] bg-[#FFFFFF] px-8 pt-6 pb-6 flex flex-col" style={{ minHeight: '110px' }}>
                <div className="w-full h-2 mb-6 mt-1 rounded-full bg-[#E7E7E7] overflow-hidden">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #3987BE 0%, #D48EA3 60%, #E6A6B7 100%)',
                      transition: 'width 0.5s cubic-bezier(.4,2,.6,1)',
                    }}
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  <span
                    className="text-[#0A0A0A]"
                    style={{
                      fontFamily: 'Fustat',
                      fontWeight: 400,
                      fontSize: '20px',
                      lineHeight: '24px',
                      letterSpacing: '-2%',
                      verticalAlign: 'middle',
                    }}
                  >
                    Helium AI is researching your idea
                  </span>
                  <span className="text-[#0A0A0A] text-2xl font-semibold" style={{ fontFamily: 'Fustat', fontWeight: 500 }}>{progress}%</span>
                </div>
              </div>
            </div>
            {/* Analysis steps */}
            <div className="w-full max-w-[649px] mx-auto">
              {[0,2,4,6,8,10].map((rowIdx) => (
                <div key={rowIdx} className="flex gap-x-2 mb-2 last:mb-0">
                  {[0,1].map((colIdx) => {
                    const index = rowIdx + colIdx;
                    if (index >= analysisSteps.length) return null;
                    const step = analysisSteps[index];
                    const stepThreshold = (index * (100 / analysisSteps.length));
                    const isActive = progress > stepThreshold;
                    const isLastActive = isActive && (index === analysisSteps.length - 1 || progress < ((index + 1) * (100 / analysisSteps.length)));
                    return (
                      <div
                        key={step.name}
                        className="flex items-center gap-2 flex-1"
                        style={{
                          borderRadius: '12px',
                          padding: '16px',
                          background: isLastActive ? '#B7BEAE40' : (isActive ? '#CCCFC7' : '#B7BEAE40'),
                        }}
                      >
                        <div 
                          style={{
                            color: '#2B2521', 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '4px'
                          }}
                        >
                          <img src={step.icon} alt={step.name} className="w-8 h-8" />
                        </div>
                        <span style={{color: '#2B2521', fontSize: '16px', fontWeight: 400}}>
                          {step.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* Right: Analyst Conversation */}
          <div className="flex-1 max-w-2xl p-4 md:p-8 rounded-2xl bg-[#F0EDE9] h-full flex flex-col ">
            {/* Meet the Analyst Team section */}
            <div className="mb-0">
              <div className="text-[#2B2521] text-base font-semibold mb-2">Meet our analyst team</div>
              <div className="grid grid-cols-2 gap-4">
                {/* Analyst Avatars and Roles */}
                {[
                  { name: 'Zane', role: 'Team Leader', desc: 'Assigns tasks to team based on the user input', img: '/zane-profile.png' },
                  { name: 'Mira', role: 'Data Scientist', desc: 'Analyzes and interprets complex data to help organizations.', img: '/mira-profile.png' },
                  { name: 'Chloe', role: 'Financial Analyst', desc: 'Evaluates financial data to guide investment & business decisions.', img: '/chloe-profile.png' },
                  { name: 'Axel', role: 'Business Strategist', desc: 'Develops plans to drive growth and achieve long-term goals.', img: '/axel-profile.png' },
                ].map(a => (
                  <div key={a.name} className="flex bg-[#FFFFFF] items-center gap-4 px-5 py-4 rounded-xl min-h-[110px]">
                    <img src={a.img} alt={a.name} className="w-[80px] h-[80px] rounded-full object-cover" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-['Fustat'] font-normal text-[16px] leading-[20px] text-[#202020] truncate">{a.name}</span>
                      <span className="font-['Fustat'] font-normal text-[12px] leading-[16px] text-[#202020] mt-0.5">{a.role}</span>
                      <span className="font-['Fustat'] font-light text-[10px] leading-[16px] text-[#202020] mt-1">{a.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-[#000000] mt-2 mb-3">This analysis is a collaborative team effort by our analysts.</div>
            </div>
            <AnalystConversation progress={progress} userInput={userInput} />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl animate-fadeUp mt-8 p-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
          {/* Render all cards if result is available and progress is 100 */}
          {result && progress >= 100 && (
            <div className="space-y-6 mt-8">
              <ScoreCard score={result.validationScore} summary={result.summary} scoreAnalysis={result.scoreAnalysis} />
              <ClientsCard clients={result.clients} />
              <CompetitorsCard competitors={result.competitors} />
              <PricingCard priceSuggestions={result.priceSuggestions} currency={result.currency} />
              <ForecastCard forecast={{
                ...result.forecasts,
                averageCase: {
                  revenue: (result.forecasts.bestCase.revenue + result.forecasts.worstCase.revenue) / 2,
                  marketShare: (result.forecasts.bestCase.marketShare + result.forecasts.worstCase.marketShare) / 2,
                  customers: (result.forecasts.bestCase.customers + result.forecasts.worstCase.customers) / 2
                }
              }} />
              <GoToMarketCard goToMarket={result.goToMarket} />
              <MilestonesCard milestones={result.milestones} currency={result.currency} />
              <FinancialPlanCard financialPlan={result.financialPlan} currency={result.currency} />
              <FundingRequirementsCard fundingRequirements={result.fundingRequirements} currency={result.currency} />
              <RevenueModelCard revenueModel={result.revenueModel} currency={result.currency} />
              <SourcesCard sources={result.sources} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AnalysisProgress;
