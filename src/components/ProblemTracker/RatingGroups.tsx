import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getContainerClasses, getTableClasses } from "@/lib/styles";
import { Problem } from "@/types/Student";
import ProblemTableHeader from "@/components/ProblemTableHeader";
import ProblemTableRow from "@/components/ProblemTableRow";

interface RatingGroupsProps {
  problemsByRating: Array<{ rating: number; problems: Problem[] }>;
  sortBy: "name" | "rating" | "solvedAt";
  sortDir: "asc" | "desc";
  setSortBy: (sortBy: "name" | "rating" | "solvedAt") => void;
  setSortDir: (sortDir: "asc" | "desc") => void;
}

export const RatingGroups: React.FC<RatingGroupsProps> = ({
  problemsByRating,
  sortBy,
  sortDir,
  setSortBy,
  setSortDir,
}) => {
  const { isDarkMode } = useDarkMode();

  if (!problemsByRating) return null;

  return (
    <>
      {problemsByRating.map(({ rating, problems }) => {
        if (problems.length === 0) return null;

        return (
          <div key={rating} className="mb-8">
            <div
              className={getContainerClasses(isDarkMode)}
              style={{
                fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
                fontSize: "15px",
              }}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Rating {rating} Problems ({problems.length})
              </h3>
              <div className="overflow-x-auto">
                <table className={getTableClasses(isDarkMode)}>
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
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
