import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
} from "recharts";
import { useContests } from "@/hooks/useContestData";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface RatingChartProps {
  studentId: string;
  handle?: string;
}

// Codeforces rating bands and colors
const ratingBands = [
  { min: 3000, max: 3500, color: "#aa0066" }, // Legendary Grandmaster
  { min: 2600, max: 2999, color: "#ff0000" }, // Red
  { min: 2400, max: 2599, color: "#ff8c00" }, // Orange
  { min: 2100, max: 2399, color: "#aa00aa" }, // Violet
  { min: 1900, max: 2099, color: "#0000ff" }, // Blue
  { min: 1600, max: 1899, color: "#03a89e" }, // Cyan
  { min: 1400, max: 1599, color: "#008000" }, // Green
  { min: 1200, max: 1399, color: "#808080" }, // Gray
  { min: 800, max: 1199, color: "#cccccc" }, // Light Gray
];

const getBandColor = (rating: number) => {
  for (const band of ratingBands) {
    if (rating >= band.min && rating <= band.max) return band.color;
  }
  return "#cccccc";
};

const RatingChart: React.FC<RatingChartProps> = ({ studentId, handle }) => {
  const { data: contests = [] } = useContests(studentId);
  const { isDarkMode } = useDarkMode();

  const ratingData = contests
    .slice()
    .reverse()
    .map((contest, index) => ({
      contest: `#${contests.length - index}`,
      rating: contest.rating,
      date: contest.date,
      name: contest.name,
    }));

  // Y-axis ticks for Codeforces
  const yTicks = [
    800, 1200, 1400, 1600, 1900, 2100, 2300, 2400, 2600, 3000, 3500,
  ];

  // Custom background bands
  const renderBands = () =>
    ratingBands.map((band, i) => (
      <ReferenceArea
        key={i}
        y1={band.min}
        y2={band.max + 1}
        stroke={band.color}
        fill={band.color}
        fillOpacity={0.18}
        ifOverflow="extendDomain"
      />
    ));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`p-3 rounded-lg border shadow-lg ${
            isDarkMode
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          <div className="font-semibold">{data.name}</div>
          <div className="text-xs mb-1">{data.date}</div>
          <div className="font-bold text-yellow-500">Rating: {data.rating}</div>
        </div>
      );
    }
    return null;
  };

  if (contests.length === 0) {
    return (
      <div
        className={`rounded-3xl p-8 ${
          isDarkMode
            ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
            : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Rating Progress
        </h3>
        <div className="flex items-center justify-center h-40">
          <p className={isDarkMode ? "text-slate-400" : "text-gray-600"}>
            No contest data available
          </p>
        </div>
      </div>
    );
  }

  // Legend with handle
  const renderLegend = () => (
    <div className="flex items-center space-x-2 mt-2">
      <span className="inline-block w-4 h-4 rounded bg-yellow-400 border border-yellow-600" />
      <span className="font-semibold text-sm px-2 py-1 rounded bg-yellow-100 border border-yellow-400 text-yellow-800">
        {handle || "Codeforces Handle"}
      </span>
    </div>
  );

  return (
    <div
      className={`rounded-3xl p-8 ${
        isDarkMode
          ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
          : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
      }`}
    >
      <h3
        className={`text-xl font-bold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Contest Rating
      </h3>
      <div className="h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ratingData}
            margin={{ left: 0, right: 0, top: 10, bottom: 10 }}
          >
            {renderBands()}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? "#334155" : "#e2e8f0"}
            />
            <XAxis
              dataKey="contest"
              stroke={isDarkMode ? "#94a3b8" : "#64748b"}
              fontSize={12}
              tick={{ fontWeight: 600 }}
              minTickGap={0}
            />
            <YAxis
              domain={[800, 3500]}
              ticks={yTicks}
              stroke={isDarkMode ? "#94a3b8" : "#64748b"}
              fontSize={12}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#FFD700"
              strokeWidth={3}
              dot={{ fill: "#FFD700", stroke: "#FFD700", r: 5 }}
              activeDot={{ r: 8, fill: "#FFD700", stroke: "#FFD700" }}
            />
          </LineChart>
        </ResponsiveContainer>
        {renderLegend()}
      </div>
    </div>
  );
};

export default RatingChart;
