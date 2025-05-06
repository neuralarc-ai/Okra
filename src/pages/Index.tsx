import React, { useState, useEffect, useRef } from "react";
import ChatInput from "@/components/ChatInput";
import ScoreCard from "@/components/ScoreCard";
import CompetitorsCard from "@/components/CompetitorsCard";
import PricingCard from "@/components/PricingCard";
import ForecastCard from "@/components/ForecastCard";
import ClientsCard from "@/components/ClientsCard";
import SourcesCard from "@/components/SourcesCard";
import ShareResultsButton from "@/components/ShareResultsButton";
import AnalysisProgress from "@/components/AnalysisProgress";
import { AnalysisResult } from "@/types/oracle";
import { generateAnalysis } from "@/services/openRouterService";
import { toast } from "sonner";
import { Download, Share2, ChevronDown, ChevronUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/services/pdfService";
import TimelineCard from "@/components/TimelineCard";
import GoToMarketCard from "@/components/GoToMarketCard";
import FinancialPlanCard from "@/components/FinancialPlanCard";
import FundingRequirementsCard from "@/components/FundingRequirementsCard";
import RevenueModelCard from "@/components/RevenueModelCard";
import MilestonesCard from "@/components/MilestonesCard";
import TrendingPrompts from "@/components/TrendingPrompts";
import Footer from "@/components/Footer";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import AccountModal from '@/components/AccountModal';

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentSource, setCurrentSource] = useState("");
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Analysis sources with clear research steps
  const analysisSources = [
    "Collecting real-time market data...",
    "Analyzing competitive landscape...",
    "Evaluating viable pricing strategies...",
    "Researching market trends and forecasts...",
    "Identifying potential client segments...",
    "Validating business model viability...",
    "Compiling comprehensive analysis...",
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
    setCurrentSource("Initializing deep analysis...");

    try {
      if (inputContainerRef.current) {
        inputContainerRef.current.classList.add("translate-y-0", "top-6");
        inputContainerRef.current.classList.remove(
          "top-1/2",
          "-translate-y-1/2"
        );
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
          const sourceIndex = Math.floor(
            (progress / 100) * analysisSources.length
          );
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
      await new Promise<void>((resolve) => {
        simulateProgress(resolve);
      });
      
      // Now actually call the API (while showing 99%)
      const analysis = await generateAnalysis(message);

      // Defensive: If analysis is null or not an object, handle error
      if (!analysis || typeof analysis !== "object") {
        throw new Error("No analysis data received from API.");
      }

      // Defensive: Check for all required fields
      if (
        typeof analysis.validationScore !== "number" ||
        !Array.isArray(analysis.competitors) ||
        !Array.isArray(analysis.priceSuggestions) ||
        !analysis.scoreAnalysis
      ) {
        throw new Error("Invalid analysis data received from API.");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate('/analysis', { state: { result: analysis, userInput: message } });
    } catch (error) {
      console.error("Error during analysis:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during analysis"
      );
      resetAnalysis();
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  };
  
  const resetAnalysis = () => {
    setUserInput("");
    if (inputContainerRef.current) {
      inputContainerRef.current.classList.remove("translate-y-0", "top-6");
      inputContainerRef.current.classList.add("top-1/2", "-translate-y-1/2");
    }
  };

  // Add safe parsing for expanded query display
  const [rawTitle = "", rawDesc = ""] = userInput.split("\n\n");
  const getSectionContent = (title: string) => {
    const parts = userInput.split(`${title}\n`);
    if (parts.length < 2) return "";
    return parts[1].split("\n\n")[0].trim();
  };

  const handleSelectTrendingPrompt = (prompt: string) => {
    setUserInput(prompt);
    if (inputContainerRef.current) {
      const textarea = inputContainerRef.current.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/auth');
      } else {
        const { user } = data.session;
        setUser({
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
        });
      }
    })();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };
  
  return (
    <>
      {/* Settings Icon and Account Modal */}
      {!isAnalyzing && (
        <div className="fixed top-6 right-6 z-30">
          <button
            className="p-2 rounded-full bg-black/40 border border-white/10 hover:bg-black/60 transition-all shadow-lg"
            onClick={() => setAccountOpen(true)}
            aria-label="Account settings"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
      {accountOpen && (
        <AccountModal
          open={accountOpen}
          onClose={() => setAccountOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <div className="min-h-screen flex flex-col justify-between relative mx-auto">
      {/* Background */}
        <div className="fixed inset-0 bg-[url('/background.png')] bg-cover bg-top z-0" />
        <div className="relative z-10 flex flex-1 flex-col min-h-screen w-full mb-auto">
      {/* Main content */}
          <div className="flex flex-col ">
        {/* Chat container */}
            {!isAnalyzing && (
        <div 
          ref={inputContainerRef} 
                className={`flex flex-col items-center w-full absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out z-20 gap-4 ${"top-1/2 -translate-y-1/2"}`}
        >
          <div className="text-center mb-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">
                    <span className="text-white">Welcome to Okra AI</span>
            </h1>
                  <p className="text-gray-300 mt-1">
                    AI Research Analyst for your Products and Services
                  </p>
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
        </div>
      </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
