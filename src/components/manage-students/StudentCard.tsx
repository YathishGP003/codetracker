import React from "react";
import { Eye, Edit, Mail, Trash2, History, ExternalLink } from "lucide-react";
import { Student } from "@/types/Student";
import { getRatingBadge, getRatingColor } from "@/lib/utils";

interface StudentCardProps {
  student: Student;
  isDarkMode: boolean;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onSendReminder: (studentId: string) => void;
  onViewContestHistory: (student: Student) => void;
  onToggleEmail?: (studentId: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  isDarkMode,
  onView,
  onEdit,
  onDelete,
  onSendReminder,
  onViewContestHistory,
  onToggleEmail,
}) => {
  const cardBg = isDarkMode
    ? "bg-gradient-to-b from-slate-900/70 to-slate-900/40 border-slate-800/80"
    : "bg-white/80 backdrop-blur-xl border-gray-200/80";
  const subtleRing = isDarkMode
    ? "hover:ring-1 hover:ring-slate-700/60"
    : "hover:ring-1 hover:ring-slate-200";

  return (
    <div
      className={`group relative rounded-3xl border ${cardBg} ${subtleRing} transition-all duration-300 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] hover:-translate-y-0.5`}
    >
      {/* Accent gradient bar */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-sky-500 via-teal-500 to-purple-500 opacity-70" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {student.codeforcesHandle ? (
              <img
                src={`https://userpic.codeforces.org/${student.codeforcesHandle}/avatar`}
                alt="CF Avatar"
                className="w-12 h-12 rounded-2xl object-cover border border-gray-300 dark:border-slate-700 bg-white"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    (
                      e.currentTarget.nextElementSibling as HTMLElement
                    ).style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-white ${
                student.isActive
                  ? "bg-gradient-to-br from-sky-500 to-teal-500"
                  : "bg-gradient-to-br from-gray-500 to-slate-500"
              }`}
              style={{ display: student.codeforcesHandle ? "none" : "flex" }}
            >
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div>
              <div
                className={`font-semibold leading-tight ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <a
                  href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-center gap-1 hover:text-sky-400 transition-colors"
                >
                  <span>{student.name}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
              <div
                className={`text-xs ${
                  isDarkMode ? "text-slate-400" : "text-gray-500"
                }`}
              >
                {student.email}
              </div>
            </div>
          </div>

          {/* Status pill */}
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              student.isActive
                ? "bg-green-500/15 text-emerald-400"
                : "bg-rose-500/15 text-rose-400"
            }`}
          >
            {student.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Ratings */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div
            className={`rounded-2xl p-3 border ${
              isDarkMode
                ? "border-slate-800/60 bg-slate-900/30"
                : "border-gray-200/60 bg-white/60"
            }`}
          >
            <div
              className={`text-xs ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Current
            </div>
            <div
              className={`text-xl font-bold ${getRatingColor(
                student.currentRating
              )}`}
            >
              {student.currentRating || 0}
            </div>
            <div
              className={`text-[10px] ${
                isDarkMode ? "text-slate-500" : "text-gray-500"
              }`}
            >
              {getRatingBadge(student.currentRating)}
            </div>
          </div>
          <div
            className={`rounded-2xl p-3 border ${
              isDarkMode
                ? "border-slate-800/60 bg-slate-900/30"
                : "border-gray-200/60 bg-white/60"
            }`}
          >
            <div
              className={`text-xs ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Max
            </div>
            <div
              className={`text-xl font-bold ${getRatingColor(
                student.maxRating
              )}`}
            >
              {student.maxRating || 0}
            </div>
            <div
              className={`text-[10px] ${
                isDarkMode ? "text-slate-500" : "text-gray-500"
              }`}
            >
              {getRatingBadge(student.maxRating)}
            </div>
          </div>
        </div>

        {/* CF handle chip and email chip */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-medium">
            @{student.codeforcesHandle}
          </span>
          <button
            type="button"
            onClick={() => onToggleEmail?.(student.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              student.emailEnabled
                ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                : "bg-rose-500/15 text-rose-400 hover:bg-rose-500/25"
            }`}
          >
            {student.emailEnabled ? "Emails On" : "Emails Off"}
          </button>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => onViewContestHistory(student)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-medium transition-all ${
              isDarkMode
                ? "bg-purple-900/40 text-purple-300 hover:bg-purple-800/50"
                : "bg-purple-100 text-purple-600 hover:bg-purple-200"
            }`}
            title="View Contest History"
          >
            <History size={16} /> Contest
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(student)}
              className={`p-2 rounded-2xl transition-colors ${
                isDarkMode
                  ? "bg-blue-900/40 text-blue-300 hover:bg-blue-800/50"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(student)}
              className={`p-2 rounded-2xl transition-colors ${
                isDarkMode
                  ? "bg-green-900/40 text-green-300 hover:bg-green-800/50"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
              }`}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onSendReminder(student.id)}
              className={`p-2 rounded-2xl transition-colors ${
                isDarkMode
                  ? "bg-yellow-900/40 text-yellow-300 hover:bg-yellow-800/50"
                  : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
              }`}
              title="Send Reminder"
            >
              <Mail size={16} />
            </button>
            <button
              onClick={() => onDelete(student.id)}
              className={`p-2 rounded-2xl transition-colors ${
                isDarkMode
                  ? "bg-rose-900/40 text-rose-300 hover:bg-rose-800/50"
                  : "bg-rose-100 text-rose-600 hover:bg-rose-200"
              }`}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
