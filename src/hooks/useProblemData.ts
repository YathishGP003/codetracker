import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";

interface Problem {
  id: string;
  student_id: string;
  problem_id: string;
  problem_name: string;
  contest_id: number;
  problem_index: string;
  rating: number;
  tags: string[];
  solved_at: Date;
  verdict: string;
  created_at: Date;
}

interface ProblemError {
  message: string;
}

export function useProblemData(studentId?: string) {
  const [data, setData] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ProblemError | null>(null);

  useEffect(() => {
    async function fetchProblems() {
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
          throw dbError;
        }

        setData(
          problems.map((problem) => ({
            ...problem,
            solved_at: new Date(problem.solved_at),
            created_at: new Date(problem.created_at),
          }))
        );
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching problems:", err);
        setError({
          message:
            err instanceof Error
              ? err.message
              : "An error occurred while fetching problems",
        });
        setData([]); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchProblems();
  }, [studentId]);

  const refreshData = async () => {
    setIsLoading(true);
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
        throw dbError;
      }

      setData(
        problems.map((problem) => ({
          ...problem,
          solved_at: new Date(problem.solved_at),
          created_at: new Date(problem.created_at),
        }))
      );
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error refreshing problems:", err);
      setError({
        message:
          err instanceof Error
            ? err.message
            : "An error occurred while fetching problems",
      });
      setData([]); // Clear data on error
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
