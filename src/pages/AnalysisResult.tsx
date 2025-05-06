import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScoreCard from "@/components/ScoreCard";
import CompetitorsCard from "@/components/CompetitorsCard";
import PricingCard from "@/components/PricingCard";
import ForecastCard from "@/components/ForecastCard";
import TimelineCard from "@/components/TimelineCard";
import GoToMarketCard from "@/components/GoToMarketCard";
import FinancialPlanCard from "@/components/FinancialPlanCard";
import FundingRequirementsCard from "@/components/FundingRequirementsCard";
import RevenueModelCard from "@/components/RevenueModelCard";
import MilestonesCard from "@/components/MilestonesCard";
import ClientsCard from "@/components/ClientsCard";
import SourcesCard from "@/components/SourcesCard";
import { Button } from "@/components/ui/button";
import { Download, Share2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { generatePDF } from "@/services/pdfService";
import ShareResultsButton from "@/components/ShareResultsButton";

const AnalysisResult = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, userInput } = location.state || {};
  const memoizedResult = useMemo(() => result, [result]);
  const [isQueryExpanded, setIsQueryExpanded] = React.useState(false);

  const handleDownloadPDF = React.useCallback(async () => {
    try {
      toast.info("Preparing PDF for download...");
      await generatePDF(memoizedResult, userInput);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  }, [memoizedResult, userInput]);

  if (!memoizedResult || !userInput) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-400 font-bold text-lg mb-4">No analysis result found.</div>
        <Button onClick={() => navigate('/app')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black/80 py-10 px-2 relative">
      {/* Background image, same as main app */}
      <div className="fixed inset-0 bg-[url('/background.png')] bg-cover bg-top z-0 pointer-events-none" />
      <div className="relative z-10 w-full flex flex-col items-center mb-8 animate-fadeUp">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Analysis Results</h2>
        <p className="text-white text-base max-w-xl text-center mb-6">
          Here are your AI-powered insights and research. Scroll down for detailed breakdowns and actionable recommendations.
        </p>
        {/* Analyzed Business Idea Card */}
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 mb-8">
          <div
            className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10"
            onClick={() => setIsQueryExpanded(!isQueryExpanded)}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">Analyzed Business Idea</h3>
              <p className="mt-1 text-sm text-gray line-clamp-1">{userInput}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={e => { e.stopPropagation(); handleDownloadPDF(); }}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-white border-white/20 hover:bg-white/10"
              >
                <Download size={16} />
                <span>PDF</span>
              </Button>
              <ShareResultsButton result={memoizedResult} prompt={userInput} />
              <Button
                onClick={e => { e.stopPropagation(); navigate('/app'); }}
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
              >
                New Analysis
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={e => { e.stopPropagation(); setIsQueryExpanded(!isQueryExpanded); }}
              >
                {isQueryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </Button>
            </div>
          </div>
          {/* Expandable Content with Formatted Sections */}
          <div
            className={`transition-all duration-300 ${
              isQueryExpanded ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="px-6 pb-6">
              <div className="w-full h-px bg-white/10 mb-4" />
              <div className="whitespace-pre-wrap break-words text-white/90 bg-black/20 rounded-lg p-4 text-base font-normal">
                {userInput}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ScoreCard score={memoizedResult.validationScore} summary={memoizedResult.summary} scoreAnalysis={memoizedResult.scoreAnalysis} />
            <CompetitorsCard competitors={memoizedResult.competitors} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <PricingCard priceSuggestions={memoizedResult.priceSuggestions} />
            <ForecastCard forecast={memoizedResult.forecasts} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TimelineCard timeline={memoizedResult.timeline} />
            <GoToMarketCard goToMarket={memoizedResult.goToMarket} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <RevenueModelCard revenueModel={memoizedResult.revenueModel} />
            <MilestonesCard milestones={memoizedResult.milestones} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FinancialPlanCard financialPlan={memoizedResult.financialPlan} />
            <FundingRequirementsCard fundingRequirements={memoizedResult.fundingRequirements} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ClientsCard clients={memoizedResult.clients} />
            <SourcesCard sources={memoizedResult.sources} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default AnalysisResult; 