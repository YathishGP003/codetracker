import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getContainerClasses, getTableClasses } from "@/lib/styles";
import { Problem } from "@/types/Student";
import ProblemTableHeader from "@/components/ProblemTableHeader";
import ProblemTableRow from "@/components/ProblemTableRow";

interface ProblemTableProps {
  problems: Problem[];
  title: string;
  sortBy: "name" | "rating" | "solvedAt";
  sortDir: "asc" | "desc";
  setSortBy: (sortBy: "name" | "rating" | "solvedAt") => void;
  setSortDir: (sortDir: "asc" | "desc") => void;
  page: number;
  pageSize: number;
}

export const ProblemTable: React.FC<ProblemTableProps> = ({
  problems,
  title,
  sortBy,
  sortDir,
  setSortBy,
  setSortDir,
  page,
  pageSize,
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={getContainerClasses(isDarkMode, "p-0 mb-4")}
      style={{
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
        fontSize: "15px",
      }}
    >
      {/* Table header bar */}
      <div
        className={`flex items-center justify-between px-6 py-4 rounded-t-3xl ${
          isDarkMode ? "bg-slate-800/70" : "bg-gray-50"
        }`}
      >
        <h3
          className={`text-lg md:text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <div
          className={`text-xs ${
            isDarkMode ? "text-slate-400" : "text-gray-500"
          }`}
        >
          {problems.length} items on this page
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className={getTableClasses(isDarkMode, "text-sm")}>
          <thead>
            <ProblemTableHeader
              isDarkMode={isDarkMode}
              sortBy={sortBy}
              sortDir={sortDir}
              setSortBy={setSortBy}
              setSortDir={setSortDir}
            />
          </thead>
          <tbody>
            {problems.map((problem, idx) => (
              <ProblemTableRow
                key={problem.id}
                problem={problem}
                idx={idx}
                isDarkMode={isDarkMode}
                page={page}
                pageSize={pageSize}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
