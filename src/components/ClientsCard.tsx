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
      <CardContent>
        <div className="space-y-3">
          {clients.map((client, index) => (
            <div 
              key={index} 
              className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-white">{client["potential client name"]}</h4>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-white/5 text-gray-400 border-white/10"
                >
                  {client.industry}
                </Badge>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-400 shrink-0">Use Case:</span>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {client.useCase}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsCard;
