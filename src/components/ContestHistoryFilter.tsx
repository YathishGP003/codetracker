
import React from 'react';

interface ContestHistoryFilterProps {
  timeFilter: 30 | 90 | 365;
  onFilterChange: (filter: 30 | 90 | 365) => void;
  isDarkMode: boolean;
}

const ContestHistoryFilter: React.FC<ContestHistoryFilterProps> = ({
  timeFilter,
  onFilterChange,
  isDarkMode
}) => {
  return (
    <div className={`rounded-3xl p-6 ${
      isDarkMode 
        ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
        : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Contest History Filter
      </h3>
      <div className="flex space-x-3">
        {[30, 90, 365].map((days) => (
          <button
            key={days}
            onClick={() => onFilterChange(days as 30 | 90 | 365)}
            className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
              timeFilter === days
                ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg'
                : isDarkMode
                ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last {days} days
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContestHistoryFilter;
