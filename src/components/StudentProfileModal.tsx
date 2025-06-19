import React, { useState } from "react";
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

  if (!student) return null;

  // Codeforces profile image URL
  const cfImgUrl = `https://userpic.codeforces.org/${student.codeforcesHandle}/avatar`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-6xl max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200"
        }`}
      >
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
              {imgError ? (
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
              <a
                href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <span>{student.codeforcesHandle}</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={isDarkMode ? "text-slate-400" : "text-gray-600"}
                >
                  Current Rating
                </span>
                <span className="font-semibold text-blue-500">
                  {student.currentRating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={isDarkMode ? "text-slate-400" : "text-gray-600"}
                >
                  Max Rating
                </span>
                <span className="font-semibold text-purple-500">
                  {student.maxRating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={isDarkMode ? "text-slate-400" : "text-gray-600"}
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
                  className={isDarkMode ? "text-slate-400" : "text-gray-600"}
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
                    className={isDarkMode ? "text-slate-400" : "text-gray-600"}
                  >
                    Reminders Sent
                  </span>
                  <span className="text-orange-500 font-medium">
                    {student.reminderCount}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Problem Tracker - Full Width */}
          <div className="lg:col-span-2">
            <ProblemTracker studentId={student.id} />
          </div>
        </div>

        {/* Rating Chart and Contest History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RatingChart studentId={student.id} />
          <ContestHistory studentId={student.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;
