import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Forecast } from "@/types/oracle";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ForecastCardProps {
  forecast: Forecast;
}

const ForecastCard = ({ forecast }: ForecastCardProps) => {
  // Process data for chart - safely handle both string and number types
  const parseValue = (value: string | number) => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;

    // Handle currency and number formatting
    const cleanValue = value.toLowerCase().trim();
    
    // Extract the first number in case of ranges (e.g., "5M-10M" -> "5M")
    const firstNumber = cleanValue.split('-')[0];
    
    // Remove currency symbols and spaces
    const withoutCurrency = firstNumber.replace(/[$€£]/g, '').trim();
    
    // Convert K/M/B to actual numbers
    if (withoutCurrency.includes('m')) {
      return parseFloat(withoutCurrency.replace(/[^0-9.]/g, '')) * 1000000;
    }
    if (withoutCurrency.includes('k')) {
      return parseFloat(withoutCurrency.replace(/[^0-9.]/g, '')) * 1000;
    }
    if (withoutCurrency.includes('b')) {
      return parseFloat(withoutCurrency.replace(/[^0-9.]/g, '')) * 1000000000;
    }
    
    // Default case - just extract numbers
    return parseFloat(withoutCurrency.replace(/[^0-9.]/g, '')) || 0;
  };
  
  // Format values for display with units
  const formatValue = (value: string | number) => {
    if (typeof value === 'string') return value;
    if (typeof value !== 'number') return '0';
    
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const revenueData = [
    {
      name: "Best Case",
      value: parseValue(forecast.bestCase.revenue),
    },
    {
      name: "Worst Case",
      value: parseValue(forecast.worstCase.revenue),
    },
  ];

  const customerData = [
    {
      name: "Best Case",
      value: parseValue(forecast.bestCase.customers),
    },
    {
      name: "Worst Case",
      value: parseValue(forecast.worstCase.customers),
    },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "#38bdf8", // Modern blue
    },
  };

  const ModernBarChart = ({ data, title, prefix = "", period }: { data: any[]; title: string; prefix?: string; period?: string }) => (
    <Card className="card-bg hover-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">
          {title} {period ? `(${period})` : forecast.timeframe ? `(${forecast.timeframe})` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} barCategoryGap={60} barGap={24} height={180} width={220}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#222" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="#aaa"
            />
            <ChartTooltip cursor={{ fill: 'rgba(56,189,248,0.08)' }} content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="#9BDCE1" radius={8} />
          </BarChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
            <h4 className="text-sm font-medium text-white">Best Case</h4>
            <p className="text-xs text-gray-400">{title}: {prefix}{formatValue(data[0].value)} {forecast.bestCase.period ? `(${forecast.bestCase.period})` : ''}</p>
            <p className="text-xs text-gray-400">Market Share: {formatValue(forecast.bestCase.marketShare)}</p>
          </div>
          <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
            <h4 className="text-sm font-medium text-gray-400">Worst Case</h4>
            <p className="text-xs text-gray-400">{title}: {prefix}{formatValue(data[1].value)} {forecast.worstCase.period ? `(${forecast.worstCase.period})` : ''}</p>
            <p className="text-xs text-gray-400">Market Share: {formatValue(forecast.worstCase.marketShare)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <ModernBarChart title="Revenue Forecast" data={revenueData} prefix="$" period={forecast.bestCase.period || forecast.worstCase.period} />
      <ModernBarChart title="Customer Forecast" data={customerData} period={forecast.bestCase.period || forecast.worstCase.period} />
    </div>
  );
};

export default ForecastCard;
