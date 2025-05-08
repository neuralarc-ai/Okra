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
import { Download, Share2, ChevronDown, ChevronUp } from 'lucide-react';
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
            progress += Math.random() * 8 + 1;
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
        }, 1000);
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
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-[url('/background.png')] bg-cover bg-top z-0"
      />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Main content */}
        <div className="flex-1 flex flex-col">
        {/* Chat container */}
          {!(isAnalyzing || showResults) && (
        <div 
          ref={inputContainerRef} 
          className={`flex flex-col items-center w-full absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out z-20 gap-4 ${
                'top-1/2 -translate-y-1/2'
          }`}
        >
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-white text-4xl font-bold">Welcome to</span>
              <img src="/okra.png" alt="Okra AI Logo" style={{ height: '40px', width: 'auto' }} className="inline-block align-middle" />
            </div>
            <p className="text-white mt-1">AI Research Analyst for your Products and Services</p>
          </div>
          
            <ChatInput 
              onSubmit={handleSubmit} 
              isAnalyzing={isAnalyzing}
              initialMessage={userInput}
            />
            
            {/* Add TrendingPrompts component */}
            <div className="w-full max-w-2xl mt-8">
              <TrendingPrompts 
                onSelectPrompt={handleSelectTrendingPrompt}
                className="animate-fadeUp"
              />
            </div>
        </div>
          )}

        {/* Analysis progress display */}
          {isAnalyzing && (
          <div className="relative z-10 flex justify-center mt-40">
            <AnalysisProgress 
              progress={analysisProgress} 
              source={currentSource} 
                userInput={userInput}
            />
            </div>
          )}
        
        {/* Analysis results section */}
        <div 
          ref={resultsRef} 
          className={`${
            showResults ? 'opacity-100' : 'opacity-0'
            } transition-all duration-700 ease-in-out relative z-10 mt-12`}
        >
            {showResults && result && (
              <>
                <div className="flex flex-col items-center mb-8 animate-fadeUp">
                  <div />
                  <h2 className="text-3xl font-bold text-black mb-2 tracking-tight">Analysis Results</h2>
                  <p className="text-black text-base max-w-xl text-center">Here are your AI-powered insights and research. Scroll down for detailed breakdowns and actionable recommendations.</p>
                </div>
                
            {/* Query display */}
                <div 
                  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8"
                  onClick={() => setIsQueryExpanded(!isQueryExpanded)}
                >
                  <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="flex-1">
                      <h3 className="text-sm font-medium text-white">Analyzed Business Idea</h3>
                      <p className="mt-1 text-sm text-gray line-clamp-1">
                        {userInput}
                      </p>
                  </div>
                  
                    <div className="flex items-center gap-2 ml-4">
                  <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPDF();
                        }}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-white border-white/20 hover:bg-white/10"
                  >
                    <Download size={16} />
                    <span>PDF</span>
                  </Button>
                  
                  <ShareResultsButton result={result} prompt={userInput} />
                  
                  <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          resetAnalysis();
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsQueryExpanded(!isQueryExpanded);
                        }}
                      >
                        {isQueryExpanded ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expandable Content with Formatted Sections */}
                  <div 
                    className={`transition-all duration-300 ${
                      isQueryExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <div className="w-full h-px bg-white/10 mb-4" />
                      <div className="whitespace-pre-wrap break-words text-white/90 bg-black/20 rounded-lg p-4 text-base font-normal">{userInput}</div>
                    </div>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <ScoreCard 
                      score={result.validationScore} 
                      summary={result.summary}
                      scoreAnalysis={result.scoreAnalysis}
                    />
                    <CompetitorsCard competitors={result.competitors} />
              </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <PricingCard priceSuggestions={result.priceSuggestions} currency={result.currency} />
                <ForecastCard forecast={{
                  ...result.forecasts,
                  averageCase: (result.forecasts as any).averageCase || result.forecasts.bestCase
                }} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <TimelineCard timeline={result.timeline} />
                    <GoToMarketCard goToMarket={result.goToMarket} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <RevenueModelCard revenueModel={result.revenueModel} currency={result.currency} />
                    <MilestonesCard milestones={result.milestones} currency={result.currency} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FinancialPlanCard financialPlan={result.financialPlan} currency={result.currency} />
                    <FundingRequirementsCard fundingRequirements={result.fundingRequirements} currency={result.currency} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ClientsCard clients={result.clients} />
                    <SourcesCard sources={result.sources} />
              </div>
            </div>
              </>
          )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
