import React from "react";
import { Card } from "./ui/card";
import { TrendingUp, Award, ListChecks } from "lucide-react";

interface CPSheetStatsProps {
  currentRating: number;
  maxRating: number;
  problemsSolved: number;
  totalProblems: number;
  leaderboardRank?: number;
  allSolved?: number; // Add this prop
}

const CPSheetStats: React.FC<CPSheetStatsProps> = ({
  currentRating,
  maxRating,
  problemsSolved,
  totalProblems,
  leaderboardRank,
  allSolved,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Rating Progress */}
      <Card className="flex flex-col items-center p-6">
        <TrendingUp className="w-7 h-7 text-blue-500 mb-2" />
        <div className="text-lg font-semibold">Rating Progress</div>
        <div className="text-2xl font-bold mt-1">
          {currentRating} / {maxRating}
        </div>
        <div className="text-xs text-gray-500 mt-1">Current / Max</div>
      </Card>
      {/* Problems Solved */}
      <Card className="flex flex-col items-center p-6">
        <ListChecks className="w-7 h-7 text-green-500 mb-2" />
        <div className="text-lg font-semibold">Problems Solved</div>
        <div className="text-2xl font-bold mt-1">
          {problemsSolved} / {totalProblems}
        </div>
        <div className="text-xs text-gray-500 mt-1">Solved / Total</div>
        {typeof allSolved === "number" && (
          <div className="text-xs text-blue-400 mt-2">
            All Codeforces: {allSolved}
          </div>
        )}
      </Card>
      {/* Leaderboard Rank */}
      <Card className="flex flex-col items-center p-6">
        <Award className="w-7 h-7 text-yellow-500 mb-2" />
        <div className="text-lg font-semibold">Leaderboard</div>
        <div className="text-2xl font-bold mt-1">
          {leaderboardRank ? `#${leaderboardRank}` : "-"}
        </div>
        <div className="text-xs text-gray-500 mt-1">Rank</div>
      </Card>
      {/* Overall Progress */}
      <Card className="flex flex-col items-center p-6">
        <TrendingUp className="w-7 h-7 text-purple-500 mb-2" />
        <div className="text-lg font-semibold">Overall Progress</div>
        <div className="text-2xl font-bold mt-1">
          {totalProblems > 0
            ? `${Math.round((problemsSolved / totalProblems) * 100)}%`
            : "0%"}
        </div>
        <div className="text-xs text-gray-500 mt-1">Completion</div>
      </Card>
    </div>
  );
};

export default CPSheetStats;
