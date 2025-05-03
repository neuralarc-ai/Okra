import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Badge } from '@/components/ui/badge';

interface Source {
  title: string;
  relevance: string;
}

interface SourcesCardProps {
  sources: Source[];
}

const SourcesCard = ({ sources }: SourcesCardProps) => {
  // Set maxHeight to match ClientsCard (500px)
  const maxHeight = "500px";

  return (
    <Card className="card-bg hover-card h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-medium flex items-center gap-2">
              <BookOpen size={18} className="text-yellow-400" />
              Research Sources
            </CardTitle>
            <div className="text-xs text-gray-400 mt-1">{sources.length} verified sources analyzed</div>
          </div>
          <button
            className="px-4 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition font-medium shadow-sm"
            style={{ minWidth: 140 }}
          >
            Deep Research Mode
          </button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div 
          className="space-y-3 overflow-y-auto custom-scrollbar pr-2"
          style={{
            maxHeight,
            maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
          }}
        >
          {sources.length === 0 ? (
            <div className="p-4 border border-white/5 rounded-lg text-center">
              <p className="text-gray-400 text-sm">No research sources available</p>
            </div>
          ) : (
            sources.map((source, index) => (
              <div 
                key={index} 
                className="p-4 bg-[#1c1c1c]/50 rounded-lg transition-all duration-200 hover:bg-[#1c1c1c] group"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-medium text-white text-base leading-tight">
                    {source.title}
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {source.relevance}
                </p>
              </div>
            ))
          )}
        </div>
        {/* Fade out effect at the bottom if content overflows */}
        <div 
          className="absolute bottom-0 left-0 right-2 h-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgb(16 16 16))'
          }}
        />
      </CardContent>
    </Card>
  );
};

export default SourcesCard;
