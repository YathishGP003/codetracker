import React, { useState, useEffect } from "react";
import { Target } from "lucide-react";
import { useProblemData } from "../../hooks/useProblemData";
import { Problem } from "../../types/Student";
import { useProblemFilters } from "../../hooks/useProblemFilters";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { EmptyState } from "../ui/EmptyState";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { ProblemFilters } from "./ProblemFilters";
import { ProblemTable } from "./ProblemTable";
import { Pagination } from "./Pagination";
import { RatingGroups } from "./RatingGroups";

interface ProblemTrackerProps {
  studentId: string;
  contestId?: number;
  title?: string;
  groupByRating?: boolean;
}

const ProblemTracker: React.FC<ProblemTrackerProps> = ({
  studentId,
  contestId,
  title = "Solved Problems",
  groupByRating = false,
}) => {
  const { data: dbProblems = [], isLoading, error } = useProblemData(studentId);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  // Map database problems to component format
  useEffect(() => {
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

  // Use the problem filters hook
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

  // Loading state
  if (isLoading) {
    return <LoadingSpinner text="Loading problems..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorBoundary>
        <div className="text-center">
          <p className="text-red-500">
            Error loading problems: {error.message}
          </p>
        </div>
      </ErrorBoundary>
    );
  }

  // Empty state
  if (problems.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No problems solved yet"
        description="Start solving problems to see them here"
      />
    );
  }

  return (
    <div>
      {/* Filter Box */}
      <ProblemFilters
        allTags={allTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        minRating={minRating}
        setMinRating={setMinRating}
        maxRating={maxRating}
        setMaxRating={setMaxRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        tagDropdownOpen={tagDropdownOpen}
        setTagDropdownOpen={setTagDropdownOpen}
      />

      {/* Render based on grouping preference */}
      {groupByRating ? (
        <RatingGroups
          problemsByRating={problemsByRating}
          sortBy={sortBy}
          sortDir={sortDir}
          setSortBy={setSortBy}
          setSortDir={setSortDir}
        />
      ) : (
        <>
          <ProblemTable
            problems={paginatedProblems}
            title={title}
            sortBy={sortBy}
            sortDir={sortDir}
            setSortBy={setSortBy}
            setSortDir={setSortDir}
            page={page}
            pageSize={pageSize}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default ProblemTracker;
