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
  const status = isPast ? "Completed" : "Upcoming";
  const StatusIcon = isPast ? CheckCircle : AlertCircle;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-card/80 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <a href={contest.url} target="_blank">
              <ExternalLink size={20} />
            </a>
            {contest.title}
          </DialogTitle>
          <DialogDescription>{contest.site}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <DetailRow
            icon={<Calendar size={16} />}
            label="Start"
            value={format(new Date(contest.startTime), "PPpp")}
          />
          <DetailRow
            icon={<Calendar size={16} />}
            label="End"
            value={format(new Date(contest.endTime), "PPpp")}
          />
          <DetailRow
            icon={<Clock size={16} />}
            label="Duration"
            value={formatDuration(contest.duration)}
          />
          <DetailRow
            icon={<StatusIcon size={16} />}
            label="Status"
            value={status}
          />
        </div>
        <Button asChild className="w-full">
          <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer">
            <Youtube className="mr-2 h-4 w-4" />
            Video Solution
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
