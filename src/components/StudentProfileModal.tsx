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
import { getRatingColor, formatIST } from "@/lib/utils";
// removed duplicate import of getRatingColor

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
  const lastUpdatedDisplay = student?.lastUpdated
    ? formatIST(new Date(student.lastUpdated))
    : "-";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl ${
          isDarkMode
            ? "bg-slate-950/90 border-slate-800 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.8)]"
            : "bg-white border-gray-200 shadow-2xl"
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
                className={`rounded-3xl p-6 border ${
                  isDarkMode
                    ? "bg-slate-900/60 border-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                    : "bg-white border-gray-200 shadow-xl"
                }`}
              >
                <div className="text-center mb-4">
                  {imgError || !cfImgUrl ? (
                    <div
                      className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center font-bold text-2xl text-white mb-3 ${
                        student.isActive
                          ? "bg-gradient-to-br from-green-500 to-teal-600"
                          : "bg-gradient-to-br from-slate-600 to-slate-700"
                      } ring-4 ring-slate-700/30`}
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
                      className="w-24 h-24 mx-auto rounded-2xl object-cover mb-3 ring-4 ring-slate-700/30 border border-slate-700/40"
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-500/15 text-blue-300 hover:bg-blue-500/20"
                    >
                      <span>{student.codeforcesHandle}</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div
                    className={`rounded-xl p-3 flex items-center justify-between ${
                      isDarkMode ? "bg-slate-800/60" : "bg-gray-50"
                    }`}
                  >
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-600"
                      }
                    >
                      Current Rating
                    </span>
                    <span
                      className={`font-semibold ${getRatingColor(
                        student.currentRating
                      )}`}
                    >
                      {student.currentRating}
                    </span>
                  </div>
                  <div
                    className={`rounded-xl p-3 flex items-center justify-between ${
                      isDarkMode ? "bg-slate-800/60" : "bg-gray-50"
                    }`}
                  >
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-600"
                      }
                    >
                      Max Rating
                    </span>
                    <span
                      className={`font-semibold ${getRatingColor(
                        student.maxRating
                      )}`}
                    >
                      {student.maxRating}
                    </span>
                  </div>
                  <div
                    className={`rounded-xl p-3 flex items-center justify-between ${
                      isDarkMode ? "bg-slate-800/60" : "bg-gray-50"
                    }`}
                  >
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-600"
                      }
                    >
                      Status
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        student.isActive
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div
                    className={`rounded-xl p-3 flex items-center justify-between ${
                      isDarkMode ? "bg-slate-800/60" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span
                        className={
                          isDarkMode ? "text-slate-400" : "text-gray-600"
                        }
                      >
                        Last Updated
                      </span>
                    </div>
                    <div className="max-w-[140px] md:max-w-[220px] text-right">
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-slate-300" : "text-gray-700"
                        } truncate`}
                        title={student?.lastUpdated || ""}
                      >
                        {lastUpdatedDisplay}
                      </span>
                    </div>
                  </div>
                  {student.reminderCount > 0 && (
                    <div
                      className={`rounded-xl p-3 flex items-center justify-between col-span-2 ${
                        isDarkMode ? "bg-slate-800/60" : "bg-gray-50"
                      }`}
                    >
                      <span
                        className={
                          isDarkMode ? "text-slate-400" : "text-gray-600"
                        }
                      >
                        Reminders Sent
                      </span>
                      <span className="text-orange-400 font-semibold">
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
