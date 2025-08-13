import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "../types/Student";
import { toast } from "sonner";
import { useEffect } from "react";

interface CreateStudentData {
  name: string;
  email: string;
  phoneNumber?: string;
  codeforcesHandle: string;
}

interface UpdateStudentData {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  codeforcesHandle: string;
  isActive: boolean;
  emailEnabled: boolean;
}

interface SyncStudentDataParams {
  studentId: string;
  handle: string;
}

interface SyncAllStudentsParams {
  syncAll: true;
}

interface SyncResponse {
  success: boolean;
  contestsFetched: number;
  problemsFetched: number;
  error?: string;
}

interface SyncAllResponse {
  results: Array<{
    contestsFetched: number;
    problemsFetched: number;
  }>;
}

/**
 * Fetches all students. Returns { data, isLoading, error }.
 * Surfaces errors for UI display.
 */
export const useStudents = () => {
  const queryClient = useQueryClient();

  // Set up real-time subscription for students table
  useEffect(() => {
    const channel = supabase
      .channel("students-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "students",
        },
        () => {
          // Invalidate and refetch students data
          queryClient.invalidateQueries({ queryKey: ["students"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message || "Failed to fetch students");
      }

      return (data || []).map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        phoneNumber: student.phone_number || "",
        codeforcesHandle: student.codeforces_handle,
        currentRating: student.current_rating || 0,
        maxRating: student.max_rating || 0,
        lastUpdated: student.last_updated || "",
        isActive: student.is_active || false,
        reminderCount: student.reminder_count || 0,
        emailEnabled: student.email_enabled || false,
        lastSubmissionDate: student.last_submission_date,
      })) as Student[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentData: CreateStudentData) => {
      const { data, error } = await supabase
        .from("students")
        .insert({
          name: studentData.name,
          email: studentData.email,
          phone_number: studentData.phoneNumber,
          codeforces_handle: studentData.codeforcesHandle,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message || "Failed to create student");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add student: ${error.message}`);
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentData: UpdateStudentData) => {
      const { data, error } = await supabase
        .from("students")
        .update({
          name: studentData.name,
          email: studentData.email,
          phone_number: studentData.phoneNumber,
          codeforces_handle: studentData.codeforcesHandle,
          is_active: studentData.isActive,
          email_enabled: studentData.emailEnabled,
        })
        .eq("id", studentData.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || "Failed to update student");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update student: ${error.message}`);
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId);

      if (error) {
        throw new Error(error.message || "Failed to delete student");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete student: ${error.message}`);
    },
  });
};

export const useDeleteMultipleStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentIds: string[]) => {
      const { error } = await supabase
        .from("students")
        .delete()
        .in("id", studentIds);

      if (error) {
        throw new Error(error.message || "Failed to delete students");
      }
    },
    onSuccess: (_, studentIds) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(`${studentIds.length} students deleted successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete students: ${error.message}`);
    },
  });
};

export const useToggleStudentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentIds,
      isActive,
    }: {
      studentIds: string[];
      isActive: boolean;
    }) => {
      const { error } = await supabase
        .from("students")
        .update({ is_active: isActive })
        .in("id", studentIds);

      if (error) {
        throw new Error(error.message || "Failed to update student status");
      }
    },
    onSuccess: (_, { studentIds, isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(
        `${studentIds.length} students ${
          isActive ? "activated" : "deactivated"
        } successfully!`
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to update student status: ${error.message}`);
    },
  });
};

export const useSyncStudentData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      handle,
    }: SyncStudentDataParams): Promise<SyncResponse> => {
      const { data, error } = await supabase.functions.invoke(
        "sync-codeforces-data",
        {
          body: { studentId, handle },
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to sync student data");
      }
      return data as SyncResponse;
    },
    onSuccess: (data: SyncResponse) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["contests"] });
      queryClient.invalidateQueries({ queryKey: ["problems"] });

      if (data.success) {
        toast.success(
          `Sync completed! ${data.contestsFetched} contests and ${data.problemsFetched} problems fetched.`
        );
      } else {
        toast.error(`Sync failed: ${data.error}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Sync failed: ${error.message}`);
    },
  });
};

export const useSyncAllStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<SyncAllResponse> => {
      const { data, error } = await supabase.functions.invoke(
        "sync-codeforces-data",
        {
          body: { syncAll: true },
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to sync all students");
      }
      return data as SyncAllResponse;
    },
    onSuccess: (data: SyncAllResponse) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["contests"] });
      queryClient.invalidateQueries({ queryKey: ["problems"] });

      const totalContests = data.results.reduce(
        (sum, result) => sum + (result.contestsFetched || 0),
        0
      );
      const totalProblems = data.results.reduce(
        (sum, result) => sum + (result.problemsFetched || 0),
        0
      );
      toast.success(
        `Global sync completed! ${totalContests} contests and ${totalProblems} problems fetched across all students.`
      );
    },
    onError: (error: Error) => {
      toast.error(`Global sync failed: ${error.message}`);
    },
  });
};
