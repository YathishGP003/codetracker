
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Contest {
  id: string;
  name: string;
  date: string;
  rating: number;
  ratingChange: number;
  rank: number;
  problemsSolved: number;
  totalProblems: number;
}

export const useContests = (studentId?: string) => {
  return useQuery({
    queryKey: ['contests', studentId],
    queryFn: async () => {
      console.log('Fetching contests for student:', studentId);
      
      let query = supabase
        .from('contests')
        .select('*')
        .order('contest_date', { ascending: false });

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Contest fetch error:', error);
        throw error;
      }

      console.log('Raw contest data:', data);

      const formattedData = data?.map(contest => ({
        id: contest.id,
        name: contest.contest_name || 'Unknown Contest',
        date: contest.contest_date || new Date().toISOString(),
        rating: contest.rating || 0,
        ratingChange: contest.rating_change || 0,
        rank: contest.rank || 0,
        problemsSolved: contest.problems_solved || 0,
        totalProblems: contest.total_problems || 0
      })) as Contest[] || [];

      console.log('Formatted contest data:', formattedData);
      return formattedData;
    },
    enabled: true,
    retry: 3,
    retryDelay: 1000
  });
};
