import React from "react";
import {
  Edit,
  Trash2,
  Clock,
  Eye,
  Mail,
  Play,
  ShieldCheck,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface Student {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastUpdated: string;
  isActive: boolean;
  reminderCount: number;
  emailEnabled: boolean;
  lastSubmissionDate: string | null;
}

interface StudentTableRowProps {
  student: Student;
  isSelected: boolean;
  onSelect: (studentId: string) => void;
  onSync: (studentId: string, handle: string) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  isSyncing: boolean;
}

export const StudentTableRow = ({
  student,
  isSelected,
  onSelect,
  onSync,
  onEdit,
  onDelete,
  isSyncing,
}: StudentTableRowProps) => {
  const { isDarkMode } = useDarkMode();

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return "text-red-500";
    if (rating >= 2100) return "text-orange-500";
    if (rating >= 1900) return "text-violet-500";
    if (rating >= 1600) return "text-blue-500";
    if (rating >= 1400) return "text-cyan-500";
    if (rating >= 1200) return "text-green-500";
    return "text-gray-500";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 2400) return "International Grandmaster";
    if (rating >= 2300) return "Grandmaster";
    if (rating >= 2100) return "International Master";
    if (rating >= 1900) return "Master";
    if (rating >= 1600) return "Candidate Master";
    if (rating >= 1400) return "Expert";
    if (rating >= 1200) return "Specialist";
    if (rating >= 800) return "Pupil";
    return "Newbie";
  };

  const avatarBg = isDarkMode ? "bg-emerald-500" : "bg-emerald-600";

  return (
    <TableRow
      className={`${isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-gray-50"}`}
    >
      <TableCell className="w-12">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(student.id)}
          className="rounded"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold shadow-md`}
          >
            {student.name?.[0]?.toUpperCase() || "S"}
          </div>
          <div>
            <div
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.name}
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
      </TableCell>
      <TableCell>
        <span
          className={`font-mono font-medium inline-flex items-center gap-2 ${
            isDarkMode ? "text-slate-200" : "text-gray-700"
          }`}
        >
          <ShieldCheck size={14} className="text-sky-500" />
          {student.codeforcesHandle}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className={`font-bold ${getRatingColor(student.currentRating)}`}
          >
            {student.currentRating || 0}
          </span>
          {student.currentRating > 0 && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode
                  ? "bg-slate-800 text-slate-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {getRatingBadge(student.currentRating)}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className={`font-bold ${getRatingColor(student.maxRating)}`}>
          {student.maxRating || 0}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            student.isActive
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-500/15 text-rose-700 dark:text-rose-400"
          }`}
        >
          <Play size={12} /> {student.isActive ? "Active" : "Inactive"}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={`text-sm inline-flex items-center gap-1 ${
            isDarkMode ? "text-slate-400" : "text-gray-500"
          }`}
        >
          <Clock size={14} />{" "}
          {student.lastUpdated
            ? new Date(student.lastUpdated).toLocaleDateString()
            : "Never"}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onSync(student.id, student.codeforcesHandle)}
            disabled={isSyncing}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60"
            title="Sync"
          >
            <Play size={16} />
          </button>
          <button
            onClick={() => onEdit(student)}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Student</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {student.name}? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => onDelete(student.id)}
                >
                  Delete Student
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};
