import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueModel } from "@/types/oracle";
import { ChartBar } from "lucide-react";

import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface RevenueModelCardProps {
  revenueModel?: RevenueModel;
  currency: string;
}

const COLORS = [
  "#8b7cf6", // purple
  "#FFADDF", // pink
  "#FCEC3B", // yellow
  "#fbbf24", // orange
  "#34d399", // green
  "#60a5fa", // blue
];

const GRADIENT_COLORS = [
  { id: "gradPurple", start: "#8b7cf6", end: "#5f3dc4" },
  { id: "gradPink", start: "#FFADDF", end: "#ff3b82" },
  { id: "gradYellow", start: "#FCEC3B", end: "#f59e42" },
  { id: "gradOrange", start: "#fbbf24", end: "#ea580c" },
  { id: "gradGreen", start: "#34d399", end: "#059669" },
  { id: "gradBlue", start: "#60a5fa", end: "#2563eb" },
];

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angle: number
  ) => {
    const a = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  };
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

// Helper to format metric values with units
const formatMetricValue = (
  name: string,
  value: number | string,
  currency: string = "INR"
) => {
  const lower = name.toLowerCase();
  if (
    lower.includes("tvl") ||
    lower.includes("revenue") ||
    lower.includes("locked") ||
    lower.includes("arpu") ||
    lower.includes("amount") ||
    lower.includes("profit")
  ) {
    // Return as simple number for currency values
    return `${value} ${currency}`;
  }
  if (lower.includes("user")) {
    return `${value} users`;
  }
  if (lower.includes("audience")) {
    return `${value} people`;
  }
  if (lower.includes("rate") || lower.includes("growth")) {
    return `${value}%`;
  }
  return value;
};

const RevenueModelCard = ({
  revenueModel,
  currency,
}: RevenueModelCardProps) => {
  const [expandedStream, setExpandedStream] = useState<string | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  if (!revenueModel) return null;

  const pieData = revenueModel.primaryStreams.map((stream) => ({
    name: stream.name,
    value: stream.percentage,
    color:
      stream.scalability === "high"
        ? COLORS[0]
        : stream.scalability === "medium"
        ? COLORS[1]
        : COLORS[2],
    recurringType: stream.recurringType,
  }));

  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  const radius = 90;
  const stroke = 22;
  const gapAngle = 16;
  const cx = radius + stroke;
  const cy = radius + stroke;
  const chartCircum = 360;
  let currentAngle = -90;

  const renderDetailItem = (title: string, content: string | string[]) => {
    if (!content || (Array.isArray(content) && content.length === 0))
      return null;

    return (
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-400">{title}</div>
        {Array.isArray(content) ? (
          <ul className="list-disc list-inside space-y-1">
            {content.map((item, idx) => (
              <li key={idx} className="text-xs text-white/80 ml-4">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-white/80 ml-6">{content}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="border-none outline-none bg-white shadow-none">
      <CardHeader>
        <CardTitle
          className="text-[40px] font-bold flex items-center gap-3 tracking-tight"
          style={{ color: "#161616" }}
        >
          Revenue Model
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6 pt-0">
        {/* Market Analysis Section */}
        {revenueModel.marketAnalysis && (
          <div className="space-y-4 p-6 bg-[url('/images/light-pink.png')] rounded-lg bg-cover bg-no-repeat bg-center">
            <h4
              className="text-2xl font-semibold mb-2 tracking-tight"
              style={{ color: "#161616" }}
            >
              Market Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market Analysis */}
              <div className="rounded-xl bg-[#FFFFFFBF] p-8">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-[#CFD2D4]">
                      <td className="w-full py-6">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[1.35rem] text-[#161616]">
                            TAM
                          </span>
                          <span className="text-[#161616] text-[1.15rem] max-w-[60%] text-right">
                            {revenueModel.marketAnalysis.totalAddressableMarket}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-[#CFD2D4]">
                      <td className="w-full py-6">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[1.35rem] text-[#161616]">
                            SAM
                          </span>
                          <span className="text-[#161616] text-[1.15rem] max-w-[60%] text-right">
                            {
                              revenueModel.marketAnalysis
                                .serviceableAddressableMarket
                            }
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-[#CFD2D4]">
                      <td className="w-full py-6">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[1.35rem] text-[#161616]">
                            SOM
                          </span>
                          <span className="text-[#161616] text-[1.15rem] max-w-[60%] text-right">
                            {
                              revenueModel.marketAnalysis
                                .serviceableObtainableMarket
                            }
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-full py-6">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[1.35rem] text-[#161616]">
                            Growth Rate
                          </span>
                          <span className="text-[#161616] text-[1.15rem] max-w-[60%] text-right">
                            {revenueModel.marketAnalysis.marketGrowthRate}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Competitive Landscape */}
              {revenueModel.marketAnalysis.competitiveLandscape && (
                <div className="rounded-xl bg-[#FFFFFFBF] p-8">
                  <div>
                    <div className="font-medium text-[20px] leading-6 tracking-[-0.4%] align-middle text-[#161616] mb-4">
                      Competitive Landscape
                    </div>
                    <hr className="border-t border-[#A8B0B8] mb-8" />
                    <div className="mb-6">
                      <div className="font-normal text-[24px] leading-7 tracking-[-0.4%] align-middle text-[#161616] mb-3">
                        Market Share
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {Array.isArray(
                          revenueModel.marketAnalysis.competitiveLandscape
                            .marketShare
                        ) ? (
                          revenueModel.marketAnalysis.competitiveLandscape.marketShare.map(
                            (share, idx) => (
                              <span
                                key={idx}
                                className="px-6 py-3 rounded-md font-medium text-[16px] tracking-normal"
                                style={{
                                  background: "#E2D4C3",
                                  color: "#161616",
                                }}
                              >
                                {share}
                              </span>
                            )
                          )
                        ) : (
                          <span
                            className="px-6 py-3 rounded-md font-sans font-medium text-[16px] leading-[25px] tracking-normal"
                            style={{ background: "#E2D4C3", color: "#161616" }}
                          >
                            {
                              revenueModel.marketAnalysis.competitiveLandscape
                                .marketShare
                            }
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="font-normal text-[24px] leading-7 tracking-[-0.4%] align-middle text-[#161616] mb-3">
                        Competitors
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {revenueModel.marketAnalysis.competitiveLandscape.competitors?.map(
                          (competitor, idx) => (
                            <span
                              key={idx}
                              className="px-6 py-3 rounded-md font-sans font-medium text-[16px] leading-[25px] tracking-normal"
                              style={{
                                background: "#E2D4C3",
                                color: "#161616",
                              }}
                            >
                              {competitor}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-normal text-[24px] leading-7 tracking-[-0.4%] align-middle text-[#161616] mb-3">
                        Advantages
                      </div>
                      <div className="font-light text-[16px] leading-[24px] tracking-[-0.4%] align-middle text-[#161616]">
                        {Array.isArray(
                          revenueModel.marketAnalysis.competitiveLandscape
                            .competitiveAdvantages
                        )
                          ? revenueModel.marketAnalysis.competitiveLandscape.competitiveAdvantages.join(
                              ", "
                            )
                          : revenueModel.marketAnalysis.competitiveLandscape
                              .competitiveAdvantages}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Market Trends */}
            {revenueModel.marketAnalysis.marketTrends && (
              <div
                className="rounded-2xl border p-0 overflow-hidden mt-4"
                style={{ borderColor: "#CFD2D4", background: "#F8F7F3" }}
              >
                <div className="px-5 py-9">
                  <h5
                    className="font-normal text-[32px] leading-5 align-middle mb-6"
                    style={{ color: "#202020" }}
                  >
                    Market Trends
                  </h5>
                  <div className="flex flex-col space-y-4">
                    <div className="text-[#161616] text-[23px] font-light leading-8">
                      <span>Current: </span>{" "}
                      {revenueModel.marketAnalysis.marketTrends.current?.join(
                        ", "
                      )}
                    </div>
                    <div className="text-[#161616] text-[23px] font-light leading-8">
                      <span>Emerging: </span>{" "}
                      {revenueModel.marketAnalysis.marketTrends.emerging?.join(
                        ", "
                      )}
                    </div>
                    <div className="text-[#161616] text-[23px] font-light leading-8">
                      <span>Impact: </span>{" "}
                      {revenueModel.marketAnalysis.marketTrends.impact}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financial Projections */}
        {revenueModel.financialProjections && (
          <div className="space-y-4 p-6 bg-[url('/images/cyan-card.png')] bg-cover bg-center bg-no-repeat rounded-lg">
            <h4
              className="text-2xl font-semibold mb-2 tracking-tight"
              style={{ color: "#161616" }}
            >
              Financial Projections
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Revenue Growth */}
              <div
                className="rounded-xl borderoverflow-hidden flex flex-col"
                style={{ background: "#FFFFFFBF", minHeight: "400px" }}
              >
                <div className="flex-1">
                  <table className="w-full mt-6 text-left">
                    <tbody>
                      {revenueModel.financialProjections.revenueGrowth && (
                        <>
                          <tr
                            className="border-b"
                            style={{ borderColor: "#CFD2D4" }}
                          >
                            <td className="px-4 py-2 text-[#202020] font-medium text-[1.15rem] ">
                              Year 1
                            </td>
                            <td className="px-4 py-2 text-[#161616] text-[1.15rem] text-right">
                              {revenueModel.financialProjections.revenueGrowth
                                ?.year1 || "N/A"}
                            </td>
                          </tr>
                          <tr
                            className="border-b"
                            style={{ borderColor: "#CFD2D4" }}
                          >
                            <td className="px-4 py-2 text-[#202020] font-medium text-[1.15rem]">
                              Year 2
                            </td>
                            <td className="px-4 py-2 text-[#161616] text-[1.15rem] text-right">
                              {revenueModel.financialProjections.revenueGrowth
                                ?.year2 || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-[#202020] font-medium text-[1.15rem]">
                              Year 3
                            </td>
                            <td className="px-4 py-2 text-[#161616] text-[1.15rem] text-right">
                              {revenueModel.financialProjections.revenueGrowth
                                ?.year3 || "N/A"}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                {revenueModel.financialProjections.revenueGrowth
                  ?.assumptions && (
                  <div className="px-4 pb-4 mt-auto">
                    <div
                      className="text-sm text-white rounded-lg shadow-md"
                      style={{
                        width: "100%",
                        minHeight: "144px",
                        padding: "24px 26px",
                        backgroundColor: "#223B35",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {revenueModel.financialProjections.revenueGrowth.assumptions.join(
                        ", "
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Profit Margins */}
              <div
                className="rounded-2xl border p-0 overflow-hidden flex flex-col"
                style={{ background: "#FFFFFFBF", minHeight: "400px" }}
              >
                <div className="px-4 pt-6 pb-2">
                  <h5 className="text-2xl font-normal leading-8 tracking-[-0.4%] text-[#161616]">
                    Profit Margins
                  </h5>
                </div>
                <div className="flex-1">
                  <table className="w-full text-left">
                    <tbody>
                      {revenueModel.financialProjections.profitMargins && (
                        <>
                          <tr
                            className="border-b"
                            style={{ borderColor: "#CFD2D4" }}
                          >
                            <td className="px-4 py-2 text-[#202020] font-semibold text-[1.15rem]">
                              Current
                            </td>
                            <td className="px-4 py-2 text-[#161616] text-[1.15rem] text-right">
                              {revenueModel.financialProjections.profitMargins
                                ?.current || "N/A"}
                            </td>
                          </tr>
                          <tr
                            className="border-b"
                            style={{ borderColor: "#CFD2D4" }}
                          >
                            <td className="px-4 py-2 text-[#202020] font-semibold text-[1.15rem]">
                              Target
                            </td>
                            <td className="px-4 py-2 text-[#161616] text-[1.15rem] text-right">
                              {revenueModel.financialProjections.profitMargins
                                ?.target || "N/A"}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                {revenueModel.financialProjections.profitMargins
                  ?.improvementStrategy && (
                  <div className="px-4 pb-4 mt-auto">
                    <div
                      className="text-sm text-white rounded-lg shadow-md"
                      style={{
                        width: "100%",
                        minHeight: "168px",
                        padding: "24px 26px",
                        backgroundColor: "#223B35",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {
                        revenueModel.financialProjections.profitMargins
                          .improvementStrategy
                      }
                    </div>
                  </div>
                )}
              </div>
              {/* Break-Even Analysis */}
              <div
                className="rounded-2xl border p-0 overflow-hidden flex flex-col"
                style={{ background: "#FFFFFFBF", minHeight: "400px" }}
              >
                <div className="px-4 pt-6 pb-2">
                  <h5 className="text-2xl font-normal leading-8 tracking-[-0.4%] text-[#161616]">
                    Break Even
                  </h5>
                </div>
                <div className="flex-1">
                  <table className="w-full text-left">
                    <tbody>
                      {revenueModel.financialProjections.breakEvenAnalysis && (
                        <>
                          <tr
                            className="border-b"
                            style={{ borderColor: "#CFD2D4" }}
                          >
                            <td className="px-4 py-2 text-[#202020] font-semibold text-[1.15rem]">
                              Point
                            </td>
                            <td className="px-4 py-2 text-[#161616] text-[1.15rem] text-right">
                              {revenueModel.financialProjections
                                .breakEvenAnalysis?.point || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-[#202020] font-semibold text-[1.15rem]">
                              Timeline
                            </td>
                            <td className="px-4 py-2 text-[#161616] text-[1.15rem] text-right">
                              {revenueModel.financialProjections
                                .breakEvenAnalysis?.timeline || "N/A"}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                {revenueModel.financialProjections.breakEvenAnalysis
                  ?.assumptions && (
                  <div className="px-4 pb-4 mt-auto">
                    <div
                      className="text-sm text-white rounded-lg shadow-md"
                      style={{
                        width: "100%",
                        minHeight: "168px",
                        padding: "24px 26px",
                        backgroundColor: "#223B35",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {revenueModel.financialProjections.breakEvenAnalysis.assumptions.join(
                        ", "
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Streams Distribution */}
        <div className="rounded-xl p-6 bg-[url('/images/light-purple.png')] bg-left bg-no-repeat bg-cover">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-semibold flex items-center">
              Revenue Streams
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-6">
              {/* Chart and Legend Section */}
              <div className="mt-4 pb-4 bg-[#FFFFFFBF] rounded-lg ">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 w-full">
                  {/* Chart on the left */}
                  <div className="relative flex w-[55%] items-center justify-center mt-6">
                    <ResponsiveContainer
                      width={520}
                      height={420}
                      className="flex items-center justify-center w-full"
                    >
                      <RechartsPieChart>
                        {/* Background circles */}
                        <circle
                          cx="50%"
                          cy="50%"
                          r={80}
                          stroke="#00000050"
                          strokeWidth={1}
                          fill="none"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r={150}
                          stroke="#00000070"
                          strokeWidth={1}
                          fill="none"
                        />

                        {/* Center circle */}
                        <circle cx="50%" cy="50%" r={30} fill="#00000025" />

                        {/* Axes */}
                        <line
                          x1="0%"
                          y1="50%"
                          x2="100%"
                          y2="50%"
                          stroke="#00000070"
                          strokeWidth={1}
                          strokeDasharray="3 3"
                        />
                        <line
                          x1="50%"
                          y1="0%"
                          x2="50%"
                          y2="100%"
                          stroke="#00000070"
                          strokeWidth={1}
                          strokeDasharray="3 3"
                        />
                        {/* Positive Y-axis line */}
                        <line
                          x1="50%"
                          y1="50%"
                          x2="50%"
                          y2="0%"
                          stroke="#00000070"
                          strokeWidth={1}
                        />

                        <Pie
                          data={pieData.map((entry, idx) => ({
                            name: entry.name,
                            value: entry.value,
                            fill: ["#D48EA3", "#3987BE", "#A5848E", "#97A487"][
                              idx % 4
                            ], // Use 4 colors for 4 segments
                          }))}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={90} // Adjusted for thicker pie
                          outerRadius={140} // Kept same
                          stroke="transparent"
                          strokeWidth={2}
                          paddingAngle={1.5}
                          cornerRadius={6}
                          label={({
                            value,
                            cx,
                            cy,
                            midAngle,
                            outerRadius,
                            percent,
                          }) => {
                            const RADIAN = Math.PI / 180;
                            const sin = Math.sin(-RADIAN * midAngle);
                            const cos = Math.cos(-RADIAN * midAngle);

                            const lineOffset = 10;
                            const textOffset = 20;
                            const boxWidth = 54; // Adjusted for padding
                            const boxHeight = 29; // Adjusted for padding

                            const sx = cx + outerRadius * cos; // Start of line from arc
                            const sy = cy + outerRadius * sin;

                            const ex = cx + (outerRadius + lineOffset) * cos; // End of line
                            const ey = cy + (outerRadius + lineOffset) * sin;

                            const textX = cx + (outerRadius + textOffset) * cos; // Position for text (before adjustment)
                            const textY = cy + (outerRadius + textOffset) * sin;

                            // Adjust text and box position for quadrants to avoid overlap and align properly
                            const isLeft = cos < 0;
                            const labelBoxX =
                              textX + (isLeft ? -boxWidth - 5 : 5); // 5px offset from line end
                            const labelBoxY = textY - boxHeight / 2;

                            return (
                              <g>
                                <rect
                                  x={labelBoxX}
                                  y={labelBoxY}
                                  width={boxWidth}
                                  height={boxHeight}
                                  rx={4}
                                  ry={4}
                                  fill="transparent"
                                  stroke="#00000045"
                                  strokeWidth={1}
                                />
                                <text
                                  x={labelBoxX + boxWidth / 2} // Center text in box
                                  y={labelBoxY + boxHeight / 2}
                                  fill="#0A0A0A"
                                  textAnchor="middle" // Center text horizontally
                                  dominantBaseline="middle" // Center text vertically
                                  fontWeight={500}
                                  fontSize={14}
                                >
                                  {`${(percent * 100).toFixed(0)}%`}
                                </text>
                              </g>
                            );
                          }}
                          labelLine={false}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend on the right */}
                  <div className="flex flex-col w-[45%] gap-3 min-w-[180px]">
                    <h4 className="text-base font-semibold mb-2 mt-4">
                      Revenue Stream Distribution
                    </h4>
                    {pieData.map((entry, idx) => (
                      <div
                        key={entry.name}
                        className="flex items-center w-fit gap-3 px-4 py-3 rounded-lg border"
                        style={{
                          background: "#282828",
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded block"
                          style={{
                            background: ["#D48EA3", "#3987BE", "#A5848E", "#97A487"][
                              idx % 4
                            ],
                          }}
                        />
                        <span
                          className="text-base font-medium"
                          style={{ color: "#F8F7F3" }}
                        >
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revenue Streams List */}
              <div className="mt-8">
                <h4 className="text-xl font-semibold mb-4">
                  Revenue Stream Details
                </h4>
                <div className="space-y-4">
                  {revenueModel.primaryStreams.map((stream, index) => (
                    <div
                      key={`stream-${index}`}
                      className="rounded-md p-4 group"
                      style={{ background: "#FFFFFFBF" }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                stream.scalability === "high"
                                  ? "#D48EA3"
                                  : stream.scalability === "medium"
                                  ? "#3987BE"
                                  : "#A5848E"
                            }}
                          />
                          <span className="text-base font-semibold">
                            {stream.name}
                          </span>
                        </div>
                        <span
                          className="text-sm px-6 py-3 rounded-[8px]"
                          style={{
                            background: "#282828",
                            color: "#FFFFFF",
                          }}
                        >
                          {stream.recurringType} • {stream.percentage}%
                        </span>
                      </div>
                      {stream.description && (
                        <div
                          className="mt-2 text-sm pl-5 text-[#28282890]"
                        >
                          {stream.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Key Metrics */}
        <div className="rounded-xl p-6 bg-[url('/images/light-yellow.png')] bg-left bg-no-repeat bg-cover">
          <h4
            className="text-2xl font-semibold mb-4 tracking-tight"
            style={{ color: "#212121" }}
          >
            Key Metrics
          </h4>
          <div className="grid gap-4">
            {revenueModel.metrics.map((metric, index) => (
              <div
                key={`metric-${index}`}
                className="border rounded-md p-5 group"
                style={{ background: "#FFFFFFBF" }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div
                      className="text-base font-bold"
                      style={{ color: "#161616" }}
                    >
                      {metric.name}
                    </div>
                    <div className="text-xs" style={{ color: "#2B2521" }}>
                      {metric.timeframe}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="text-sm px-6 py-3 rounded-lg border"
                      style={{ background: "#C5B496", color: "#161616" }}
                    >
                      {formatMetricValue(metric.name, metric.target, currency)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm" style={{ color: "#2B2521" }}>
                  Current: {metric.current} | Target: {metric.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueModelCard;
