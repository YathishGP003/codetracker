
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useContests } from '@/hooks/useContestData';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface RatingChartProps {
  studentId: string;
}

const RatingChart: React.FC<RatingChartProps> = ({ studentId }) => {
  const { data: contests = [] } = useContests(studentId);
  const { isDarkMode } = useDarkMode();

  const ratingData = contests.slice().reverse().map((contest, index) => ({
    contest: `Contest ${index + 1}`,
    rating: contest.rating,
    date: contest.date,
    name: contest.name
  }));

  const getRatingColor = (rating: number) => {
    if (rating >= 1600) return 'text-purple-400';
    if (rating >= 1400) return 'text-blue-400';
    if (rating >= 1200) return 'text-green-400';
    return 'text-gray-400';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg border ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">{data.date}</p>
          <p className={`font-bold ${getRatingColor(data.rating)}`}>
            Rating: {data.rating}
          </p>
        </div>
      );
    }
    return null;
  };

  if (contests.length === 0) {
    return (
      <div className={`rounded-3xl p-8 ${
        isDarkMode 
          ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
          : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
      }`}>
        <h3 className={`text-xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Rating Progress
        </h3>
        <div className="flex items-center justify-center h-40">
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            No contest data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl p-8 ${
      isDarkMode 
        ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
        : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
    }`}>
      <h3 className={`text-xl font-bold mb-6 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Rating Progress
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ratingData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#334155' : '#e2e8f0'} 
            />
            <XAxis 
              dataKey="contest" 
              stroke={isDarkMode ? '#94a3b8' : '#64748b'}
              fontSize={12}
            />
            <YAxis 
              stroke={isDarkMode ? '#94a3b8' : '#64748b'}
              fontSize={12}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="rating" 
              stroke="url(#ratingGradient)" 
              strokeWidth={3}
              dot={{ fill: '#0891b2', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#0891b2' }}
            />
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingChart;
