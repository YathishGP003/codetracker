import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define and export Contest type if not present
export interface Contest {
  id: string;
  name: string;
  date: string;
  rating: number;
  ratingChange: number;
  rank: number;
  problemsSolved: number;
  totalProblems: number;
}

/**
 * Fetches all contests (optionally for a student). Returns { data, isLoading, error }.
 * Surfaces errors for UI display.
 */
export const useContests = (studentId?: string) => {
  return useQuery({
    queryKey: ["contests", studentId],
    queryFn: async () => {
      let query = supabase
        .from("contests")
        .select("*")
        .order("contest_date", { ascending: false });

      if (studentId) {
        query = query.eq("student_id", studentId);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message || "Failed to fetch contests");

      return (data || []).map((contest) => ({
        id: contest.id,
        name: contest.contest_name || "Unknown Contest",
        date: contest.contest_date || new Date().toISOString(),
        rating: contest.rating || 0,
        ratingChange: contest.rating_change || 0,
        rank: contest.rank || 0,
        problemsSolved: contest.problems_solved || 0,
        totalProblems: contest.total_problems || 0,
      })) as Contest[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
