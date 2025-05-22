import { useState, useEffect } from 'react';
import { TrendingPrompt, getTrendingPrompts } from '@/services/aiService';
import { Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    const formattedPrompt = `Problem & Solution:
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
        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse delay-75" />
        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse delay-150" />
      </div>
    );
  }

  // Card background colors for the 4 cards
  const cardBgColors = [
    '#C0C6B8', // greenish
    '#CFD2D4', // light gray
    '#A8B0B8', // blue-gray
    '#D0C3B5', // tan
  ];
  // Icon background colors for the 4 cards
  const iconBgColors = [
    '#949D87B0',
    '#949D87',
    '#1E342FA3',
    '#302D2A',
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
            className="rounded-2xl p-0 flex flex-col h-full min-h-[260px] shadow-sm"
            style={{
              background: cardBgColors[index % cardBgColors.length],
              boxShadow: '0 2px 8px 0 #0000000D',
            }}
          >
            <div className="flex items-center gap-3 px-6 pt-6 pb-2">
              <span
                className="inline-flex items-center justify-center rounded-full"
                style={{
                  background: iconBgColors[index % iconBgColors.length],
                  width: 40,
                  height: 40,
                }}
              >
                <TrendingUp size={20} className="text-white" />
              </span>
              <span className="text-2xl font-semibold text-[#1E1E1E]">{prompt.title}</span>
            </div>
            <div className="bg-[#FFFFFF] rounded-xl mx-6 mt-2 p-6 flex flex-col gap-4 flex-1">
              <p className="text-[#202020] font-normal mb-2" style={{ fontSize: '16px' }}>
                {prompt.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-medium px-4 py-1 rounded-full" style={{background: '#949D87', color: '#FFFFFF'}}>
                  {prompt.category}
                </span>
                <span className="text-sm font-medium px-4 py-1 rounded-full" style={{background: '#F6F6F6', color: '#202020'}}>
                  {prompt.trendScore}% trending
                </span>
              </div>
            </div>
            <div className="flex-1 flex items-end px-6 pb-4 pt-2">
              <Button
                variant="ghost"
                className="text-[#1E1E1E] hover:bg-[#FBFAF8] px-0"
                onClick={() => handleSelectPrompt(prompt)}
              >
                <span className="font-medium">Use Idea</span>
                <ChevronRight size={18} className="ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPrompts; 