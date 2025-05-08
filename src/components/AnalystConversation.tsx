import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Brain, Network, DollarSign } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalystMessage {
  id: number;
  analyst: 'Emma' | 'Mike' | 'Scott' | 'David';
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
    Emma: {
      role: "Data Scientist",
      specialty: "market research, data analysis, and customer insights",
      color: "bg-[#9b87f5]/10",
      border: "border-[#9b87f5]/30",
      text: "text-white",
      icon: <Brain size={16} className="text-[#9b87f5]" />,
      image: "/emma-profile.png"
    },
    Mike: {
      role: "Business Strategist",
      specialty: "go-to-market strategy, business model, and competitive positioning",
      color: "bg-[#33C3F0]/10",
      border: "border-[#33C3F0]/30",
      text: "text-white",
      icon: <Network size={16} className="text-[#33C3F0]" />,
      image: "/mike-profile.png"
    },
    Scott: {
      role: "Financial Analyst",
      specialty: "financial forecasts, investment, and risk analysis",
      color: "bg-[#F97316]/10",
      border: "border-[#F97316]/30",
      text: "text-white",
      icon: <DollarSign size={16} className="text-[#F97316]" />,
      image: "/scott-profile.png"
    },
    David: {
      role: "Manager",
      specialty: "synthesizing insights, next steps, and overall direction",
      color: "bg-[#22d3ee]/10",
      border: "border-[#22d3ee]/30",
      text: "text-white",
      icon: <Brain size={16} className="text-[#22d3ee]" />,
      image: "/manager-profile.png"
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

  // Manager always first, then Emma, Mike, Scott
  const analystOrder: AnalystMessage["analyst"][] = ["David", "Emma", "Mike", "Scott"];

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
    // Determine current topic index
    const lastTopicIndex = prevMessages.length > 0 ? topicOrder.indexOf(prevMessages[prevMessages.length - 1].category) : -1;
    const nextTopicIndex = getNextTopicIndex(lastTopicIndex);
    const nextTopic = topicOrder[nextTopicIndex];
    let analyst: AnalystMessage["analyst"];
    if (nextTopic === "conclusion") {
      analyst = "David";
    } else if (prevMessages.length === 0) {
      analyst = "David";
    } else {
      const idx = (prevMessages.length - 1) % 3;
      analyst = analystOrder[idx + 1];
    }
    const role = analysts[analyst].role;
    const specialty = analysts[analyst].specialty;
    const prevContext = prevMessages.map((m) => `${m.analyst} (${analysts[m.analyst].role}): ${m.message}`).join("\n");
    const persona =
      analyst === "Emma"
        ? "You are Emma, a data-driven Market Research Analyst."
        : analyst === "Mike"
        ? "You are Mike, a strategic Business Strategist."
        : analyst === "Scott"
        ? "You are Scott, a pragmatic Financial Analyst."
        : "You are David, a wise and concise team leader.";
    let prompt = '';
    if (nextTopic === "conclusion") {
      prompt = `
${persona}
You are the team manager. Synthesize the discussion and provide a clear, actionable conclusion or next steps in one sentence.\nEnd your message with [conclusion complete].\nPrevious conversation:\n${prevContext || "(none yet)"}
`;
    } else {
      prompt = `
${persona}
You are part of a 4-person analyst team (David, Emma, Mike, Scott) discussing a new business idea: "${idea}".
Your role: ${role}.
Your specialty: ${specialty}.
Current topic: ${nextTopic}.
Previous conversation:
${prevContext || "(none yet)"}

You must address the topic: "${nextTopic}" in your response.
Do not repeat previous topics.
Respond with a single, concise, and professional message as your character.
- Reference the previous analyst's point and add new insight or a follow-up question.
- Do not mention progress numbers or scores.
- Keep your response to one sentence, no more than 20 words.
- Be insightful and business-focused.
- End your message with [${nextTopic} complete].
`;
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return {
      id: prevMessages.length + 1,
      analyst,
      message: text.trim(),
      progressThreshold: progress,
      category: nextTopic
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
    // Stop if the last message is a conclusion and marked complete
    if (
      visibleMessages.length > 0 &&
      visibleMessages[visibleMessages.length - 1].category === "conclusion" &&
      visibleMessages[visibleMessages.length - 1].message.includes("[conclusion complete]")
    ) {
      return;
    }
    const promptKey = `${userInput}|${progress}|${visibleMessages.length}`;
    if (lastPrompt === promptKey) return;
    setLastPrompt(promptKey);
    // Add a cooldown (e.g., 3 seconds) between messages
    const cooldown = 3000;
    const now = Date.now();
    const lastMsgTime = (window as any)._lastAnalystMsgTime || 0;
    if (now - lastMsgTime < cooldown) return;
    (window as any)._lastAnalystMsgTime = now;
    const thinkingDelay = 1200 + Math.random() * 600; // 1.2s to 1.8s
    const typingDelay = 1800 + Math.random() * 1000;  // 1.8s to 2.8s
    setTimeout(() => {
      let nextAnalyst: AnalystMessage["analyst"];
      // Always advance to the next topic after each message
      const lastTopicIndex = visibleMessages.length > 0 ? topicOrder.indexOf(visibleMessages[visibleMessages.length - 1].category) : -1;
      const nextTopicIndex = getNextTopicIndex(lastTopicIndex);
      const nextTopic = topicOrder[nextTopicIndex];
      if (nextTopic === "conclusion") {
        nextAnalyst = "David";
      } else if (visibleMessages.length === 0) {
        nextAnalyst = "David";
      } else {
        const idx = (visibleMessages.length - 1) % 3;
        nextAnalyst = analystOrder[idx + 1];
      }
      setTyping(nextAnalyst);
      generateAnalystMessage(userInput, visibleMessages, progress).then((msg) => {
        setTimeout(() => {
          setVisibleMessages((prev) => [...prev, msg]);
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
          className={`flex gap-3 mb-4 animate-fadeUp ${message.analyst === 'David' ? 'flex-row-reverse justify-end' : ''}`}
          style={{ animationDuration: '0.5s' }}
        >
          <Avatar className={`h-8 w-8 ${analysts[message.analyst].color} ${analysts[message.analyst].border} border flex items-center justify-center`}>
            <AvatarImage src={analysts[message.analyst].image} alt={message.analyst} />
            <AvatarFallback className="bg-transparent">
              {analysts[message.analyst].icon}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">
                {message.analyst}
              </span>
              <span className="text-xs text-white/60">
                {analysts[message.analyst].role}
              </span>
            </div>
            <div 
              className={`mt-1 p-3 rounded-lg ${analysts[message.analyst].color} ${analysts[message.analyst].border} border ${message.analyst === 'David' ? 'text-right' : ''}`}
            >
              <p className={`text-sm ${analysts[message.analyst].text}`}>
                {message.message}
              </p>
            </div>
          </div>
        </div>
      ))}
      {/* Typing indicator with profile image */}
      {typing && (
        <div
          key={`typing-${typing}-${visibleMessages.length}`}
          className={`flex gap-3 mb-4 animate-fadeUp ${typing === 'David' ? 'flex-row-reverse justify-end' : ''}`}
        >
          <Avatar className={`h-8 w-8 ${analysts[typing].color} ${analysts[typing].border} border flex items-center justify-center`}>
            <AvatarImage src={analysts[typing].image} alt={typing} />
            <AvatarFallback className="bg-transparent">
              {analysts[typing].icon}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">
                {typing}
              </span>
              <span className="text-xs text-white/60">
                {analysts[typing].role}
              </span>
            </div>
            <div 
              className={`mt-1 p-3 rounded-lg ${analysts[typing].color} ${analysts[typing].border} border ${typing === 'David' ? 'text-right' : ''}`}
            >
              <div className="flex gap-1 items-center h-4 justify-end">
                <span className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalystConversation; 