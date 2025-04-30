import React, { useState, useEffect, useRef } from 'react';
import ChatInput from '@/components/ChatInput';
import SettingsButton from '@/components/SettingsButton';
import ScoreCard from '@/components/ScoreCard';
import CompetitorsCard from '@/components/CompetitorsCard';
import PricingCard from '@/components/PricingCard';
import ForecastCard from '@/components/ForecastCard';
import ClientsCard from '@/components/ClientsCard';
import SourcesCard from '@/components/SourcesCard';
import ShareResultsButton from '@/components/ShareResultsButton';
import AnalysisProgress from '@/components/AnalysisProgress';
import { OracleSettings, AnalysisResult } from '@/types/oracle';
import { generateAnalysis } from '@/services/openRouterService';
import { toast } from 'sonner';
import { Download, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/services/pdfService';
import TimelineCard from '@/components/TimelineCard';
import GoToMarketCard from '@/components/GoToMarketCard';
import TrendingPrompts from '@/components/TrendingPrompts';

const Index = () => {
  const [settings, setSettings] = useState<OracleSettings>({
    primaryModel: '',
    fallbackModel: ''
  });
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentSource, setCurrentSource] = useState('');
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isQueryExpanded, setIsQueryExpanded] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('oracleSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings', error);
      }
    }
  }, []);

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
      // Move input to top of screen
      if (inputContainerRef.current) {
        inputContainerRef.current.classList.add('translate-y-0', 'top-6');
        inputContainerRef.current.classList.remove('top-1/2', '-translate-y-1/2');
      }

      // Simulate progressive analysis with sources
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 8 + 1;
          if (progress > 100) progress = 100;
          
          setAnalysisProgress(Math.floor(progress));
          
          // Update current source being analyzed
          const sourceIndex = Math.floor((progress / 100) * analysisSources.length);
          if (sourceIndex < analysisSources.length) {
            setCurrentSource(analysisSources[sourceIndex]);
          }
          
          if (progress >= 100) clearInterval(interval);
        }, 1000);
        return interval;
      };
      
      const progressInterval = simulateProgress();
      
      // Generate analysis
      const analysis = await generateAnalysis(message, settings);
      clearInterval(progressInterval);
      
      if (!analysis) {
        throw new Error("Failed to generate analysis - no data received");
      }

      // Validate required fields
      if (typeof analysis.validationScore !== 'number' || 
          !Array.isArray(analysis.competitors) || 
          !Array.isArray(analysis.priceSuggestions) ||
          !analysis.scoreAnalysis) {
        throw new Error("Invalid analysis data received");
      }

      // Set result and show with delay for smooth animation
      setResult(analysis);
      
      // Use Promise to ensure proper timing
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowResults(true);
      
      // Scroll to results after they're shown
      await new Promise(resolve => setTimeout(resolve, 500));
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }

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
    <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-16">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-[url('/background.png')] bg-cover bg-top z-0"
      />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Settings */}
        <SettingsButton settings={settings} onSettingsChange={setSettings} />
        
        {/* Chat container */}
        {!(isAnalyzing || showResults) && (
        <div 
          ref={inputContainerRef} 
          className={`flex flex-col items-center w-full absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out z-20 gap-4 ${
              'top-1/2 -translate-y-1/2'
          }`}
        >
          <div className="text-center mb-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              <span className="text-white">Welcome to Okra AI</span>
            </h1>
            <p className="text-gray-300 mt-1">AI Research Analyst for your Products and Services</p>
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
                <div className="w-24 h-2 rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 mb-4 opacity-70" />
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Analysis Results</h2>
                <p className="text-gray-400 text-base max-w-xl text-center">Here are your AI-powered insights and research. Scroll down for detailed breakdowns and actionable recommendations.</p>
              </div>

              {/* Query display */}
              <div 
                className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8"
                onClick={() => setIsQueryExpanded(!isQueryExpanded)}
              >
                <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white">Analyzed Business Idea</h3>
                    <p className="mt-1 text-sm text-gray-400 line-clamp-1">
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
                    <div className="space-y-4 text-white/80">
                      {/* Title and Description */}
                      <div>
                        <h4 className="text-sm font-medium text-white/90 mb-1">Problem & Solution:</h4>
                        <p className="whitespace-pre-wrap">{getSectionContent('Problem & Solution:')}</p>
                      </div>

                      {/* Market Opportunity */}
                      <div>
                        <h4 className="text-sm font-medium text-white/90 mb-1">Market Opportunity:</h4>
                        <p className="whitespace-pre-wrap">{getSectionContent('Market Opportunity:')}</p>
                      </div>

                      {/* Target Audience */}
                      <div>
                        <h4 className="text-sm font-medium text-white/90 mb-1">Who it's for:</h4>
                        <ul className="list-disc list-inside pl-2">
                          {getSectionContent("Who it's for:")
                            .split('\n')
                            .filter(line => line.trim())
                            .map((line, index) => (
                              <li key={index} className="text-white/80">{line.trim().replace(/^[•-]\s*/, '')}</li>
                            ))}
                        </ul>
                      </div>

                      {/* Unique Features */}
                      <div>
                        <h4 className="text-sm font-medium text-white/90 mb-1">What makes it unique:</h4>
                        <ul className="list-disc list-inside pl-2">
                          {getSectionContent('What makes it unique:')
                            .split('\n')
                            .filter(line => line.trim())
                            .map((line, index) => (
                              <li key={index} className="text-white/80">{line.trim().replace(/^[•-]\s*/, '')}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
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
                  <PricingCard priceSuggestions={result.priceSuggestions} />
                  <ForecastCard forecast={result.forecasts} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <TimelineCard timeline={result.timeline} />
                  <GoToMarketCard goToMarket={result.goToMarket} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ClientsCard clients={result.clients} />
                  <SourcesCard sources={result.sources} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
