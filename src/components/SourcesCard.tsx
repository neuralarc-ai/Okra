import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface Source {
  title: string;
  relevance: string;
}

interface SourcesCardProps {
  sources?: Source[];
}

const SourcesCard = ({ sources = [] }: SourcesCardProps) => {
  return (
    <Card className="bg-[#FFFFFF] shadow-lg rounded-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-[#202020] flex items-center gap-3 tracking-tight">
              <BookOpen size={22} className="text-[#202020]" /> Research Sources
            </CardTitle>
            <div className="text-xs text-[#202020] mt-1 font-medium">
              {sources?.length || 0} verified sources analyzed
            </div>
          </div>
          <button
            className="px-4 py-1 rounded-full border border-[#202020]/10 bg-[#CFD2D4] text-xs text-[#202020] hover:bg-[#CFD2D4] transition font-medium shadow-sm"
            style={{ minWidth: 140 }}
          >
            Deep Research Mode
          </button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div 
          className="space-y-5 overflow-y-auto custom-scrollbar pr-2"
          style={{ maxHeight: 'calc(100vh - 300px)' }}
        >
          {!sources || sources.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#CFD2D4] border border-[#202020]/10 text-center">
              <p className="text-[#202020] text-base">No research sources available</p>
            </div>
          ) : (
            sources.map((source, index) => (
              <div 
                key={index} 
                className="p-5 rounded-xl bg-[#CFD2D4] border border-[#202020]/10 transition-all duration-200 hover:border-[#202020]/20 hover:bg-[#CFD2D4] group flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h4 className="font-semibold text-[#202020] text-base leading-tight">
                    {source.title}
                  </h4>
                </div>
                <p className="text-[#202020] text-sm leading-relaxed">
                  {source.relevance}
                </p>
              </div>
            ))
          )}
        </div>
        {/* Fade out effect at the bottom if content overflows */}
        {sources && sources.length > 3 && (
          <div 
            className="absolute bottom-0 left-0 right-2 h-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgb(16 16 16))'
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SourcesCard;
