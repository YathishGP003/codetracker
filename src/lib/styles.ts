import { type ClassValue } from "clsx";
import { cn } from "./utils";

// Common container styles
export const containerStyles = {
  base: "rounded-3xl transition-all duration-500",
  dark: "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50",
  light: "bg-white/80 backdrop-blur-xl border border-gray-200/50",
};

// Common button styles
export const buttonStyles = {
  base: "px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105",
  dark: {
    active: "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300",
    inactive: "text-slate-300",
    ghost: "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300",
  },
  light: {
    active: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    inactive: "text-gray-700",
    ghost: "bg-gray-100 hover:bg-gray-200 text-gray-700",
  },
};

// Common input styles
export const inputStyles = {
  base: "rounded-full border px-3 py-1.5 text-sm focus:ring-2 focus:ring-violet-500",
  dark: "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400",
  light: "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
};

// Common table styles
export const tableStyles = {
  base: "min-w-full border border-gray-300 dark:border-slate-700 text-sm",
  dark: "bg-slate-800/70",
  light: "bg-gray-50",
};

// Helper function to get container classes
export const getContainerClasses = (isDarkMode: boolean, additionalClasses?: ClassValue) => {
  return cn(
    containerStyles.base,
    isDarkMode ? containerStyles.dark : containerStyles.light,
    additionalClasses
  );
};

// Helper function to get button classes
export const getButtonClasses = (
  isDarkMode: boolean,
  variant: "active" | "inactive" | "ghost" = "ghost",
  additionalClasses?: ClassValue
) => {
  return cn(
    buttonStyles.base,
    isDarkMode ? buttonStyles.dark[variant] : buttonStyles.light[variant],
    additionalClasses
  );
};

// Helper function to get input classes
export const getInputClasses = (isDarkMode: boolean, additionalClasses?: ClassValue) => {
  return cn(
    inputStyles.base,
    isDarkMode ? inputStyles.dark : inputStyles.light,
    additionalClasses
  );
};

// Helper function to get table classes
export const getTableClasses = (isDarkMode: boolean, additionalClasses?: ClassValue) => {
  return cn(
    tableStyles.base,
    additionalClasses
  );
};
