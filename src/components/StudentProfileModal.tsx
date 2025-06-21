import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Calendar, Trophy, Target, Clock } from "lucide-react";
import { Student } from "@/types/Student";
import { useDarkMode } from "@/contexts/DarkModeContext";
import ProblemTracker from "@/components/ProblemTracker";
import RatingChart from "@/components/RatingChart";
import ContestHistory from "@/components/ContestHistory";
import { useProblemData } from "@/hooks/useProblemData";

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const { isDarkMode } = useDarkMode();
  const [imgError, setImgError] = useState(false);
  const { data: problems = [] } = useProblemData(student?.id);

  // Language aggregation (unique languages from last 500 problems)
  const languageList = useMemo(() => {
    const langs = new Set<string>();
    problems.slice(0, 500).forEach((p) => {
      if (p.programming_language) {
        langs.add(p.programming_language);
      }
    });
    return Array.from(langs);
  }, [problems]);

  // Tag to skill group mapping
  const tagGroups: Record<string, string> = {
    // Advanced
    "dynamic programming": "Advanced",
    dp: "Advanced",
    backtracking: "Advanced",
    "divide and conquer": "Advanced",
    "union find": "Advanced",
    "disjoint set": "Advanced",
    "monotonic stack": "Advanced",
    // Intermediate
    math: "Intermediate",
    "hash table": "Intermediate",
    "binary search": "Intermediate",
    tree: "Intermediate",
    graphs: "Intermediate",
    // Fundamental
    array: "Fundamental",
    string: "Fundamental",
    sorting: "Fundamental",
    stack: "Fundamental",
    "two pointers": "Fundamental",
  };
  const skillOrder = ["Advanced", "Intermediate", "Fundamental"];
  const skillColors = {
    Advanced: "text-red-400",
    Intermediate: "text-yellow-400",
    Fundamental: "text-green-400",
  };
  // Aggregate tag counts by group
  const tagCounts = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {
      Advanced: {},
      Intermediate: {},
      Fundamental: {},
    };
    problems.forEach((p) => {
      (p.tags || []).forEach((tag) => {
        const norm = tag.toLowerCase();
        const group = tagGroups[norm] || "Fundamental";
        counts[group][tag] = (counts[group][tag] || 0) + 1;
      });
    });
    return counts;
  }, [problems]);
  // Show more state
  const [showMore, setShowMore] = useState<{ [group: string]: boolean }>({});

  // Codeforces profile image URL
  const cfImgUrl =
    student && student.codeforcesHandle
      ? `https://userpic.codeforces.org/${student.codeforcesHandle}/avatar`
      : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-6xl max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200"
        }`}
      >
        {student && student.id ? (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {student.name}'s Profile
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student Info Card */}
              <div
                className={`rounded-2xl p-6 ${
                  isDarkMode ? "bg-slate-800/50" : "bg-gray-50/50"
                }`}
              >
                <div className="text-center mb-4">
                  {/* Profile Image or Initials */}
                  {imgError || !cfImgUrl ? (
                    <div
                      className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center font-bold text-xl text-white mb-3 ${
                        student.isActive
                          ? "bg-gradient-to-br from-green-500 to-teal-500"
                          : "bg-gradient-to-br from-gray-500 to-slate-500"
                      }`}
                    >
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  ) : (
                    <img
                      src={cfImgUrl}
                      alt={`${student.codeforcesHandle} profile`}
                      className="w-20 h-20 mx-auto rounded-full object-cover mb-3 border border-gray-300 dark:border-slate-700 bg-white"
                      onError={() => setImgError(true)}
                    />
                  )}
                  <h3
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {student.name}
                  </h3>
                  {student.codeforcesHandle && (
                    <a
                      href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <span>{student.codeforcesHandle}</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-600"
                      }
                    >
                      Current Rating
                    </span>
                    <span className="font-semibold text-blue-500">
                      {student.currentRating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-600"
                      }
                    >
                      Max Rating
                    </span>
                    <span className="font-semibold text-purple-500">
                      {student.maxRating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-600"
                      }
                    >
                      Status
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        student.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-600"
                      }
                    >
                      Last Updated
                    </span>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-slate-300" : "text-gray-700"
                      }`}
                    >
                      {student.lastUpdated}
                    </span>
                  </div>
                  {student.reminderCount > 0 && (
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          isDarkMode ? "text-slate-400" : "text-gray-600"
                        }
                      >
                        Reminders Sent
                      </span>
                      <span className="text-orange-500 font-medium">
                        {student.reminderCount}
                      </span>
                    </div>
                  )}
                  {/* Languages Section */}
                  <div className="mt-6 border-t pt-4">
                    <h4
                      className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Languages
                    </h4>
                    {languageList.length === 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {["C++", "Python", "Java"].map((lang) => (
                          <span
                            key={lang}
                            className="px-3 py-1 rounded-full bg-slate-700/30 text-slate-200 text-sm font-semibold dark:bg-slate-700 dark:text-slate-200"
                            style={{ minWidth: 70 }}
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {languageList.map((lang) => (
                          <span
                            key={lang}
                            className="px-3 py-1 rounded-full bg-slate-700/30 text-slate-200 text-sm font-semibold dark:bg-slate-700 dark:text-slate-200"
                            style={{ minWidth: 70 }}
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Skills Section */}
                  <div className="mt-6 border-t pt-4">
                    <h4
                      className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Skills
                    </h4>
                    {skillOrder.map((group) => {
                      const tags = Object.entries(tagCounts[group] || {}).sort(
                        (a, b) => b[1] - a[1]
                      );
                      if (tags.length === 0) return null;
                      return (
                        <div key={group} className="mb-4">
                          <div className="flex items-center mb-2">
                            <span
                              className={`mr-2 text-base font-bold ${skillColors[group]}`}
                            >
                              •
                            </span>
                            <span
                              className={`font-semibold text-base ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {group}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {tags
                              .slice(0, showMore[group] ? undefined : 3)
                              .map(([tag, count]) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700/30 text-slate-200 text-sm font-medium dark:bg-slate-700 dark:text-slate-200"
                                >
                                  {tag}{" "}
                                  <span className="ml-1 font-bold">
                                    x{count}
                                  </span>
                                </span>
                              ))}
                          </div>
                          {tags.length > 3 && (
                            <button
                              className="text-sm text-gray-400 hover:underline"
                              onClick={() =>
                                setShowMore((s) => ({
                                  ...s,
                                  [group]: !s[group],
                                }))
                              }
                            >
                              {showMore[group] ? "Show less" : "Show more"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Problem Tracker - Full Width */}
              <div className="lg:col-span-2">
                <ProblemTracker studentId={student.id} />
              </div>
            </div>

            {/* Rating Chart and Contest History */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              {/* Rating Chart */}
              <div className="rounded-2xl p-6 bg-slate-800/50">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Rating Progression
                </h3>
                <RatingChart handle={student.codeforcesHandle} />
              </div>

              {/* Contest History */}
              <ContestHistory student={student} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No student data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;
