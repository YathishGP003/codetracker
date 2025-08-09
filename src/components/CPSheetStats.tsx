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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
      {/* Rating Progress */}
      <Card className="group relative overflow-hidden p-5 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 transition-colors hover:border-slate-700">
        <div className="absolute -top-14 -right-16 h-40 w-40 rounded-full bg-sky-500/10 blur-2xl" />
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-500/10 ring-1 ring-sky-500/30 p-2">
            <TrendingUp className="text-sky-400" />
          </div>
          <div className="text-sm font-semibold text-slate-300">
            Rating Progress
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight text-white">
          {currentRating}
          <span className="text-slate-500"> / {maxRating}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">Current / Max</div>
      </Card>

      {/* Problems Solved */}
      <Card className="group relative overflow-hidden p-5 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 transition-colors hover:border-slate-700">
        <div className="absolute -top-14 -right-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30 p-2">
            <ListChecks className="text-emerald-400" />
          </div>
          <div className="text-sm font-semibold text-slate-300">
            Problems Solved
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight text-white">
          {problemsSolved}
          <span className="text-slate-500"> / {totalProblems}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">Solved / Total</div>
        {typeof allSolved === "number" && (
          <div className="mt-2 text-xs text-emerald-300/90">
            All Codeforces: {allSolved}
          </div>
        )}
      </Card>

      {/* Leaderboard Rank */}
      <Card className="group relative overflow-hidden p-5 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 transition-colors hover:border-slate-700">
        <div className="absolute -top-14 -right-16 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl" />
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/10 ring-1 ring-amber-500/30 p-2">
            <Award className="text-amber-400" />
          </div>
          <div className="text-sm font-semibold text-slate-300">
            Leaderboard
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight text-white">
          {leaderboardRank ? `#${leaderboardRank}` : "-"}
        </div>
        <div className="mt-1 text-xs text-slate-500">Rank</div>
      </Card>

      {/* Overall Progress */}
      <Card className="group relative overflow-hidden p-5 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 transition-colors hover:border-slate-700">
        <div className="absolute -top-14 -right-16 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-2xl" />
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-fuchsia-500/10 ring-1 ring-fuchsia-500/30 p-2">
            <TrendingUp className="text-fuchsia-400" />
          </div>
          <div className="text-sm font-semibold text-slate-300">
            Overall Progress
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight text-white">
          {totalProblems > 0
            ? `${Math.round((problemsSolved / totalProblems) * 100)}%`
            : "0%"}
        </div>
        <div className="mt-1 text-xs text-slate-500">Completion</div>
      </Card>
    </div>
  );
};

export default CPSheetStats;
