
import React, { useState, useEffect } from 'react';
import { Check, ExternalLink, Play, Clock, Target } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useProblems } from '@/hooks/useProblemData';

interface Problem {
  id: string;
  name: string;
  contestId: number;
  index: string;
  rating?: number;
  tags: string[];
  solved: boolean;
  solvedAt?: string;
}

interface ProblemTrackerProps {
  studentId: string;
  contestId?: number;
  title?: string;
}

const ProblemTracker: React.FC<ProblemTrackerProps> = ({ 
  studentId, 
  contestId = 31, // Default to CP-31 as shown in image
  title = "CP-31 Problem Tracker"
}) => {
  const { isDarkMode } = useDarkMode();
  const { data: solvedProblems = [] } = useProblems(studentId);
  const [problems, setProblems] = useState<Problem[]>([]);

  // Sample problems based on the image (you can replace with real data)
  const sampleProblems = [
    { id: '1', name: 'Forked!', contestId: 31, index: 'A', rating: 800 },
    { id: '2', name: 'Chemistry', contestId: 31, index: 'B', rating: 900 },
    { id: '3', name: 'Vasilije in Cacak', contestId: 31, index: 'C', rating: 1000 },
    { id: '4', name: 'Jellyfish and Undertale', contestId: 31, index: 'D', rating: 1200 },
    { id: '5', name: 'Make It Zero', contestId: 31, index: 'E', rating: 1400 },
    { id: '6', name: 'Longest Divisors Interval', contestId: 31, index: 'F', rating: 1600 },
    { id: '7', name: 'Balanced Round', contestId: 31, index: 'G', rating: 1800 },
    { id: '8', name: 'Comparison String', contestId: 31, index: 'H', rating: 2000 },
  ];

  useEffect(() => {
    // Map solved problems to check which ones are completed
    const problemsWithStatus = sampleProblems.map(problem => {
      const solved = solvedProblems.some(sp => 
        sp.name.toLowerCase().includes(problem.name.toLowerCase()) ||
        (sp.id && sp.id.includes(`${problem.contestId}-${problem.index}`))
      );
      
      const solvedProblem = solvedProblems.find(sp => 
        sp.name.toLowerCase().includes(problem.name.toLowerCase())
      );

      return {
        ...problem,
        solved,
        solvedAt: solvedProblem?.solvedAt,
        tags: ['implementation', 'math'] // Sample tags
      };
    });

    setProblems(problemsWithStatus);
  }, [solvedProblems]);

  const solvedCount = problems.filter(p => p.solved).length;
  const totalCount = problems.length;

  return (
    <div className={`rounded-3xl p-6 transition-all duration-500 ${
      isDarkMode 
        ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
        : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <p className={`text-sm ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Progress: {solvedCount}/{totalCount} problems solved
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Progress Circle */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray={`${(solvedCount / totalCount) * 175.93} 175.93`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.round((solvedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-2">
        {problems.map((problem, index) => (
          <div
            key={problem.id}
            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
              problem.solved
                ? 'bg-green-500/20 border border-green-500/30'
                : isDarkMode
                  ? 'bg-slate-800/30 border border-slate-700/30 hover:bg-slate-700/30'
                  : 'bg-gray-100/50 border border-gray-200/50 hover:bg-gray-200/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Problem Number and Status */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                problem.solved
                  ? 'bg-green-500 text-white'
                  : isDarkMode
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-gray-300 text-gray-700'
              }`}>
                {problem.solved ? (
                  <Check size={16} />
                ) : (
                  index + 1
                )}
              </div>

              {/* Problem Info */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    problem.solved
                      ? 'text-green-600'
                      : isDarkMode
                        ? 'text-white'
                        : 'text-gray-900'
                  }`}>
                    {problem.name}
                  </span>
                  <a
                    href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                {problem.rating && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      problem.rating >= 1600
                        ? 'bg-purple-500/20 text-purple-400'
                        : problem.rating >= 1200
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                    }`}>
                      {problem.rating}
                    </span>
                    {problem.solved && problem.solvedAt && (
                      <span className={`text-xs ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        <Clock size={12} className="inline mr-1" />
                        {new Date(problem.solvedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {!problem.solved && (
                <button
                  onClick={() => window.open(`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`, '_blank')}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    isDarkMode
                      ? 'bg-blue-900/50 text-blue-400 hover:bg-blue-800/50'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title="Solve Problem"
                >
                  <Play size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className={`mt-6 pt-4 border-t ${
        isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
      }`}>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-lg font-bold text-green-500`}>
              {solvedCount}
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Solved
            </div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              {totalCount - solvedCount}
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Remaining
            </div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold text-blue-500`}>
              {totalCount}
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemTracker;
