import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useStudents } from "../hooks/useStudentData";
import { useProblemData } from "../hooks/useProblemData";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import CPSheetProblemTracker from "../components/CPSheetProblemTracker";
import CPSheetStats from "../components/CPSheetStats";

// --- Static 800-rated problems ---
const staticCPProblems = {
  800: [
    {
      name: "Forked!",
      url: "https://codeforces.com/problemset/problem/1903/A",
      rating: 800,
    },
    {
      name: "Chemistry",
      url: "https://codeforces.com/problemset/problem/1901/A",
      rating: 800,
    },
    {
      name: "1900/A",
      url: "https://codeforces.com/problemset/problem/1900/A",
      rating: 800,
    },
    {
      name: "1899/A",
      url: "https://codeforces.com/problemset/problem/1899/A",
      rating: 800,
    },
    {
      name: "1896/A",
      url: "https://codeforces.com/problemset/problem/1896/A",
      rating: 800,
    },
    {
      name: "1890/A",
      url: "https://codeforces.com/problemset/problem/1890/A",
      rating: 800,
    },
    {
      name: "1881/A",
      url: "https://codeforces.com/problemset/problem/1881/A",
      rating: 800,
    },
    {
      name: "1878/A",
      url: "https://codeforces.com/problemset/problem/1878/A",
      rating: 800,
    },
    {
      name: "1877/A",
      url: "https://codeforces.com/problemset/problem/1877/A",
      rating: 800,
    },
    {
      name: "1873/C",
      url: "https://codeforces.com/problemset/problem/1873/C",
      rating: 800,
    },
    {
      name: "1866/A",
      url: "https://codeforces.com/problemset/problem/1866/A",
      rating: 800,
    },
    {
      name: "1862/B",
      url: "https://codeforces.com/problemset/problem/1862/B",
      rating: 800,
    },
    {
      name: "1859/A",
      url: "https://codeforces.com/problemset/problem/1859/A",
      rating: 800,
    },
    {
      name: "1858/A",
      url: "https://codeforces.com/problemset/problem/1858/A",
      rating: 800,
    },
    {
      name: "1857/A",
      url: "https://codeforces.com/problemset/problem/1857/A",
      rating: 800,
    },
    {
      name: "1853/A",
      url: "https://codeforces.com/problemset/problem/1853/A",
      rating: 800,
    },
    {
      name: "1845/A",
      url: "https://codeforces.com/problemset/problem/1845/A",
      rating: 800,
    },
    {
      name: "1837/A",
      url: "https://codeforces.com/problemset/problem/1837/A",
      rating: 800,
    },
    {
      name: "1834/A",
      url: "https://codeforces.com/problemset/problem/1834/A",
      rating: 800,
    },
    {
      name: "1831/A",
      url: "https://codeforces.com/problemset/problem/1831/A",
      rating: 800,
    },
    {
      name: "1829/B",
      url: "https://codeforces.com/problemset/problem/1829/B",
      rating: 800,
    },
    {
      name: "1814/A",
      url: "https://codeforces.com/problemset/problem/1814/A",
      rating: 800,
    },
    {
      name: "1806/A",
      url: "https://codeforces.com/problemset/problem/1806/A",
      rating: 800,
    },
    {
      name: "1805/A",
      url: "https://codeforces.com/problemset/problem/1805/A",
      rating: 800,
    },
    {
      name: "1791/C",
      url: "https://codeforces.com/problemset/problem/1791/C",
      rating: 800,
    },
    {
      name: "1789/A",
      url: "https://codeforces.com/problemset/problem/1789/A",
      rating: 800,
    },
    {
      name: "1788/A",
      url: "https://codeforces.com/problemset/problem/1788/A",
      rating: 800,
    },
    {
      name: "1783/A",
      url: "https://codeforces.com/problemset/problem/1783/A",
      rating: 800,
    },
    {
      name: "1777/A",
      url: "https://codeforces.com/problemset/problem/1777/A",
      rating: 800,
    },
    {
      name: "1766/A",
      url: "https://codeforces.com/problemset/problem/1766/A",
      rating: 800,
    },
    {
      name: "1761/A",
      url: "https://codeforces.com/problemset/problem/1761/A",
      rating: 800,
    },
  ],
  900: [
    {
      name: "1904/A",
      url: "https://codeforces.com/problemset/problem/1904/A",
      rating: 900,
    },
    {
      name: "1883/B",
      url: "https://codeforces.com/problemset/problem/1883/B",
      rating: 900,
    },
    {
      name: "1878/C",
      url: "https://codeforces.com/problemset/problem/1878/C",
      rating: 900,
    },
    {
      name: "1875/A",
      url: "https://codeforces.com/problemset/problem/1875/A",
      rating: 900,
    },
    {
      name: "1869/A",
      url: "https://codeforces.com/problemset/problem/1869/A",
      rating: 900,
    },
    {
      name: "1855/B",
      url: "https://codeforces.com/problemset/problem/1855/B",
      rating: 900,
    },
    {
      name: "1850/D",
      url: "https://codeforces.com/problemset/problem/1850/D",
      rating: 900,
    },
    {
      name: "1837/B",
      url: "https://codeforces.com/problemset/problem/1837/B",
      rating: 900,
    },
    {
      name: "1828/B",
      url: "https://codeforces.com/problemset/problem/1828/B",
      rating: 900,
    },
    {
      name: "1807/D",
      url: "https://codeforces.com/problemset/problem/1807/D",
      rating: 900,
    },
    {
      name: "1794/B",
      url: "https://codeforces.com/problemset/problem/1794/B",
      rating: 900,
    },
    {
      name: "1726/A",
      url: "https://codeforces.com/problemset/problem/1726/A",
      rating: 900,
    },
    {
      name: "1696/B",
      url: "https://codeforces.com/problemset/problem/1696/B",
      rating: 900,
    },
    {
      name: "1679/A",
      url: "https://codeforces.com/problemset/problem/1679/A",
      rating: 900,
    },
    {
      name: "1675/B",
      url: "https://codeforces.com/problemset/problem/1675/B",
      rating: 900,
    },
    {
      name: "1666/D",
      url: "https://codeforces.com/problemset/problem/1666/D",
      rating: 900,
    },
    {
      name: "1665/B",
      url: "https://codeforces.com/problemset/problem/1665/B",
      rating: 900,
    },
    {
      name: "1624/B",
      url: "https://codeforces.com/problemset/problem/1624/B",
      rating: 900,
    },
    {
      name: "1607/B",
      url: "https://codeforces.com/problemset/problem/1607/B",
      rating: 900,
    },
    {
      name: "1606/A",
      url: "https://codeforces.com/problemset/problem/1606/A",
      rating: 900,
    },
    {
      name: "1593/B",
      url: "https://codeforces.com/problemset/problem/1593/B",
      rating: 900,
    },
    {
      name: "1582/B",
      url: "https://codeforces.com/problemset/problem/1582/B",
      rating: 900,
    },
    {
      name: "1559/A",
      url: "https://codeforces.com/problemset/problem/1559/A",
      rating: 900,
    },
    {
      name: "1543/A",
      url: "https://codeforces.com/problemset/problem/1543/A",
      rating: 900,
    },
    {
      name: "1537/B",
      url: "https://codeforces.com/problemset/problem/1537/B",
      rating: 900,
    },
    {
      name: "1475/A",
      url: "https://codeforces.com/problemset/problem/1475/A",
      rating: 900,
    },
    {
      name: "1471/A",
      url: "https://codeforces.com/problemset/problem/1471/A",
      rating: 900,
    },
    {
      name: "1440/B",
      url: "https://codeforces.com/problemset/problem/1440/B",
      rating: 900,
    },
    {
      name: "1380/A",
      url: "https://codeforces.com/problemset/problem/1380/A",
      rating: 900,
    },
    {
      name: "1373/B",
      url: "https://codeforces.com/problemset/problem/1373/B",
      rating: 900,
    },
    {
      name: "1374/B",
      url: "https://codeforces.com/problemset/problem/1374/B",
      rating: 900,
    },
  ],
  // TODO: Add 1000, 1100, ..., 1900
};

const ratingOptions = [
  800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900,
];

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
  const [selectedRating, setSelectedRating] = useState(800);

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

  // Get problems for the selected rating
  const currentProblems = staticCPProblems[selectedRating] || [];

  // Calculate CP Sheet solved for selected rating
  const cpSheetProblemSet = new Set(
    currentProblems.map((p) => {
      const urlParts = p.url.split("/");
      return `${urlParts[urlParts.length - 2]}${urlParts[urlParts.length - 1]}`;
    })
  );
  const cpSheetSolved = problems.filter((p) => {
    if (p.contest_id && p.problem_index) {
      return cpSheetProblemSet.has(`${p.contest_id}${p.problem_index}`);
    }
    if (p.problem_url) {
      const urlParts = p.problem_url.split("/");
      return cpSheetProblemSet.has(
        `${urlParts[urlParts.length - 2]}${urlParts[urlParts.length - 1]}`
      );
    }
    return false;
  }).length;
  const cpSheetTotal = currentProblems.length;
  // All unique Codeforces problems solved by user
  const allSolved = problems.length;

  // Calculate total problems from all ratings
  const totalProblems = Object.values(staticCPProblems).reduce(
    (total, problems) => total + problems.length,
    0
  );
  const leaderboardRank = undefined; // TODO: Replace with real rank if available

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Your CP Sheet</h2>
          <CPSheetStats
            currentRating={student.currentRating}
            maxRating={student.maxRating}
            problemsSolved={cpSheetSolved}
            totalProblems={cpSheetTotal}
            leaderboardRank={leaderboardRank}
            allSolved={allSolved}
          />

          {/* Rating Selector Row (moved below stats) */}
          <div className="flex flex-wrap gap-3 mb-8 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 py-4">
            <span className="text-lg font-semibold mr-4 text-gray-400 dark:text-slate-500">
              Rating
            </span>
            {ratingOptions.map((rating) => (
              <button
                key={rating}
                className={`px-6 py-2 rounded-xl font-bold border transition-all duration-200 focus:outline-none text-lg
                  ${
                    selectedRating === rating
                      ? "bg-green-100 border-green-500 text-green-700 dark:bg-green-700/30 dark:text-green-300 dark:border-green-400 shadow-lg"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:dark:bg-slate-700"
                  }
                `}
                style={
                  selectedRating === rating
                    ? { boxShadow: "0 0 0 2px #22c55e" }
                    : {}
                }
                onClick={() => setSelectedRating(rating)}
              >
                {rating}
              </button>
            ))}
          </div>

          <CPSheetProblemTracker
            studentId={student.id}
            title={`${selectedRating} Rated Problems`}
            problems={currentProblems}
          />
        </div>
        <div className="md:col-span-1 space-y-6">
          {/* Quick Stats Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Problems</span>
                <span className="font-semibold">{totalProblems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">800 Rated</span>
                <span className="font-semibold">
                  {staticCPProblems[800].length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Your Rating</span>
                <span className="font-semibold">{student.currentRating}</span>
              </div>
            </div>
          </Card>

          {/* Progress Tips */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Progress Tips</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Start with 800 rated problems</p>
              <p>• Solve at least 2-3 problems daily</p>
              <p>• Focus on understanding concepts</p>
              <p>• Practice consistently</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CPSheet;
