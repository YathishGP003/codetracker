import React from "react";
import { Eye, Edit, Mail, Trash2, History, ExternalLink } from "lucide-react";
import { Student } from "@/types/Student";
import { getRatingBadge, getRatingColor } from "@/lib/utils";
import { getCodeforcesProfilePicture } from "@/lib/codeforces";
import ProfileAvatar from "@/components/ui/ProfileAvatar";

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
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Avatar with status dot */}
              <div className="relative">
                <ProfileAvatar
                  size={64}
                  imageUrl={student.codeforcesHandle ? getCodeforcesProfilePicture(student.codeforcesHandle, 80) : undefined}
                  alt={student.name}
                />
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                    isDarkMode ? 'border-slate-900' : 'border-white'
                  } ${student.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                />
              </div>
            </div>

            <div className="ml-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {student.name}
                </span>
                <a
                  href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-500 transition-colors"
                  title="View on Codeforces"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
              <div
                className={`text-xs ${
                  isDarkMode ? "text-slate-400" : "text-gray-500"
                } mt-0.5`}
              >
                {student.email}
              </div>
            </div>
          </div>

          {/* Status pill */}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              student.isActive
                ? "bg-green-500/10 text-green-400"
                : "bg-gray-500/10 text-gray-400"
            }`}
          >
            {student.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Ratings */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              isDarkMode ? "bg-slate-800/40" : "bg-gray-100"
            }`}
          >
            <div
              className={`text-[10px] uppercase tracking-wider ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Current
            </div>
            <div
              className={`text-lg font-semibold mt-1 ${getRatingColor(
                student.currentRating
              )}`}
            >
              {student.currentRating || 0}
              <span className="ml-1 text-xs font-normal opacity-75">
                {getRatingBadge(student.currentRating)}
              </span>
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl ${
              isDarkMode ? "bg-slate-800/40" : "bg-gray-100"
            }`}
          >
            <div
              className={`text-[10px] uppercase tracking-wider ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Max
            </div>
            <div
              className={`text-lg font-semibold mt-1 ${getRatingColor(
                student.maxRating
              )}`}
            >
              {student.maxRating || 0}
              <span className="ml-1 text-xs font-normal opacity-75">
                {getRatingBadge(student.maxRating)}
              </span>
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
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => onViewContestHistory(student)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isDarkMode
                ? "text-blue-400 hover:bg-slate-800/60"
                : "text-blue-600 hover:bg-gray-100"
            }`}
            title="View Contest History"
          >
            <History size={14} /> Contest
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(student)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-slate-300 hover:bg-slate-800/60"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(student)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-slate-300 hover:bg-slate-800/60"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onSendReminder(student.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-slate-300 hover:bg-slate-800/60"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Send Reminder"
            >
              <Mail size={16} />
            </button>
            <button
              onClick={() => onDelete(student.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-rose-400 hover:bg-rose-900/30"
                  : "text-rose-500 hover:bg-rose-100"
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
