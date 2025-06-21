import { useQuery } from "@tanstack/react-query";

interface ContestHistoryItem {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

const fetchContestHistory = async (
  handle: string
): Promise<ContestHistoryItem[]> => {
  const response = await fetch(
    `https://codeforces.com/api/user.rating?handle=${handle}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch contest history from Codeforces");
  }
  const data = await response.json();
  if (data.status !== "OK") {
    throw new Error(data.comment || "Codeforces API returned an error");
  }
  return data.result.map((item: any) => ({
    ...item,
    ratingChange: item.newRating - item.oldRating,
  }));
};

export const useContestHistory = (handle?: string) => {
  return useQuery({
    queryKey: ["contestHistory", handle],
    queryFn: () => fetchContestHistory(handle!),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
