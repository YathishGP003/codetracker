import React from "react";
import { NavLink } from "react-router-dom";
import {
  Settings,
  Calendar,
  Users,
  BarChart3,
  Target,
  BookOpen,
} from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface NavigationLinksProps {
  isDarkMode: boolean;
}

export const NavigationLinks: React.FC<NavigationLinksProps> = ({
  isDarkMode,
}) => {
  return (
    <div className="flex items-center space-x-6">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : isDarkMode
              ? "text-slate-300 hover:text-white"
              : "text-gray-700 hover:text-black"
          }`
        }
      >
        <BarChart3 size={16} />
        <span>DASHBOARD</span>
      </NavLink>

      <NavLink
        to="/manage"
        className={({ isActive }) =>
          `flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : isDarkMode
              ? "text-slate-300 hover:text-white"
              : "text-gray-700 hover:text-black"
          }`
        }
      >
        <Users size={16} />
        <span>MANAGE</span>
      </NavLink>

      <NavLink
        to="/calendar"
        className={({ isActive }) =>
          `flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : isDarkMode
              ? "text-slate-300 hover:text-white"
              : "text-gray-700 hover:text-black"
          }`
        }
      >
        <Calendar size={16} />
        <span>CALENDAR</span>
      </NavLink>

      <NavLink
        to="/cp-sheet"
        className={({ isActive }) =>
          `flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : isDarkMode
              ? "text-slate-300 hover:text-black"
              : "text-gray-700 hover:text-black"
          }`
        }
      >
        <BookOpen size={16} />
        <span>CP SHEET</span>
      </NavLink>

      <NavLink
        to="/explore"
        className={({ isActive }) =>
          `flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : isDarkMode
              ? "text-slate-300 hover:text-white"
              : "text-gray-700 hover:text-black"
          }`
        }
      >
        <Target size={16} />
        <span>EXPLORE</span>
      </NavLink>
    </div>
  );
};
