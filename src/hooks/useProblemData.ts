import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { Problem } from "../types/Student";

/**
 * Fetches all solved problems for a student (or all students if no ID).
 * Returns { data, isLoading, error, refetch }.
 * Surfaces errors for UI display.
 */
export function useProblemData(studentId?: string) {

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["problems", studentId],
    queryFn: async (): Promise<Problem[]> => {
      let query = supabase
        .from("problems")
        .select("*")
        .order("solved_at", { ascending: false });

      if (studentId) {
        query = query.eq("student_id", studentId);
      }

      const { data: problems, error: dbError } = await query;

      if (dbError) {
        throw new Error(dbError.message || "Failed to fetch problems");
      }

      return (problems || []).map((problem) => ({
        ...problem,
        solved_at: new Date(problem.solved_at),
        created_at: new Date(problem.created_at),
      })) as Problem[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    data,
    isLoading,
    error: error
      ? {
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching problems",
        }
      : null,
    refreshData: refetch,
  };
}
