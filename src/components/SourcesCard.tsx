
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Link, ExternalLink } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Source {
  title: string;
  url: string;
  relevance: string;
}

interface SourcesCardProps {
  sources: Source[];
}

const SourcesCard = ({ sources }: SourcesCardProps) => {
  // All sources should be treated as external links - no dummy data
  return (
    <Card className="card-bg hover-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <BookOpen size={18} className="text-purple-300" />
          <span>Research Sources</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sources.length === 0 ? (
            <div className="p-4 border border-white/5 rounded-lg text-center">
              <p className="text-gray-400 text-sm">No research sources available</p>
            </div>
          ) : (
            sources.map((source, index) => (
              <div 
                key={index} 
                className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-white flex-1">{source.title}</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs border-white/10 hover:bg-white/10 flex items-center gap-1"
                    onClick={() => window.open(source.url.startsWith('http') ? source.url : `https://${source.url}`, '_blank')}
                    disabled={source.url === '#'}
                  >
                    <ExternalLink size={12} />
                    <span>View</span>
                  </Button>
                </div>
                <Badge variant="outline" className="text-xs w-fit bg-white/5 hover:bg-white/10">
                  Research source
                </Badge>
                <p className="text-gray-300 text-xs leading-relaxed">{source.relevance}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourcesCard;
