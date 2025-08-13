import React from "react";
import { LucideIcon } from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getContainerClasses } from "@/lib/styles";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={getContainerClasses(isDarkMode, className)}>
      <div
        className={`flex flex-col items-center justify-center py-8 ${
          isDarkMode ? "text-slate-400" : "text-gray-600"
        }`}
      >
        <Icon className="w-12 h-12 mb-2 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-center mb-4 opacity-75">{description}</p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
};
