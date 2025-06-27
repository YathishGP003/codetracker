import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useStudents } from "../hooks/useStudentData";
import { useProblemData } from "../hooks/useProblemData";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import ProblemTracker from "../components/ProblemTracker";
import CPSheetStats from "../components/CPSheetStats";

// TODO: Import or create the following components as needed
// import RatingFilter from '../components/RatingFilter';
// import ProgressCards from '../components/ProgressCards';
// import ProblemTable from '../components/ProblemTable';
// import UserInfoBar from '../components/UserInfoBar';
// import Sidebar from '../components/Sidebar';
// import ReportBugButton from '../components/ReportBugButton';

const CPSheet: React.FC = () => {
  const { user } = useAuth();
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const student = students.find(
    (s) => s.email.trim().toLowerCase() === user?.email?.trim().toLowerCase()
  );
  // Always call the hook, even if student is undefined
  const { data: problems = [], isLoading: problemsLoading } = useProblemData(
    student?.id
  );
  const navigate = useNavigate();
  const [codeforcesHandle, setCodeforcesHandle] = useState<string | null>(null);

  // Debug logs
  console.log("Auth user email:", user?.email);
  console.log("All students:", students);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (student && student.codeforcesHandle) {
      setCodeforcesHandle(student.codeforcesHandle);
    }
  }, [student]);

  if (!user || studentsLoading) {
    return <Skeleton className="w-full h-screen" />;
  }
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Student record not found</h2>
        <p className="mb-6">
          No student record found for your account. Please contact support.
        </p>
      </div>
    );
  }
  if (!codeforcesHandle) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">
          Connect your Codeforces account
        </h2>
        <p className="mb-6">
          To access your CP Sheet, please connect your Codeforces handle in your
          profile settings.
        </p>
        <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
      </div>
    );
  }

  // Placeholder: totalProblems and leaderboardRank (replace with real data if available)
  const totalProblems = 372; // TODO: Replace with real total if available
  const leaderboardRank = undefined; // TODO: Replace with real rank if available

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* User Info Bar */}
      {/* <UserInfoBar handle={codeforcesHandle} /> */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Your CP Sheet</h2>
          <CPSheetStats
            currentRating={student.currentRating}
            maxRating={student.maxRating}
            problemsSolved={problems.length}
            totalProblems={totalProblems}
            leaderboardRank={leaderboardRank}
          />
          <ProblemTracker
            studentId={student.id}
            title="CP Sheet Problems"
            groupByRating={true}
          />
          {/* Progress Cards */}
          {/* <ProgressCards progress={progress} stats={stats} leaderboard={leaderboard} /> */}
        </div>
        <div className="md:col-span-1 space-y-6">
          {/* Sidebar */}
          {/* <Sidebar stats={stats} /> */}
        </div>
      </div>

      {/* Report Bug Button */}
      {/* <ReportBugButton /> */}
    </div>
  );
};

export default CPSheet;
