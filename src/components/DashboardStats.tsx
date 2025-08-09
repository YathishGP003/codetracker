import React from "react";
import { Users, TrendingUp, Award, AlertTriangle } from "lucide-react";
import { Student, Contest, Problem } from "@/types/Student";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface DashboardStatsProps {
  students: Student[];
  contests: Contest[];
  problems: Problem[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  students,
  contests,
  problems,
}) => {
  const { isDarkMode } = useDarkMode();

  const activeStudents = students.filter((student) => student.isActive);
  const recentlyActiveStudents = students.filter((student) => {
    if (!student.lastSubmissionDate) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(student.lastSubmissionDate) > weekAgo;
  });

  const topPerformers = students.filter(
    (student) => student.currentRating >= 1500
  );
  const needAttention = students.filter((student) => {
    if (!student.lastSubmissionDate) return true;
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return new Date(student.lastSubmissionDate) < twoWeeksAgo;
  });

  const stats = [
    {
      title: "Total Students",
      value: students.length.toString(),
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgImage:
        "https://assets.leetcode.com/explore/cards/leetcodes-interview-crash-course-data-structures-and-algorithms/img-1663091244.png",
      trend: "up",
    },
    {
      title: "Active This Week",
      value: recentlyActiveStudents.length.toString(),
      change: "+8%",
      icon: TrendingUp,
      color: "from-green-500 to-teal-500",
      bgImage:
        "https://assets.leetcode.com/explore/cards/system-design-for-interviews-and-beyond/img-1676672273.png",
      trend: "up",
    },
    {
      title: "Top Performers",
      value: topPerformers.length.toString(),
      change: "+15%",
      icon: Award,
      color: "from-yellow-500 to-orange-500",
      bgImage:
        "https://assets.leetcode.com/explore/cards/introduction-to-the-beginners-guide/img-1652222288.png",
      trend: "up",
    },
    {
      title: "Need Attention",
      value: needAttention.length.toString(),
      change: "-5%",
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
      bgImage:
        "https://assets.leetcode.com/explore/cards/top-151-interview-questions/img",
      trend: "down",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-3xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl ${
            isDarkMode
              ? "bg-slate-900/70 border border-slate-800/60"
              : "bg-white shadow-xl border border-gray-100"
          }`}
        >
          {/* Header artwork area */}
          <div
            className={`relative h-32 sm:h-36 p-5 flex items-end rounded-t-3xl bg-gradient-to-br ${stat.color}`}
            style={
              // Add background image if provided
              (stat as any).bgImage
                ? {
                    backgroundImage: `url(${(stat as any).bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-white/25 blur-2xl" />
            <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
            {(stat as any).bgImage && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent rounded-t-3xl" />
            )}
            <div className="relative z-10 flex items-center gap-3 text-white">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-base font-semibold drop-shadow-sm">
                {stat.title}
              </div>
            </div>
          </div>
          {/* Footer stats area */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <div
                className={`text-3xl font-extrabold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stat.value}
              </div>
              <div
                className={`mt-0.5 text-xs ${
                  isDarkMode ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Total
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                stat.trend === "up"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
