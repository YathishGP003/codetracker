import React from "react";
import { Check } from "lucide-react";
import { getRatingColor } from "@/lib/utils";
import { Problem } from "@/types/Student";

interface ProblemTableRowProps {
  problem: Problem;
  idx: number;
  isDarkMode: boolean;
  page?: number;
  pageSize?: number;
}

const ProblemTableRow: React.FC<ProblemTableRowProps> = ({
  problem,
  idx,
  isDarkMode,
  page = 0,
  pageSize = 0,
}) => {
  return (
    <tr
      className={`${
        isDarkMode
          ? idx % 2 === 0
            ? "bg-slate-900/60"
            : "bg-slate-800/60"
          : idx % 2 === 0
          ? "bg-white"
          : "bg-gray-50"
      } border-l-4 ${
        problem.solved ? "border-emerald-500" : "border-amber-400"
      } hover:shadow-sm transition-colors hover:bg-opacity-90`}
    >
      <td className="px-4 py-2 font-mono border-b border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
        {pageSize ? page * pageSize + idx + 1 : idx + 1}
      </td>
      <td className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
        <a
          href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          {problem.name}
        </a>
      </td>
      <td className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
        {problem.tags && problem.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs dark:bg-slate-700 dark:text-slate-200"
              >
                {tag}
              </span>
            ))}
            {problem.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-slate-400">
                +{problem.tags.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-500 dark:text-slate-300">-</span>
        )}
      </td>
      <td className="px-4 py-2 border-b border-gray-200 dark:border-slate-700 text-right">
        <span
          className={`font-semibold ${getRatingColor(problem.rating || 0)}`}
        >
          {problem.rating || "-"}
        </span>
      </td>
      <td className="px-4 py-2 border-b border-gray-200 dark:border-slate-700 whitespace-nowrap text-slate-700 dark:text-slate-200">
        {problem.solvedAt
          ? new Date(problem.solvedAt).toLocaleDateString()
          : "-"}
      </td>
      <td className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-xs font-medium">
          <Check size={14} /> Solved
        </span>
      </td>
    </tr>
  );
};

export default ProblemTableRow;
