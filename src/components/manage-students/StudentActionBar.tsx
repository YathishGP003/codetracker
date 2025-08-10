import React from "react";
import { Search, Download, Upload, Users } from "lucide-react";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface StudentActionBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSyncAll: () => void;
  onExportCSV: () => void;
  isSyncing: boolean;
}

export const StudentActionBar = ({
  searchTerm,
  setSearchTerm,
  onSyncAll,
  onExportCSV,
  isSyncing,
}: StudentActionBarProps) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`rounded-2xl p-6 mb-8 ${
        isDarkMode ? "bg-slate-900/60" : "bg-white"
      } border ${
        isDarkMode ? "border-slate-800" : "border-gray-200"
      } shadow-xl`}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-2xl w-full">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Search students by name or Codeforces handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
                  : "bg-white"
              } pl-11 pr-4 h-12 rounded-full`}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onExportCSV}
            className="h-10 px-4 rounded-full bg-emerald-600 text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-emerald-700"
          >
            <Download size={16} /> CSV
          </button>

          <button
            onClick={onSyncAll}
            disabled={isSyncing}
            className="h-10 px-4 rounded-full bg-sky-600 text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-sky-700 disabled:opacity-60"
          >
            <Users size={16} /> {isSyncing ? "Syncing…" : "Sync All"}
          </button>

          <AddStudentDialog />
        </div>
      </div>
    </div>
  );
};
