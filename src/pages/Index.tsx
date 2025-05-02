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
import PrivacyModal from '@/components/PrivacyModal';

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
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [ethicsOpen, setEthicsOpen] = useState(false);

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
      const analysis = await generateAnalysis(message);
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <RevenueModelCard revenueModel={result.revenueModel} />
                    <MilestonesCard milestones={result.milestones} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FinancialPlanCard financialPlan={result.financialPlan} />
                    <FundingRequirementsCard fundingRequirements={result.fundingRequirements} />
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
        <Footer 
          onPrivacyClick={() => setPrivacyOpen(true)} 
          onEthicsClick={() => setEthicsOpen(true)}
        />
        <PrivacyModal
          open={privacyOpen}
          onClose={() => setPrivacyOpen(false)}
          title="Privacy Policy"
        >
          {`Effective Date: [Insert Date]

Okra (“Platform,” “we,” “us,” or “our”) is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our Platform, including any AI-based tools or services we provide.

1. Information We Collect
We may collect the following types of information:

a. Personal Information
Information you voluntarily provide, such as:
- Name
- Email address
- Any additional contact details
- Content or inputs provided to AI tools (if associated with a user identity)

b. Usage Data
Automatically collected information such as:
- IP address
- Browser type and version
- Operating system
- Date and time of your visit
- Pages viewed and time spent
- Referring/exit pages
- Clickstream data

c. Cookies and Tracking Technologies
We use cookies, pixels, and similar technologies for analytics and functionality. You can disable cookies through your browser settings.

2. How We Use Your Information
We use collected information for the following purposes:
- To operate, manage, and maintain the Platform.
- To improve the performance and accuracy of AI systems.
- To personalize your experience.
- To respond to queries or support requests.
- For data analysis and system monitoring.
- To comply with legal obligations.

3. Sharing and Disclosure
We do not sell your data. However, we may share your data in the following situations:
- With service providers who support our infrastructure, under strict data protection agreements.
- With law enforcement or government agencies when required by law.
- In case of business transitions, such as mergers or acquisitions.

4. Data Storage and Security
We employ industry-standard security practices including:
- SSL encryption
- Access control protocols
- Regular vulnerability scans
Despite our efforts, no digital transmission or storage system is completely secure. Use at your own discretion.

5. Your Rights
Depending on your jurisdiction, you may have the following rights:
- Access to your data
- Correction of inaccurate data
- Deletion or restriction of processing
- Data portability
- Withdrawal of consent
- Lodging a complaint with a regulatory authority

For inquiries, contact us at: [Insert Contact Email]
`}
        </PrivacyModal>
        <PrivacyModal
          open={ethicsOpen}
          onClose={() => setEthicsOpen(false)}
          title="Responsible AI & Disclaimer"
        >
          {`
Responsible AI Use Policy
We are committed to developing and deploying AI responsibly. AI technologies hosted on https://okra-woad.vercel.app are designed to augment human decision-making, not replace it.

Our Principles
1. Transparency
- Clear communication when users are interacting with AI.
- Explanation of how results are generated wherever feasible.

2. Human Oversight
- AI suggestions or outputs should be reviewed by a qualified human.
- Critical or sensitive decisions (e.g., legal or health matters) must not be made solely based on AI output.

3. Robustness and Safety
- We test AI systems to identify and minimize errors and unintended consequences.
- Feedback mechanisms are built to report inappropriate or harmful behavior.

4. Privacy-Aware Design
- Minimal collection of personal data.
- Short-term retention of user inputs (only if necessary).

5. Purpose Limitation
- AI tools are deployed only for clearly defined, ethical, and socially beneficial use cases.

Ethical AI Guidelines
We believe AI should benefit all users and be governed by principles that uphold fairness, accountability, and human dignity.

Key Values
1. Fairness & Non-Discrimination
- Our AI models are evaluated to reduce bias and promote inclusive use.
- Discriminatory or harmful content generation is actively monitored and filtered.

2. Accountability
- We accept responsibility for the behavior and consequences of our AI systems.
- We encourage users to report concerns via [Insert Contact Email].

3. Autonomy
- Users are empowered to understand and control their interaction with AI.
- AI should never manipulate, coerce, or deceive.

4. Do No Harm
- We design AI tools with safeguards to prevent misuse, harm, or exploitation.
- Malicious use of AI tools is prohibited.

5. Accessibility
- We strive to make the Platform accessible and usable by people of all backgrounds and abilities.

 Disclaimer
Please read this Disclaimer carefully before using the Platform.

The tools and content available at https://okra-woad.vercel.app are provided "as is" and are intended for informational and experimental purposes only. By using the Platform, you acknowledge and agree to the following:

1. No Professional Advice
The AI-generated outputs are not a substitute for professional advice in:
- Legal
- Medical
- Financial
- Psychological
or any other regulated domain. Always consult a licensed professional.

2. Limitation of Liability
We shall not be held liable for:
- Any direct or indirect loss or damage arising from reliance on AI outputs.
- Errors, inaccuracies, or omissions in the AI-generated content.
- Unintended consequences or misuse of AI tools.

3. User Responsibility
You are solely responsible for:
- The content you input into the system.
- How you use and interpret the output.
- Ensuring your use complies with applicable laws and ethical norms.

4. AI Limitations
Our AI tools may:
- Generate incorrect or misleading results.
- Fail to understand context or nuance.
- Produce biased or inappropriate content.

Use discretion and critical judgment when using the Platform.
`}
        </PrivacyModal>
      </div>
    </div>
  );
};

export default Index;
