import React from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "@/contexts/DarkModeContext";

export const Logo: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <Link to="/" className="flex items-center space-x-4">
      <img src="/logo.png" alt="CodeTracker Pro Logo" className="w-10 h-10" />
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          CodeTracker Pro
        </h1>
        <p
          className={`text-sm ${
            isDarkMode ? "text-slate-400" : "text-gray-600"
          }`}
        >
          Management System
        </p>
      </div>
    </Link>
  );
};
