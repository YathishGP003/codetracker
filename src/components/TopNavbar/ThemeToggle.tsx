import React from "react";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getButtonClasses } from "@/lib/styles";

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={getButtonClasses(isDarkMode, "ghost")}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
