import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

type FilterPeriod = 30 | 90 | 365;

interface ContestHistoryFilterProps {
  selectedPeriod: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
}

const ContestHistoryFilter: React.FC<ContestHistoryFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const { isDarkMode } = useDarkMode();

  const getButtonClass = (period: FilterPeriod) => {
    const baseClass =
      "px-4 py-2 rounded-lg font-semibold transition-all duration-200";
    if (period === selectedPeriod) {
      return `${baseClass} bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg`;
    }
    return `${baseClass} ${
      isDarkMode
        ? "bg-slate-700/50 hover:bg-slate-700 text-slate-300"
        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
    }`;
  };

  return (
    <div
      className={`p-4 rounded-xl mb-6 ${
        isDarkMode ? "bg-slate-800/50" : "bg-white/80"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-3 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Contest History Filter
      </h3>
      <div className="flex space-x-2">
        <button
          onClick={() => onPeriodChange(30)}
          className={getButtonClass(30)}
        >
          Last 30 days
        </button>
        <button
          onClick={() => onPeriodChange(90)}
          className={getButtonClass(90)}
        >
          Last 90 days
        </button>
        <button
          onClick={() => onPeriodChange(365)}
          className={getButtonClass(365)}
        >
          Last 365 days
        </button>
      </div>
    </div>
  );
};

export default ContestHistoryFilter;
