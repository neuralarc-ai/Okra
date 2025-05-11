import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/oracle";
import { Users, Target, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientsCardProps {
  clients?: Client[];
}

const ClientsCard = ({ clients = [] }: ClientsCardProps) => {
  if (!clients || clients.length === 0) {
    return (
      <Card className="card-bg hover-card shadow-lg h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-white flex items-center gap-3 tracking-tight">
            <Users className="w-6 h-6 text-blue-200" /> Target Audience
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            No client segments available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold text-white flex items-center gap-3 tracking-tight">
          <Users className="w-6 h-6 text-blue-200" /> Target Audience
          <span className="ml-auto px-4 py-1 rounded-full bg-blue-200/10 text-blue-200 font-medium text-xs border border-blue-200/10">
            {clients.length} segments
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-6">
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar pr-2"
        >
          {clients.map((client, index) => (
            <div 
              key={index}
              className="p-6 border border-white/5 rounded-2xl bg-gradient-to-br from-white/2 to-blue-900/5 transition-all duration-200 hover:border-blue-200/20 hover:bg-blue-200/5 shadow-sm flex flex-col gap-6"
            >
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">{client.name}</h4>
                <div className="flex items-center gap-2 text-xs text-blue-200 font-medium">
                  <Target className="w-3 h-3" />
                  {client.industry}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {client.targetAudienceType && (
                  <span className="px-3 py-1 rounded-full bg-pink-200/10 text-pink-200 font-medium text-xs border border-pink-200/10">
                    {client.targetAudienceType}
                  </span>
                )}
                {client.segment?.priority && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    client.segment.priority === 'high' 
                      ? 'bg-green-200/10 text-green-200 border-green-200/10'
                      : client.segment.priority === 'medium'
                      ? 'bg-yellow-200/10 text-yellow-200 border-yellow-200/10'
                      : 'bg-gray-200/10 text-gray-200 border-gray-200/10'
                  }`}>
                    {client.segment.priority} priority
                  </span>
                )}
              </div>

              <div className="text-base text-gray-200 font-normal">
                {client.useCase}
              </div>

              <div className="grid grid-cols-1 gap-3 mt-3">
                {/* Demographics Section */}
                {client.targetAudienceDefinition?.demographics?.primary && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-blue-200">Demographics</h5>
                    <div className="flex flex-wrap gap-1">
                      {client.targetAudienceDefinition.demographics.primary.map((demo, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 rounded-full bg-blue-200/10 text-blue-100 font-medium text-xs border border-blue-200/10"
                        >
                          {demo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Needs Section */}
                {client.targetAudienceDefinition?.psychographics?.needs && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-green-200">Key Needs</h5>
                    <div className="flex flex-wrap gap-1">
                      {client.targetAudienceDefinition.psychographics.needs.map((need, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 rounded-full bg-green-200/10 text-green-100 font-medium text-xs border border-green-200/10"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location & Growth */}
                {client.targetAudienceDefinition?.geographics && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-200" />
                    <span className="text-blue-100 font-medium">{client.targetAudienceDefinition.geographics.location}</span>,
                    <span className="text-blue-100 font-medium">{client.targetAudienceDefinition.geographics.coverage}</span>
                  </div>
                )}
                {client.segment?.growth && (
                  <div className="flex items-center gap-1 text-green-200 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    {client.segment.growth} growth
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Fade out effect at the bottom */}
        {clients.length > 3 && (
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

export default ClientsCard;

// Add the following CSS to your global stylesheet (e.g., src/index.css or App.css):
// .custom-scrollbar::-webkit-scrollbar {
//   display: none;
// }
// .custom-scrollbar {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// }
