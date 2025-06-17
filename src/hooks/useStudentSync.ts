
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSyncAllStudents = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('Starting sync all students...');
      
      const { data, error } = await supabase.functions.invoke('sync-codeforces-data', {
        body: { syncAll: true }
      });

      if (error) {
        console.error('Sync error:', error);
        throw new Error(error.message || 'Failed to sync student data');
      }

      console.log('Sync response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Sync successful:', data);
      queryClient.invalidateQueries({ queryKey: ['students'] });
      
      const summary = data?.summary;
      if (summary) {
        toast({
          title: "Sync Completed",
          description: `Successfully synced ${summary.successful}/${summary.totalStudents} students. ${summary.failed > 0 ? `${summary.failed} failed.` : ''}`,
        });
      } else {
        toast({
          title: "Sync Completed",
          description: "Successfully synced all active students.",
        });
      }
    },
    onError: (error: Error) => {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync student data. Please try again.",
        variant: "destructive",
      });
    }
  });
};

export const useSyncStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ studentId, handle }: { studentId: string; handle: string }) => {
      console.log('Starting sync for student:', studentId, handle);
      
      const { data, error } = await supabase.functions.invoke('sync-codeforces-data', {
        body: { 
          studentId,
          codeforcesHandle: handle
        }
      });

      if (error) {
        console.error('Student sync error:', error);
        throw new Error(error.message || 'Failed to sync student data');
      }

      console.log('Student sync response:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('Student sync successful:', data);
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['contests', variables.studentId] });
      
      if (data?.success) {
        toast({
          title: "Sync Completed",
          description: data.message || `Successfully synced data for ${variables.handle}.`,
        });
      } else {
        toast({
          title: "Sync Failed",
          description: data?.message || `Failed to sync data for ${variables.handle}.`,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error, variables) => {
      console.error('Student sync failed:', error);
      toast({
        title: "Sync Failed",
        description: `Failed to sync data for ${variables.handle}. ${error.message}`,
        variant: "destructive",
      });
    }
  });
};
