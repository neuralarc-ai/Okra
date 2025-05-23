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
        <div className="w-2 h-2 rounded-full bg-[#302D2A]/70 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-[#302D2A]/70 animate-pulse delay-75" />
        <div className="w-2 h-2 rounded-full bg-[#302D2A]/70 animate-pulse delay-150" />
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
  const iconOuterBgColors = [
    '#949D87B0', // greenish outer
    '#7A8286B0', // gray outer
    '#73808C38', // blue-gray outer
    '#A3896DB0', // tan outer
  ];
  const iconInnerBgColors = [
    '#949D87', // greenish inner
    '#7A8286', // gray inner
    '#73808C', // blue-gray inner
    '#A3896D', // tan inner
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
            className="flex flex-col shadow-sm transition-transform cursor-pointer hover:shadow-md hover:scale-[1.015] focus:outline-none"
            style={{
              background: cardBgColors[index % cardBgColors.length],
              boxShadow: '0 2px 8px 0 #0000000D',
              width: 522,
              height: 260,
              gap: 24,
              borderRadius: 8,
              borderWidth: 1,
              padding: 24,
              borderStyle: 'solid',
              borderColor: '#E5E7EB',
            }}
            onClick={() => handleSelectPrompt(prompt)}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelectPrompt(prompt); }}
          >
            <div className="flex items-center gap-3" style={{marginBottom: 1}}>
              <span
                className="inline-flex items-center justify-center"
                style={{
                  background: iconOuterBgColors[index % iconOuterBgColors.length],
                  width: 40,
                  height: 40,
                  borderRadius: '28.89px',
                  padding: '7.78px',
                }}
              >
                <span
                  className="inline-flex items-center justify-center"
                  style={{
                    background: iconInnerBgColors[index % iconInnerBgColors.length],
                    width: '24.44px',
                    height: '24.44px',
                    borderRadius: '22.22px',
                  }}
                >
                  <TrendingUp size={20} className="text-white" />
                </span>
              </span>
              <span className="text-2xl font-semibold text-[#1E1E1E] truncate max-w-full">{prompt.title}</span>
            </div>
            <div
              className="bg-[#FFFFFF] flex flex-col gap-1"
              style={{
                width: 474,
                height: 148,
                borderRadius: 4,
                paddingTop: 24,
                paddingRight: 26,
                paddingBottom: 24,
                paddingLeft: 26,
                marginBottom: 0,
              }}
            >
              <p
                className="text-[#202020] font-normal mb-2"
                style={{ fontSize: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {prompt.description}
              </p>
              <div className="flex items-center gap-3 ">
                <span className="text-sm font-medium px-3 py-1 rounded-full" style={{background: '#1E342FA3', color: '#FFFFFF'}}>
                  {prompt.category}
                </span>
                <span className="text-sm font-medium px-4 py-1 rounded-full" style={{background: '#2020200D', color: '#202020'}}>
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