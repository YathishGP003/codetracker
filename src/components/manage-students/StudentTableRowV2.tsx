import React from "react";
import {
  ExternalLink,
  Eye,
  Edit,
  Mail,
  Trash2,
  History,
  AlertCircle,
} from "lucide-react";
import { Student } from "@/types/Student";
import { getRatingColor, getRatingBadge } from "@/lib/utils";

interface StudentTableRowV2Props {
  student: Student;
  isDarkMode: boolean;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onSendReminder: (studentId: string) => void;
  onViewContestHistory: (student: Student) => void;
}

const StudentTableRowV2: React.FC<StudentTableRowV2Props> = ({
  student,
  isDarkMode,
  onView,
  onEdit,
  onDelete,
  onSendReminder,
  onViewContestHistory,
}) => {
  return (
    <tr
      className={`border-b transition-all duration-300 hover:bg-opacity-50 ${
        isDarkMode
          ? "border-slate-700/30 hover:bg-slate-800/30"
          : "border-gray-200/30 hover:bg-gray-100/30"
      }`}
    >
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          {student.codeforcesHandle ? (
            <img
              src={`https://userpic.codeforces.org/${student.codeforcesHandle}/avatar`}
              alt="CF Avatar"
              className="w-10 h-10 rounded-2xl object-cover border border-gray-300 dark:border-slate-700 bg-white"
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
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold text-white ${
              student.isActive
                ? "bg-gradient-to-br from-green-500 to-teal-500"
                : "bg-gradient-to-br from-gray-500 to-slate-500"
            }`}
            style={{
              display: student.codeforcesHandle ? "none" : "flex",
            }}
          >
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <a
                href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center space-x-1 hover:text-blue-500 transition-colors"
              >
                <span>{student.name}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
          {student.codeforcesHandle}
        </span>
      </td>
      <td className={`py-4 px-4`}>
        <div className="flex flex-col">
          <span
            className={`font-bold text-lg ${getRatingColor(
              student.currentRating
            )}`}
          >
            {student.currentRating || 0}
          </span>
          <span
            className={`text-xs ${
              isDarkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            {getRatingBadge(student.currentRating)}
          </span>
        </div>
      </td>
      <td className={`py-4 px-4`}>
        <div className="flex flex-col">
          <span
            className={`font-bold text-lg ${getRatingColor(student.maxRating)}`}
          >
            {student.maxRating || 0}
          </span>
          <span
            className={`text-xs ${
              isDarkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            {getRatingBadge(student.maxRating)}
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-col space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
              student.isActive
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {student.isActive ? "Active" : "Inactive"}
          </span>
          {student.reminderCount > 0 && (
            <div className="flex items-center space-x-1 text-xs text-orange-400">
              <AlertCircle size={12} />
              <span>{student.reminderCount} reminders sent</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-xs">
            <span
              className={`px-2 py-1 rounded text-xs ${
                student.emailEnabled
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {student.emailEnabled ? "Emails On" : "Emails Off"}
            </span>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <button
          onClick={() => onViewContestHistory(student)}
          className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
            isDarkMode
              ? "bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
              : "bg-purple-100 text-purple-600 hover:bg-purple-200"
          }`}
          title="View Contest History"
        >
          <History size={16} />
        </button>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(student)}
            disabled={!student || !student.id}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
              isDarkMode
                ? "bg-blue-900/50 text-blue-400 hover:bg-blue-800/50"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(student)}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
              isDarkMode
                ? "bg-green-900/50 text-green-400 hover:bg-green-800/50"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            title="Edit Student"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onSendReminder(student.id)}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
              isDarkMode
                ? "bg-yellow-900/50 text-yellow-400 hover:bg-yellow-800/50"
                : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
            }`}
            title="Send Reminder"
          >
            <Mail size={16} />
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
              isDarkMode
                ? "bg-red-900/50 text-red-400 hover:bg-red-800/50"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
            title="Delete Student"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentTableRowV2;
