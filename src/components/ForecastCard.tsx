
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Forecast } from "@/types/oracle";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ForecastCardProps {
  forecast: Forecast;
}

const ForecastCard = ({ forecast }: ForecastCardProps) => {
  // Process data for chart - safely handle both string and number types
  const parseValue = (value: string | number) => {
    if (typeof value === 'number') return value;
    return typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : 0;
  };
  
  const chartData = [
    {
      name: "Revenue",
      "Best Case": parseValue(forecast.bestCase.revenue),
      "Worst Case": parseValue(forecast.worstCase.revenue)
    },
    {
      name: "Customers",
      "Best Case": parseValue(forecast.bestCase.customers),
      "Worst Case": parseValue(forecast.worstCase.customers)
    }
  ];

  // Format values for display
  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <Card className="card-bg hover-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">
          Forecast ({forecast.timeframe})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip 
              contentStyle={{ backgroundColor: "#111", borderColor: "#444", color: "white" }}
              labelStyle={{ color: "white" }}
            />
            <Legend />
            <Bar dataKey="Best Case" fill="#fff" />
            <Bar dataKey="Worst Case" fill="#555" />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
            <h4 className="text-sm font-medium text-white">Best Case</h4>
            <p className="text-xs text-gray-400">Revenue: {formatValue(forecast.bestCase.revenue)}</p>
            <p className="text-xs text-gray-400">Market Share: {formatValue(forecast.bestCase.marketShare)}</p>
            <p className="text-xs text-gray-400">Customers: {formatValue(forecast.bestCase.customers)}</p>
          </div>
          <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
            <h4 className="text-sm font-medium text-gray-400">Worst Case</h4>
            <p className="text-xs text-gray-400">Revenue: {formatValue(forecast.worstCase.revenue)}</p>
            <p className="text-xs text-gray-400">Market Share: {formatValue(forecast.worstCase.marketShare)}</p>
            <p className="text-xs text-gray-400">Customers: {formatValue(forecast.worstCase.customers)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
