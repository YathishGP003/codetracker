
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Trophy, Target, TrendingUp, Activity } from 'lucide-react';
import { Student } from '../types/Student';
import ContestHistory from './ContestHistory';
import ProblemSolvingData from './ProblemSolvingData';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
  isDarkMode: boolean;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'contests' | 'problems'>('contests');

  const getRatingColor = (rating: number) => {
    if (rating >= 1600) return 'text-purple-400';
    if (rating >= 1400) return 'text-blue-400';
    if (rating >= 1200) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`rounded-3xl p-8 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
          : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
      }`}>
        <button
          onClick={onBack}
          className={`mb-6 flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <ArrowLeft size={18} />
          <span>Back to Students</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
          {/* Student Avatar and Basic Info */}
          <div className="flex-shrink-0">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-2xl font-bold text-white mb-4 ${
              student.isActive 
                ? 'bg-gradient-to-br from-green-500 to-teal-500' 
                : 'bg-gradient-to-br from-gray-500 to-slate-500'
            }`}>
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className={`text-center ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                student.isActive
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {student.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="flex-grow">
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {student.name}
            </h1>
            <p className={`text-lg mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              {student.email}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-4 rounded-2xl ${
                isDarkMode ? 'bg-slate-800/30' : 'bg-gray-100/50'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-xl bg-blue-500/20">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    CF Handle
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-400">
                  {student.codeforcesHandle}
                </p>
              </div>

              <div className={`p-4 rounded-2xl ${
                isDarkMode ? 'bg-slate-800/30' : 'bg-gray-100/50'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-xl bg-green-500/20">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Current Rating
                  </span>
                </div>
                <p className={`text-lg font-bold ${getRatingColor(student.currentRating)}`}>
                  {student.currentRating}
                </p>
              </div>

              <div className={`p-4 rounded-2xl ${
                isDarkMode ? 'bg-slate-800/30' : 'bg-gray-100/50'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-xl bg-purple-500/20">
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Max Rating
                  </span>
                </div>
                <p className={`text-lg font-bold ${getRatingColor(student.maxRating)}`}>
                  {student.maxRating}
                </p>
              </div>

              <div className={`p-4 rounded-2xl ${
                isDarkMode ? 'bg-slate-800/30' : 'bg-gray-100/50'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-xl bg-orange-500/20">
                    <Activity className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Last Updated
                  </span>
                </div>
                <p className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {student.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`rounded-3xl p-2 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
          : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
      }`}>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('contests')}
            className={`flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-300 ${
              activeTab === 'contests'
                ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg'
                : isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Contest History
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-300 ${
              activeTab === 'problems'
                ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg'
                : isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Problem Solving Data
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'contests' ? (
        <ContestHistory studentId={student.id} />
      ) : (
        <ProblemSolvingData student={student} isDarkMode={isDarkMode} />
      )}
    </div>
  );
};

export default StudentProfile;
