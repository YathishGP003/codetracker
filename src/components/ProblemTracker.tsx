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
import { Problem } from "../types/Student";
import ProblemTableRow from "@/components/ProblemTableRow";
import TagDropdown from "@/components/TagDropdown";
import ProblemTableHeader from "@/components/ProblemTableHeader";
import { useProblemFilters } from "@/hooks/useProblemFilters";

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

  // Add missing state and ref for tag dropdown
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
  }, [dbProblems, contestId]);

  // Replace all state and logic for filtering, sorting, and pagination with the hook:
  const {
    allTags,
    selectedTags,
    setSelectedTags,
    minRating,
    setMinRating,
    maxRating,
    setMaxRating,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    paginatedProblems,
    problemsByRating,
  } = useProblemFilters(problems, contestId);

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
            <div className="relative">
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
              <TagDropdown
                allTags={allTags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                isDarkMode={isDarkMode}
                open={tagDropdownOpen}
                setOpen={setTagDropdownOpen}
              />
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
                <ProblemTableHeader
                  isDarkMode={isDarkMode}
                  sortBy={sortBy}
                  sortDir={sortDir}
                  setSortBy={setSortBy}
                  setSortDir={setSortDir}
                />
              </thead>
              <tbody>
                {paginatedProblems.map((problem, idx) => (
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
