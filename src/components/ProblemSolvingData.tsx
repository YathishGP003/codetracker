import React, { useState, useEffect } from "react";
import {
  Calendar,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  Trophy,
} from "lucide-react";
import { Student, Problem, StudentStats } from "../types/Student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRatingColor } from "../lib/utils";

interface ProblemSolvingDataProps {
  student: Student;
  isDarkMode: boolean;
}

const ProblemSolvingData: React.FC<ProblemSolvingDataProps> = ({
  student,
  isDarkMode,
}) => {
  const [timeFilter, setTimeFilter] = useState<7 | 30 | 90>(30);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProblemSolvingData();
  }, [student.id, timeFilter]);

  const fetchProblemSolvingData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(
        `/api/students/${student.id}/problem-solving?days=${timeFilter}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching problem solving data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHeatmapColor = (count: number) => {
    if (count === 0) return isDarkMode ? "bg-slate-800/50" : "bg-gray-100";
    if (count <= 2) return "bg-green-200 dark:bg-green-900/30";
    if (count <= 4) return "bg-green-300 dark:bg-green-800/40";
    if (count <= 6) return "bg-green-400 dark:bg-green-700/50";
    return "bg-green-500 dark:bg-green-600/60";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <Card
        className={isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white"}
      >
        <CardHeader>
          <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
            Problem Solving Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={timeFilter.toString()}
            onValueChange={(value) =>
              setTimeFilter(parseInt(value) as 7 | 30 | 90)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Most Difficult Problem */}
        <Card
          className={
            isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white"
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Hardest Problem
                </h4>
                <p
                  className={`text-2xl font-bold ${getRatingColor(
                    stats.mostDifficultProblem?.rating || 0
                  )}`}
                >
                  {stats.mostDifficultProblem?.rating}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {stats.mostDifficultProblem?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Problems */}
        <Card
          className={
            isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white"
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Total Problems
                </h4>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.totalProblems}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card
          className={
            isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white"
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Average Rating
                </h4>
                <p
                  className={`text-2xl font-bold ${getRatingColor(
                    stats.averageRating
                  )}`}
                >
                  {stats.averageRating}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problems per Day */}
        <Card
          className={
            isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white"
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Problems/Day
                </h4>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.averageProblemsPerDay.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution Chart */}
      <Card
        className={isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white"}
      >
        <CardHeader>
          <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
            Problems by Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.problemsByRating).map(([range, count]) => (
              <div key={range} className="flex items-center space-x-4">
                <div
                  className={`w-24 text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  {range}
                </div>
                <div className="flex-1 bg-gray-200/20 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (count /
                          Math.max(...Object.values(stats.problemsByRating))) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div
                  className={`w-12 text-sm font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {count}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Heatmap */}
      <Card
        className={isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white"}
      >
        <CardHeader>
          <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
            Submission Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="grid grid-cols-7 gap-2">
              {Object.entries(stats.submissionHeatmap).map(
                ([date, submissions]) => (
                  <Tooltip key={date}>
                    <TooltipTrigger asChild>
                      <div
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${getHeatmapColor(
                          submissions
                        )}`}
                      >
                        {submissions || ""}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {date}: {submissions} submissions
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )
              )}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemSolvingData;
