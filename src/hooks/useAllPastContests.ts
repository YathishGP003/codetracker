import { useQuery } from "@tanstack/react-query";

export interface PastContest {
  id: string;
  name: string;
  date: string;
  url: string;
  site: string;
}

function getCurrentYearStart() {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
}

export const useAllPastContests = () => {
  return useQuery<PastContest[], Error>({
    queryKey: ["allPastContests"],
    queryFn: async () => {
      const now = new Date();
      const yearStart = getCurrentYearStart();
      const contests: PastContest[] = [];
      let errorCount = 0;
      let errorMessages: string[] = [];

      // --- Codeforces ---
      try {
        const res = await fetch("https://codeforces.com/api/contest.list");
        const data = await res.json();
        if (data.status === "OK") {
          data.result.forEach((contest: any) => {
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
          errorMessages.push("Codeforces API error");
        }
      } catch (e: any) {
        errorCount++;
        errorMessages.push("Codeforces fetch failed");
      }

      // --- CodeChef ---
      try {
        const res = await fetch("https://kontests.net/api/v1/code_chef");
        const data = await res.json();
        data.forEach((contest: any) => {
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
      } catch (e: any) {
        errorCount++;
        errorMessages.push("CodeChef fetch failed");
      }

      // --- LeetCode ---
      try {
        const res = await fetch("https://kontests.net/api/v1/leet_code");
        const data = await res.json();
        data.forEach((contest: any) => {
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
      } catch (e: any) {
        errorCount++;
        errorMessages.push("LeetCode fetch failed");
      }

      contests.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      if (contests.length === 0) {
        throw new Error(
          `Unable to fetch past contests. Errors: ${errorMessages.join(
            ", "
          )}. This may be due to network issues, CORS, or the APIs being down.`
        );
      }
      // Optionally, you could attach a warning property to the result if errorCount > 0
      return contests;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
