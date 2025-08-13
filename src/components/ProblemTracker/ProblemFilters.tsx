import React, { useRef, useEffect } from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getInputClasses } from "@/lib/styles";
import TagDropdown from "@/components/TagDropdown";

interface ProblemFiltersProps {
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  minRating: number | "";
  setMinRating: (rating: number | "") => void;
  maxRating: number | "";
  setMaxRating: (rating: number | "") => void;
  sortBy: "name" | "rating" | "solvedAt";
  setSortBy: (sortBy: "name" | "rating" | "solvedAt") => void;
  sortDir: "asc" | "desc";
  setSortDir: (sortDir: "asc" | "desc") => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  tagDropdownOpen: boolean;
  setTagDropdownOpen: (open: boolean) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const VISIBLE_TAGS = 8;

export const ProblemFilters: React.FC<ProblemFiltersProps> = ({
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
  tagDropdownOpen,
  setTagDropdownOpen,
}) => {
  const { isDarkMode } = useDarkMode();
  const tagDropdownRef = useRef<HTMLDivElement>(null);

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
  }, [tagDropdownOpen, setTagDropdownOpen]);

  // Tag dropdown button label
  const tagButtonLabel =
    selectedTags.length === 0
      ? "All tags"
      : selectedTags.length === 1
      ? selectedTags[0]
      : `${selectedTags[0]} +${selectedTags.length - 1}`;

  return (
    <div
      className={`mb-6 rounded-3xl overflow-hidden ${
        isDarkMode
          ? "bg-slate-900/70 border border-slate-800/60 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)]"
          : "bg-white shadow-2xl border border-gray-100"
      }`}
    >
      {/* Filter header with gradient artwork */}
      <div className="relative px-6 pt-5 pb-4 bg-gradient-to-br from-fuchsia-700 via-indigo-700 to-sky-700 text-white">
        <div className="absolute -top-10 -right-8 h-24 w-24 rounded-full bg-fuchsia-300/40 blur-2xl" />
        <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-sky-300/40 blur-2xl" />
        <div className="relative z-10 font-extrabold text-lg tracking-tight">
          Filter Problems
        </div>
        <div className="relative z-10 text-xs/5 opacity-90">
          Quickly narrow down by tags, rating, and pages
        </div>
        {/* Chip bar */}
        <div className="relative z-10 mt-3 flex items-center justify-between gap-2">
          <div className="flex gap-2 overflow-x-auto pr-2">
            <button
              onClick={() => setSelectedTags([])}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm ring-1 transition ${
                selectedTags.length === 0
                  ? "bg-white text-slate-900 ring-transparent shadow"
                  : "bg-transparent text-white/90 ring-white/30 hover:bg-white/10"
              }`}
            >
              All Tags
            </button>
            {allTags.slice(0, VISIBLE_TAGS).map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTags(
                      active
                        ? selectedTags.filter((t) => t !== tag)
                        : [...selectedTags, tag]
                    )
                  }
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-sm ring-1 transition ${
                    active
                      ? "bg-white text-slate-900 ring-transparent shadow"
                      : "bg-transparent text-white/90 ring-white/30 hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
            {allTags.length > VISIBLE_TAGS && (
              <button
                onClick={() => setTagDropdownOpen(true)}
                className="whitespace-nowrap rounded-full px-4 py-2 text-sm ring-1 ring-white/30 text-white/90 hover:bg-white/10"
              >
                +{allTags.length - VISIBLE_TAGS} more
              </button>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2 opacity-90">
            <button
              onClick={() =>
                sortBy === "name"
                  ? setSortDir(sortDir === "asc" ? "desc" : "asc")
                  : setSortBy("name")
              }
              className="inline-flex items-center gap-1 rounded-full bg-transparent px-3 py-1.5 text-xs ring-1 ring-white/30 hover:bg-white/10"
              title="Sort by name"
            >
              <ArrowUpDown size={14} /> Name
            </button>
            <button
              onClick={() =>
                sortBy === "rating"
                  ? setSortDir(sortDir === "asc" ? "desc" : "asc")
                  : setSortBy("rating")
              }
              className="inline-flex items-center gap-1 rounded-full bg-transparent px-3 py-1.5 text-xs ring-1 ring-white/30 hover:bg-white/10"
              title="Sort by rating"
            >
              <ArrowUpDown size={14} /> Rating
            </button>
            <button
              onClick={() =>
                sortBy === "solvedAt"
                  ? setSortDir(sortDir === "asc" ? "desc" : "asc")
                  : setSortBy("solvedAt")
              }
              className="inline-flex items-center gap-1 rounded-full bg-transparent px-3 py-1.5 text-xs ring-1 ring-white/30 hover:bg-white/10"
              title="Sort by solved date"
            >
              <ArrowUpDown size={14} /> Date
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 pt-4 pb-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Page size */}
          <div>
            <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide opacity-80">
              Problems per page
            </label>
            <select
              className={getInputClasses(isDarkMode, "w-28")}
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
            <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide opacity-80">
              Jump to page
            </label>
            <select
              className={getInputClasses(isDarkMode, "w-24")}
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
            <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide opacity-80">
              Filter by tag
            </label>
            <button
              type="button"
              className={`flex items-center justify-between rounded-full border px-3 py-1.5 text-sm min-w-[140px] w-full focus:ring-2 focus:ring-violet-500 ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-white border-gray-300 text-gray-900"
              } ${tagDropdownOpen ? "ring-2 ring-violet-500" : ""}`}
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
            <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide opacity-80">
              Rating min
            </label>
            <input
              type="number"
              className={getInputClasses(isDarkMode, "w-24")}
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
            <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide opacity-80">
              Rating max
            </label>
            <input
              type="number"
              className={getInputClasses(isDarkMode, "w-24")}
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
  );
};
