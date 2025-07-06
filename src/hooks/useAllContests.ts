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
  const now = new Date();
  const contests: UpcomingContest[] = [];

  // --- Codeforces ---
  try {
    const res = await fetch("https://codeforces.com/api/contest.list");
    const data = await res.json();
    if (data.status === "OK") {
      data.result.forEach((contest: any) => {
        // Only upcoming contests (not finished, and startTime in the future)
        if (
          (contest.phase === "BEFORE" || contest.phase === "CODING") &&
          contest.startTimeSeconds &&
          new Date(contest.startTimeSeconds * 1000) >= now
        ) {
          contests.push({
            site: "codeforces",
            title: contest.name,
            startTime: contest.startTimeSeconds * 1000,
            duration: contest.durationSeconds * 1000,
            endTime:
              (contest.startTimeSeconds + contest.durationSeconds) * 1000,
            url: `https://codeforces.com/contest/${contest.id}`,
          });
        }
      });
    }
  } catch (e) {
    // Ignore errors for now
  }

  // --- CodeChef ---
  try {
    const res = await fetch("https://kontests.net/api/v1/code_chef");
    const data = await res.json();
    data.forEach((contest: any) => {
      const start = new Date(contest.start_time);
      if (
        start >= now &&
        (contest.status === "BEFORE" || contest.status === "CODING")
      ) {
        contests.push({
          site: "codechef",
          title: contest.name,
          startTime: start.getTime(),
          duration: contest.duration * 1000, // duration in seconds
          endTime: new Date(contest.end_time).getTime(),
          url: contest.url,
        });
      }
    });
  } catch (e) {
    // Ignore errors for now
  }

  // --- LeetCode ---
  try {
    const res = await fetch("https://kontests.net/api/v1/leet_code");
    const data = await res.json();
    data.forEach((contest: any) => {
      const start = new Date(contest.start_time);
      if (
        start >= now &&
        (contest.status === "BEFORE" || contest.status === "CODING")
      ) {
        contests.push({
          site: "leetcode",
          title: contest.name,
          startTime: start.getTime(),
          duration: contest.duration * 1000, // duration in seconds
          endTime: new Date(contest.end_time).getTime(),
          url: contest.url,
        });
      }
    });
  } catch (e) {
    // Ignore errors for now
  }

  // Sort by startTime ascending (soonest first)
  contests.sort((a, b) => a.startTime - b.startTime);
  return contests;
};

export const useAllContests = () => {
  return useQuery<UpcomingContest[], Error>({
    queryKey: ["allContests"],
    queryFn: fetchUpcomingContests,
  });
};
