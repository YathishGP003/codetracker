
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  isDarkMode: boolean;
}

const HeroSection = ({ isDarkMode }: HeroSectionProps) => {
  const handleWatchDemo = () => {
    window.open('https://www.tle-eliminators.com', '_blank');
  };

  return (
    <section className="container mx-auto px-6 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            isDarkMode 
              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' 
              : 'bg-teal-100 text-teal-700 border border-teal-200'
          }`}>
            ✨ Next-Gen Student Progress Management
          </span>
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Transform Your
          <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {' '}Competitive Programming{' '}
          </span>
          Education
        </h1>
        
        <p className={`text-xl md:text-2xl mb-10 leading-relaxed ${
          isDarkMode ? 'text-slate-400' : 'text-gray-600'
        }`}>
          Monitor student progress, analyze performance trends, and boost engagement with automated insights and smart notifications.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 text-lg"
          >
            <span>Start Free Trial</span>
            <ArrowRight size={20} />
          </Link>
          
          <button 
            onClick={handleWatchDemo}
            className={`px-8 py-4 rounded-2xl font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105 text-lg ${
              isDarkMode 
                ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50' 
                : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
            }`}
          >
            <span>Watch Demo</span>
          </button>
        </div>

        <div className="mb-12">
          <Link
            to="/explore"
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'text-teal-400 hover:bg-teal-500/10 border border-teal-500/30' 
                : 'text-teal-600 hover:bg-teal-50 border border-teal-200'
            }`}
          >
            <span>Explore Students</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className={`p-6 rounded-2xl ${
            isDarkMode 
              ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
              : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
          }`}>
            <div className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              10,000+
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Students Tracked
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl ${
            isDarkMode 
              ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
              : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
          }`}>
            <div className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              500+
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Instructors
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl ${
            isDarkMode 
              ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
              : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
          }`}>
            <div className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              99.9%
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Uptime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
