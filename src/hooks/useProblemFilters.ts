import { useState, useMemo, useEffect } from "react";
import { Problem } from "@/types/Student";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function useProblemFilters(problems: Problem[], contestId?: number) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | "">("");
  const [maxRating, setMaxRating] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "solvedAt">(
    "solvedAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Filter by contest if contestId is provided
  const contestFiltered = useMemo(
    () =>
      contestId ? problems.filter((p) => p.contestId === contestId) : problems,
    [problems, contestId]
  );

  // Unique tags for filter dropdown
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    contestFiltered.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [contestFiltered]);

  // Filtering
  const filteredProblems = useMemo(() => {
    return contestFiltered.filter((p) => {
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
  }, [contestFiltered, selectedTags, minRating, maxRating]);

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
  const paginatedProblems = useMemo(
    () => sortedProblems.slice(page * pageSize, (page + 1) * pageSize),
    [sortedProblems, page, pageSize]
  );

  // Reset page if filters/pageSize change
  useEffect(() => {
    setPage(0);
  }, [
    pageSize,
    selectedTags,
    minRating,
    maxRating,
    sortBy,
    sortDir,
    contestId,
  ]);

  // Group problems by rating ranges for CP Sheet
  const problemsByRating = useMemo(() => {
    const groupByRating = (problems: Problem[]) => {
      const ratingRanges = [];
      for (let rating = 800; rating <= 1900; rating += 100) {
        ratingRanges.push(rating);
      }
      return ratingRanges.map((rating) => ({
        rating,
        problems: problems.filter((p) => p.rating === rating),
      }));
    };
    return groupByRating(filteredProblems);
  }, [filteredProblems]);

  return {
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
    filteredProblems,
    sortedProblems,
    paginatedProblems,
    problemsByRating,
  };
}
