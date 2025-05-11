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
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-white flex items-center gap-3 tracking-tight">
              <BookOpen size={22} className="text-yellow-300" /> Research Sources
            </CardTitle>
            <div className="text-xs text-yellow-200 mt-1 font-medium">
              {sources?.length || 0} verified sources analyzed
            </div>
          </div>
          <button
            className="px-4 py-1 rounded-full border border-yellow-200/10 bg-yellow-200/5 text-xs text-yellow-200 hover:bg-yellow-200/10 transition font-medium shadow-sm"
            style={{ minWidth: 140 }}
          >
            Deep Research Mode
          </button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div 
          className="space-y-5 pr-2"
        >
          {!sources || sources.length === 0 ? (
            <div className="p-6 rounded-xl bg-white/5 border border-yellow-200/10 text-center">
              <p className="text-gray-400 text-base">No research sources available</p>
            </div>
          ) : (
            sources.map((source, index) => (
              <div 
                key={index} 
                className="p-5 rounded-2xl bg-gradient-to-br from-yellow-100/5 to-yellow-900/5 border border-yellow-200/10 transition-all duration-200 hover:border-yellow-300/20 hover:bg-yellow-200/10 group flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h4 className="font-semibold text-white text-base leading-tight">
                    {source.title}
                  </h4>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
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
