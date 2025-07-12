import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { Problem } from "../types/Student";

interface ProblemError {
  message: string;
}

/**
 * Fetches all solved problems for a student (or all students if no ID).
 * Returns { data, isLoading, error, refreshData }.
 * Surfaces errors for UI display.
 */
export function useProblemData(studentId?: string) {
  const [data, setData] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ProblemError | null>(null);

  useEffect(() => {
    async function fetchProblems() {
      setIsLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("problems")
          .select("*")
          .order("solved_at", { ascending: false });

        if (studentId) {
          query = query.eq("student_id", studentId);
        }

        const { data: problems, error: dbError } = await query;

        if (dbError) {
          setError({ message: dbError.message });
          setData([]);
          return;
        }

        setData(
          (problems || []).map((problem) => ({
            ...problem,
            solved_at: new Date(problem.solved_at),
            created_at: new Date(problem.created_at),
          }))
        );
      } catch (err) {
        setError({
          message:
            err instanceof Error
              ? err.message
              : "An error occurred while fetching problems",
        });
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProblems();
  }, [studentId]);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("problems")
        .select("*")
        .order("solved_at", { ascending: false });

      if (studentId) {
        query = query.eq("student_id", studentId);
      }

      const { data: problems, error: dbError } = await query;

      if (dbError) {
        setError({ message: dbError.message });
        setData([]);
        return;
      }

      setData(
        (problems || []).map((problem) => ({
          ...problem,
          solved_at: new Date(problem.solved_at),
          created_at: new Date(problem.created_at),
        }))
      );
    } catch (err) {
      setError({
        message:
          err instanceof Error
            ? err.message
            : "An error occurred while fetching problems",
      });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refreshData,
  };
}
