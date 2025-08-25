import React from "react";
import { Search } from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";

export const SearchBar: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className={`w-48 lg:w-64 px-4 py-2 pl-10 text-sm rounded-lg border transition-all duration-200 focus:scale-105 ${
          isDarkMode
            ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-500"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
        }`}
      />
      <Search
        size={16}
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          isDarkMode ? "text-slate-400" : "text-gray-400"
        }`}
      />
    </div>
  );
};
