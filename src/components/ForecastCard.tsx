import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Forecast } from "@/types/oracle";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList, Tooltip as RechartsTooltip, ResponsiveContainer, LabelProps } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ForecastCardProps {
  forecast: Forecast;
}

const parseValue = (value: string | number) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const cleanValue = value.toLowerCase().trim();
  const firstNumber = cleanValue.split('-')[0];
  const withoutCurrency = firstNumber.replace(/[$€£]/g, '').trim();
  if (withoutCurrency.includes('m')) {
    return parseFloat(withoutCurrency.replace(/[^0-9.]/g, '')) * 1000000;
  }
  if (withoutCurrency.includes('k')) {
    return parseFloat(withoutCurrency.replace(/[^0-9.]/g, '')) * 1000;
  }
  if (withoutCurrency.includes('b')) {
    return parseFloat(withoutCurrency.replace(/[^0-9.]/g, '')) * 1000000000;
  }
  return parseFloat(withoutCurrency.replace(/[^0-9.]/g, '')) || 0;
};

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

const getAvg = (a: string | number, b: string | number) => {
  const av = parseValue(a);
  const bv = parseValue(b);
  return (av + bv) / 2;
};

const renderCategoryLabel = (props: LabelProps) => {
  const { x, y, value, height, width } = props;
  const xNum = Number(x);
  const yNum = Number(y);
  const widthNum = Number(width);
  const heightNum = Number(height);
  const threshold = 120;
  if (widthNum < threshold) {
    return (
      <text x={xNum - 8} y={yNum + heightNum / 2 + 5} fill="#fff" fontSize={13} fontWeight="500" alignmentBaseline="middle" textAnchor="end">
        {value}
      </text>
    );
  }
  return (
    <text x={xNum + 8} y={yNum + heightNum / 2 + 5} fill="#fff" fontSize={13} fontWeight="500" alignmentBaseline="middle">
      {value}
    </text>
  );
};

const ForecastBarChart = ({ data, title, prefix = "", period, bestCase, avgCase, worstCase, valueLabel }: any) => (
  <Card className="card-bg hover-card shadow-lg">
    <CardHeader className="pb-2">
      <CardTitle className="text-xl font-medium">
        {title} {period ? `(${period})` : ''}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ right: 16, left: 0, top: 0, bottom: 0 }}
          >
            <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#222" />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tick={false}
              hide
            />
            <XAxis dataKey="value" type="number" hide />
            <RechartsTooltip
              cursor={false}
              contentStyle={{ background: '#1a1a1a', border: 'none', color: '#fff' }}
              formatter={(value: number) => valueLabel ? valueLabel(value) : formatValue(value)}
            />
            <Bar
              dataKey="value"
              layout="vertical"
              radius={6}
              fill="#4ade80"
              isAnimationActive={false}
            >
              <LabelList dataKey="name" position="insideLeft" content={props => renderCategoryLabel({ ...props, fill: '#fff' })} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
          <h4 className="text-sm font-medium text-white">Best Case</h4>
          <p className="text-xs text-gray-400">{title}: {prefix}{formatValue(bestCase)} {period ? `(${period})` : ''}</p>
        </div>
        <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
          <h4 className="text-sm font-medium text-white">Average Case</h4>
          <p className="text-xs text-gray-400">{title}: {prefix}{formatValue(avgCase)} {period ? `(${period})` : ''}</p>
        </div>
        <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
          <h4 className="text-sm font-medium text-white">Worst Case</h4>
          <p className="text-xs text-gray-400">{title}: {prefix}{formatValue(worstCase)} {period ? `(${period})` : ''}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ForecastCard = ({ forecast }: ForecastCardProps) => {
  // Revenue
  const bestRevenue = forecast.bestCase.revenue;
  const worstRevenue = forecast.worstCase.revenue;
  const avgRevenue = getAvg(bestRevenue, worstRevenue);
  // Customers
  const bestCustomers = forecast.bestCase.customers;
  const worstCustomers = forecast.worstCase.customers;
  const avgCustomers = getAvg(bestCustomers, worstCustomers);
  // Period
  const period = forecast.bestCase.period || forecast.worstCase.period || forecast.timeframe;

  const revenueData = [
    { name: "Best Case", value: parseValue(bestRevenue) },
    { name: "Average Case", value: avgRevenue },
    { name: "Worst Case", value: parseValue(worstRevenue) },
  ];
  const customerData = [
    { name: "Best Case", value: parseValue(bestCustomers) },
    { name: "Average Case", value: avgCustomers },
    { name: "Worst Case", value: parseValue(worstCustomers) },
  ];

  return (
    <div className="space-y-6">
      <ForecastBarChart
        title="Revenue Forecast"
        data={revenueData}
        prefix="$"
        period={period}
        bestCase={bestRevenue}
        avgCase={avgRevenue}
        worstCase={worstRevenue}
        valueLabel={formatValue}
      />
      <ForecastBarChart
        title="Customer Forecast"
        data={customerData}
        period={period}
        bestCase={bestCustomers}
        avgCase={avgCustomers}
        worstCase={worstCustomers}
        valueLabel={formatValue}
      />
    </div>
  );
};

export default ForecastCard;
