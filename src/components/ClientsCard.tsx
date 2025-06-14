import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/oracle";
import { Users, Target, MapPin, TrendingUp } from "lucide-react";

interface ClientsCardProps {
  clients?: Client[];
}

const ClientsCard = ({ clients = [] }: ClientsCardProps) => {
  if (!clients || clients.length === 0) {
    return (
      <Card className="bg-[#FFFFFF] rounded-[8px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-[#202020] flex items-center gap-3 tracking-tight">
            <Users className="w-6 h-6 text-[#202020]" /> Target Audience
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-[#202020]">
            No client segments available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none outline-none bg-white shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="font-['Fustat'] font-medium text-[40px] leading-[69px] tracking-[-0.02em] align-middle text-[#202020] flex items-center justify-between">
          Target Audience
          <span className="ml-4 px-6  rounded-[8px] border border-[#202020]/10 bg-[#F8F8F7BF] text-[18px] text-[#202020] hover:bg-[#F8F8F7] transition font-medium shadow-sm">
            {clients.length} segments
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar pr-2">
          {clients.map((client, index) => (
            <div 
              key={index}
              className="relative p-6 rounded-[4px] overflow-hidden"
              style={{
                backgroundImage: "url('background/background-4.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="absolute inset-0 bg-[#FFFFFF]/20" />
              <div className="relative z-10 bg-[#FFFFFFBF] p-6 rounded-[8px] h-full">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div>
                    <h4 className="font-['Fustat'] font-normal text-[24px] leading-8 text-[#202020] mb-1">
                      {client.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-[#202020] font-medium">
                      <Target className="w-3 h-3 text-[#202020] flex-shrink-0" />
                      {client.industry}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {client.targetAudienceType && (
                      <span className="px-3 py-1 rounded-full bg-[#A7B897] font-medium text-xs border border-pink-200/10 whitespace-nowrap">
                        {client.targetAudienceType}
                      </span>
                    )}
                    {client.segment?.priority && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                        client.segment.priority === 'high' 
                          ? 'bg-[#A7B897]'
                          : client.segment.priority === 'medium'
                          ? 'bg-[#A7B897]'
                          : 'bg-[#A7B897]'
                      }`}>
                        {client.segment.priority} priority
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="w-full h-px bg-[#20202026] my-4" />

                <div className="font-['Fustat'] font-normal text-[18px] leading-6 text-[#202020] mb-4">
                  {client.useCase}
                </div>

                <div className="space-y-3">
                  {/* Demographics Section */}
                  {client.targetAudienceDefinition?.demographics?.primary && (
                    <div>
                      <h5 className="font-['Fustat'] font-light text-[15px] leading-[25px] text-[#202020] mb-1">Demographics</h5>
                      <div className="flex flex-wrap gap-1">
                        {client.targetAudienceDefinition.demographics.primary.map((demo, i) => (
                          <span 
                            key={i}
                            className="px-5 py-1.52 mb-2 rounded-2xl bg-[#2020200D] text-[#202020] font-['Fustat'] font-light text-[15px] leading-[25px] border"
                          >
                            {demo}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Needs Section */}
                  {client.targetAudienceDefinition?.psychographics?.needs && (
                    <div>
                      <h5 className="font-['Fustat'] font-light text-[15px] leading-[25px] text-[#202020] mb-1">Key Needs</h5>
                      <div className="flex flex-wrap gap-1">
                        {client.targetAudienceDefinition.psychographics.needs.map((need, i) => (
                          <span 
                            key={i}
                            className="px-5 py-1.52 mb-2 rounded-2xl bg-[#2020200D] text-[#202020] font-['Fustat'] font-light text-[15px] leading-[25px] border"
                          >
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location & Growth */}
                  <div className="space-y-2 pt-2">
                    {client.targetAudienceDefinition?.geographics && (
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-[#202020] flex-shrink-0" />
                        <span className="text-[#202020]">
                          {client.targetAudienceDefinition.geographics.location}, {client.targetAudienceDefinition.geographics.coverage}
                        </span>
                      </div>
                    )}
                    {client.segment?.growth && (
                      <div className="flex items-center gap-1 text-sm text-[#202020]">
                        <TrendingUp className="w-3 h-3 text-[#202020] flex-shrink-0" />
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
          <div className="absolute bottom-0 left-0 right-2 h-20 pointer-events-none" />
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
