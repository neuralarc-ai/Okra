import { useState, useEffect } from 'react';
import { TrendingPrompt, getTrendingPrompts } from '@/services/geminiService';
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

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-white/80">
        <Sparkles size={16} className="text-green-400" />
        <span className="text-sm font-medium">Trending Ideas</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex items-start text-left p-4 h-auto bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
            onClick={() => handleSelectPrompt(prompt)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-green-400 shrink-0" />
                <span className="text-sm font-medium text-white truncate">
                  {prompt.title}
                </span>
              </div>
              <p className="text-xs text-white/70 line-clamp-2">
                {prompt.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-medium bg-white/10 text-white/80 px-2 py-0.5 rounded-full">
                  {prompt.category}
                </span>
                <span className="text-[10px] font-medium bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full">
                  {prompt.trendScore}% trending
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-white/40 shrink-0 self-center ml-2" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TrendingPrompts; 