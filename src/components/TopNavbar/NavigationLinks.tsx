import React from "react";
import { NavLink } from "react-router-dom";
import { Settings, Calendar } from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getButtonClasses } from "@/lib/styles";

interface NavigationLinksProps {
  isDarkMode: boolean;
}

export const NavigationLinks: React.FC<NavigationLinksProps> = ({
  isDarkMode,
}) => {
  return (
    <>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          getButtonClasses(
            isDarkMode,
            isActive ? "active" : "inactive",
            "flex items-center space-x-2"
          )
        }
      >
        <span className="font-medium">Dashboard</span>
      </NavLink>
      <NavLink
        to="/manage"
        className={({ isActive }) =>
          getButtonClasses(
            isDarkMode,
            isActive ? "active" : "inactive",
            "flex items-center space-x-2"
          )
        }
      >
        <Settings size={18} />
        <span className="font-medium">Manage</span>
      </NavLink>
      <NavLink
        to="/calendar"
        className={({ isActive }) =>
          getButtonClasses(
            isDarkMode,
            isActive ? "active" : "inactive",
            "flex items-center space-x-2"
          )
        }
      >
        <Calendar size={18} />
        <span className="font-medium">Calendar</span>
      </NavLink>
      <NavLink
        to="/cp-sheet"
        className={({ isActive }) =>
          getButtonClasses(
            isDarkMode,
            isActive ? "active" : "inactive",
            "flex items-center space-x-2"
          )
        }
      >
        <span className="font-medium">CP Sheet</span>
      </NavLink>
    </>
  );
};
