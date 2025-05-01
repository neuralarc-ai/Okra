import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/oracle";
import { Users } from "lucide-react";
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
          className="space-y-3 overflow-y-auto custom-scrollbar pr-2"
          style={{
            maxHeight: '400px',
            maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {clients.map((client, index) => (
            <div 
              key={index} 
              className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-white">{client.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-white/5 text-gray-400 border-white/10"
                  >
                    {client.industry}
                  </Badge>
                  {client.targetAudienceType && (
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-purple-700/20 text-purple-300 border-purple-700/30 font-semibold"
                    >
                      {client.targetAudienceType}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2 mb-1">
                <span className="text-xs text-gray-400 shrink-0">Use Case:</span>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {client.useCase}
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-400 shrink-0">Demographics:</span>
                  <span className="text-xs text-gray-200">{
                    typeof client.targetAudienceDefinition?.demographics === 'object' && client.targetAudienceDefinition?.demographics !== null
                      ? Object.values(client.targetAudienceDefinition.demographics).join(', ')
                      : client.targetAudienceDefinition?.demographics
                  }</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-400 shrink-0">Psychographics:</span>
                  <span className="text-xs text-gray-200">{
                    typeof client.targetAudienceDefinition?.psychographics === 'object' && client.targetAudienceDefinition?.psychographics !== null
                      ? Object.values(client.targetAudienceDefinition.psychographics).join(', ')
                      : client.targetAudienceDefinition?.psychographics
                  }</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-400 shrink-0">Geographics:</span>
                  <span className="text-xs text-gray-200">{
                    typeof client.targetAudienceDefinition?.geographics === 'object' && client.targetAudienceDefinition?.geographics !== null
                      ? Object.values(client.targetAudienceDefinition.geographics).join(', ')
                      : client.targetAudienceDefinition?.geographics
                  }</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Fade out effect at the bottom */}
        {clients.length > 4 && (
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
