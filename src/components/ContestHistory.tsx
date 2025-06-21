import React from "react";
import { useContestHistory } from "@/hooks/useContestHistory";
import { Student } from "@/types/Student";
import { useDarkMode } from "@/contexts/DarkModeContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContestHistoryProps {
  student: Student;
}

const ContestHistory: React.FC<ContestHistoryProps> = ({ student }) => {
  const { isDarkMode } = useDarkMode();
  const {
    data: contestHistory,
    isLoading,
    isError,
    error,
  } = useContestHistory(student.codeforcesHandle);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <p
          className={`ml-3 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
        >
          Loading contest history...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`text-center p-4 rounded-lg ${
          isDarkMode ? "bg-red-900/50" : "bg-red-100"
        }`}
      >
        <p className="text-red-500">
          Error loading contest history:{" "}
          {error instanceof Error && error.message}
        </p>
      </div>
    );
  }

  if (!contestHistory || contestHistory.length === 0) {
    return (
      <div
        className={`text-center p-4 rounded-lg ${
          isDarkMode ? "bg-slate-800/50" : "bg-gray-100"
        }`}
      >
        <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
          No contest history found for this user.
        </p>
      </div>
    );
  }

  const getRatingChangeColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return isDarkMode ? "text-slate-400" : "text-gray-500";
  };

  // Reverse the array to show most recent first
  const reversedHistory = [...contestHistory].reverse();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Contest</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Rating Change</TableHead>
            <TableHead>New Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reversedHistory.map((contest, index) => (
            <TableRow key={contest.contestId}>
              <TableCell>{reversedHistory.length - index}</TableCell>
              <TableCell>
                <a
                  href={`https://codeforces.com/contest/${contest.contestId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-500"
                >
                  {contest.contestName}
                </a>
              </TableCell>
              <TableCell>
                {new Date(
                  contest.ratingUpdateTimeSeconds * 1000
                ).toLocaleString()}
              </TableCell>
              <TableCell>{contest.rank}</TableCell>
              <TableCell
                className={getRatingChangeColor(
                  contest.newRating - contest.oldRating
                )}
              >
                {contest.newRating - contest.oldRating > 0 ? "+" : ""}
                {contest.newRating - contest.oldRating}
              </TableCell>
              <TableCell>{contest.newRating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContestHistory;
