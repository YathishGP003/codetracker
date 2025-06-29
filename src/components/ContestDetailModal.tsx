import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Youtube,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface UpcomingContest {
  site: string;
  title: string;
  startTime: number;
  duration: number;
  endTime: number;
  url: string;
}

interface ContestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contest: UpcomingContest | null;
}

const DetailRow = ({ icon, label, value }: any) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
    <span className="text-sm font-semibold">{value}</span>
  </div>
);

export const ContestDetailModal = ({
  isOpen,
  onClose,
  contest,
}: ContestDetailModalProps) => {
  if (!contest) return null;

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=tle-eliminators+${encodeURIComponent(
    contest.title
  )}`;

  const isPast = new Date(contest.endTime) < new Date();
  const status = isPast ? "COMPLETED" : "UPCOMING";
  const statusColor = isPast ? "text-red-500" : "text-blue-500";

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`.trim();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 bg-white rounded-2xl shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 bg-slate-50 rounded-t-2xl border-b border-slate-100">
          <div className="flex items-center gap-2 text-lg font-bold text-blue-700">
            <a
              href={contest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              <ExternalLink size={18} className="inline-block mr-1" />
            </a>
            <span className="truncate max-w-[220px]">{contest.title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold focus:outline-none"
          >
            ×
          </button>
        </div>
        {/* Subtitle */}
        <div className="px-6 pt-2 pb-1 text-sm text-slate-500 font-semibold border-b border-slate-100">
          {contest.site}
        </div>
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4 px-6 py-5">
          <div className="flex flex-col bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold mb-1">
              START
            </span>
            <span className="text-sm font-bold text-slate-700">
              {format(new Date(contest.startTime), "PP p")}
            </span>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold mb-1">
              END
            </span>
            <span className="text-sm font-bold text-slate-700">
              {format(new Date(contest.endTime), "PP p")}
            </span>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold mb-1">
              DURATION
            </span>
            <span className="text-sm font-bold text-slate-700">
              {formatDuration(contest.duration)}
            </span>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold mb-1">
              STATUS
            </span>
            <span className={`text-sm font-bold ${statusColor}`}>{status}</span>
          </div>
        </div>
        {/* Video Solution Button */}
        <div className="px-6 pb-6">
          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full mt-2 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-base hover:bg-blue-100 transition"
          >
            <Youtube className="h-5 w-5 text-red-500" />
            Video Solution
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
