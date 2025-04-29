import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/oracle";

interface ClientsCardProps {
  clients: Client[];
}

const ClientsCard = ({ clients }: ClientsCardProps) => {
  return (
    <Card className="card-bg hover-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Target Audience</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.map((client, index) => (
            <div 
              key={index} 
              className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">{client.name}</h4>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{client.industry}</span>
              </div>
              <p className="text-gray-400 text-sm">
                <span className="text-white text-xs mr-1">Use Case:</span>
                {client.useCase}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsCard;
