import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { isDarkMode } = useDarkMode();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-4 space-x-2">
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 ${
          currentPage === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : isDarkMode
            ? "bg-slate-800 text-white hover:bg-slate-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Previous
      </button>
      <span className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 ${
          currentPage === totalPages - 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : isDarkMode
            ? "bg-slate-800 text-white hover:bg-slate-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Next
      </button>
    </div>
  );
};
