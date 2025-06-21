import React from "react";
import { Calendar, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface Contest {
  contestName: string;
  ratingUpdateTimeSeconds: number;
  rank: number;
  oldRating: number;
  newRating: number;
  problemsSolved: number; // You will need to add this data
}

interface ContestCardProps {
  contest: Contest;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  const { isDarkMode } = useDarkMode();
  const ratingChange = contest.newRating - contest.oldRating;

  const getRatingChangeColor = () => {
    if (ratingChange > 0) return "text-green-400";
    if (ratingChange < 0) return "text-red-400";
    return isDarkMode ? "text-slate-400" : "text-gray-500";
  };

  const RatingChangeIcon =
    ratingChange > 0 ? TrendingUp : ratingChange < 0 ? TrendingDown : BarChart2;

  return (
    <div
      className={`rounded-xl p-4 transition-all duration-200 ${
        isDarkMode
          ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800"
          : "bg-white/80 border border-gray-200/80 hover:bg-white"
      }`}
    >
      <h3
        className={`font-bold text-lg mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {contest.contestName}
      </h3>
      <div
        className={`flex items-center space-x-4 text-sm mb-4 ${
          isDarkMode ? "text-slate-400" : "text-gray-600"
        }`}
      >
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>
            {new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Rank: {contest.rank}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-slate-500" : "text-gray-500"
            }`}
          >
            Rating
          </p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-purple-400" : "text-purple-600"
            }`}
          >
            {contest.newRating}
          </p>
        </div>
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-slate-500" : "text-gray-500"
            }`}
          >
            Change
          </p>
          <div
            className={`flex items-center justify-center space-x-1 text-2xl font-bold ${getRatingChangeColor()}`}
          >
            <RatingChangeIcon size={20} />
            <span>{ratingChange}</span>
          </div>
        </div>
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-slate-500" : "text-gray-500"
            }`}
          >
            Problems
          </p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-slate-300" : "text-gray-800"
            }`}
          >
            {contest.problemsSolved}/?
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
