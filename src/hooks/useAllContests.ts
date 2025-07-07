import { useQuery } from "@tanstack/react-query";

interface UpcomingContest {
  site: string;
  title: string;
  startTime: number;
  duration: number;
  endTime: number;
  url: string;
}

const fetchUpcomingContests = async (): Promise<UpcomingContest[]> => {
  const response = await fetch(
    "https://competeapi.vercel.app/contests/upcoming/"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch upcoming contests");
  }
  const data = await response.json();
  // The API returns the data directly as an array
  return data;
};

export const useAllContests = () => {
  return useQuery<UpcomingContest[], Error>({
    queryKey: ["allContests"],
    queryFn: fetchUpcomingContests,
  });
};
