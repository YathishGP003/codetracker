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
    if (!key) return <th className="px-4 py-2 text-left border">{label}</th>;
    return (
      <th
        className="px-4 py-2 text-left border cursor-pointer select-none hover:bg-blue-50 dark:hover:bg-slate-800"
        onClick={() => {
          if (sortBy === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
          } else {
            setSortBy(key);
            setSortDir("asc");
          }
        }}
      >
        <span className="inline-flex items-center text-blue-700 dark:text-blue-400 font-semibold">
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
    <tr className={isDarkMode ? "bg-slate-800" : "bg-gray-100"}>
      <th className="px-4 py-2 text-left border">#</th>
      {renderHeader("Name", "name")}
      <th className="px-4 py-2 text-left border">Tags</th>
      {renderHeader("Rating", "rating")}
      {renderHeader("Solved At", "solvedAt")}
      <th className="px-4 py-2 text-left border">Status</th>
    </tr>
  );
};

export default ProblemTableHeader;
