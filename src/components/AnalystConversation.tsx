import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Brain, Network, DollarSign } from 'lucide-react';

interface AnalystMessage {
  id: number;
  analyst: 'Emma' | 'Mike' | 'Scott';
  message: string;
  progressThreshold: number;
  category: 'market' | 'competitors' | 'pricing' | 'forecast' | 'target' | 'risk';
}

interface AnalystConversationProps {
  progress: number;
  userInput?: string;
}

const AnalystConversation: React.FC<AnalystConversationProps> = ({ progress, userInput = '' }) => {
  const [visibleMessages, setVisibleMessages] = useState<AnalystMessage[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Extract key terms from user input for personalization
  const extractKeyTerms = (input: string): { industry: string, type: string, keywords: string[] } => {
    const lowercaseInput = input.toLowerCase();
    const defaultResult = { industry: 'business', type: 'product', keywords: ['idea'] };
    
    if (!input) return defaultResult;
    
    // Basic pattern matching for industry and business type
    const industries = ['tech', 'food', 'healthcare', 'finance', 'retail', 'education', 'manufacturing'];
    const types = ['app', 'service', 'product', 'platform', 'software', 'startup', 'business'];
    
    const foundIndustry = industries.find(ind => lowercaseInput.includes(ind)) || defaultResult.industry;
    const foundType = types.find(type => lowercaseInput.includes(type)) || defaultResult.type;
    
    // Extract possibly important words (nouns and adjectives) - very simplistic approach
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
      color: "bg-[#9b87f5]/10",
      border: "border-[#9b87f5]/30",
      text: "text-white",
      icon: <Brain size={16} className="text-[#9b87f5]" />,
      image: "/emma-profile.png" // Path to Emma's image
    },
    Mike: {
      role: "Business Strategist",
      color: "bg-[#33C3F0]/10",
      border: "border-[#33C3F0]/30",
      text: "text-white",
      icon: <Network size={16} className="text-[#33C3F0]" />,
      image: "/mike-profile.png" // Path to Mike's image
    },
    Scott: {
      role: "Financial Analyst",
      color: "bg-[#F97316]/10",
      border: "border-[#F97316]/30",
      text: "text-white",
      icon: <DollarSign size={16} className="text-[#F97316]" />,
      image: "/scott-profile.png" // Path to Scott's image
    }
  };

  // Helper function to personalize messages
  const personalizeMessage = (message: string) => {
    if (!userInput) return message;
    
    // Replace placeholder terms with extracted terms from user input
    return message
      .replace(/\[industry\]/g, keyTerms.industry)
      .replace(/\[type\]/g, keyTerms.type)
      .replace(/\[keyword\]/g, keyTerms.keywords[0] || 'idea');
  };

  // Define the conversation script
  const generateConversationScript = (): AnalystMessage[] => {
    return [
      {
        id: 1,
        analyst: 'Emma',
        message: `Alright team, let's dive into this idea: "${userInput || 'the user\'s business idea'}". I hope it's not another "Uber for llamas"...`,
        progressThreshold: 3,
        category: 'market'
      },
      {
        id: 2,
        analyst: 'Mike',
        message: `Emma, even llamas need rides! But seriously, this ${keyTerms.type} in the ${keyTerms.industry} sector could be a game changer. I'll start mapping competitors.`,
        progressThreshold: 8,
        category: 'competitors'
      },
      {
        id: 3,
        analyst: 'Scott',
        message: `If this takes off, I'm buying a llama. But first, let's crunch the numbers. What's the TAM for this ${keyTerms.industry} ${keyTerms.type}?`,
        progressThreshold: 14,
        category: 'forecast'
      },
      {
        id: 4,
        analyst: 'Emma',
        message: `Market data shows a 14% annual growth. Also, fun fact: 73% of people would try a new ${keyTerms.type} if it came with free coffee.`,
        progressThreshold: 20,
        category: 'market'
      },
      {
        id: 5,
        analyst: 'Mike',
        message: `Competitor analysis: 3 big players, but none offer coffee or llamas. Our edge? Quirkiness and innovation.`,
        progressThreshold: 28,
        category: 'competitors'
      },
      {
        id: 6,
        analyst: 'Scott',
        message: `If we capture 5% of the market, that's enough for a coffee subscription for all of us. Numbers look promising!`,
        progressThreshold: 36,
        category: 'forecast'
      },
      {
        id: 7,
        analyst: 'Emma',
        message: `Demographics show millennials and Gen Z love quirky ${keyTerms.type}s. Psychographics: must love coffee, memes, and innovation.`,
        progressThreshold: 44,
        category: 'target'
      },
      {
        id: 8,
        analyst: 'Mike',
        message: `Geographically, urban areas are hot. Rural? Maybe if we add tractor support.`,
        progressThreshold: 52,
        category: 'competitors'
      },
      {
        id: 9,
        analyst: 'Scott',
        message: `Pricing models: tiered, freemium, and... "pay with memes"? Just kidding. But let's keep it creative.`,
        progressThreshold: 60,
        category: 'pricing'
      },
      {
        id: 10,
        analyst: 'Emma',
        message: `Survey says users would pay $20-50/month for core features, or unlimited llama rides.`,
        progressThreshold: 68,
        category: 'pricing'
      },
      {
        id: 11,
        analyst: 'Scott',
        message: `At that price, we break even in 14-18 months. Or sooner if we sell llama merch.`,
        progressThreshold: 76,
        category: 'forecast'
      },
      {
        id: 12,
        analyst: 'Mike',
        message: `Main risk: rapid tech changes. Also, llamas can be unpredictable. We'll need strong R&D.`,
        progressThreshold: 84,
        category: 'risk'
      },
      {
        id: 13,
        analyst: 'Emma',
        message: `To stay ahead, we should iterate every 6-8 months. And maybe add a meme generator.`,
        progressThreshold: 90,
        category: 'risk'
      },
      {
        id: 14,
        analyst: 'Scott',
        message: `24-month outlook: strong growth if we execute. If not, at least we'll have good coffee.`,
        progressThreshold: 96,
        category: 'forecast'
      },
      {
        id: 15,
        analyst: 'Mike',
        message: `Final thoughts: This ${keyTerms.type} in ${keyTerms.industry} is quirky, bold, and has real potential. Let's pitch it—with or without llamas.`,
        progressThreshold: 100,
        category: 'competitors'
      }
    ];
  };
  
  const conversationScript = generateConversationScript();

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleMessages, typing]);

  // Show typing indicator before message appears
  useEffect(() => {
    // Find the next message that should appear based on progress
    const nextMessage = conversationScript.find(message => 
      message.progressThreshold <= progress && 
      !visibleMessages.some(m => m.id === message.id)
    );

    if (nextMessage) {
      // Show typing indicator
      setTyping(nextMessage.analyst);
      
      // After a longer delay, add the message and remove typing indicator
      const timeout = setTimeout(() => {
        // Personalize the message before adding it
        const personalizedMessage = {
          ...nextMessage,
          message: personalizeMessage(nextMessage.message)
        };
        
        setVisibleMessages(prev => [...prev, personalizedMessage]);
        setTyping(null);
      }, 1000); // Slowed down for more natural pacing
      
      return () => clearTimeout(timeout);
    }
  }, [progress, visibleMessages, userInput]);

  // Early return if no messages to show yet
  if (visibleMessages.length === 0 && !typing) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="mt-6 max-h-[300px] overflow-y-auto custom-scrollbar"
    >
      {visibleMessages.map((message) => (
        <div 
          key={message.id}
          className="flex gap-3 mb-4 animate-fadeUp"
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
              className={`mt-1 p-3 rounded-lg ${analysts[message.analyst].color} ${analysts[message.analyst].border} border`}
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
        <div className="flex gap-3 mb-4 animate-fadeUp">
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
              className={`mt-1 p-3 rounded-lg ${analysts[typing].color} ${analysts[typing].border} border`}
            >
              <div className="flex gap-1 items-center h-4">
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