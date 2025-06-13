import { useState, useEffect } from 'react';
import { TrendingPrompt, getTrendingPrompts } from '@/services/aiService';
import { Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface TrendingPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

// Skeleton card component for loading state
const SkeletonCard = () => (
  <div className="relative flex flex-col w-[522px] h-[260px] p-6 rounded-lg border border-gray-200 bg-gray-50/50 animate-pulse">
    {/* Icon skeleton */}
    <div className="flex items-center gap-3 mb-1">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="h-8 w-48 bg-gray-200 rounded-md" />
    </div>
    
    {/* Content skeleton */}
    <div className="mt-auto bg-white/90 backdrop-blur-sm p-6 rounded-md">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="flex items-center gap-3 mt-4">
        <div className="h-6 w-24 bg-gray-200 rounded-full" />
        <div className="h-6 w-32 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);

const TrendingPrompts = ({ onSelectPrompt, className = '' }: TrendingPromptsProps) => {
  const [prompts, setPrompts] = useState<TrendingPrompt[]>([]);
  const [loadedPrompts, setLoadedPrompts] = useState<Record<number, TrendingPrompt>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [nextIndexToLoad, setNextIndexToLoad] = useState(0);

  useEffect(() => {
    const fetchAndProcessPrompts = async () => {
      try {
        // Start fetching prompts
        const fetchPromise = getTrendingPrompts();
        
        // Show loading state immediately
        setIsLoading(true);
        
        // Get the prompts (limited to 4)
        const trendingPrompts = (await fetchPromise).slice(0, 4);
        setPrompts(trendingPrompts);

        // Process prompts in order
        const processPromptsInOrder = async () => {
          for (let i = 0; i < trendingPrompts.length; i++) {
            try {
              // Simulate processing time (remove this in production)
              // In real implementation, this would be actual data processing
              await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
              
              // Update the loaded prompts and next index
              setLoadedPrompts(prev => ({
                ...prev,
                [i]: trendingPrompts[i]
              }));
              setNextIndexToLoad(i + 1);
            } catch (error) {
              console.error(`Error processing prompt ${i}:`, error);
            }
          }
          setIsLoading(false);
        };

        processPromptsInOrder();
      } catch (error) {
        console.error('Error fetching trending prompts:', error);
        toast.error('Failed to load trending ideas');
        setIsLoading(false);
      }
    };

    fetchAndProcessPrompts();
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

  const backgroundImages = [
    "bg-[url('/card-bg-10.png')]",
    "bg-[url('/card-bg-11.png')]",
    "bg-[url('/card-bg-12.png')]",
    "bg-[url('/card-bg-13.png')]"
  ];

  // Create an array of 4 slots (either skeleton or actual card)
  const cardSlots = Array.from({ length: 4 }, (_, index) => {
    const prompt = loadedPrompts[index];
    
    // Only show card if it's the next one in sequence or earlier
    if (prompt && index <= nextIndexToLoad) {
      return (
        <div
          key={`prompt-${index}`}
          className={`
            relative flex flex-col cursor-pointer transition-all duration-300
            hover:scale-[1.015] shadow-sm hover:shadow-md 
            w-[522px] h-[260px] p-6 rounded-lg border border-gray-200
            ${backgroundImages[index % backgroundImages.length]} bg-cover bg-center
            before:absolute before:inset-0 before:rounded-lg 
            before:bg-gradient-to-t before:from-white/50 before:from-5% before:to-white/10 before:to-70% before:z-0
            overflow-hidden
            animate-fadeIn
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
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#6B74784D]">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#525D45]">
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
      );
    }
    
    return <SkeletonCard key={`skeleton-${index}`} />;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-[#1E1E1E] mb-4">
        <Sparkles size={16} className="text-[#1E342F]" />
        <span className="text-sm font-medium">Trending Ideas</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {cardSlots}
      </div>
    </div>
  );
};

export default TrendingPrompts;
