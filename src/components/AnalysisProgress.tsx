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
    { name: 'Market research', icon: <Globe size={16} /> },
    { name: 'Competitor analysis', icon: <Network size={16} /> },
    { name: 'Target audience', icon: <Users size={16} /> },
    { name: 'Business model validation', icon: <Gauge size={16} /> },
    { name: 'Revenue projections', icon: <BarChart size={16} /> },
    { name: 'Risk assessment', icon: <Brain size={16} /> },
    { name: 'Project timeline', icon: <Clock size={16} /> },
    { name: 'Go-to-market strategy', icon: <Target size={16} /> },
    { name: 'Funding requirements', icon: <DollarSign size={16} /> },
    { name: 'Financial plan', icon: <Gauge size={16} /> },
    { name: 'Milestones', icon: <Calendar size={16} /> },
    { name: 'Revenue model', icon: <BarChart size={16} /> },
  ];

  return (
    <>
      {progress < 100 ? (
        <div className="w-full min-h-[600px] flex flex-col md:flex-row gap-6 animate-fadeUp mt-8 items-stretch justify-center">
          {/* Left: Progress UI */}
          <div className="flex-1 max-w-2xl p-8 rounded-xl bg-[#FFFFFF] shadow-lg h-full flex flex-col border border-[#B0B7BC]">
            <div className="mb-5 flex items-center gap-2">
              <div className="p-2 bg-[#E3E7EA] rounded-full">
                <Search className="text-[#202020] h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg text-[#202020] font-medium tracking-wide">Deep Analysis in Progress</h3>
                <p className="text-sm text-[#202020]/70">{source}</p>
              </div>
            </div>
            <div className="progress-container h-3 relative overflow-hidden mb-6">
              <div 
                className="progress-bar"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #262626 0%, #3987BE 60%, #D48EA3 100%)' }}
              />
              {/* Particle overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {particles.map(particle => (
                  <div 
                    key={particle.id}
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left: `${particle.x}%`,
                      width: `${particle.size}px`,
                      opacity: particle.opacity,
                      backgroundColor: particle.color,
                      transform: `translateX(-${particle.size / 2}px)`,
                      boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px ${particle.color}80`
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-[#202020]/80 font-medium flex items-center gap-1">
                <Sparkles size={16} className="animate-pulse text-[#3987BE]" /> Okra AI is researching your idea
              </span>
              <span className="text-sm font-medium text-[#202020] bg-[#E3E7EA] px-3 py-1 rounded-full">
                {progress}%
              </span>
            </div>
            {/* Analysis steps */}
            <div className="grid grid-cols-2 gap-4">
              {analysisSteps.map((step, index) => {
                // Adjust the progress threshold for more steps
                const stepThreshold = (index * (100 / analysisSteps.length));
                return (
                  <div 
                    key={step.name} 
                    className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 border ${
                      progress > stepThreshold ? 'bg-[#E3E7EA] border-[#B0B7BC]' : 'bg-transparent border-[#E3E7EA]'
                    }`}
                  >
                    <div 
                      className={`flex items-center justify-center ${
                        progress > stepThreshold ? 'text-[#3987BE]' : 'text-[#B0B7BC]'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span className={`text-xs ${
                      progress > stepThreshold ? 'text-[#202020]' : 'text-[#B0B7BC]'
                    }`}>
                      {step.name}
                    </span>
                    {progress > stepThreshold && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3987BE] animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Right: Analyst Conversation */}
          <div className="flex-1 max-w-xl p-4 md:p-8 rounded-xl bg-[#FFFFFF] shadow-lg h-full flex flex-col border border-[#B0B7BC]">
            {/* Meet the Analyst Team section */}
            <div className="mb-0">
              <div className="text-[#202020]/80 text-sm font-medium mb-2">Meet our analyst team</div>
              <div className="grid grid-cols-2 gap-3">
                {/* Analyst Avatars and Roles */}
                {[
                  { name: 'David', role: 'Manager', img: '/manager-profile.png', color: 'bg-[#22d3ee]/10', border: 'border-[#22d3ee]/30' },
                  { name: 'Emma', role: 'Data Scientist', img: '/emma-profile.png', color: 'bg-[#9b87f5]/10', border: 'border-[#9b87f5]/30' },
                  { name: 'Mike', role: 'Business Strategist', img: '/mike-profile.png', color: 'bg-[#33C3F0]/10', border: 'border-[#33C3F0]/30' },
                  { name: 'Scott', role: 'Financial Analyst', img: '/scott-profile.png', color: 'bg-[#F97316]/10', border: 'border-[#F97316]/30' },
                ].map(a => (
                  <div key={a.name} className={`flex items-center gap-2 px-2 py-1 border rounded-lg ${a.color} ${a.border}`} style={{ minWidth: 0 }}>
                    <img src={a.img} alt={a.name} className="w-7 h-7 rounded-full border border-[#B0B7BC] object-cover" />
                    <div className="flex flex-col min-w-0 max-w-[120px]">
                      <span className="text-sm font-semibold text-[#202020] truncate">{a.name}</span>
                      <span className="text-xs text-[#202020]/60 whitespace-nowrap">{a.role}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-[#202020]/50 mt-2">This analysis is a collaborative team effort by our analysts.</div>
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
