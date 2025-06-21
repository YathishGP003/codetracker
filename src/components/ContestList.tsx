import React from "react";
import ContestCard from "./ContestCard";

// The contest type will be enriched with problemsSolved, so we must define it here.
interface Contest {
  contestId: number;
  contestName: string;
  ratingUpdateTimeSeconds: number;
  rank: number;
  oldRating: number;
  newRating: number;
  problemsSolved: number; // This will be added
}

interface ContestListProps {
  contests: Contest[];
}

const ContestList: React.FC<ContestListProps> = ({ contests }) => {
  if (contests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          No contests found for the selected period.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contests.map((contest) => (
        <ContestCard key={contest.contestId} contest={contest} />
      ))}
    </div>
  );
};

export default ContestList;
