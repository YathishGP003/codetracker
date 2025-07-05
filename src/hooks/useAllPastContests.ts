import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PastContest {
  id: string;
  name: string;
  date: string;
}

export const useAllPastContests = () => {
  return useQuery({
    queryKey: ["allPastContests"],
    queryFn: async () => {
      // TODO: PROPER IMPLEMENTATION
      //
      // The current database schema only stores contests that students have participated in
      // (contests table has student_id foreign key). For the calendar to show ALL past contests
      // from various platforms, we need one of these approaches:
      //
      // Option 1: Create a separate table for all contests
      // - Create a new table: global_contests (id, name, platform, start_time, end_time, url)
      // - Populate it from APIs or web scraping
      // - Query this table instead of the student-specific contests table
      //
      // Option 2: Use external APIs
      // - Use the same API that provides upcoming contests to also get past contests
      // - Example: https://competeapi.vercel.app/contests/past/ (if available)
      // - Or integrate with platform-specific APIs
      //
      // Option 3: Store past contests when they become past
      // - When upcoming contests become past, store them in a separate table
      // - Run a daily job to move contests from upcoming to past
      //
      // For now, using mock data to demonstrate the calendar functionality.

      const mockPastContests: PastContest[] = [
        // Recent contests that would be visible in current month (January 2025)
        {
          id: "past-recent-1",
          name: "Codeforces Round #951 (Div. 2)",
          date: "2025-01-15T14:00:00Z",
        },
        {
          id: "past-recent-2",
          name: "LeetCode Weekly Contest 401",
          date: "2025-01-14T15:00:00Z",
        },
        {
          id: "past-recent-3",
          name: "CodeChef Starters 151",
          date: "2025-01-13T20:00:00Z",
        },
        {
          id: "past-recent-4",
          name: "AtCoder Beginner Contest 351",
          date: "2025-01-12T17:00:00Z",
        },
        {
          id: "past-recent-5",
          name: "Codeforces Round #950 (Div. 3)",
          date: "2025-01-11T10:00:00Z",
        },
        {
          id: "past-recent-6",
          name: "LeetCode Biweekly Contest 131",
          date: "2025-01-10T15:00:00Z",
        },
        {
          id: "past-recent-7",
          name: "CodeChef Lunchtime 2025",
          date: "2025-01-09T19:30:00Z",
        },
        {
          id: "past-recent-8",
          name: "AtCoder Regular Contest 181",
          date: "2025-01-08T21:00:00Z",
        },
        {
          id: "past-recent-9",
          name: "Codeforces Round #949 (Div. 1)",
          date: "2025-01-07T16:00:00Z",
        },
        {
          id: "past-recent-10",
          name: "LeetCode Weekly Contest 400",
          date: "2025-01-06T15:00:00Z",
        },
        {
          id: "past-recent-11",
          name: "CodeChef Starters 150",
          date: "2025-01-05T20:00:00Z",
        },
        {
          id: "past-recent-12",
          name: "AtCoder Beginner Contest 350",
          date: "2025-01-04T17:00:00Z",
        },
        {
          id: "past-recent-13",
          name: "Codeforces Round #948 (Div. 2)",
          date: "2025-01-03T14:00:00Z",
        },
        {
          id: "past-recent-14",
          name: "LeetCode Biweekly Contest 130",
          date: "2025-01-02T15:00:00Z",
        },
        {
          id: "past-recent-15",
          name: "CodeChef Lunchtime 2025",
          date: "2025-01-01T19:30:00Z",
        },
        // Older contests for demonstration (from December 2024)
        {
          id: "past-1",
          name: "Codeforces Round #950 (Div. 3)",
          date: "2024-12-31T10:00:00Z",
        },
        {
          id: "past-2",
          name: "LeetCode Weekly Contest 400",
          date: "2024-12-30T15:00:00Z",
        },
        {
          id: "past-3",
          name: "CodeChef Starters 150",
          date: "2024-12-29T20:00:00Z",
        },
        {
          id: "past-4",
          name: "AtCoder Beginner Contest 350",
          date: "2024-12-28T17:00:00Z",
        },
        {
          id: "past-5",
          name: "Codeforces Round #949 (Div. 2)",
          date: "2024-12-27T14:00:00Z",
        },
        {
          id: "past-6",
          name: "LeetCode Biweekly Contest 130",
          date: "2024-12-26T15:00:00Z",
        },
        {
          id: "past-7",
          name: "CodeChef Lunchtime 2024",
          date: "2024-12-25T19:30:00Z",
        },
        {
          id: "past-8",
          name: "AtCoder Regular Contest 180",
          date: "2024-12-24T21:00:00Z",
        },
        {
          id: "past-9",
          name: "Codeforces Round #948 (Div. 1)",
          date: "2024-12-23T16:00:00Z",
        },
        {
          id: "past-10",
          name: "LeetCode Weekly Contest 399",
          date: "2024-12-22T15:00:00Z",
        },
        {
          id: "past-11",
          name: "CodeChef Starters 149",
          date: "2024-12-21T20:00:00Z",
        },
        {
          id: "past-12",
          name: "AtCoder Beginner Contest 349",
          date: "2024-12-20T17:00:00Z",
        },
        {
          id: "past-13",
          name: "Codeforces Round #947 (Div. 3)",
          date: "2024-12-19T14:00:00Z",
        },
        {
          id: "past-14",
          name: "LeetCode Biweekly Contest 129",
          date: "2024-12-18T15:00:00Z",
        },
        {
          id: "past-15",
          name: "CodeChef Lunchtime 2024",
          date: "2024-12-17T19:30:00Z",
        },
        {
          id: "past-16",
          name: "AtCoder Regular Contest 179",
          date: "2024-12-16T21:00:00Z",
        },
        {
          id: "past-17",
          name: "Codeforces Round #946 (Div. 2)",
          date: "2024-12-15T16:00:00Z",
        },
        {
          id: "past-18",
          name: "LeetCode Weekly Contest 398",
          date: "2024-12-14T15:00:00Z",
        },
        {
          id: "past-19",
          name: "CodeChef Starters 148",
          date: "2024-12-13T20:00:00Z",
        },
        {
          id: "past-20",
          name: "AtCoder Beginner Contest 348",
          date: "2024-12-12T17:00:00Z",
        },
      ];

      return mockPastContests;
    },
  });
};
