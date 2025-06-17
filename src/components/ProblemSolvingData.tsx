
import React, { useState } from 'react';
import { Calendar, Target, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { Student, Problem, StudentStats } from '../types/Student';

interface ProblemSolvingDataProps {
  student: Student;
  isDarkMode: boolean;
}

const ProblemSolvingData: React.FC<ProblemSolvingDataProps> = ({ student, isDarkMode }) => {
  const [timeFilter, setTimeFilter] = useState<7 | 30 | 90>(30);
  
  // Mock data for demonstration
  const stats: StudentStats = {
    totalProblems: 245,
    averageRating: 1342,
    averageProblemsPerDay: 2.3,
    mostDifficultProblem: {
      id: '1',
      name: 'Maximum Subarray Sum',
      rating: 1800,
      solvedAt: '2024-01-10',
      tags: ['dp', 'greedy']
    },
    problemsByRating: {
      '800-1000': 45,
      '1000-1200': 67,
      '1200-1400': 89,
      '1400-1600': 34,
      '1600+': 10
    },
    submissionHeatmap: {
      '2024-01-01': 3,
      '2024-01-02': 5,
      '2024-01-03': 2,
      '2024-01-04': 7,
      '2024-01-05': 4,
      '2024-01-06': 6,
      '2024-01-07': 1
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 1600) return 'text-purple-400';
    if (rating >= 1400) return 'text-blue-400';
    if (rating >= 1200) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className={`rounded-3xl p-6 ${
        isDarkMode 
          ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
          : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Problem Solving Filter
        </h3>
        <div className="flex space-x-3">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeFilter(days as 7 | 30 | 90)}
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

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-3xl p-6 ${
          isDarkMode 
            ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
            : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Total Problems
              </h4>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.totalProblems}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl p-6 ${
          isDarkMode 
            ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
            : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Average Rating
              </h4>
              <p className={`text-2xl font-bold ${getRatingColor(stats.averageRating)}`}>
                {stats.averageRating}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl p-6 ${
          isDarkMode 
            ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
            : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Problems/Day
              </h4>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.averageProblemsPerDay}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl p-6 ${
          isDarkMode 
            ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
            : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Hardest Problem
              </h4>
              <p className={`text-xl font-bold ${getRatingColor(stats.mostDifficultProblem?.rating || 0)}`}>
                {stats.mostDifficultProblem?.rating}
              </p>
              <p className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                {stats.mostDifficultProblem?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Problems by Rating Chart */}
      <div className={`rounded-3xl p-8 ${
        isDarkMode 
          ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
          : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
      }`}>
        <h3 className={`text-xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Problems by Rating Distribution
        </h3>
        
        <div className="space-y-4">
          {Object.entries(stats.problemsByRating).map(([range, count]) => (
            <div key={range} className="flex items-center space-x-4">
              <div className={`w-20 text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {range}
              </div>
              <div className="flex-1 bg-gray-200/20 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(count / Math.max(...Object.values(stats.problemsByRating))) * 100}%` }}
                ></div>
              </div>
              <div className={`w-12 text-sm font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Heatmap */}
      <div className={`rounded-3xl p-8 ${
        isDarkMode 
          ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
          : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
      }`}>
        <h3 className={`text-xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Submission Heatmap
        </h3>
        
        <div className="grid grid-cols-7 gap-2">
          {Object.entries(stats.submissionHeatmap).map(([date, submissions]) => (
            <div
              key={date}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                submissions > 5
                  ? 'bg-teal-500 text-white'
                  : submissions > 3
                  ? 'bg-teal-400 text-white'
                  : submissions > 1
                  ? 'bg-teal-300 text-gray-900'
                  : submissions > 0
                  ? 'bg-teal-200 text-gray-900'
                  : isDarkMode
                  ? 'bg-slate-800/50 text-slate-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
              title={`${date}: ${submissions} submissions`}
            >
              {submissions || ''}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs">
          <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Less
          </span>
          <div className="flex space-x-1">
            {[0, 1, 3, 5, 7].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${
                  level === 0
                    ? isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
                    : level === 1
                    ? 'bg-teal-200'
                    : level === 3
                    ? 'bg-teal-300'
                    : level === 5
                    ? 'bg-teal-400'
                    : 'bg-teal-500'
                }`}
              ></div>
            ))}
          </div>
          <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            More
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingData;
