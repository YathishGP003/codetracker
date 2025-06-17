
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
  lastSubmissionDate: string | null;
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
  name: string;
  rating: number;
  solvedAt: string;
  tags: string[];
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
  syncType: 'scheduled' | 'manual' | 'handle_update';
  status: 'success' | 'error' | 'partial';
  message: string | null;
  contestsFetched: number;
  problemsFetched: number;
  createdAt: string;
}
