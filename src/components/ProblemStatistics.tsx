import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Bar } from "./ui/chart";
import { useProblemData } from "../hooks/useProblemData";
import { format } from "date-fns";
import SubmissionHeatMap from "./SubmissionHeatMap";

type FilterPeriod = "7" | "30" | "90";

// Codeforces rating bands and colors
const ratingBands = [
  { min: 3000, max: 3500, color: "#aa0066", label: "Legendary Grandmaster" },
  { min: 2600, max: 2999, color: "#ff0000", label: "Red" },
  { min: 2400, max: 2599, color: "#ff8c00", label: "Orange" },
  { min: 2100, max: 2399, color: "#aa00aa", label: "Violet" },
  { min: 1900, max: 2099, color: "#0000ff", label: "Blue" },
  { min: 1600, max: 1899, color: "#03a89e", label: "Cyan" },
  { min: 1400, max: 1599, color: "#008000", label: "Green" },
  { min: 1200, max: 1399, color: "#808080", label: "Gray" },
  { min: 800, max: 1199, color: "#cccccc", label: "Light Gray" },
];

const getBarColor = (rating) => {
  for (const band of ratingBands) {
    if (rating >= band.min && rating <= band.max) return band.color;
  }
  return "#cccccc";
};

const ProblemStatistics = () => {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("30");
  const { data: problems, isLoading, error } = useProblemData();

  const filteredProblems = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(filterPeriod));
    return problems.filter(
      (problem) => new Date(problem.solved_at) >= cutoffDate
    );
  }, [problems, filterPeriod]);

  const stats = useMemo(() => {
    if (!filteredProblems.length) {
      return {
        mostDifficultProblem: null,
        totalProblems: 0,
        averageRating: 0,
        averageProblemsPerDay: 0,
        ratingDistribution: {} as Record<string, number>,
      };
    }

    const mostDifficultProblem = filteredProblems.reduce(
      (max, p) => (p.rating || 0) > (max?.rating || 0) ? p : max),
      filteredProblems[0]
    );

    const totalProblems = filteredProblems.length;
    const averageRating =
      filteredProblems.reduce((sum, p) => sum + (p.rating || 0), 0) / totalProblems;
    const averageProblemsPerDay = totalProblems / parseInt(filterPeriod);

    // Create rating buckets (800-3500 in steps of 100)
    const ratingDistribution = filteredProblems.reduce((acc, problem) => {
      const bucket = Math.floor((problem.rating || 0) / 100) * 100;
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      mostDifficultProblem,
      totalProblems,
      averageRating,
      averageProblemsPerDay,
      ratingDistribution,
    };
  }, [filteredProblems, filterPeriod]);

  const chartData = useMemo(() => {
    const labels = Object.keys(stats.ratingDistribution).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );
    const data = labels.map((label) => stats.ratingDistribution[label]);
    const backgroundColor = labels.map((label) => getBarColor(parseInt(label)));
    return {
      labels,
      datasets: [
        {
          label: "Problems Solved",
          data,
          backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1,
        },
      ],
    };
  }, [stats.ratingDistribution]);

  const generateHeatMapData = () => {
    const heatmapData: Record<string, number> = {};
    filteredProblems.forEach((problem) => {
      const date = format(new Date(problem.solved_at), "yyyy-MM-dd");
      heatmapData[date] = (heatmapData[date] || 0) + 1;
    });
    return heatmapData;
  };

  if (isLoading) {
    return <div>Loading statistics...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Problem Statistics</h2>
        <Select
          value={filterPeriod}
          onValueChange={(value) => setFilterPeriod(value as FilterPeriod)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Most Difficult Problem
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {stats.mostDifficultProblem ? stats.mostDifficultProblem.rating : "N/A"}
          </p>
          {stats.mostDifficultProblem && (
            <p className="mt-1 text-sm text-gray-500">
              {stats.mostDifficultProblem.problem_name}
            </p>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Problems</h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalProblems}</p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
          <p className="mt-2 text-3xl font-bold">
            {stats.averageRating.toFixed(0)}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Avg Problems/Day
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {stats.averageProblemsPerDay.toFixed(1)}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Problems by Rating</h3>
        <div className="h-[300px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `Solved: ${context.parsed.y}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
        {/* Legend for rating bands */}
        <div className="flex flex-wrap gap-2 mt-4">
          {ratingBands.map((band) => (
            <div key={band.label} className="flex items-center space-x-2">
              <span className="inline-block w-4 h-4 rounded" style={{ background: band.color, border: '1px solid #888' }}></span>
              <span className="text-xs" style={{ color: band.color }}>{band.min}-{band.max}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Submission Heat Map</h3>
        <div className="h-[200px]">
          <SubmissionHeatMap
            data={generateHeatMapData()}
            days={parseInt(filterPeriod)}
          />
        </div>
      </Card>
    </div>
  );
};

export default ProblemStatistics;
 