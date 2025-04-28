
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceSuggestion } from "@/types/oracle";

interface PricingCardProps {
  priceSuggestions: PriceSuggestion[];
}

const PricingCard = ({ priceSuggestions }: PricingCardProps) => {
  return (
    <Card className="card-bg hover-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Suggested Price Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {priceSuggestions.map((price, index) => (
            <div 
              key={index} 
              className="p-3 border border-white/5 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium text-gray-300">{price.type}</h4>
                <span className="text-xl font-bold text-white bg-white/10 px-2 py-0.5 rounded">{price.value}</span>
              </div>
              <p className="text-gray-400 text-xs">{price.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
