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
    setUserInput(message);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentSource('Initializing deep analysis...');
    setShowResults(false); // Ensure results are hidden during analysis
    
    try {
      // Move input to top of screen
      setTimeout(() => {
        inputContainerRef.current?.classList.add('translate-y-0', 'top-6');
        inputContainerRef.current?.classList.remove('top-1/2', '-translate-y-1/2');
      }, 200);

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
      
      if (analysis) {
        setResult(analysis);
        // Delayed showing of results to ensure smooth animation
        setTimeout(() => {
          setShowResults(true);
          // Ensure resultsRef is in view
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 500);
        }, 1000);
      } else {
        toast.error("Failed to generate analysis");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during analysis");
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  };
  
  const resetAnalysis = () => {
    setShowResults(false);
    setResult(null);
    setUserInput('');
    setTimeout(() => {
      inputContainerRef.current?.classList.remove('translate-y-0', 'top-6');
      inputContainerRef.current?.classList.add('top-1/2', '-translate-y-1/2');
    }, 200);
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
          
          <ChatInput onSubmit={handleSubmit} isAnalyzing={isAnalyzing} />
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
          {/* Top graphic and heading for results */}
          {showResults && (
            <div className="flex flex-col items-center mb-8 animate-fadeUp">
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 mb-4 opacity-70" />
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Analysis Results</h2>
              <p className="text-gray-400 text-base max-w-xl text-center">Here are your AI-powered insights and research. Scroll down for detailed breakdowns and actionable recommendations.</p>
            </div>
          )}
          {/* Query display */}
          {userInput && showResults && (
            <div className="container mx-auto px-4 animate-fadeUp">
              <div className="bg-black/40 backdrop-blur-md rounded-xl mb-6 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg overflow-hidden">
                {/* Query Header */}
                <div 
                  className="p-6 cursor-pointer flex items-center justify-between"
                  onClick={() => setIsQueryExpanded(!isQueryExpanded)}
                >
                  <div className="flex-1">
                    <span className="text-gray-300 text-sm font-medium mb-1 block">Your query:</span>
                    <p className="text-white text-lg line-clamp-2">
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
                        <h3 className="font-medium text-white mb-2">{userInput.split('\n\n')[0]}</h3>
                        <p className="whitespace-pre-wrap">{userInput.split('\n\n')[1]}</p>
                      </div>

                      {/* Problem & Solution */}
                      <div>
                        <h4 className="text-sm font-medium text-white/90 mb-1">Problem & Solution:</h4>
                        <p className="whitespace-pre-wrap">
                          {userInput
                            .split('Problem & Solution:\n')[1]
                            .split('\n\n')[0]
                            .trim()}
                        </p>
                      </div>

                      {/* Market Opportunity */}
                      <div>
                        <h4 className="text-sm font-medium text-white/90 mb-1">Market Opportunity:</h4>
                        <p className="whitespace-pre-wrap">
                          {userInput
                            .split('Market Opportunity:\n')[1]
                            .split('\n\n')[0]
                            .trim()}
                        </p>
                      </div>

                      {/* Target Audience */}
                      <div>
                        <h4 className="text-sm font-medium text-white/90 mb-1">Who it's for:</h4>
                        <ul className="list-disc list-inside pl-2">
                          {userInput
                            .split('Who it\'s for:\n')[1]
                            .split('\n\n')[0]
                            .split('\n')
                            .filter(line => line.trim())
                            .map((line, index) => (
                              <li key={index} className="text-white/80">
                                {line.trim().replace(/^[•-]\s*/, '')}
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Unique Features */}
                      <div>
                        <h4 className="text-sm font-medium text-white/90 mb-1">What makes it unique:</h4>
                        <ul className="list-disc list-inside pl-2">
                          {userInput
                            .split('What makes it unique:\n')[1]
                            .trim()
                            .split('\n')
                            .filter(line => line.trim())
                            .map((line, index) => (
                              <li key={index} className="text-white/80">
                                {line.trim().replace(/^[•-]\s*/, '')}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Results grid */}
          {result && showResults && (
            <div className="container mx-auto px-4 mt-4 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreCard score={result.validationScore} summary={result.summary} />
                <CompetitorsCard competitors={result.competitors} />
                <PricingCard priceSuggestions={result.priceSuggestions} />
                <ForecastCard forecast={result.forecasts} />
                <ClientsCard clients={result.clients} />
                <SourcesCard sources={result.sources || []} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
