import React, { useState, useEffect, useRef } from 'react';
import ChatInput from '@/components/ChatInput';
import ScoreCard from '@/components/ScoreCard';
import CompetitorsCard from '@/components/CompetitorsCard';
import PricingCard from '@/components/PricingCard';
import ForecastCard from '@/components/ForecastCard';
import ClientsCard from '@/components/ClientsCard';
import SourcesCard from '@/components/SourcesCard';
import ShareResultsButton from '@/components/ShareResultsButton';
import AnalysisProgress from '@/components/AnalysisProgress';
import { AnalysisResult } from '@/types/oracle';
import { generateAnalysis } from '@/services/openRouterService';
import { toast } from 'sonner';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/services/pdfService';
import TimelineCard from '@/components/TimelineCard';
import GoToMarketCard from '@/components/GoToMarketCard';
import FinancialPlanCard from '@/components/FinancialPlanCard';
import FundingRequirementsCard from '@/components/FundingRequirementsCard';
import RevenueModelCard from '@/components/RevenueModelCard';
import MilestonesCard from '@/components/MilestonesCard';
import TrendingPrompts from '@/components/TrendingPrompts';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import UserMenu from '@/components/UserMenu';

const Index = () => {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentSource, setCurrentSource] = useState('');
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isQueryExpanded, setIsQueryExpanded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get the user's name or email
  const userName = user?.user_metadata?.full_name || user?.email || 'Guest';

  // Analysis sources with clear research steps
  const analysisSources = [
    'Collecting real-time market data...',
    'Analyzing competitive landscape...',
    'Evaluating viable pricing strategies...',
    'Researching market trends and forecasts...',
    'Identifying potential client segments...',
    'Validating business model viability...',
    'Compiling comprehensive analysis...'
  ];

  // Handle form submission
  const handleSubmit = async (message: string) => {
    if (!message.trim()) {
      toast.error("Please enter a business idea to analyze");
      return;
    }

    setUserInput(message);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentSource('Initializing deep analysis...');
    setShowResults(false);
    
    try {
      if (inputContainerRef.current) {
        inputContainerRef.current.classList.add('translate-y-0', 'top-6');
        inputContainerRef.current.classList.remove('top-1/2', '-translate-y-1/2');
      }

      // Simulate progressive analysis with sources
      let progress = 0;
      let lastSourceIndex = 0;
      const simulateProgress = (onDone: () => void) => {
        const interval = setInterval(() => {
          if (progress < 99) {
            // Base increment is 1% per ~900ms, with a little randomization for organic feel
            progress += 1 + Math.random(); // 1% + up to 1% random
            if (progress > 99) progress = 99;
          } else {
            progress = 99;
          }
          setAnalysisProgress(Math.floor(progress));
          // Update current source being analyzed
          const sourceIndex = Math.floor((progress / 100) * analysisSources.length);
          if (sourceIndex < analysisSources.length) {
            setCurrentSource(analysisSources[sourceIndex]);
            lastSourceIndex = sourceIndex;
          }
          if (progress >= 99) {
            clearInterval(interval);
            onDone();
          }
        }, 900); // ~90 seconds to reach 99%
        return interval;
      };
      
      // Wait for progress to reach 99%
      await new Promise<void>(resolve => {
        simulateProgress(resolve);
      });
      
      // Now actually call the API (while showing 99%)
      const analysis = await generateAnalysis(message);

      // Set to 100% and show the last step for at least 2 seconds
      setAnalysisProgress(100);
      setCurrentSource('Compiling comprehensive analysis...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!analysis) {
        throw new Error("Failed to generate analysis - no data received");
      }
      if (typeof analysis.validationScore !== 'number' || 
          !Array.isArray(analysis.competitors) || 
          !Array.isArray(analysis.priceSuggestions) ||
          !analysis.scoreAnalysis) {
        throw new Error("Invalid analysis data received");
      }
      // Instead of showing results here, navigate to /analysis with state
      navigate('/analysis', { state: { result: analysis, userInput: message } });
    } catch (error) {
      console.error("Error during analysis:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred during analysis");
      resetAnalysis();
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  };
  
  const resetAnalysis = () => {
    setShowResults(false);
    setResult(null);
    setUserInput('');
    setIsQueryExpanded(false);
    if (inputContainerRef.current) {
      inputContainerRef.current.classList.remove('translate-y-0', 'top-6');
      inputContainerRef.current.classList.add('top-1/2', '-translate-y-1/2');
    }
  };
  
  const handleDownloadPDF = async () => {
    if (!result) return;
    
    try {
      toast.info("Preparing PDF for download...");
      await generatePDF(result, userInput);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };
  
  // Add safe parsing for expanded query display
  const [rawTitle = '', rawDesc = ''] = userInput.split('\n\n');
  const getSectionContent = (title: string) => {
    const parts = userInput.split(`${title}\n`);
    if (parts.length < 2) return '';
    return parts[1].split('\n\n')[0].trim();
  };
  
  const handleSelectTrendingPrompt = (prompt: string) => {
    setUserInput(prompt);
    if (inputContainerRef.current) {
      const textarea = inputContainerRef.current.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#FBFAF8]">
      {/* User Menu Button */}
      <div className="absolute top-6 right-6 z-20">
        <UserMenu />
      </div>

      {/* App Name Header */}
      <div className="w-full flex justify-center pt-20">
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
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Chat container */}
          {!(isAnalyzing || showResults) && (
            <div className="relative flex flex-col items-center justify-center flex-grow transition-all duration-500 pt-10" ref={inputContainerRef}>
              <h2 className="font-['Fustat'] font-normal text-[20px] leading-[28px] tracking-[-0.02em] text-center text-[#202020] mt-4 mb-8 max-w-2xl px-4">
                Your AI-powered business analyst. What are you building next?
              </h2>
              <ChatInput onSubmit={handleSubmit} isAnalyzing={isAnalyzing} />
              <TrendingPrompts onSelectPrompt={handleSelectTrendingPrompt} />
            </div>
          )}

          {(isAnalyzing || showResults) && result && (
            <div className="p-8 w-full max-w-[1440px] mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="font-['Fustat'] font-medium text-[40px] leading-[69px] tracking-[-0.02em] align-middle text-[#202020]">
                  Analysis of "{rawTitle}"
                </h2>
                <div className="flex space-x-4">
                  <ShareResultsButton result={result} prompt={userInput} />
                  <Button
                    variant="outline"
                    className="border-[#0000001A] bg-[#FFFFFF47] text-[#000000] rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#FFFFFF47]/80"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <AnalysisProgress progress={analysisProgress} source={currentSource} />

              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <ScoreCard score={result.validationScore} summary={result.summary} scoreAnalysis={result.scoreAnalysis} />
                  <CompetitorsCard competitors={result.competitors} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <PricingCard priceSuggestions={result.priceSuggestions} currency={result.currency} />
                  <ForecastCard forecast={result.forecasts} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FinancialPlanCard financialPlan={result.financialPlan} currency={result.currency} />
                  <RevenueModelCard revenueModel={result.revenueModel} currency={result.currency} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FundingRequirementsCard fundingRequirements={result.fundingRequirements} currency={result.currency} />
                  <MilestonesCard milestones={result.milestones} currency={result.currency} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <GoToMarketCard goToMarket={result.goToMarket} />
                  <TimelineCard timeline={result.timeline} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <ClientsCard clients={result.clients} />
                  <SourcesCard sources={result.sources} />
                </div>
              </>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
