
import React from 'react';
import { Users, TrendingUp, Calendar, Mail } from 'lucide-react';

interface FeaturesSectionProps {
  isDarkMode: boolean;
}

const FeaturesSection = ({ isDarkMode }: FeaturesSectionProps) => {
  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Comprehensive student database with Codeforces integration and progress tracking.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Detailed contest history, rating graphs, and problem-solving statistics.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: Calendar,
      title: 'Automated Sync',
      description: 'Daily Codeforces data synchronization with customizable scheduling.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Mail,
      title: 'Smart Reminders',
      description: 'Automatic email notifications for inactive students with tracking.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="features" className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Powerful Features for
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            {' '}Modern Educators
          </span>
        </h2>
        <p className={`text-xl ${
          isDarkMode ? 'text-slate-400' : 'text-gray-600'
        }`}>
          Everything you need to track, analyze, and improve student performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 hover:border-slate-700/50' 
                : 'bg-white/80 backdrop-blur-xl border border-gray-200/50 hover:border-gray-300/50'
            }`}
          >
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} w-fit mb-6`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            
            <h3 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {feature.title}
            </h3>
            
            <p className={`text-lg leading-relaxed ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
