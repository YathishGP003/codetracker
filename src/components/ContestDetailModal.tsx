import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Youtube, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import React from "react";

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

const getPlatformStyle = (site: string) => {
  switch (site?.toLowerCase()) {
    case "codeforces":
      return {
        color: "#1F8ACB",
        logo: (
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAjVBMVEVHcEwcmdQcmdQcmdQak9Ebl9IbldEZktD82XX82XT812/81m781WoYjs370mHCHCTNWC370mEXi8u7HSTAHCS+HCS8HSUXicu7HST5z1e7HST4zFD4y022HSX4yk23HSUWhcgVhMf3xkGzHib2xDwUgcb2xkL1wzkVgcawHyb2xD31wzkUf8QUgMWxHiamUe3qAAAAL3RSTlMATmz/q////0luJv/u/4glD/+rxP/ibf+R///wieD///+s//+N/7phkrbL8iDY8hvaMEAAAADLSURBVHgBxMm1AcMAEANAhZmZmWPvP16kN1Odaw9/VipTqeAqJn+rlUqNqvlZk3pR1qUgOY1GI5HNFrWVnFS2OtLletmLZ5dFfWVPLAc0DHKk7NmOgeFkSrOBckTMscpyzqIJuqpYLphLL2eWq9XKciF+rtfrGTYs2jJVfq5lh43dPpl2ByVr7+VRTkrWQcnxU+WlKsoz8xSl3UV5lquft5uSQ0yVnzdRqpR3Lx/A82aewNzLF4bvD10BfB2d8wWwdGkyRIRNvxGdVgHKfyOSwlpokQAAAABJRU5ErkJggg=="
            alt="codeforces"
            className="h-5 w-5 mr-1 inline-block align-middle"
          />
        ),
      };
    case "leetcode":
      return {
        color: "#FFA116",
        logo: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 95 111"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 inline-block align-middle"
          >
            <path
              d="M68.0063 83.0664C70.5 80.5764 74.5366 80.5829 77.0223 83.0809C79.508 85.579 79.5015 89.6226 77.0078 92.1127L65.9346 103.17C55.7187 113.371 39.06 113.519 28.6718 103.513C28.6117 103.456 23.9861 98.9201 8.72653 83.957C-1.42528 74.0029 -2.43665 58.0749 7.11648 47.8464L24.9282 28.7745C34.4095 18.6219 51.887 17.5122 62.7275 26.2789L78.9048 39.362C81.6444 41.5776 82.0723 45.5985 79.8606 48.3429C77.6488 51.0873 73.635 51.5159 70.8954 49.3003L54.7182 36.2173C49.0488 31.6325 39.1314 32.2622 34.2394 37.5006L16.4274 56.5727C11.7767 61.5522 12.2861 69.574 17.6456 74.8292C28.851 85.8169 37.4869 94.2846 37.4969 94.2942C42.8977 99.496 51.6304 99.4184 56.9331 94.1234L68.0063 83.0664Z"
              fill="#FFA116"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M41.1067 72.0014C37.5858 72.0014 34.7314 69.1421 34.7314 65.615C34.7314 62.0879 37.5858 59.2286 41.1067 59.2286H88.1245C91.6454 59.2286 94.4997 62.0879 94.4997 65.615C94.4997 69.1421 91.6454 72.0014 88.1245 72.0014H41.1067Z"
              fill="#B3B3B3"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M49.9118 2.02335C52.3173 -0.55232 56.3517 -0.686894 58.9228 1.72277C61.494 4.13244 61.6284 8.17385 59.2229 10.7495L16.4276 56.5729C11.7768 61.552 12.2861 69.5738 17.6453 74.8292L37.4088 94.2091C39.9249 96.6764 39.968 100.72 37.505 103.24C35.042 105.761 31.0056 105.804 28.4895 103.337L8.72593 83.9567C-1.42529 74.0021 -2.43665 58.0741 7.1169 47.8463L49.9118 2.02335Z"
              fill="black"
            ></path>
          </svg>
        ),
      };
    case "codechef":
      return {
        color: "#6B4F2E",
        logo: (
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAbFBMVEVYNyJUMRpNJgdJHwBVMx1PKQ5IHQBMJABRLBNWNR9SLhaGcWHFvK3n5NeHc2RrUD21qJnc18nSy7yklYVjRjP7++79/fDt697///SuoJL///Z1Wkj08uVdOySOe2qVhHRdPiqdjX3Uzb+9s6UG9M0gAAAA1UlEQVR4Ad2QxQHDMAxFY6q5QclY3n/GMmeD/Istll6zOBHKGCX3LxdsJZV+h7Sxznu31leXabveD+NEXkHTAd7kVGNsiIgYfcsfMZEiYMwRAyGlIty+0T5K9QYAvW1TXRs5INSx3Xonn013CLFV3JRrXoWYJFft9NxIdIj96rZnw0uFPF2n3Vb7Deq/4KstEKJVu+ebgPFANdlPz2W1roBDq7dhVNRFCFtejj199R1vp9SIdf84BTLGnfmDcDJzCC98W3LHl/pwfOH7gDdP8PIBflG6AAaYETfXpxQdAAAAAElFTkSuQmCC"
            alt="codechef"
            className="h-5 w-5 mr-1 inline-block align-middle"
          />
        ),
      };
    default:
      return { color: "#9E9E9E", logo: null };
  }
};

export const ContestDetailModal = ({
  isOpen,
  onClose,
  contest,
}: ContestDetailModalProps) => {
  if (!isOpen || !contest) return null;
  const { color, logo } = getPlatformStyle(contest.site);
  const start = contest.startTime
    ? new Date(contest.startTime)
    : contest.date
    ? new Date(contest.date)
    : null;
  const end = contest.endTime ? new Date(contest.endTime) : null;
  const duration = contest.duration
    ? contest.duration
    : start && end
    ? Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60))
    : null;
  const status = start ? (start > new Date() ? "UPCOMING" : "PAST") : "";
  const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    contest.title + " TLE PCD"
  )}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 bg-white rounded-2xl shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            {logo}
            <a
              href={contest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2D5BFF] font-bold text-base hover:underline flex items-center gap-1"
              style={{ color }}
            >
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
              {start ? start.toLocaleString() : "-"}
            </span>
          </div>
          <div className="flex flex-col bg-[#F7F9FB] rounded-xl p-4 border border-[#E6ECF3]">
            <span className="text-xs text-[#8B98A9] font-bold mb-1 tracking-wide">
              END
            </span>
            <span className="text-[15px] font-bold text-[#1A314B]">
              {end ? end.toLocaleString() : "-"}
            </span>
          </div>
          <div className="flex flex-col bg-[#F7F9FB] rounded-xl p-4 border border-[#E6ECF3]">
            <span className="text-xs text-[#8B98A9] font-bold mb-1 tracking-wide">
              DURATION
            </span>
            <span className="text-[15px] font-bold text-[#1A314B]">
              {duration ? `${duration}h` : "-"}
            </span>
          </div>
          <div className="flex flex-col bg-[#F7F9FB] rounded-xl p-4 border border-[#E6ECF3]">
            <span className="text-xs text-[#8B98A9] font-bold mb-1 tracking-wide">
              STATUS
            </span>
            <span
              className={`text-[15px] font-bold ${
                status === "UPCOMING" ? "text-blue-500" : "text-[#E14B4B]"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
        {/* Video Solution & Virtual Contest Buttons */}
        <div className="px-5 pb-6 pt-2 flex flex-col gap-3">
          {status === "PAST" && (
            <a
              href={contest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#B3D0F7] bg-white text-[#1A314B] font-semibold text-base hover:bg-blue-50 transition"
            >
              <ExternalLink className="h-5 w-5 text-[#2D5BFF]" />
              Join Virtual Contest
            </a>
          )}
          <a
            href={youtubeSearch}
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
