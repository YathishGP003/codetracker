import React from "react";
import { Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const Navigation = ({ isDarkMode, setIsDarkMode }: NavigationProps) => {
  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-950/80 border-slate-800/50"
          : "bg-white/80 border-gray-200/50"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="CodeTracker Pro Logo"
              className="w-10 h-10"
            />
            <div>
              <h1
                className={`text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent`}
              >
                CodeTracker Pro
              </h1>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                className={`font-medium transition-colors ${
                  isDarkMode
                    ? "text-slate-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className={`font-medium transition-colors ${
                  isDarkMode
                    ? "text-slate-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Testimonials
              </a>
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
            >
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
