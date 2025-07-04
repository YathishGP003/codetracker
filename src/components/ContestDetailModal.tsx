import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Youtube, ExternalLink } from "lucide-react";
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

export const ContestDetailModal = ({
  isOpen,
  onClose,
  contest,
}: ContestDetailModalProps) => {
  if (!contest) return null;

  // Always link to TLE Eliminators YouTube channel
  const youtubeChannelUrl = "https://www.youtube.com/@TLEEliminators";

  const isPast = new Date(contest.endTime) < new Date();
  const status = isPast ? "COMPLETED" : "UPCOMING";
  const statusColor = isPast ? "text-[#E14B4B]" : "text-blue-500";

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`.trim();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 bg-white rounded-2xl shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <a
              href={contest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2D5BFF] font-bold text-base hover:underline flex items-center gap-1"
            >
              <ExternalLink size={18} className="inline-block mr-1" />
              <span className="truncate max-w-[220px]">{contest.title}</span>
            </a>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold focus:outline-none"
          >
            ×
          </button>
        </div>
        {/* Subtitle */}
        <div className="px-5 pt-0 pb-2 text-[15px] text-[#8B98A9] font-medium">
          {contest.site} Contest
        </div>
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 px-5 pb-2">
          <div className="flex flex-col bg-[#F7F9FB] rounded-xl p-4 border border-[#E6ECF3]">
            <span className="text-xs text-[#8B98A9] font-bold mb-1 tracking-wide">
              START
            </span>
            <span className="text-[15px] font-bold text-[#1A314B]">
              {format(new Date(contest.startTime), "PP p")}
            </span>
          </div>
          <div className="flex flex-col bg-[#F7F9FB] rounded-xl p-4 border border-[#E6ECF3]">
            <span className="text-xs text-[#8B98A9] font-bold mb-1 tracking-wide">
              END
            </span>
            <span className="text-[15px] font-bold text-[#1A314B]">
              {format(new Date(contest.endTime), "PP p")}
            </span>
          </div>
          <div className="flex flex-col bg-[#F7F9FB] rounded-xl p-4 border border-[#E6ECF3]">
            <span className="text-xs text-[#8B98A9] font-bold mb-1 tracking-wide">
              DURATION
            </span>
            <span className="text-[15px] font-bold text-[#1A314B]">
              {formatDuration(contest.duration)}
            </span>
          </div>
          <div className="flex flex-col bg-[#F7F9FB] rounded-xl p-4 border border-[#E6ECF3]">
            <span className="text-xs text-[#8B98A9] font-bold mb-1 tracking-wide">
              STATUS
            </span>
            <span className={`text-[15px] font-bold ${statusColor}`}>
              {status}
            </span>
          </div>
        </div>
        {/* Video Solution Button */}
        <div className="px-5 pb-6 pt-2">
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#B3D0F7] bg-[#F5FAFF] text-[#1A314B] font-semibold text-base hover:bg-blue-50 transition"
          >
            <Youtube className="h-5 w-5 text-[#E14B4B]" />
            Video Solution
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
