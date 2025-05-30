import { useState, useEffect } from 'react';
import { TrendingPrompt, getTrendingPrompts } from '@/services/aiService';
import { Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface TrendingPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

const TrendingPrompts = ({ onSelectPrompt, className = '' }: TrendingPromptsProps) => {
  const [prompts, setPrompts] = useState<TrendingPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const trendingPrompts = await getTrendingPrompts();
        setPrompts(trendingPrompts);
      } catch (error) {
        console.error('Error fetching trending prompts:', error);
        toast.error('Failed to load trending ideas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const handleSelectPrompt = (prompt: TrendingPrompt) => {
    const formattedPrompt = `${prompt.title}

Problem & Solution:
${prompt.description}

Market Opportunity:
The ${prompt.category} market shows significant growth potential with increasing demand for innovative solutions.

Who it's for:
• Early adopters in the ${prompt.category} space
• Users looking for efficient, tech-driven solutions
• Businesses seeking to modernize their operations

What makes it unique:
• AI-powered solution with advanced capabilities
• Seamless integration with existing systems
• Focus on user experience and accessibility
• Data-driven insights and analytics`;

    onSelectPrompt(formattedPrompt);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-[#302D2A]/70 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-[#302D2A]/70 animate-pulse delay-75" />
        <div className="w-2 h-2 rounded-full bg-[#302D2A]/70 animate-pulse delay-150" />
      </div>
    );
  }

  const backgroundImages = [
    "bg-[url('/card-bg-10.png')]",
    "bg-[url('/card-bg-11.png')]",
    "bg-[url('/card-bg-12.png')]",
    "bg-[url('/card-bg-13.png')]"
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-[#1E1E1E] mb-4">
        <Sparkles size={16} className="text-[#1E342F]" />
        <span className="text-sm font-medium">Trending Ideas</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {prompts.slice(0, 4).map((prompt, index) => (
  <div
    key={index}
    className={`
      relative flex flex-col cursor-pointer transition-transform hover:scale-[1.015] shadow-sm hover:shadow-md 
      w-[522px] h-[260px] p-6 rounded-lg border border-gray-200
      ${backgroundImages[index % backgroundImages.length]} bg-cover bg-center
      before:absolute before:inset-0 before:rounded-lg 
      before:bg-gradient-to-t before:from-white/50 before:from-5% before:to-white/10 before:to-70% before:z-0
      overflow-hidden
    `}
    onClick={() => handleSelectPrompt(prompt)}
    role="button"
    tabIndex={0}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') handleSelectPrompt(prompt);
    }}
  >
    {/* Content sits above the overlay */}
    <div className="relative z-10 flex items-center gap-3 mb-1">
      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1E342F]">
          <TrendingUp size={20} className="text-white" />
        </span>
      </span>
      <span className="text-2xl font-semibold text-[#1E1E1E] truncate">{prompt.title}</span>
    </div>

    <div className="relative z-10 flex flex-col gap-2 bg-white/90 backdrop-blur-sm p-6 rounded-md mt-auto">
      <p className="text-[#202020] text-base line-clamp-2">
        {prompt.description}
      </p>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-[#1E342FA3] text-white">
          {prompt.category}
        </span>
        <span className="text-sm font-medium px-4 py-1 rounded-full bg-[#2020200D] text-[#202020]">
          {prompt.trendScore}% trending
        </span>
      </div>
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default TrendingPrompts;
