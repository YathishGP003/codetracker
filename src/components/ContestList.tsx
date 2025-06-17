
import React from 'react';
import { Contest } from '../types/Student';
import ContestCard from './ContestCard';

interface ContestListProps {
  contests: Contest[];
  isDarkMode: boolean;
}

const ContestList: React.FC<ContestListProps> = ({ contests, isDarkMode }) => {
  return (
    <div className={`rounded-3xl p-8 ${
      isDarkMode 
        ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
        : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
    }`}>
      <h3 className={`text-xl font-bold mb-6 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Recent Contests
      </h3>

      <div className="space-y-4">
        {contests.map((contest) => (
          <ContestCard
            key={contest.id}
            contest={contest}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ContestList;
