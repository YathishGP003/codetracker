import React from "react";
import { Check } from "lucide-react";
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
        {pageSize ? page * pageSize + idx + 1 : idx + 1}
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
      <td className="px-4 py-2 border">{problem.rating || "-"}</td>
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
  );
};

export default ProblemTableRow;
