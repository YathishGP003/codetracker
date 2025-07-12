import React, { useState, useEffect, useMemo } from "react";
import {
  Check,
  ExternalLink,
  Target,
  ChevronDown,
  ChevronUp,
  Play,
  Clock,
} from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useProblemData } from "../hooks/useProblemData";

interface CPProblem {
  name: string;
  url: string;
  rating: number;
  contestId?: string;
  index?: string;
  realName?: string;
}

interface CPSheetProblemTrackerProps {
  studentId: string;
  title?: string;
  problems: CPProblem[];
}

const CPSheetProblemTracker: React.FC<CPSheetProblemTrackerProps> = ({
  studentId,
  title = "CP Sheet Problems",
  problems,
}) => {
  const { isDarkMode } = useDarkMode();
  const { data: solvedProblems = [], isLoading } = useProblemData(studentId);
  const [sortBy, setSortBy] = useState<"name" | "rating" | "status">("status");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterRating, setFilterRating] = useState<number | "">("");
  const [problemNames, setProblemNames] = useState<Record<string, string>>({});
  const [isLoadingNames, setIsLoadingNames] = useState(false);

  // Fetch real problem names from Codeforces API
  useEffect(() => {
    const fetchProblemNames = async () => {
      setIsLoadingNames(true);
      const names: Record<string, string> = {};

      try {
        // Fetch all problems from Codeforces API in one call
        const response = await fetch(
          `https://codeforces.com/api/problemset.problems`
        );
        const data = await response.json();

        if (data.status === "OK") {
          // Create a map for quick lookup
          const problemsMap = new Map();
          data.result.problems.forEach((problem: any) => {
            const key = `${problem.contestId}${problem.index}`;
            problemsMap.set(key, problem.name);
          });

          // Match our problems with the fetched data
          for (const problem of problems) {
            const urlParts = problem.url.split("/");
            const contestId = urlParts[urlParts.length - 2];
            const index = urlParts[urlParts.length - 1];
            const key = `${contestId}${index}`;

            const realName = problemsMap.get(key);
            if (realName) {
              names[key] = realName;
            }
          }
        }
      } catch (error) {
        console.error(
          "Error fetching problem names from Codeforces API:",
          error
        );
      } finally {
        setIsLoadingNames(false);
      }

      setProblemNames(names);
    };

    fetchProblemNames();
  }, [problems]);

  // Create a map of solved problems for quick lookup
  const solvedProblemsMap = useMemo(() => {
    const map = new Set<string>();
    solvedProblems.forEach((problem) => {
      // Extract contest ID and index from the problem URL or name
      const url = problem.problem_url || "";
      const contestId = problem.contest_id;
      const index = problem.problem_index;

      if (contestId && index) {
        map.add(`${contestId}${index}`);
      }

      // Also check by name for broader matching
      if (problem.problem_name) {
        map.add(problem.problem_name.toLowerCase());
      }

      // Check by URL if available
      if (url) {
        const urlParts = url.split("/");
        if (urlParts.length >= 2) {
          const lastPart = urlParts[urlParts.length - 1];
          const secondLastPart = urlParts[urlParts.length - 2];
          if (secondLastPart && lastPart) {
            map.add(`${secondLastPart}${lastPart}`);
          }
        }
      }
    });
    return map;
  }, [solvedProblems]);

  // Combine static problems with solved status
  const problemsWithStatus = useMemo(() => {
    return problems.map((problem) => {
      // Extract contest ID and index from URL
      const urlParts = problem.url.split("/");
      const contestId = urlParts[urlParts.length - 2];
      const index = urlParts[urlParts.length - 1];

      // Check if this problem is solved using multiple matching strategies
      const isSolved =
        solvedProblemsMap.has(`${contestId}${index}`) ||
        solvedProblemsMap.has(problem.name.toLowerCase()) ||
        solvedProblemsMap.has(
          problem.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
        );

      // Get real problem name if available
      const realName = problemNames[`${contestId}${index}`] || problem.name;

      return {
        ...problem,
        contestId,
        index,
        solved: isSolved,
        solvedAt: isSolved ? new Date().toISOString() : undefined, // Placeholder
        realName,
      };
    });
  }, [problems, solvedProblemsMap, problemNames]);

  // Filter by rating if specified
  const filteredProblems = useMemo(() => {
    if (filterRating === "") return problemsWithStatus;
    return problemsWithStatus.filter((p) => p.rating === filterRating);
  }, [problemsWithStatus, filterRating]);

  // Sort problems
  const sortedProblems = useMemo(() => {
    const sorted = [...filteredProblems];
    sorted.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === "rating") {
        cmp = a.rating - b.rating;
      } else if (sortBy === "status") {
        // Sort by solved status first, then by name
        if (a.solved !== b.solved) {
          cmp = a.solved ? 1 : -1; // Unsolved first
        } else {
          cmp = a.name.localeCompare(b.name);
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filteredProblems, sortBy, sortDir]);

  // Calculate progress
  const progress = useMemo(() => {
    const solved = problemsWithStatus.filter((p) => p.solved).length;
    const total = problemsWithStatus.length;
    return {
      solved,
      total,
      percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
  }, [problemsWithStatus]);

  // Calculate progress by rating
  const progressByRating = useMemo(() => {
    const ratingGroups = problemsWithStatus.reduce((acc, problem) => {
      const rating = problem.rating;
      if (!acc[rating]) {
        acc[rating] = { total: 0, solved: 0 };
      }
      acc[rating].total++;
      if (problem.solved) {
        acc[rating].solved++;
      }
      return acc;
    }, {} as Record<number, { total: number; solved: number }>);

    return Object.entries(ratingGroups).map(([rating, stats]) => ({
      rating: parseInt(rating),
      ...stats,
      percentage: Math.round((stats.solved / stats.total) * 100),
    }));
  }, [problemsWithStatus]);

  // --- Dynamic Rating Selection ---
  const ratingOptions = useMemo(() => {
    // Get all unique ratings from the problems list, sorted
    const ratings = Array.from(new Set(problems.map((p) => p.rating))).sort(
      (a, b) => a - b
    );
    return ratings;
  }, [problems]);
  const [selectedRating, setSelectedRating] = useState(ratingOptions[0] || 800);

  // Filter problems and stats by selected rating
  const problemsForRating = useMemo(
    () => problemsWithStatus.filter((p) => p.rating === selectedRating),
    [problemsWithStatus, selectedRating]
  );
  const progressForRating = useMemo(() => {
    const solved = problemsForRating.filter((p) => p.solved).length;
    const total = problemsForRating.length;
    return {
      solved,
      total,
      percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
  }, [problemsForRating]);

  // Helper for rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return "text-red-500";
    if (rating >= 2200) return "text-orange-500";
    if (rating >= 1900) return "text-yellow-500";
    if (rating >= 1600) return "text-purple-500";
    if (rating >= 1400) return "text-blue-500";
    if (rating >= 1200) return "text-green-500";
    return "text-gray-500";
  };

  // Helper for rendering sortable table headers
  const renderHeader = (
    label: string,
    key: "name" | "rating" | "status" | undefined
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

  // --- UI ---
  return (
    <div>
      {/* Rating Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ratingOptions.map((rating) => (
          <button
            key={rating}
            className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 focus:outline-none ${
              selectedRating === rating
                ? isDarkMode
                  ? "bg-green-700/30 border-green-400 text-green-300"
                  : "bg-green-100 border-green-500 text-green-700"
                : isDarkMode
                ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedRating(rating)}
          >
            {rating}
          </button>
        ))}
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Problems Progress Card */}
        <div
          className={`rounded-2xl border shadow-sm flex flex-col items-center justify-center px-6 py-5 ${
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="text-lg font-semibold mb-2 text-gray-500 dark:text-slate-400">
            {selectedRating} Rated Problems
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span
              className={`text-3xl font-extrabold ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {progressForRating.solved}
            </span>
            <span
              className={`text-2xl font-bold ${
                isDarkMode ? "text-slate-400" : "text-gray-400"
              }`}
            >
              / {progressForRating.total}
            </span>
            <span
              className={`ml-4 text-2xl font-extrabold ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {progressForRating.percentage}%
            </span>
          </div>
          <div className="flex items-center gap-8 w-full justify-between">
            <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              Problems Solved
            </span>
            <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              Completion
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden mt-2">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
              style={{ width: `${progressForRating.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Progress by Rating Card */}
        <div
          className={`rounded-2xl border shadow-sm flex flex-col items-center justify-center px-6 py-5 ${
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="text-lg font-semibold mb-2 text-gray-500 dark:text-slate-400">
            Progress by Rating
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${getRatingColor(selectedRating)}`}
            >
              {selectedRating}
            </div>
            <div className="text-lg text-gray-600 dark:text-slate-400">
              {progressForRating.solved}/{progressForRating.total}
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-500">
              {progressForRating.percentage}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 dark:bg-slate-700">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                style={{ width: `${progressForRating.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filter Problems Card */}
        <div
          className={`rounded-2xl border shadow-sm flex flex-col items-center justify-center px-6 py-5 ${
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="text-lg font-semibold mb-2 text-gray-500 dark:text-slate-400">
            → Filter Problems
          </div>
          <div className="w-full">
            <label className="block text-xs font-semibold mb-1">
              Rating Filter
            </label>
            <select
              className={`rounded border px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-400 ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              value={selectedRating}
              onChange={(e) => setSelectedRating(Number(e.target.value))}
            >
              {ratingOptions.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div
        className={`rounded-3xl p-6 transition-all duration-500 ${
          isDarkMode
            ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
            : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
        }`}
        style={{
          fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
          fontSize: "15px",
        }}
      >
        <div className="overflow-x-auto">
          <table
            className="min-w-full border border-gray-300 dark:border-slate-700 text-sm"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className={isDarkMode ? "bg-slate-800" : "bg-gray-100"}>
                <th className="px-4 py-2 text-left border">#</th>
                {renderHeader("Name", "name")}
                {renderHeader("Rating", "rating")}
                {renderHeader("Status", "status")}
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProblems.map((problem, idx) => {
                return (
                  <tr
                    key={`${problem.contestId}${problem.index}`}
                    className={
                      isDarkMode
                        ? idx % 2 === 0
                          ? "bg-slate-900/40 hover:bg-slate-800/60"
                          : "bg-slate-800/40 hover:bg-slate-700/60"
                        : idx % 2 === 0
                        ? "bg-white hover:bg-gray-100"
                        : "bg-gray-50 hover:bg-gray-200"
                    }
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                  >
                    <td className="px-4 py-2 font-mono border">{idx + 1}</td>
                    <td className="px-4 py-2 border">
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline font-medium"
                      >
                        {problem.realName}
                      </a>
                    </td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`font-semibold ${getRatingColor(
                          problem.rating
                        )}`}
                      >
                        {problem.rating}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      {problem.solved ? (
                        <span className="inline-flex items-center text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                          <Check size={14} className="mr-1" /> Solved
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                          <Target size={14} className="mr-1" /> Unsolved
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex space-x-2">
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-3 py-1 text-xs rounded transition-colors ${
                            problem.solved
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {problem.solved ? (
                            <>
                              <Check size={12} className="mr-1" />
                              Solved
                            </>
                          ) : (
                            <>
                              <ExternalLink size={12} className="mr-1" />
                              Solve
                            </>
                          )}
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedProblems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No problems found with the current filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default CPSheetProblemTracker;
