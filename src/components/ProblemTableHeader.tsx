import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ProblemTableHeaderProps {
  isDarkMode: boolean;
  sortBy: "name" | "rating" | "solvedAt";
  sortDir: "asc" | "desc";
  setSortBy: (key: "name" | "rating" | "solvedAt") => void;
  setSortDir: (dir: "asc" | "desc") => void;
}

const ProblemTableHeader: React.FC<ProblemTableHeaderProps> = ({
  isDarkMode,
  sortBy,
  sortDir,
  setSortBy,
  setSortDir,
}) => {
  const renderHeader = (
    label: string,
    key: "name" | "rating" | "solvedAt" | undefined
  ) => {
    if (!key)
      return (
        <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-slate-700">
          {label}
        </th>
      );
    return (
      <th
        className="px-4 py-3 text-left border-b border-slate-200 dark:border-slate-700 cursor-pointer select-none hover:bg-violet-50 dark:hover:bg-slate-800/80"
        onClick={() => {
          if (sortBy === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
          } else {
            setSortBy(key);
            setSortDir("asc");
          }
        }}
      >
        <span className="inline-flex items-center text-violet-700 dark:text-violet-400 font-semibold">
          {label}
          {sortBy === key &&
            (sortDir === "asc" ? (
              <ChevronUp className="ml-1 w-4 h-4" />
            ) : (
              <ChevronDown className="ml-1 w-4 h-4" />
            ))}
        </span>
      </th>
    );
  };

  return (
    <tr className={isDarkMode ? "bg-slate-900/60" : "bg-gray-100"}>
      <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-slate-700">
        #
      </th>
      {renderHeader("Name", "name")}
      <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-slate-700">
        Tags
      </th>
      {renderHeader("Rating", "rating")}
      {renderHeader("Solved At", "solvedAt")}
      <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-slate-700">
        Status
      </th>
    </tr>
  );
};

export default ProblemTableHeader;
