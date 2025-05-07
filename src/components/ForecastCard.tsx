import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Forecast } from "@/types/oracle";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList, Tooltip as RechartsTooltip, ResponsiveContainer, LabelProps, LineChart, Line, AreaChart, Area, Cell } from "recharts";
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

const REVENUE_GRADIENTS = [
  { id: "revBarBest", from: "#1e293b", to: "#2563eb" },   // darkest blue (Best Case)
  { id: "revBarAvg", from: "#2563eb", to: "#60a5fa" },    // medium blue (Average Case)
  { id: "revBarWorst", from: "#60a5fa", to: "#dbeafe" },  // lightest blue (Worst Case)
];

// Custom label renderer for inside-left bar labels
const renderInsideLeftLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  // Add padding from the left edge of the bar
  const padding = 8;
  return (
    <text
      x={x + padding}
      y={y + height / 2}
      fill="#f9fafb"
      fontSize={13}
      fontWeight={600}
      alignmentBaseline="middle"
      dominantBaseline="middle"
      textAnchor="start"
      pointerEvents="none"
    >
      {value}
    </text>
  );
};

const ForecastBarChart = ({ data, title, prefix = "", period, bestCase, avgCase, worstCase, valueLabel }: any) => {
  // Attach a custom fill to each data entry
  const dataWithFill = data.map((entry: any, idx: number) => ({
    ...entry,
    fill: `url(#${REVENUE_GRADIENTS[data.length - 1 - idx].id})`,
  }));
  return (
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
              data={dataWithFill}
              layout="vertical"
              margin={{ right: 16, left: -60, top: 0, bottom: 0 }}
            >
              <defs>
                {REVENUE_GRADIENTS.map((g, idx) => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={g.from} />
                    <stop offset="100%" stopColor={g.to} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#222" />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={false}
              />
              <XAxis dataKey="value" type="number" hide />
              <RechartsTooltip
                cursor={false}
                contentStyle={{ background: '#1a1a1a', border: 'none', color: '#f9fafb' }}
                formatter={(value: number) => valueLabel ? valueLabel(value) : formatValue(value)}
              />
              <Bar
                dataKey="value"
                barSize={32}
                radius={6}
                isAnimationActive={false}
              >
                <LabelList dataKey="name" content={renderInsideLeftLabel} />
                <LabelList dataKey="value" position="right" fill="#fff" fontSize={13} fontWeight={500} formatter={valueLabel} />
                {dataWithFill.map((entry: any, idx: number) => (
                  <Cell key={`cell-${idx}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
            <h4 className="text-sm font-medium text-white">Best Case</h4>
            <p className="text-xs text-gray-400">{title}: {formatWithPrefix(prefix, bestCase)} {period ? `(${period})` : ''}</p>
          </div>
          <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
            <h4 className="text-sm font-medium text-white">Average Case</h4>
            <p className="text-xs text-gray-400">{title}: {formatWithPrefix(prefix, avgCase)} {period ? `(${period})` : ''}</p>
          </div>
          <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
            <h4 className="text-sm font-medium text-white">Worst Case</h4>
            <p className="text-xs text-gray-400">{title}: {formatWithPrefix(prefix, worstCase)} {period ? `(${period})` : ''}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ForecastAreaChart = ({ data, title, period, bestCase, avgCase, worstCase, valueLabel }: any) => (
  <Card className="card-bg hover-card shadow-lg">
    <CardHeader className="pb-2">
      <CardTitle className="text-xl font-medium">
        {title} {period ? `(${period})` : ''}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
          >
            <defs>
              <linearGradient id="customerBlueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#fff', fontSize: 13, fontWeight: 500 }} />
            <YAxis dataKey="value" axisLine={false} tickLine={false} tick={false} hide />
            <RechartsTooltip
              cursor={false}
              contentStyle={{ background: '#1a1a1a', border: 'none', color: '#f9fafb' }}
              formatter={(value: number) => valueLabel ? valueLabel(value) : formatValue(value)}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#customerBlueGradient)"
              dot={{ r: 6, fill: '#60a5fa', stroke: '#2563eb', strokeWidth: 2 }}
              activeDot={{ r: 8, fill: '#2563eb', stroke: '#60a5fa', strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <LabelList dataKey="value" position="top" fill="#fff" fontSize={13} fontWeight={500} formatter={valueLabel} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
          <h4 className="text-sm font-medium text-white">Best Case</h4>
          <p className="text-xs text-gray-400">{title}: {formatValue(bestCase)} {period ? `(${period})` : ''}</p>
        </div>
        <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
          <h4 className="text-sm font-medium text-white">Average Case</h4>
          <p className="text-xs text-gray-400">{title}: {formatValue(avgCase)} {period ? `(${period})` : ''}</p>
        </div>
        <div className="space-y-1 p-3 border border-white/10 rounded-lg transition-all duration-200 hover:border-white/20 hover:bg-white/5">
          <h4 className="text-sm font-medium text-white">Worst Case</h4>
          <p className="text-xs text-gray-400">{title}: {formatValue(worstCase)} {period ? `(${period})` : ''}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Helper to avoid double $ in summary cards
const formatWithPrefix = (prefix: string, value: string | number) => {
  const formatted = formatValue(value);
  if (prefix && formatted.startsWith(prefix)) return formatted;
  return prefix + formatted;
};

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
      <ForecastAreaChart
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
