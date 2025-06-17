
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useRef } from 'react';

interface Problem {
  id: string;
  name: string;
  rating: number;
  solvedAt: string;
  tags: string[];
}

interface StudentStats {
  totalProblems: number;
  averageRating: number;
  averageProblemsPerDay: number;
  mostDifficultProblem: Problem | null;
  problemsByRating: { [key: string]: number };
  submissionHeatmap: { [key: string]: number };
}

export const useProblems = (studentId?: string) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  // Set up real-time subscription
  useEffect(() => {
    // Clean up existing channel if it exists
    if (channelRef.current) {
      console.log('Cleaning up existing problems channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create new channel with unique name
    const channelName = `problems-changes-${studentId || 'all'}-${Date.now()}`;
    console.log('Creating new problems channel:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'problems',
          filter: studentId ? `student_id=eq.${studentId}` : undefined
        },
        (payload) => {
          console.log('Problems table changed:', payload);
          // Invalidate and refetch problems data when changes occur
          queryClient.invalidateQueries({ queryKey: ['problems', studentId] });
        }
      )
      .subscribe((status) => {
        console.log('Problems subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up problems subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [studentId, queryClient]);

  return useQuery({
    queryKey: ['problems', studentId],
    queryFn: async () => {
      let query = supabase
        .from('problems')
        .select('*')
        .order('solved_at', { ascending: false });

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(problem => ({
        id: problem.id,
        name: problem.problem_name,
        rating: problem.rating || 0,
        solvedAt: problem.solved_at,
        tags: problem.tags || []
      })) as Problem[];
    },
    enabled: true
  });
};

export const useStudentStats = (studentId: string) => {
  const { data: problems = [] } = useProblems(studentId);

  return useQuery({
    queryKey: ['student-stats', studentId, problems.length],
    queryFn: async (): Promise<StudentStats> => {
      if (problems.length === 0) {
        return {
          totalProblems: 0,
          averageRating: 0,
          averageProblemsPerDay: 0,
          mostDifficultProblem: null,
          problemsByRating: {},
          submissionHeatmap: {}
        };
      }

      const totalProblems = problems.length;
      const averageRating = problems.reduce((sum, p) => sum + (p.rating || 0), 0) / totalProblems;
      
      const firstSubmission = new Date(problems[problems.length - 1]?.solvedAt || Date.now());
      const lastSubmission = new Date(problems[0]?.solvedAt || Date.now());
      const daysDiff = Math.max(1, Math.ceil((lastSubmission.getTime() - firstSubmission.getTime()) / (1000 * 60 * 60 * 24)));
      const averageProblemsPerDay = totalProblems / daysDiff;

      const mostDifficultProblem = problems.reduce((max, current) => 
        (current.rating || 0) > (max?.rating || 0) ? current : max, null as Problem | null);

      const problemsByRating: { [key: string]: number } = {};
      const submissionHeatmap: { [key: string]: number } = {};

      problems.forEach(problem => {
        const ratingRange = Math.floor((problem.rating || 0) / 100) * 100;
        const ratingKey = `${ratingRange}-${ratingRange + 99}`;
        problemsByRating[ratingKey] = (problemsByRating[ratingKey] || 0) + 1;

        const date = new Date(problem.solvedAt).toDateString();
        submissionHeatmap[date] = (submissionHeatmap[date] || 0) + 1;
      });

      return {
        totalProblems,
        averageRating: Math.round(averageRating),
        averageProblemsPerDay: Math.round(averageProblemsPerDay * 100) / 100,
        mostDifficultProblem,
        problemsByRating,
        submissionHeatmap
      };
    },
    enabled: problems.length > 0
  });
};
