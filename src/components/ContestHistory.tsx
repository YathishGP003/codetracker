import React, { useState, useMemo } from "react";
import { useContestHistory } from "@/hooks/useContestHistory";
import { Student } from "@/types/Student";
import { useDarkMode } from "@/contexts/DarkModeContext";
import ContestHistoryFilter from "./ContestHistoryFilter";
import ContestList from "./ContestList";
import { subDays } from "date-fns";

interface ContestHistoryProps {
  student: Student;
}

const ContestHistory: React.FC<ContestHistoryProps> = ({ student }) => {
  const { isDarkMode } = useDarkMode();
  const {
    data: contestHistory,
    isLoading,
    isError,
  } = useContestHistory(student.codeforcesHandle);

  const [filterPeriod, setFilterPeriod] = useState<30 | 90 | 365>(30);

  const filteredContests = useMemo(() => {
    if (!contestHistory) return [];
    const cutoffDate = subDays(new Date(), filterPeriod);
    return (
      contestHistory
        .filter(
          (contest) =>
            new Date(contest.ratingUpdateTimeSeconds * 1000) >= cutoffDate
        )
        // NOTE: The `problemsSolved` field is mocked here.
        // You will need to fetch this data from an appropriate source.
        .map((contest) => ({ ...contest, problemsSolved: 0 }))
        .sort((a, b) => b.ratingUpdateTimeSeconds - a.ratingUpdateTimeSeconds)
    );
  }, [contestHistory, filterPeriod]);

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

  return (
    <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-900/50" : ""}`}>
      <h2
        className={`text-2xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Contest History
      </h2>
      <ContestHistoryFilter
        selectedPeriod={filterPeriod}
        onPeriodChange={setFilterPeriod}
      />
      <div className="mt-6">
        <h3
          className={`text-xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Recent Contests
        </h3>
        <ContestList contests={filteredContests} />
      </div>
    </div>
  );
};

export default ContestHistory;
