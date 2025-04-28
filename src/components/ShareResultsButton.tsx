
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { AnalysisResult } from '@/types/oracle';

interface ShareResultsButtonProps {
  result: AnalysisResult | null;
  prompt: string;
}

const ShareResultsButton: React.FC<ShareResultsButtonProps> = ({ result, prompt }) => {
  const handleShare = async () => {
    if (!result) return;
    
    // Create a simple share text
    const shareText = `Oracle AI Analysis of "${prompt}" - Validation Score: ${result.validationScore}/100`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Oracle AI Analysis',
          text: shareText,
        });
        toast.success('Analysis shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };
  
  // Fallback for browsers that don't support the Web Share API
  const fallbackShare = () => {
    try {
      navigator.clipboard.writeText(
        `Oracle AI Analysis Results\n\nProduct/Service Idea: "${prompt}"\nValidation Score: ${result?.validationScore}/100\n\nSummary: ${result?.summary}`
      );
      toast.success('Analysis copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to share results');
    }
  };
  
  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className="flex items-center gap-1 text-white border-white/20 hover:bg-white/10"
    >
      <Share2 size={16} />
      <span>Share</span>
    </Button>
  );
};

export default ShareResultsButton;
