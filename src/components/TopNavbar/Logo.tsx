import React from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "@/contexts/DarkModeContext";

export const Logo: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <Link to="/" className="flex items-center space-x-2 lg:space-x-3 group">
      {/* Codeforces-style vertical bars */}
      <div className="flex items-end space-x-1">
        <div className="w-1.5 lg:w-2 h-4 lg:h-6 bg-yellow-400 rounded-sm transition-all duration-200 group-hover:scale-110"></div>
        <div className="w-1.5 lg:w-2 h-5 lg:h-8 bg-blue-500 rounded-sm transition-all duration-200 group-hover:scale-110"></div>
        <div className="w-1.5 lg:w-2 h-3 lg:h-5 bg-red-500 rounded-sm transition-all duration-200 group-hover:scale-110"></div>
      </div>

      <div>
        <h1 className="text-lg lg:text-xl font-bold transition-colors duration-200">
          <span className="text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">
            CODE
          </span>
          <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            TRACKER
          </span>
        </h1>
        <p
          className={`text-xs lg:text-xs ${
            isDarkMode ? "text-slate-400" : "text-gray-600"
          } transition-colors duration-200 group-hover:text-slate-500 dark:group-hover:text-slate-300`}
        >
          PRO
        </p>
      </div>
    </Link>
  );
};
