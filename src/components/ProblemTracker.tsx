import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Check,
  ExternalLink,
  Play,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useProblemData } from "../hooks/useProblemData";
import { getRatingColor } from "../lib/utils";

interface Problem {
  id: string;
  name: string;
  contestId: number;
  index: string;
  rating?: number;
  tags: string[];
  solved: boolean;
  solvedAt?: string;
}

interface ProblemTrackerProps {
  studentId: string;
  contestId?: number;
  title?: string;
  groupByRating?: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const getUniqueTags = (problems: Problem[]) => {
  const tagSet = new Set<string>();
  problems.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
};

const ProblemTracker: React.FC<ProblemTrackerProps> = ({
  studentId,
  contestId,
  title = "Solved Problems",
  groupByRating = false,
}) => {
  const { isDarkMode } = useDarkMode();
  const { data: dbProblems = [], isLoading, error } = useProblemData(studentId);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | "">("");
  const [maxRating, setMaxRating] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "solvedAt">(
    "solvedAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Map database problems to component format
    const mappedProblems = dbProblems.map((problem) => ({
      id: problem.id,
      name: problem.problem_name,
      contestId: problem.contest_id || 0,
      index: problem.problem_index || "",
      rating: problem.rating || undefined,
      tags: problem.tags || [],
      solved: true, // If it's in the database, it's solved
      solvedAt: problem.solved_at.toISOString(),
    }));
    // Filter by contest if contestId is provided
    const filteredProblems = contestId
      ? mappedProblems.filter((p) => p.contestId === contestId)
      : mappedProblems;
    setProblems(filteredProblems);
    setPage(0); // Reset to first page on data change
  }, [dbProblems, contestId]);

  // Unique tags for filter dropdown
  const allTags = useMemo(() => getUniqueTags(problems), [problems]);

  // Filtering
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // Tag filter
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => p.tags.includes(tag))
      ) {
        return false;
      }
      // Rating filter
      if (
        minRating !== "" &&
        (p.rating === undefined || p.rating < minRating)
      ) {
        return false;
      }
      if (
        maxRating !== "" &&
        (p.rating === undefined || p.rating > maxRating)
      ) {
        return false;
      }
      return true;
    });
  }, [problems, selectedTags, minRating, maxRating]);

  // Sorting
  const sortedProblems = useMemo(() => {
    const sorted = [...filteredProblems];
    sorted.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === "rating") {
        cmp = (a.rating || 0) - (b.rating || 0);
      } else if (sortBy === "solvedAt") {
        cmp =
          new Date(a.solvedAt || "").getTime() -
          new Date(b.solvedAt || "").getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filteredProblems, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sortedProblems.length / pageSize);
  const paginatedProblems = sortedProblems.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  // Reset page if filters/pageSize change
  useEffect(() => {
    setPage(0);
  }, [pageSize, selectedTags, minRating, maxRating, sortBy, sortDir]);

  // Group problems by rating ranges for CP Sheet
  const problemsByRating = useMemo(() => {
    if (!groupByRating) return null;

    const ratingRanges = [];
    for (let rating = 800; rating <= 1900; rating += 100) {
      ratingRanges.push(rating);
    }

    const grouped = ratingRanges.map((rating) => ({
      rating,
      problems: filteredProblems.filter((p) => p.rating === rating),
    }));

    return grouped;
  }, [filteredProblems, groupByRating]);

  // Table header with sorting
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

  // Handle outside click for tag dropdown
  useEffect(() => {
    if (!tagDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(e.target as Node)
      ) {
        setTagDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [tagDropdownOpen]);

  // Tag dropdown button label
  const tagButtonLabel =
    selectedTags.length === 0
      ? "All tags"
      : selectedTags.length === 1
      ? selectedTags[0]
      : `${selectedTags[0]} +${selectedTags.length - 1}`;

  // Render rating-based groups
  const renderRatingGroups = () => {
    if (!problemsByRating) return null;

    return problemsByRating.map(({ rating, problems }) => {
      if (problems.length === 0) return null;

      return (
        <div key={rating} className="mb-8">
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
            <h3
              className={`text-xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Rating {rating} Problems ({problems.length})
            </h3>
            <div className="overflow-x-auto">
              <table
                className="min-w-full border border-gray-300 dark:border-slate-700 text-sm"
                style={{ borderCollapse: "collapse" }}
              >
                <thead>
                  <tr className={isDarkMode ? "bg-slate-800" : "bg-gray-100"}>
                    <th className="px-4 py-2 text-left border">#</th>
                    {renderHeader("Name", "name")}
                    <th className="px-4 py-2 text-left border">Tags</th>
                    {renderHeader("Rating", "rating")}
                    {renderHeader("Solved At", "solvedAt")}
                    <th className="px-4 py-2 text-left border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem, idx) => (
                    <tr
                      key={problem.id}
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
                          href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {problem.name}
                        </a>
                      </td>
                      <td className="px-4 py-2 border">
                        {problem.tags && problem.tags.length > 0
                          ? problem.tags.join(", ")
                          : "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {problem.rating || "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {problem.solvedAt
                          ? new Date(problem.solvedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        <span className="inline-flex items-center text-green-600">
                          <Check size={16} className="mr-1" /> Solved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <div
        className={`rounded-3xl p-6 transition-all duration-500 ${
          isDarkMode
            ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
            : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
        }`}
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-3xl p-6 transition-all duration-500 ${
          isDarkMode
            ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
            : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
        }`}
      >
        <div className="flex items-center justify-center h-32">
          <p className={`text-red-500`}>
            Error loading problems: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div
        className={`rounded-3xl p-6 transition-all duration-500 ${
          isDarkMode
            ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
            : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center py-8 ${
            isDarkMode ? "text-slate-400" : "text-gray-600"
          }`}
        >
          <Target className="w-12 h-12 mb-2 opacity-50" />
          <p>No problems solved yet</p>
        </div>
      </div>
    );
  }

  // --- UI ---
  return (
    <div>
      {/* Filter Box */}
      <div
        className={`mb-6 rounded-2xl border shadow-sm ${
          isDarkMode
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center mb-3">
            <span className="text-blue-700 dark:text-blue-400 font-bold text-base mr-2">
              →
            </span>
            <span className="text-blue-700 dark:text-blue-400 font-bold text-base tracking-wide">
              Filter Problems
            </span>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            {/* Page size */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Problems per page
              </label>
              <select
                className={`rounded border px-2 py-1 text-sm w-24 focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {/* Jump to page */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Jump to page
              </label>
              <select
                className={`rounded border px-2 py-1 text-sm w-20 focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            {/* Tag filter dropdown */}
            <div className="relative" ref={tagDropdownRef}>
              <label className="block text-xs font-semibold mb-1">
                Filter by tag
              </label>
              <button
                type="button"
                className={`flex items-center justify-between rounded border px-2 py-1 text-sm min-w-[120px] w-full focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-white border-gray-300 text-gray-900"
                } ${tagDropdownOpen ? "ring-2 ring-blue-400" : ""}`}
                onClick={() => setTagDropdownOpen((open) => !open)}
              >
                <span className="truncate text-left">{tagButtonLabel}</span>
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              {tagDropdownOpen && (
                <div
                  className={`absolute z-20 mt-1 left-0 w-full max-h-48 overflow-y-auto rounded border shadow-lg ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  {allTags.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-400">
                      No tags
                    </div>
                  )}
                  {allTags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700"
                    >
                      <input
                        type="checkbox"
                        className="mr-2 accent-blue-500"
                        checked={selectedTags.includes(tag)}
                        onChange={() => {
                          setSelectedTags(
                            selectedTags.includes(tag)
                              ? selectedTags.filter((t) => t !== tag)
                              : [...selectedTags, tag]
                          );
                        }}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                  <div
                    className="px-3 py-2 border-t text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                    onClick={() => {
                      setSelectedTags([]);
                      setTagDropdownOpen(false);
                    }}
                  >
                    Clear all
                  </div>
                </div>
              )}
            </div>
            {/* Rating filter */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Rating min
              </label>
              <input
                type="number"
                className={`rounded border px-2 py-1 text-sm w-20 focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
                value={minRating}
                onChange={(e) =>
                  setMinRating(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="min"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Rating max
              </label>
              <input
                type="number"
                className={`rounded border px-2 py-1 text-sm w-20 focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
                value={maxRating}
                onChange={(e) =>
                  setMaxRating(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="max"
                min={0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Render based on grouping preference */}
      {groupByRating ? (
        renderRatingGroups()
      ) : (
        <div
          className={`rounded-3xl p-6 mb-4 transition-all duration-500 ${
            isDarkMode
              ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
              : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
          }`}
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
            {title}
          </h3>
          <div className="overflow-x-auto">
            <table
              className="min-w-full border border-gray-300 dark:border-slate-700 text-sm"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr className={isDarkMode ? "bg-slate-800" : "bg-gray-100"}>
                  <th className="px-4 py-2 text-left border">#</th>
                  {renderHeader("Name", "name")}
                  <th className="px-4 py-2 text-left border">Tags</th>
                  {renderHeader("Rating", "rating")}
                  {renderHeader("Solved At", "solvedAt")}
                  <th className="px-4 py-2 text-left border">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProblems.map((problem, idx) => (
                  <tr
                    key={problem.id}
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
                    <td className="px-4 py-2 font-mono border">
                      {page * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-2 border">
                      <a
                        href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {problem.name}
                      </a>
                    </td>
                    <td className="px-4 py-2 border">
                      {problem.tags && problem.tags.length > 0
                        ? problem.tags.join(", ")
                        : "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {problem.rating || "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {problem.solvedAt
                        ? new Date(problem.solvedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      <span className="inline-flex items-center text-green-600">
                        <Check size={16} className="mr-1" /> Solved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 ${
                  page === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Previous
              </button>
              <span className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 ${
                  page === totalPages - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemTracker;
