import React from "react";
import { useContestHistory } from "@/hooks/useContestHistory";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface CodeforcesContestTableProps {
  handle: string;
}

const CodeforcesContestTable: React.FC<CodeforcesContestTableProps> = ({
  handle,
}) => {
  const { isDarkMode } = useDarkMode();
  const { data, isLoading, isError } = useContestHistory(handle);

  if (isLoading) {
    return <div className="text-center p-4">Loading contest history...</div>;
  }
  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading contest history.
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No contest history found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full rounded-xl ${
          isDarkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <thead>
          <tr className={isDarkMode ? "bg-slate-800" : "bg-gray-100"}>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Contest</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Rank</th>
            <th className="px-4 py-2 text-left">Old Rating</th>
            <th className="px-4 py-2 text-left">New Rating</th>
            <th className="px-4 py-2 text-left">Change</th>
          </tr>
        </thead>
        <tbody>
          {data
            .slice()
            .reverse()
            .map((contest, idx) => {
              const ratingChange = contest.newRating - contest.oldRating;
              return (
                <tr
                  key={contest.contestId}
                  className={
                    isDarkMode ? "hover:bg-slate-800/70" : "hover:bg-gray-50"
                  }
                >
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">
                    <a
                      href={`https://codeforces.com/contest/${contest.contestId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {contest.contestName}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(
                      contest.ratingUpdateTimeSeconds * 1000
                    ).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{contest.rank}</td>
                  <td className="px-4 py-2">{contest.oldRating}</td>
                  <td className="px-4 py-2 font-bold">{contest.newRating}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      ratingChange > 0
                        ? "text-green-400"
                        : ratingChange < 0
                        ? "text-red-400"
                        : isDarkMode
                        ? "text-slate-400"
                        : "text-gray-500"
                    }`}
                  >
                    {ratingChange > 0 ? "+" : ""}
                    {ratingChange}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default CodeforcesContestTable;
