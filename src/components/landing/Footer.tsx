
import React from 'react';
import { Code } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer = ({ isDarkMode }: FooterProps) => {
  return (
    <footer className={`border-t ${
      isDarkMode ? 'border-slate-800/50 bg-slate-950/50' : 'border-gray-200/50 bg-gray-50/50'
    }`}>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDarkMode ? 'bg-gradient-to-br from-teal-500 to-blue-600' : 'bg-gradient-to-br from-teal-400 to-blue-500'
            }`}>
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent`}>
                CodeTracker Pro
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Empowering competitive programming education
              </p>
            </div>
          </div>
          
          <div className={`text-center md:text-right ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            <p>&copy; 2024 CodeTracker Pro. All rights reserved.</p>
            <p className="text-sm mt-1">Built for educators, by educators</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
