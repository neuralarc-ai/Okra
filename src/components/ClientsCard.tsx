import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/oracle";
import { Users, Target, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientsCardProps {
  clients: Client[];
}

const ClientsCard = ({ clients }: ClientsCardProps) => {
  return (
    <Card className="card-bg hover-card shadow-lg h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          Target Audience
          <Badge 
            variant="outline" 
            className="ml-auto text-xs bg-white/5 text-gray-400 border-white/10"
          >
            {clients.length} segments
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div 
          className="space-y-4 overflow-y-auto custom-scrollbar pr-2"
          style={{
            maxHeight: '500px',
            maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {clients.map((client, index) => (
            <div 
              key={index} 
              className="p-4 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">{client.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Target className="w-3 h-3" />
                    {client.industry}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {client.targetAudienceType && (
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-purple-700/20 text-purple-300 border-purple-700/30 font-semibold"
                    >
                      {client.targetAudienceType}
                    </Badge>
                  )}
                  {client.segment?.priority && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        client.segment.priority === 'high' 
                          ? 'bg-green-700/20 text-green-300 border-green-700/30'
                          : client.segment.priority === 'medium'
                          ? 'bg-yellow-700/20 text-yellow-300 border-yellow-700/30'
                          : 'bg-gray-700/20 text-gray-300 border-gray-700/30'
                      }`}
                    >
                      {client.segment.priority} priority
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-300">{client.useCase}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-3">
                  {/* Demographics Section */}
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-gray-400">Demographics</h5>
                    <div className="flex flex-wrap gap-1">
                      {client.targetAudienceDefinition.demographics.primary.map((demo, i) => (
                        <Badge 
                          key={i}
                          variant="outline" 
                          className="text-xs bg-white/5 text-gray-200 border-white/10"
                        >
                          {demo}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Needs Section */}
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-gray-400">Key Needs</h5>
                    <div className="flex flex-wrap gap-1">
                      {client.targetAudienceDefinition.psychographics.needs.map((need, i) => (
                        <Badge 
                          key={i}
                          variant="outline" 
                          className="text-xs bg-blue-700/20 text-blue-300 border-blue-700/30"
                        >
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Location & Growth */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {client.targetAudienceDefinition.geographics.location}, 
                      {client.targetAudienceDefinition.geographics.coverage}
                    </div>
                    {client.segment?.growth && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {client.segment.growth} growth
                      </div>
                    )}
                  </div>
                </div>
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
