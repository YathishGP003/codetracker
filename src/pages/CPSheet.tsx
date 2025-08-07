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
    <div className="min-h-screen bg-[#f6faff] dark:bg-[#0a1627] px-0 md:px-0">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-[#e0f2fe] to-[#f0fdf4] dark:from-[#0a1627] dark:to-[#0a1627] py-10 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between border-b border-[#e0e7ef] dark:border-[#1e293b]">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] dark:text-white mb-2 leading-tight">
            CP-31 Sheet{" "}
            <span className="text-[#0ea5e9]">Hand-picked Problems</span>
          </h1>
          <p className="text-lg md:text-xl text-[#334155] dark:text-[#cbd5e1] mb-4">
            This sheet is curated by{" "}
            <a
              href="https://codeforces.com/profile/Priyansh31dec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563eb] font-semibold underline"
            >
              Priyansh31dec
            </a>{" "}
            - <span className="text-[#f59e42] font-bold">Master</span> on
            Codeforces and{" "}
            <span className="font-bold">ICPC World Finalist</span>. Priyansh has
            solved 4000+ algorithmic problems and has spent 200+ hours reading
            1800+ problems to pick 31 problems in each rating from 800 - 1900
            containing the most interesting and reusable concepts.
          </p>
        </div>
        <div className="flex-1 flex justify-center md:justify-end mt-6 md:mt-0">
          <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-[#0ea5e9] w-[340px] h-[190px] md:w-[400px] md:h-[225px] bg-black">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/watch?v=jzzjTa3z9xE"
              title="CP Sheet | Handpicked Problems from 800 to 1900 | NEWBIE TO EXPERT"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left/Main Section */}
        <div className="md:col-span-3 space-y-8">
          {/* Rating Selector Row */}
          <div className="flex flex-wrap gap-2 mb-8 items-center justify-center rounded-2xl border border-[#bae6fd] dark:border-[#334155] bg-[#e0f2fe] dark:bg-[#1e293b] py-4 shadow-md">
            <span className="text-lg font-semibold mr-4 text-[#0ea5e9] dark:text-[#38bdf8]">
              Rating
            </span>
            {ratingOptions.map((rating) => (
              <button
                key={rating}
                className={`px-6 py-2 rounded-xl font-bold border transition-all duration-200 focus:outline-none text-lg
                  ${
                    selectedRating === rating
                      ? "bg-[#0ea5e9] border-[#0ea5e9] text-white shadow-lg scale-105"
                      : "bg-white border-[#bae6fd] text-[#0ea5e9] hover:bg-[#f0fdf4] dark:bg-[#1e293b] dark:border-[#334155] dark:text-[#38bdf8] hover:dark:bg-[#0a1627]"
                  }
                `}
                style={
                  selectedRating === rating
                    ? { boxShadow: "0 0 0 2px #0ea5e9" }
                    : {}
                }
                onClick={() => setSelectedRating(rating)}
              >
                {rating}
              </button>
            ))}
          </div>

          <CPSheetStats
            currentRating={student.currentRating}
            maxRating={student.maxRating}
            problemsSolved={cpSheetSolved}
            totalProblems={cpSheetTotal}
            leaderboardRank={leaderboardRank}
            allSolved={allSolved}
          />

          <CPSheetProblemTracker
            studentId={student.id}
            title={`${selectedRating} Rated Problems`}
            problems={currentProblems}
          />
        </div>

        {/* Right/Sidebar Section */}
        <div className="md:col-span-1 space-y-8">
          {/* Quick Stats Card */}
          <Card className="p-8 bg-[#f0fdf4] dark:bg-[#1e293b] border border-[#bbf7d0] dark:border-[#334155] rounded-2xl shadow-md">
            <h3 className="text-lg font-bold mb-4 text-[#0ea5e9] dark:text-[#38bdf8]">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#334155] dark:text-[#cbd5e1]">
                  Total Problems
                </span>
                <span className="font-semibold text-[#0ea5e9] dark:text-[#38bdf8]">
                  {totalProblems}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#334155] dark:text-[#cbd5e1]">
                  800 Rated
                </span>
                <span className="font-semibold text-[#0ea5e9] dark:text-[#38bdf8]">
                  {staticCPProblems[800].length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#334155] dark:text-[#cbd5e1]">
                  Your Rating
                </span>
                <span className="font-semibold text-[#0ea5e9] dark:text-[#38bdf8]">
                  {student.currentRating}
                </span>
              </div>
            </div>
          </Card>

          {/* Progress Tips */}
          <Card className="p-8 bg-[#e0f2fe] dark:bg-[#0a1627] border border-[#bae6fd] dark:border-[#334155] rounded-2xl shadow-md">
            <h3 className="text-lg font-bold mb-4 text-[#0ea5e9] dark:text-[#38bdf8]">
              Progress Tips
            </h3>
            <div className="space-y-3 text-sm text-[#334155] dark:text-[#cbd5e1]">
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
