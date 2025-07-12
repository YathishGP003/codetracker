export interface Student {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastUpdated: string;
  isActive: boolean;
  reminderCount: number;
  emailEnabled: boolean;
  lastSubmissionDate?: string;
}

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

export interface Problem {
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
  programming_language?: string | null;
  problem_url?: string;
}

export interface StudentStats {
  totalProblems: number;
  averageRating: number;
  averageProblemsPerDay: number;
  mostDifficultProblem: Problem | null;
  problemsByRating: { [key: string]: number };
  submissionHeatmap: { [key: string]: number };
}

export interface SyncLog {
  id: string;
  studentId: string;
  syncType: "scheduled" | "manual" | "handle_update";
  status: "success" | "error" | "partial";
  message: string | null;
  contestsFetched: number;
  problemsFetched: number;
  createdAt: string;
}
