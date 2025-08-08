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
      <Card className="flex flex-col items-center p-6 bg-white/90 dark:bg-slate-900/70 border border-indigo-100 dark:border-slate-800 shadow-xl">
        <TrendingUp className="w-7 h-7 text-indigo-600 mb-2" />
        <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Rating Progress
        </div>
        <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
          {currentRating} / {maxRating}
        </div>
        <div className="text-xs text-slate-500 mt-1">Current / Max</div>
      </Card>
      {/* Problems Solved */}
      <Card className="flex flex-col items-center p-6 bg-white/90 dark:bg-slate-900/70 border border-indigo-100 dark:border-slate-800 shadow-xl">
        <ListChecks className="w-7 h-7 text-emerald-600 mb-2" />
        <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Problems Solved
        </div>
        <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
          {problemsSolved} / {totalProblems}
        </div>
        <div className="text-xs text-slate-500 mt-1">Solved / Total</div>
        {typeof allSolved === "number" && (
          <div className="text-xs text-indigo-600 dark:text-indigo-300 mt-2">
            All Codeforces: {allSolved}
          </div>
        )}
      </Card>
      {/* Leaderboard Rank */}
      <Card className="flex flex-col items-center p-6 bg-white/90 dark:bg-slate-900/70 border border-indigo-100 dark:border-slate-800 shadow-xl">
        <Award className="w-7 h-7 text-amber-500 mb-2" />
        <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Leaderboard
        </div>
        <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
          {leaderboardRank ? `#${leaderboardRank}` : "-"}
        </div>
        <div className="text-xs text-slate-500 mt-1">Rank</div>
      </Card>
      {/* Overall Progress */}
      <Card className="flex flex-col items-center p-6 bg-white/90 dark:bg-slate-900/70 border border-indigo-100 dark:border-slate-800 shadow-xl">
        <TrendingUp className="w-7 h-7 text-fuchsia-600 mb-2" />
        <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Overall Progress
        </div>
        <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
          {totalProblems > 0
            ? `${Math.round((problemsSolved / totalProblems) * 100)}%`
            : "0%"}
        </div>
        <div className="text-xs text-slate-500 mt-1">Completion</div>
      </Card>
    </div>
  );
};

export default CPSheetStats;
