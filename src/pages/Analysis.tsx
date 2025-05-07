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
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
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
    navigate('/app');
  };

  React.useEffect(() => {
    if (!result) {
      // If no result, redirect back to main page
      navigate("/app");
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[url('/background.png')] bg-cover bg-top z-0" />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <div className="flex-1 flex flex-col items-center w-full py-8">
          <div className="flex flex-col items-center mb-8 animate-fadeUp">
            <h2 className="text-3xl font-bold text-black mb-2 tracking-tight">Analysis Results</h2>
            <p className="text-black text-base max-w-xl text-center">Here are your AI-powered insights and research. Scroll down for detailed breakdowns and actionable recommendations.</p>
          </div>
          {/* Query display section restored from Index.tsx */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8" onClick={() => setIsQueryExpanded(!isQueryExpanded)}>
            <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">Analyzed Business Idea</h3>
                <p className="mt-1 text-sm text-gray line-clamp-1">{userInput}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button onClick={e => { e.stopPropagation(); handleDownloadPDF(); }} variant="outline" size="sm" className="flex items-center gap-1 text-white border-white/20 hover:bg-white/10">
                  <Download size={16} />
                  <span>PDF</span>
                </Button>
                <ShareResultsButton result={result} prompt={userInput} />
                <Button onClick={e => { e.stopPropagation(); handleNewAnalysis(); }} variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                  New Analysis
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={e => { e.stopPropagation(); setIsQueryExpanded(!isQueryExpanded); }}>
                  {isQueryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
              </div>
            </div>
            {/* Expandable Content with Formatted Sections */}
            <div className={`transition-all duration-300 ${isQueryExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              <div className="px-6 pb-6">
                <div className="w-full h-px bg-white/10 mb-4" />
                <div className="whitespace-pre-wrap break-words text-white/90 bg-black/20 rounded-lg p-4 text-base font-normal">{userInput}</div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-6xl mx-auto bg-black/40 rounded-xl p-6 border border-white/10 shadow-lg animate-fadeUp">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-center mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="pricing-revenue">Pricing & Revenue</TabsTrigger>
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
                <TabsTrigger value="go-to-market">Go-to-Market</TabsTrigger>
                <TabsTrigger value="timeline-milestones">Timeline & Milestones</TabsTrigger>
                <TabsTrigger value="financial-plan">Financial Plan</TabsTrigger>
                <TabsTrigger value="clients-sources">Clients & Sources</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                {/* Overview: ScoreCard, summary, recommendations */}
                <ScoreCard score={result.validationScore} summary={result.summary} scoreAnalysis={result.scoreAnalysis} />
                {/* TODO: Add executive summary, recommendations, etc. */}
              </TabsContent>
              <TabsContent value="competitors">
                <CompetitorsCard competitors={result.competitors} />
              </TabsContent>
              <TabsContent value="pricing-revenue">
                <PricingCard priceSuggestions={result.priceSuggestions} />
                <RevenueModelCard revenueModel={result.revenueModel} />
              </TabsContent>
              <TabsContent value="forecast">
                <ForecastCard forecast={result.forecasts} />
              </TabsContent>
              <TabsContent value="go-to-market">
                <GoToMarketCard goToMarket={result.goToMarket} />
              </TabsContent>
              <TabsContent value="timeline-milestones">
                <TimelineCard timeline={result.timeline} />
                <MilestonesCard milestones={result.milestones} />
              </TabsContent>
              <TabsContent value="financial-plan">
                <FinancialPlanCard financialPlan={result.financialPlan} />
                <FundingRequirementsCard fundingRequirements={result.fundingRequirements} />
              </TabsContent>
              <TabsContent value="clients-sources">
                <ClientsCard clients={result.clients} />
                <SourcesCard sources={result.sources} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Analysis; 