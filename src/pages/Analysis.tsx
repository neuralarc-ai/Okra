import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ScoreCard from "@/components/ScoreCard";
import CompetitorsCard from "@/components/CompetitorsCard";
import PricingCard from "@/components/PricingCard";
import RevenueModelCard from "@/components/RevenueModelCard";
import ForecastCard from "@/components/ForecastCard";
import GoToMarketCard from "@/components/GoToMarketCard";
import TimelineCard from "@/components/TimelineCard";
import MilestonesCard from "@/components/MilestonesCard";
import FinancialPlanCard from "@/components/FinancialPlanCard";
import FundingRequirementsCard from "@/components/FundingRequirementsCard";
import ClientsCard from "@/components/ClientsCard";
import SourcesCard from "@/components/SourcesCard";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Download, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import ShareResultsButton from '@/components/ShareResultsButton';
import { generatePDF } from '@/services/pdfService';

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // TODO: Wire up real data from location.state or global store
  const result = location.state?.result;
  const userInput = location.state?.userInput;

  const [isQueryExpanded, setIsQueryExpanded] = React.useState(false);

  const handleDownloadPDF = async () => {
    if (!result) return;
    try {
      await generatePDF(result, userInput);
    } catch (error) {
      // Optionally show a toast if you use one
      console.error('Failed to generate PDF:', error);
    }
  };
  const handleNewAnalysis = () => {
    navigate('/');
  };

  React.useEffect(() => {
    if (!result) {
      // If no result, redirect back to landing page
      navigate("/");
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#F2F0EB] grain-texture">
      {/* App Name Header */}
      <div className="w-full flex justify-center pt-8 pb-2">
        <h1
          className="text-center"
          style={{
            fontFamily: 'Fustat',
            fontWeight: 500,
            fontSize: '32px',
            lineHeight: '40px',
            letterSpacing: '3%',
            verticalAlign: 'middle',
            color: '#1E1E1E',
          }}
        >
          Helium AI
        </h1>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <div className="flex-1 flex flex-col items-center w-full py-8">
          <div className="w-full max-w-[1440px] mx-auto px-12">
          <div className="flex flex-col items-center mb-8 animate-fadeUp w-full">
            <h2 className="text-[64px] font-semibold text-black mb-2 tracking-tight">Analysis Results</h2>
            <p className="text-black text-base font-[300] lg:text-2xl max-w-full text-center">Here are your AI-powered insights and research. Scroll down for detailed breakdowns and actionable recommendations.</p>
          </div>
          {/* Query display section restored from Index.tsx */}
            <div className="mb-8 w-full" onClick={() => setIsQueryExpanded(!isQueryExpanded)}>
            <div className="flex items-center justify-between p-4 bg-[#E0D9D1] rounded-[8px] w-full">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#161616]">Analyzed Business Idea</h3>
                <p className="mt-1 text-sm text-[#161616] line-clamp-1">{userInput}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button 
                  onClick={e => { e.stopPropagation(); handleDownloadPDF(); }} 
                  variant="ghost" 
                  size="icon" 
                  className="w-[72px] h-[72px] p-0 hover:bg-transparent"
                >
                  <img src="/pdf.svg" alt="Download PDF" className="w-full h-full" />
                </Button>
                <Button 
                  onClick={e => { 
                    e.stopPropagation(); 
                    if (result) {
                      const shareText = `Helium AI Analysis of "${userInput}" - Validation Score: ${result.validationScore}/100`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'Helium AI Analysis',
                          text: shareText,
                        }).catch(() => {
                          navigator.clipboard.writeText(
                            `Helium AI Analysis Results\n\nProduct/Service Idea: "${userInput}"\nValidation Score: ${result.validationScore}/100\n\nSummary: ${result.summary}`
                          );
                        });
                      } else {
                        navigator.clipboard.writeText(
                          `Helium AI Analysis Results\n\nProduct/Service Idea: "${userInput}"\nValidation Score: ${result.validationScore}/100\n\nSummary: ${result.summary}`
                        );
                      }
                    }
                  }}
                  variant="ghost" 
                  size="icon" 
                  className="w-[72px] h-[72px] p-0 hover:bg-transparent"
                >
                  <img src="/share.svg" alt="Share Results" className="w-full h-full" />
                </Button>
                <Button 
                  onClick={e => { e.stopPropagation(); handleNewAnalysis(); }} 
                  variant="ghost" 
                  className="h-[64px] bg-[#2B2521] text-white hover:bg-[#2B2521]/90 hover:text-white duration-300 transition-all ease-in-out rounded-[4px] px-[27px] py-[16px] flex items-center gap-2"
                >
                  New Analysis
                  <ArrowRight size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#2B2521]  " onClick={e => { e.stopPropagation(); setIsQueryExpanded(!isQueryExpanded); }}>
                  {isQueryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
              </div>
            </div>
            {/* Expandable Content with Formatted Sections */}
            <div className={`transition-all duration-300 ${isQueryExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              <div className="px-6 pb-6">
                <div className="w-full h-px bg-white/10 mb-4" />
                <div className="whitespace-pre-wrap break-words text-black bg-[#F2EFEB] rounded-lg p-4 text-base font-normal">{userInput}</div>
              </div>
            </div>
          </div>
            <div className="w-full animate-fadeUp">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full flex overflow-x-scroll flex-nowrap justify-between mb-6 h-fit py-2 bg-[#2B2521]  rounded-[8px]">
                <TabsTrigger value="overview" className="text-white w-full font-normal rounded mx-1 tracking-wide px-3 py-[11px] text-sm data-[state=active]:bg-[#FBFAF8] data-[state=active]:text-[#2B2521] hover:bg-[#000000]/20 ease-in-out transition-colors duration-300">Overview</TabsTrigger>
                <TabsTrigger value="competitors" className="text-white w-full font-normal rounded mx-1 tracking-normal px-3 py-[11px] text-sm data-[state=active]:bg-[#FBFAF8] data-[state=active]:text-[#2B2521] transition-colors">Competitors</TabsTrigger>
                <TabsTrigger value="pricing-revenue" className="text-white w-full font-normal rounded mx-1 tracking-normal px-3 py-[11px] text-sm data-[state=active]:bg-[#FBFAF8] data-[state=active]:text-[#2B2521] transition-colors">Pricing & Revenue</TabsTrigger>
                <TabsTrigger value="forecast" className="text-white w-full font-normal rounded mx-1 px-3 tracking-normal py-[11px] text-sm data-[state=active]:bg-[#FBFAF8] data-[state=active]:text-[#2B2521] transition-colors">Forecast</TabsTrigger>
                <TabsTrigger value="go-to-market" className="text-white w-full font-normal rounded mx-1 px-3 tracking-normal py-[11px] text-sm data-[state=active]:bg-[#FBFAF8] data-[state=active]:text-[#2B2521] transition-colors">Go-to-Market</TabsTrigger>
                <TabsTrigger value="timeline-milestones" className="text-white w-full font-normal rounded tracking-normal mx-1 px-3 py-[11px] text-sm data-[state=active]:bg-[#FBFAF8] data-[state=active]:text-[#2B2521] transition-colors">Timeline & Milestones</TabsTrigger>
                <TabsTrigger value="financial-plan" className="text-white w-full font-normal rounded mx-1 tracking-normal px-3 py-[11px] text-sm data-[state=active]:bg-[#FBFAF8] data-[state=active]:text-[#2B2521] transition-colors">Financial Plan</TabsTrigger>
                <TabsTrigger value="clients-sources" className="text-white w-full font-normal rounded mx-1 tracking-normal px-3 py-[11px] text-sm data-[state=active]:bg-[#FBFAF8] data-[state=active]:text-[#2B2521] transition-colors">Clients & Sources</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                {/* Overview: ScoreCard, summary, recommendations */}
                <ScoreCard score={result.validationScore} summary={result.summary} scoreAnalysis={result.scoreAnalysis} />
                {/* TODO: Add executive summary, recommendations, etc. */}
              </TabsContent>
              <TabsContent value="competitors">
                <CompetitorsCard competitors={result.competitors} />
              </TabsContent>
              <TabsContent value="pricing-revenue" className="flex flex-col gap-4">
                <PricingCard priceSuggestions={result.priceSuggestions} currency={result.currency} />
                <RevenueModelCard revenueModel={result.revenueModel} currency={result.currency} />
              </TabsContent>
              <TabsContent value="forecast">
                <ForecastCard forecast={result.forecasts} />
              </TabsContent>
              <TabsContent value="go-to-market">
                <GoToMarketCard goToMarket={result.goToMarket} />
              </TabsContent>
              <TabsContent value="timeline-milestones" className="flex flex-col gap-4">
                <TimelineCard timeline={result.timeline} />
                <MilestonesCard milestones={result.milestones} currency={result.currency} />
              </TabsContent>
              <TabsContent value="financial-plan" className="flex flex-col gap-4 border-none outline-none">
                <FinancialPlanCard financialPlan={result.financialPlan} currency={result.currency} />
                <FundingRequirementsCard fundingRequirements={result.fundingRequirements} currency={result.currency} />
              </TabsContent>
              <TabsContent value="clients-sources" className="flex flex-col gap-4">
                <ClientsCard clients={result.clients} />
                <SourcesCard sources={result.sources} />
              </TabsContent>
            </Tabs>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Analysis; 