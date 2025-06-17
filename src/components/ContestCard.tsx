
import React from 'react';
import { Calendar, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { Contest } from '../types/Student';

interface ContestCardProps {
  contest: Contest;
  isDarkMode: boolean;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, isDarkMode }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 1600) return 'text-purple-400';
    if (rating >= 1400) return 'text-blue-400';
    if (rating >= 1200) return 'text-green-400';
    return 'text-gray-400';
  };

  const formatToIST = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
        isDarkMode 
          ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50' 
          : 'bg-gray-50/50 border-gray-200/50 hover:border-gray-300/50'
      }`}
    >
      <div className="flex flex-col space-y-4">
        {/* Contest Title */}
        <div className="flex-1">
          <h4 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {contest.name}
          </h4>
          
          {/* Date and Rank Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className={`w-4 h-4 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`} />
              <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                {formatToIST(contest.date)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className={`w-4 h-4 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`} />
              <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                Rank: {contest.rank}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row - All contained within the card */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-sm font-medium mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Rating
            </div>
            <div className={`text-lg font-bold ${getRatingColor(contest.rating)}`}>
              {contest.rating}
            </div>
          </div>

          <div className="text-center">
            <div className={`text-sm font-medium mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Change
            </div>
            <div className={`text-lg font-bold flex items-center justify-center space-x-1 ${
              contest.ratingChange > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {contest.ratingChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}</span>
            </div>
          </div>

          <div className="text-center">
            <div className={`text-sm font-medium mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Problems
            </div>
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {contest.problemsSolved}/{contest.totalProblems}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
