
import React, { useState } from 'react';
import { useContests } from '@/hooks/useContestData';
import { useDarkMode } from '@/contexts/DarkModeContext';
import ContestHistoryFilter from './ContestHistoryFilter';
import ContestList from './ContestList';

interface ContestHistoryProps {
  studentId: string;
}

const ContestHistory: React.FC<ContestHistoryProps> = ({ studentId }) => {
  const [timeFilter, setTimeFilter] = useState<30 | 90 | 365>(30);
  const { data: contests = [] } = useContests(studentId);
  const { isDarkMode } = useDarkMode();

  // Filter contests based on time filter
  const filteredContests = contests.filter(contest => {
    const contestDate = new Date(contest.date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeFilter);
    return contestDate >= cutoffDate;
  });

  return (
    <div className={`rounded-3xl p-8 ${
      isDarkMode 
        ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
        : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
    }`}>
      <h3 className={`text-xl font-bold mb-6 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Contest History
      </h3>
      
      <div className="space-y-6">
        <ContestHistoryFilter
          timeFilter={timeFilter}
          onFilterChange={setTimeFilter}
          isDarkMode={isDarkMode}
        />
        
        {filteredContests.length > 0 ? (
          <ContestList contests={filteredContests} isDarkMode={isDarkMode} />
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
              No contest data available for the selected period
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestHistory;
