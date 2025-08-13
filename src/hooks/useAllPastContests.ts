import { useQuery } from "@tanstack/react-query";

interface PastContest {
  id: string;
  name: string;
  date: string;
  url: string;
  site: string;
}

interface CodeforcesContest {
  id: number;
  name: string;
  phase: string;
  startTimeSeconds: number;
}

interface KontestsContest {
  name: string;
  start_time: string;
  status: string;
  url: string;
}

function getCurrentYearStart() {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
}

const errorMessages = [
  "Codeforces API error",
  "CodeChef fetch failed",
  "LeetCode fetch failed",
];

export const useAllPastContests = () => {
  return useQuery<PastContest[], Error>({
    queryKey: ["allPastContests"],
    queryFn: async () => {
      const now = new Date();
      const yearStart = getCurrentYearStart();
      const contests: PastContest[] = [];
      let errorCount = 0;

      // --- Codeforces ---
      try {
        const res = await fetch("https://codeforces.com/api/contest.list");
        const data = await res.json();
        if (data.status === "OK") {
          data.result.forEach((contest: CodeforcesContest) => {
            if (
              contest.phase === "FINISHED" &&
              contest.startTimeSeconds &&
              new Date(contest.startTimeSeconds * 1000) >= yearStart &&
              new Date(contest.startTimeSeconds * 1000) <= now
            ) {
              contests.push({
                id: `codeforces-${contest.id}`,
                name: contest.name,
                date: new Date(contest.startTimeSeconds * 1000).toISOString(),
                url: `https://codeforces.com/contest/${contest.id}`,
                site: "codeforces",
              });
            }
          });
        } else {
          errorCount++;
        }
      } catch (e: unknown) {
        errorCount++;
      }

      // --- CodeChef ---
      try {
        const res = await fetch("https://kontests.net/api/v1/code_chef");
        const data = await res.json();
        data.forEach((contest: KontestsContest) => {
          const start = new Date(contest.start_time);
          if (
            (start >= yearStart &&
              start <= now &&
              contest.status === "BEFORE") ||
            contest.status === "CODING" ||
            contest.status === "FINISHED" ||
            contest.status === "PAST"
          ) {
            contests.push({
              id: `codechef-${contest.name.replace(
                /\s+/g,
                "-"
              )}-${start.getTime()}`,
              name: contest.name,
              date: start.toISOString(),
              url: contest.url,
              site: "codechef",
            });
          }
        });
      } catch (e: unknown) {
        errorCount++;
      }

      // --- LeetCode ---
      try {
        const res = await fetch("https://kontests.net/api/v1/leet_code");
        const data = await res.json();
        data.forEach((contest: KontestsContest) => {
          const start = new Date(contest.start_time);
          if (
            (start >= yearStart &&
              start <= now &&
              contest.status === "BEFORE") ||
            contest.status === "CODING" ||
            contest.status === "FINISHED" ||
            contest.status === "PAST"
          ) {
            contests.push({
              id: `leetcode-${contest.name.replace(
                /\s+/g,
                "-"
              )}-${start.getTime()}`,
              name: contest.name,
              date: start.toISOString(),
              url: contest.url,
              site: "leetcode",
            });
          }
        });
      } catch (e: unknown) {
        errorCount++;
      }

      contests.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (errorCount > 0) {
        console.warn(
          `${errorCount} out of 3 contest sources failed to fetch. Some contests may not be displayed.`
        );
      }

      return contests;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchInterval: 1000 * 60 * 60 * 24, // 24 hours
  });
};
