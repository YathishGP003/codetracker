
import React from 'react';
import { Users, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { Student, Contest, Problem } from '@/types/Student';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface DashboardStatsProps {
  students: Student[];
  contests: Contest[];
  problems: Problem[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ students, contests, problems }) => {
  const { isDarkMode } = useDarkMode();
  
  const activeStudents = students.filter(student => student.isActive);
  const recentlyActiveStudents = students.filter(student => {
    if (!student.lastSubmissionDate) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(student.lastSubmissionDate) > weekAgo;
  });
  
  const topPerformers = students.filter(student => student.currentRating >= 1500);
  const needAttention = students.filter(student => {
    if (!student.lastSubmissionDate) return true;
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return new Date(student.lastSubmissionDate) < twoWeeksAgo;
  });

  const stats = [
    {
      title: 'Total Students',
      value: students.length.toString(),
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up'
    },
    {
      title: 'Active This Week',
      value: recentlyActiveStudents.length.toString(),
      change: '+8%',
      icon: TrendingUp,
      color: 'from-green-500 to-teal-500',
      trend: 'up'
    },
    {
      title: 'Top Performers',
      value: topPerformers.length.toString(),
      change: '+15%',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      trend: 'up'
    },
    {
      title: 'Need Attention',
      value: needAttention.length.toString(),
      change: '-5%',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-500',
      trend: 'down'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            isDarkMode 
              ? 'bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 hover:border-slate-700/70' 
              : 'bg-white/90 backdrop-blur-xl border border-gray-200/50 hover:border-gray-300/70 shadow-lg'
          }`}
        >
          {/* Glowing background effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  {stat.title}
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                stat.trend === 'up' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
