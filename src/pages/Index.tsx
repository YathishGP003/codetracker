import TopNavbar from "@/components/TopNavbar";
import StudentTable from "@/components/StudentTable";
import DashboardStats from "@/components/DashboardStats";
import ProblemTracker from "@/components/ProblemTracker";
// Removed sync management widgets from dashboard; now shown on Manage Students page
import { useStudents } from "@/hooks/useStudentData";
import { useContests } from "@/hooks/useContestData";
import { useProblemData } from "../hooks/useProblemData";
import { Skeleton } from "@/components/ui/skeleton";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    data: students = [],
    isLoading: studentsLoading,
    error: studentsError,
  } = useStudents();
  const {
    data: contests = [],
    isLoading: contestsLoading,
    error: contestsError,
  } = useContests();
  const {
    data: problems = [],
    isLoading: problemsLoading,
    error: problemsError,
  } = useProblemData();
  const { isDarkMode } = useDarkMode();

  const isLoading =
    authLoading || studentsLoading || contestsLoading || problemsLoading;
  const hasErrors = studentsError || contestsError || problemsError;

  // Debug logging
  useEffect(() => {
    console.log("Dashboard Debug Info:", {
      user: user?.email,
      authLoading,
      studentsLoading,
      contestsLoading,
      problemsLoading,
      studentsCount: students.length,
      contestsCount: contests.length,
      problemsCount: problems.length,
      hasErrors,
      errors: {
        studentsError,
        contestsError,
        problemsError,
      },
    });
  }, [
    user,
    authLoading,
    studentsLoading,
    contestsLoading,
    problemsLoading,
    students,
    contests,
    problems,
    hasErrors,
    studentsError,
    contestsError,
    problemsError,
  ]);

  // Show auth loading state
  if (authLoading) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
      >
        <TopNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div
            className={`text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Authenticating...
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there are critical errors
  if (hasErrors) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
      >
        <TopNavbar />
        <div className="container mx-auto px-4 py-8">
          <div
            className={`text-center space-y-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <h2 className="text-2xl font-bold text-red-500">
              Error Loading Dashboard
            </h2>
            <div className="space-y-2">
              {studentsError && (
                <p className="text-red-400">
                  Students: {studentsError.message}
                </p>
              )}
              {contestsError && (
                <p className="text-red-400">
                  Contests: {contestsError.message}
                </p>
              )}
              {problemsError && (
                <p className="text-red-400">
                  Problems: {problemsError.message}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Check the console for more details or try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading skeleton
  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
      >
        <TopNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="text-center">
            <p className={`${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Find the current user's student record based on email
  const currentUserStudent = students.find((s) => s.email === user?.email);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
    >
      <TopNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            CodeTracker Dashboard
          </h1>
          <p className={`${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
            Monitor and track Codeforces progress for all students with
            real-time synchronization
          </p>
        </div>

        <DashboardStats
          students={students}
          contests={contests}
          problems={problems}
        />

        {/* Sync management moved to Manage Students page */}

        {/* Problem Tracker Section - Show current user's progress */}
        {currentUserStudent && (
          <div className="mb-8">
            <ProblemTracker
              studentId={currentUserStudent.id}
              title={`${currentUserStudent.name}'s Current Contest Progress`}
            />
          </div>
        )}

        <StudentTable students={students} />

        {/* Debug info - remove in production */}
        {/* <div className={`mt-8 p-4 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`}>
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p>User: {user?.email}</p>
          <p>Students: {students.length}</p>
          <p>Contests: {contests.length}</p>
          <p>Problems: {problems.length}</p>
          <p>Current User Student: {currentUserStudent ? currentUserStudent.name : 'Not found'}</p>
        </div> */}
      </div>
    </div>
  );
};

export default Index;
