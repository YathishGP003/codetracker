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
  try {
    const response = await fetch(
      "https://competeapi.vercel.app/contests/upcoming/"
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch upcoming contests: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    // Show all contests on their actual date
    return data;
  } catch (error: any) {
    // Network/CORS error or other
    throw new Error(
      "Unable to fetch upcoming contests. This may be due to a network error, CORS issue, or the API being down. Please try again later."
    );
  }
};

export const useAllContests = () => {
  return useQuery<UpcomingContest[], Error>({
    queryKey: ["allContests"],
    queryFn: fetchUpcomingContests,
  });
};
