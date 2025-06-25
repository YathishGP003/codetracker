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
      const { data, error } = await supabase
        .from("contests")
        .select("id, contest_name, contest_date")
        .order("contest_date", { ascending: false });

      if (error) {
        throw new Error("Failed to fetch past contests");
      }

      return data.map((contest) => ({
        id: contest.id,
        name: contest.contest_name || "Unknown Contest",
        date: contest.contest_date,
      })) as PastContest[];
    },
  });
};
