import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Brain, Network, DollarSign } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalystMessage {
  id: number;
  analyst: 'Zane' | 'Mira' | 'Axel' | 'Chloe';
  message: string;
  progressThreshold: number;
  category: 'market' | 'competitors' | 'pricing' | 'forecast' | 'target' | 'risk' | 'conclusion';
}

interface AnalystConversationProps {
  progress: number;
  userInput?: string;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const AnalystConversation: React.FC<AnalystConversationProps> = ({ progress, userInput = '' }) => {
  const [visibleMessages, setVisibleMessages] = useState<AnalystMessage[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Extract key terms from user input for personalization
  const extractKeyTerms = (input: string): { industry: string, type: string, keywords: string[] } => {
    const lowercaseInput = input.toLowerCase();
    const defaultResult = { industry: 'business', type: 'product', keywords: ['idea'] };
    if (!input) return defaultResult;
    const industries = ['tech', 'food', 'healthcare', 'finance', 'retail', 'education', 'manufacturing'];
    const types = ['app', 'service', 'product', 'platform', 'software', 'startup', 'business'];
    const foundIndustry = industries.find(ind => lowercaseInput.includes(ind)) || defaultResult.industry;
    const foundType = types.find(type => lowercaseInput.includes(type)) || defaultResult.type;
    const words = lowercaseInput.split(/\s+/);
    const keywords = words.filter(word => 
      word.length > 4 && 
      !['about', 'would', 'could', 'should', 'their', 'there'].includes(word)
    );
    return {
      industry: foundIndustry,
      type: foundType,
      keywords: keywords.length > 0 ? keywords : defaultResult.keywords
    };
  };
  
  const keyTerms = extractKeyTerms(userInput);
  
  // Define analyst personas with their roles, images and visual styles
  const analysts = {
    Zane: {
      role: "Team Leader",
      desc: "Assigns tasks to team based on the user input",
      specialty: "assigning tasks to team based on the user input",
      color: "bg-[#22d3ee]/10",
      border: "border-[#22d3ee]/30",
      text: "text-white",
      icon: <Brain size={16} className="text-[#22d3ee]" />,
      image: "/zane-profile.png",
      chatBg: "#D0BBB1"
    },
    Mira: {
      role: "Data Scientist",
      desc: "Analyzes and interprets complex data to help organizations.",
      specialty: "analyzing and interpreting complex data to help organizations",
      color: "bg-[#9b87f5]/10",
      border: "border-[#9b87f5]/30",
      text: "text-white",
      icon: <Brain size={16} className="text-[#9b87f5]" />,
      image: "/mira-profile.png",
      chatBg: "#DDE2D7"
    },
    Axel: {
      role: "Business Strategist",
      desc: "Develops plans to drive growth and achieve long-term goals.",
      specialty: "developing plans to drive growth and achieve long-term goals",
      color: "bg-[#33C3F0]/10",
      border: "border-[#33C3F0]/30",
      text: "text-white",
      icon: <Network size={16} className="text-[#33C3F0]" />,
      image: "/axel-profile.png",
      chatBg: "#BDAB9752"
    },
    Chloe: {
      role: "Financial Analyst",
      desc: "Evaluates financial data to guide investment & business decisions.",
      specialty: "evaluating financial data to guide investment & business decisions",
      color: "bg-[#F97316]/10",
      border: "border-[#F97316]/30",
      text: "text-white",
      icon: <DollarSign size={16} className="text-[#F97316]" />,
      image: "/chloe-profile.png",
      chatBg: "#BFC6CB"
    }
  };

  // Helper function to personalize messages
  const personalizeMessage = (message: string) => {
    if (!userInput) return message;
    return message
      .replace(/\[industry\]/g, keyTerms.industry)
      .replace(/\[type\]/g, keyTerms.type)
      .replace(/\[keyword\]/g, keyTerms.keywords[0] || 'idea');
  };

  // Manager always first, then Mira, Axel, Chloe
  const analystOrder: AnalystMessage["analyst"][] = ["Zane", "Mira", "Axel", "Chloe"];

  // Define the order of business topics to cover
  const topicOrder: AnalystMessage["category"][] = [
    "market", "competitors", "pricing", "forecast", "target", "risk", "conclusion"
  ];

  // Helper to get the next topic index
  const getNextTopicIndex = (currentIndex: number) => {
    if (currentIndex < topicOrder.length - 1) return currentIndex + 1;
    return topicOrder.length - 1;
  };

  // Function to generate a new analyst message using Gemini
  const generateAnalystMessage = async (idea: string, prevMessages: AnalystMessage[], progress: number) => {
    // Determine the current and potentially next topic
    const lastTopicIndex = prevMessages.length > 0 ? topicOrder.indexOf(prevMessages[prevMessages.length - 1].category) : -1;
    const currentTopic = lastTopicIndex !== -1 ? topicOrder[lastTopicIndex] : topicOrder[0];

    // Determine the current analyst and potentially the next
    let currentAnalyst: AnalystMessage["analyst"];
    if (prevMessages.length === 0) {
      currentAnalyst = "Zane";
    } else {
      const lastAnalyst = prevMessages[prevMessages.length - 1].analyst;
      const analystOptions = analystOrder.filter(a => a !== lastAnalyst); // Avoid the same analyst speaking twice in a row
      currentAnalyst = analystOptions[Math.floor(Math.random() * analystOptions.length)] || analystOrder[0];
    }

    // Build previous conversation transcript, focusing on the last few turns
    const conversationHistory = prevMessages.slice(-3).map((m) => `${m.analyst}: ${m.message.replace(/\s*\[[a-z]+ complete\]$/i, '')}`).join("\n");

    const prompt = `
You are part of a team of business analysts discussing the idea: "${idea}". The team includes Zane (Team Leader), Mira (Data Scientist), Axel (Business Strategist), and Chloe (Financial Analyst).

The current topic of discussion is: ${currentTopic}.

Engage in a natural, concise conversation, directly referencing or building upon the previous analyst's points where relevant. Each analyst should speak in their own voice and contribute meaningfully to the discussion. Aim for short in 2-3 sentences under 27 words, impactful statements that advance the conversation.

Previous turns:
${conversationHistory || "(none yet)"}

Your turn as ${currentAnalyst}: Respond to the previous point or add a new relevant insight related to ${currentTopic}. Keep your response brief and focused.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return {
      id: prevMessages.length + 1,
      analyst: currentAnalyst,
      message: text.trim(),
      progressThreshold: progress,
      category: currentTopic // Keep the category consistent for a while
    } as AnalystMessage;
  };

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleMessages, typing]);

  // Generate a new message when userInput or progress changes
  useEffect(() => {
    if (!userInput || progress < 3) return;

    const shouldAdvanceTopic = visibleMessages.length > 0 && Math.random() < 0.4; // Adjust probability as needed
    const lastTopicIndex = visibleMessages.length > 0 ? topicOrder.indexOf(visibleMessages[visibleMessages.length - 1].category) : -1;
    const nextTopicIndex = shouldAdvanceTopic ? getNextTopicIndex(lastTopicIndex) : lastTopicIndex;
    const nextTopic = topicOrder[nextTopicIndex];

    // Stop if the last message is a conclusion from Zane
    if (
      visibleMessages.length > 0 &&
      visibleMessages[visibleMessages.length - 1].category === "conclusion" &&
      visibleMessages[visibleMessages.length - 1].analyst === "Zane"
    ) {
      return;
    }

    const promptKey = `${userInput}|${progress}|${visibleMessages.length}|${nextTopic}`;
    if (lastPrompt === promptKey) return;
    setLastPrompt(promptKey);

    const cooldown = 1500 + Math.random() * 1500; // Adjust cooldown
    const now = Date.now();
    const lastMsgTime = (window as any)._lastAnalystMsgTime || 0;
    if (now - lastMsgTime < cooldown) return;
    (window as any)._lastAnalystMsgTime = now;

    const thinkingDelay = 800 + Math.random() * 400;
    const typingDelay = 1200 + Math.random() * 800;

    setTimeout(() => {
      let nextAnalyst: AnalystMessage["analyst"];
      if (nextTopic === "conclusion") {
        nextAnalyst = "Zane";
      } else if (visibleMessages.length === 0) {
        nextAnalyst = "Zane";
      } else {
        const lastAnalyst = visibleMessages[visibleMessages.length - 1].analyst;
        const analystOptions = analystOrder.filter(a => a !== lastAnalyst);
        nextAnalyst = analystOptions[Math.floor(Math.random() * analystOptions.length)] || analystOrder[0];
      }
      setTyping(nextAnalyst);
      generateAnalystMessage(userInput, visibleMessages, progress).then((msg) => {
        setTimeout(() => {
          setVisibleMessages((prev) => [...prev, { ...msg, category: nextTopic }]); // Ensure the category is updated
          setTyping(null);
        }, typingDelay);
      });
    }, thinkingDelay);
    // eslint-disable-next-line
  }, [userInput, progress, visibleMessages.length]);

  if (visibleMessages.length === 0 && !typing) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="mt-6 h-[400px] overflow-y-auto custom-scrollbar"
    >
      {visibleMessages.map((message, idx) => (
        <div 
          key={`${message.id}-${message.analyst}-${idx}`}
          className={`flex gap-3 mb-4 animate-fadeUp ${message.analyst === 'Zane' ? 'flex-row-reverse justify-end' : ''}`}
          style={{ animationDuration: '0.5s' }}
        >
          <Avatar className={`h-8 w-8 bg-[#F0EDE9] border border-[#D9D3C7] flex items-center justify-center`}>
            <AvatarImage src={analysts[message.analyst].image} alt={message.analyst} />
            <AvatarFallback className="bg-transparent">
              {analysts[message.analyst].icon}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-normal text-[16px] leading-[20px] text-[#202020]">
                {message.analyst}
              </span>
              <span className="font-normal text-[12px] leading-[16px] text-[#202020]/80">
                {analysts[message.analyst].role}
              </span>
            </div>
            <div 
              className={`mt-1 p-3 rounded-lg border border-[#F0EDE9] ${message.analyst === 'Zane' ? 'text-right' : ''}`}
              style={{ background: analysts[message.analyst].chatBg }}
            >
              <p className={`text-sm text-[#2B2521]`}>
                {message.message.replace(/^([A-Za-z]+):\s*/, '')}
              </p>
            </div>
          </div>
        </div>
      ))}
      {/* Typing indicator with profile image */}
      {typing && (
        <div
          key={`typing-${typing}-${visibleMessages.length}`}
          className={`flex gap-3 mb-4 animate-fadeUp ${typing === 'Zane' ? 'flex-row-reverse justify-end' : ''}`}
        >
          <Avatar className={`h-8 w-8 bg-[#F0EDE9] border border-[#D9D3C7] flex items-center justify-center`}>
            <AvatarImage src={analysts[typing].image} alt={typing} />
            <AvatarFallback className="bg-transparent">
              {analysts[typing].icon}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-normal text-[16px] leading-[20px] text-[#202020]">
                {typing}
              </span>
              <span className="font-normal text-[12px] leading-[16px] text-[#202020]/80">
                {analysts[typing].role}
              </span>
            </div>
            <div 
              className={`mt-1 p-3 rounded-lg border border-[#F0EDE9] ${typing === 'Zane' ? 'text-right' : ''}`}
              style={{ background: analysts[typing].chatBg }}
            >
              <div className="flex gap-1 items-center h-4 justify-end">
                <span className="w-2 h-2 bg-[#B7BEAE] rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-[#B7BEAE] rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2 h-2 bg-[#B7BEAE] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalystConversation; 