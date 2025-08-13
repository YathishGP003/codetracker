import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getContainerClasses } from "@/lib/styles";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  showContainer?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  className,
  showContainer = true,
}) => {
  const { isDarkMode } = useDarkMode();

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}
      />
      {text && (
        <p
          className={`mt-2 text-sm ${
            isDarkMode ? "text-slate-400" : "text-gray-600"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (!showContainer) {
    return <div className={className}>{spinner}</div>;
  }

  return (
    <div className={getContainerClasses(isDarkMode, className)}>
      <div className="flex items-center justify-center h-32">{spinner}</div>
    </div>
  );
};
