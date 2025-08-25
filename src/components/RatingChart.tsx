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
import { useContestHistory } from "@/hooks/useContestHistory";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { format } from "date-fns";

interface RatingChartProps {
  handle: string;
}

const ratingBands = [
  { rank: "Newbie", min: 0, max: 1199, color: "#94a3b8" }, // Cool gray
  { rank: "Pupil", min: 1200, max: 1399, color: "#4ade80" }, // Green
  { rank: "Specialist", min: 1400, max: 1599, color: "#2dd4bf" }, // Teal
  { rank: "Expert", min: 1600, max: 1899, color: "#60a5fa" }, // Blue
  {
    rank: "Candidate Master",
    min: 1900,
    max: 2099,
    color: "#c084fc", // Purple
  },
  { rank: "Master", min: 2100, max: 2399, color: "#f59e0b" }, // Amber
  { rank: "Grandmaster", min: 2400, max: 2999, color: "#ef4444" }, // Red
  {
    rank: "Legendary Grandmaster",
    min: 3000,
    max: 4000,
    color: "#7f1d1d", // Dark red
  },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      contestName: string;
      newRating: number;
      oldRating: number;
      rank: number;
      date: Date;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  const { isDarkMode } = useDarkMode();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const ratingChange = data.newRating - data.oldRating;
    return (
      <div
        className={`p-2 rounded border text-sm ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300"
        }`}
      >
        <p className="font-bold">{data.contestName}</p>
        <p>
          {`Rank: ${data.rank}, Rating: ${data.newRating} (${
            ratingChange >= 0 ? "+" : ""
          }${ratingChange})`}
        </p>
        <p className="text-xs text-gray-500">
          {format(data.date, "MMM d, yyyy")}
        </p>
      </div>
    );
  }
  return null;
};

const RatingChart: React.FC<RatingChartProps> = ({ handle }) => {
  const { data: contestHistory, isLoading } = useContestHistory(handle);
  const { isDarkMode } = useDarkMode();

  const chartData = (contestHistory || [])
    .map((d) => ({
      ...d,
      date: new Date(d.ratingUpdateTimeSeconds * 1000),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        Loading chart...
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        No contest data available to display chart.
      </div>
    );
  }

  const ratings = chartData.map((d) => d.newRating);
  const minRating = Math.floor(Math.min(...ratings) / 200) * 200 - 200;
  const maxRating = Math.ceil(Math.max(...ratings) / 200) * 200 + 200;

  const yAxisTicks = [0, 1200, 1400, 1600, 1900, 2100, 2300, 2400, 2600, 3000];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="0"
          stroke={
            isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
          }
        />
        {ratingBands.map((band) => (
          <ReferenceArea
            key={band.rank}
            y1={band.min}
            y2={band.max}
            ifOverflow="extendDomain"
            fill={band.color}
            stroke={band.color}
            fillOpacity={1}
            strokeOpacity={1}
          />
        ))}
        <XAxis
          dataKey="date"
          tickFormatter={(time) => format(time, "MMM yyyy")}
          stroke={isDarkMode ? "white" : "black"}
          minTickGap={60}
        />
        <YAxis
          domain={[0, "dataMax + 200"]}
          stroke={isDarkMode ? "white" : "black"}
          allowDataOverflow
          ticks={yAxisTicks}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ top: -10, right: 20 }}
          payload={[
            {
              value: handle,
              type: "line",
              color: "#ffc833",
            },
          ]}
        />
        <Line
          type="monotone"
          dataKey="newRating"
          stroke="#ffc833"
          strokeWidth={1.5}
          dot={{
            stroke: "#ffc833",
            strokeWidth: 1,
            r: 3,
            fill: "white",
          }}
          activeDot={{
            stroke: "white",
            strokeWidth: 1,
            r: 5,
            fill: "#ffc833",
          }}
          name={handle}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RatingChart;
