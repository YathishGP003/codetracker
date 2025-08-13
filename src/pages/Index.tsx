import { TopNavbar } from "@/components/TopNavbar";
import StudentTable from "@/components/StudentTable";
import DashboardStats from "@/components/DashboardStats";
import ProblemTracker from "@/components/ProblemTracker/ProblemTracker";
import { useStudents } from "@/hooks/useStudentData";
import { useContests } from "@/hooks/useContestData";
import { useProblemData } from "../hooks/useProblemData";
import { Skeleton } from "@/components/ui/skeleton";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

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

  // Show auth loading state
  if (authLoading) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
      >
        <TopNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <LoadingSpinner text="Authenticating..." />
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
          <ErrorBoundary>
            <div
              className={`text-center space-y-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <h2 className="text-2xl font-bold">Something went wrong</h2>
              <p className="text-lg opacity-75">
                There was an error loading your dashboard data.
              </p>
              {studentsError && (
                <p className="text-red-500">
                  Students: {studentsError.message}
                </p>
              )}
              {contestsError && (
                <p className="text-red-500">
                  Contests: {contestsError.message}
                </p>
              )}
              {problemsError && (
                <p className="text-red-500">
                  Problems: {problemsError.message}
                </p>
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
    >
      <TopNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Dashboard Stats */}
          <DashboardStats
            students={students}
            contests={contests}
            problems={problems}
            isLoading={isLoading}
          />

          {/* Student Table */}
          <div className="space-y-4">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Students Overview
            </h2>
            {studentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <StudentTable students={students} />
            )}
          </div>

          {/* Problem Tracker */}
          {user && (
            <div className="space-y-4">
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Problems
              </h2>
              <ProblemTracker
                studentId={user.id}
                title="Recent Problems"
                groupByRating={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
