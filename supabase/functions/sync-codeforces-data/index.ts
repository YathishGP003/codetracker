import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CodeforcesUser {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank?: string;
  rating?: number;
  maxRank?: string;
  maxRating?: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar?: string;
  titlePhoto?: string;
}

interface CodeforcesSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    type?: string;
    points?: number;
    rating?: number;
    tags: string[];
  };
  author: {
    members: Array<{ handle: string }>;
    participantType: string;
    ghost: boolean;
    startTimeSeconds?: number;
  };
  programmingLanguage: string;
  verdict: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

interface CodeforcesRatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

const supabase = createClient(
  "https://lktxfhtvxygsigealzif.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdHhmaHR2eHlnc2lnZWFsemlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTcwNjQsImV4cCI6MjA2NTQ3MzA2NH0.z9cEDipmxYm_hTGaI3Al1A4MlCC2OKMSvRY4ARpIGtg"
);

async function makeCodeforcesRequest(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Making request to: ${url} (attempt ${i + 1}/${retries})`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(
          `Codeforces API error: ${data.comment || "Unknown error"}`
        );
      }

      // Add delay to respect rate limits
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      return data;
    } catch (error) {
      console.error(`Request failed (attempt ${i + 1}):`, error);

      if (i === retries - 1) {
        throw error;
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}

async function fetchCodeforcesUser(
  handle: string
): Promise<CodeforcesUser | null> {
  try {
    const data = await makeCodeforcesRequest(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );

    if (data.result && data.result.length > 0) {
      return data.result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching user info for ${handle}:`, error);
    return null;
  }
}

async function fetchCodeforcesSubmissions(
  handle: string,
  from?: number,
  count?: number
): Promise<CodeforcesSubmission[]> {
  try {
    let url = `https://codeforces.com/api/user.status?handle=${handle}`;
    if (from) url += `&from=${from}`;
    if (count) url += `&count=${count}`;

    const data = await makeCodeforcesRequest(url);
    return data.result || [];
  } catch (error) {
    console.error(`Error fetching submissions for ${handle}:`, error);
    return [];
  }
}

async function fetchCodeforcesRatingHistory(
  handle: string
): Promise<CodeforcesRatingChange[]> {
  try {
    const data = await makeCodeforcesRequest(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );
    return data.result || [];
  } catch (error) {
    console.error(`Error fetching rating history for ${handle}:`, error);
    return [];
  }
}

async function syncStudentData(studentId: string, handle: string) {
  console.log(`Starting sync for student ${studentId} with handle ${handle}`);

  let contestsFetched = 0;
  let problemsFetched = 0;
  let errorMessage = null;

  try {
    // Fetch user info
    console.log(`Fetching user info for handle: ${handle}`);
    const userInfo = await fetchCodeforcesUser(handle);

    if (userInfo) {
      console.log(`User info fetched successfully:`, {
        handle: userInfo.handle,
        rating: userInfo.rating,
        maxRating: userInfo.maxRating,
        rank: userInfo.rank,
        maxRank: userInfo.maxRank,
      });

      // Update student with rating values
      const updateData = {
        current_rating: userInfo.rating || 0,
        max_rating: userInfo.maxRating || userInfo.rating || 0,
        last_updated: new Date().toISOString(),
        is_active: true,
      };

      console.log(`Updating student ${studentId} with data:`, updateData);

      const { error: updateError } = await supabase
        .from("students")
        .update(updateData)
        .eq("id", studentId);

      if (updateError) {
        console.error(`Error updating student ratings:`, updateError);
        throw updateError;
      }
    } else {
      console.warn(`No user info found for handle: ${handle}`);
      await supabase
        .from("students")
        .update({
          last_updated: new Date().toISOString(),
          is_active: false,
        })
        .eq("id", studentId);
    }

    // Fetch submissions
    console.log(`Fetching submissions for handle: ${handle}`);
    const submissions = await fetchCodeforcesSubmissions(handle, 1, 1000);
    const acceptedSubmissions = submissions.filter(
      (sub) => sub.verdict === "OK"
    );

    console.log(`Found ${acceptedSubmissions.length} accepted submissions`);

    // Process recent submissions
    for (const submission of acceptedSubmissions.slice(0, 100)) {
      const solvedAt = new Date(submission.creationTimeSeconds * 1000);
      const problemId = `${submission.problem.contestId || "unknown"}-${
        submission.problem.index
      }`;

      const { data: existingProblem } = await supabase
        .from("problems")
        .select("id")
        .eq("student_id", studentId)
        .eq("problem_id", problemId)
        .single();

      if (!existingProblem) {
        const { error: insertError } = await supabase.from("problems").insert({
          student_id: studentId,
          problem_id: problemId,
          problem_name: submission.problem.name,
          contest_id: submission.problem.contestId || null,
          problem_index: submission.problem.index,
          rating: submission.problem.rating || null,
          tags: submission.problem.tags || [],
          solved_at: solvedAt.toISOString(),
          verdict: submission.verdict,
          programming_language: submission.programmingLanguage,
        });

        if (!insertError) {
          problemsFetched++;
        }
      }
    }

    // Fetch and process rating history
    console.log(`Fetching rating history for handle: ${handle}`);
    const ratingHistory = await fetchCodeforcesRatingHistory(handle);
    console.log(`Found ${ratingHistory.length} rating changes`);

    for (const rating of ratingHistory.slice(0, 50)) {
      if (
        !rating.contestId ||
        !rating.contestName ||
        !rating.ratingUpdateTimeSeconds
      ) {
        continue;
      }

      const { data: existingContest } = await supabase
        .from("contests")
        .select("id")
        .eq("student_id", studentId)
        .eq("contest_id", rating.contestId)
        .single();

      if (!existingContest) {
        const { error: insertError } = await supabase.from("contests").insert({
          student_id: studentId,
          contest_id: rating.contestId,
          contest_name: rating.contestName,
          contest_date: new Date(
            rating.ratingUpdateTimeSeconds * 1000
          ).toISOString(),
          rating: rating.newRating,
          rating_change: rating.newRating - rating.oldRating,
          rank: rating.rank,
        });

        if (!insertError) {
          contestsFetched++;
        }
      }
    }

    // Final update
    await supabase
      .from("students")
      .update({
        last_updated: new Date().toISOString(),
      })
      .eq("id", studentId);

    const successMessage = `Successfully synced ${contestsFetched} contests and ${problemsFetched} problems for ${handle}`;
    console.log(successMessage);

    return {
      success: true,
      contestsFetched,
      problemsFetched,
      userInfo: {
        handle: userInfo?.handle || handle,
        rating: userInfo?.rating || 0,
        maxRating: userInfo?.maxRating || 0,
      },
      message: successMessage,
    };
  } catch (error) {
    errorMessage = error.message;
    console.error(`Error syncing data for student ${studentId}:`, error);

    return {
      success: false,
      error: errorMessage,
      contestsFetched,
      problemsFetched,
      message: `Sync failed for ${handle}: ${errorMessage}`,
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json().catch(() => ({}));
    const { studentId, codeforcesHandle, syncAll } = requestBody;

    console.log("Sync request received:", {
      studentId,
      codeforcesHandle,
      syncAll,
    });

    if (syncAll) {
      // Sync all active students
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("id, codeforces_handle, name")
        .eq("is_active", true);

      if (studentsError) {
        console.error("Error fetching students:", studentsError);
        return new Response(
          JSON.stringify({
            error: "Failed to fetch students",
            details: studentsError.message,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!students || students.length === 0) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "No active students found",
            results: [],
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Starting sync for ${students.length} active students`);
      const results = [];

      for (const student of students) {
        try {
          const result = await syncStudentData(
            student.id,
            student.codeforces_handle
          );
          results.push({
            studentId: student.id,
            studentName: student.name,
            handle: student.codeforces_handle,
            ...result,
          });

          // Add delay between students
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to sync student ${student.name}:`, error);
          results.push({
            studentId: student.id,
            studentName: student.name,
            handle: student.codeforces_handle,
            success: false,
            error: error.message,
            message: `Sync failed for ${student.name}: ${error.message}`,
          });
        }
      }

      const summary = {
        totalStudents: students.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      };

      console.log("Sync summary:", summary);

      return new Response(
        JSON.stringify({
          success: true,
          results,
          summary,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (studentId && codeforcesHandle) {
      // Sync specific student
      if (!codeforcesHandle.match(/^[a-zA-Z0-9_.-]+$/)) {
        return new Response(
          JSON.stringify({
            error: "Invalid Codeforces handle format",
            message: "Handle contains invalid characters",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const result = await syncStudentData(studentId, codeforcesHandle);

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters",
          message:
            "Provide either (studentId, codeforcesHandle) or syncAll=true",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in sync function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
