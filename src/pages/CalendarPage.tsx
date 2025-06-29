import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatePlanDialog } from "@/components/CreatePlanDialog";
import { useAllContests } from "@/hooks/useAllContests";
import { useAllPastContests } from "@/hooks/useAllPastContests";
import { ContestDetailModal } from "@/components/ContestDetailModal";
import { isSameDay } from "date-fns";
import {
  PlusCircle,
  RotateCw,
  Star,
  StarOff,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";

const siteColors: { [key: string]: string } = {
  codeforces: "#1F8ACB",
  leetcode: "#FFA116",
  codechef: "#6B4F2E",
  atcoder: "#2C2C54",
  hackerrank: "#2EC866",
  hackerearth: "#323754",
  topcoder: "#796EFF",
  other: "#9E9E9E",
};

interface UpcomingContest {
  site: string;
  title: string;
  startTime: number;
  duration: number;
  endTime: number;
  url: string;
}

// Platform logo SVGs and base64 images
const platformLogos: Record<string, React.ReactNode> = {
  leetcode: (
    <span className="flex h-[18px] w-[18px] items-center justify-center mr-1">
      <svg
        width="15"
        height="18"
        viewBox="0 0 95 111"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-w-none"
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
    </span>
  ),
  codeforces: (
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAjVBMVEVHcEwcmdQcmdQcmdQak9Ebl9IbldEZktD82XX82XT812/81m781WoYjs370mHCHCTNWC370mEXi8u7HSTAHCS+HCS8HSUXicu7HST5z1e7HST4zFD4y022HSX4yk23HSUWhcgVhMf3xkGzHib2xDwUgcb2xkL1wzkVgcawHyb2xD31wzkUf8QUgMWxHiamUe3qAAAAL3RSTlMATmz/q////0luJv/u/4glD/+rxP/ibf+R///wieD///+s//+N/7phkrbL8iDY8hvaMEAAAADLSURBVHgBxMm1AcMAEANAhZmZmWPvP16kN1Odaw9/VipTqeAqJn+rlUqNqvlZk3pR1qUgOY1GI5HNFrWVnFS2OtLletmLZ5dFfWVPLAc0DHKk7NmOgeFkSrOBckTMscpyzqIJuqpYLphLL2eWq9XKciF+rtfrGTYs2jJVfq5lh43dPpl2ByVr7+VRTkrWQcnxU+WlKsoz8xSl3UV5lquft5uSQ0yVnzdRqpR3Lx/A82aewNzLF4bvD10BfB2d8wWwdGkyRIRNvxGdVgHKfyOSwlpokQAAAABJRU5ErkJggg=="
      alt="codeforces"
      className="h-[18px] w-[18px] mr-1 inline-block align-middle"
    />
  ),
  codechef: (
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAbFBMVEVYNyJUMRpNJgdJHwBVMx1PKQ5IHQBMJABRLBNWNR9SLhaGcWHFvK3n5NeHc2RrUD21qJnc18nSy7yklYVjRjP7++79/fDt697///SuoJL///Z1Wkj08uVdOySOe2qVhHRdPiqdjX3Uzb+9s6UG9M0gAAAA1UlEQVR4Ad2QxQHDMAxFY6q5QclY3n/GMmeD/Istll6zOBHKGCX3LxdsJZV+h7Sxznu31leXabveD+NEXkHTAd7kVGNsiIgYfcsfMZEiYMwRAyGlIty+0T5K9QYAvW1TXRs5INSx3Xonn013CLFV3JRrXoWYJFft9NxIdIj96rZnw0uFPF2n3Vb7Deq/4KstEKJVu+ebgPFANdlPz2W1roBDq7dhVNRFCFtejj199R1vp9SIdf84BTLGnfmDcDJzCC98W3LHl/pwfOH7gDdP8PIBflG6AAaYETfXpxQdAAAAAElFTkSuQmCC"
      alt="codechef"
      className="h-[18px] w-[18px] mr-1 inline-block align-middle"
    />
  ),
  atcoder: (
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAflBMVEX////o6OjR0dH29vbExMRnZmY0NDTLy8vs7OzW1tatra1HR0d0dHRvb288PDyXl5fl5eXg4OBQUFCjo6NhXl62traPj49ra2v4+PhYWFi/v7+bm5uEhISJiYm5ubl+fn56enr8/PywsLBNSUgdGxkmJSMOCg0AAAAeHB37+/uODyMpAAABZUlEQVR4AYzN0W6EIBCF4bOgK6AWR8RFQFS77db3f8HGhAvTtEm/2z8zB/93Y/gLL8p7xX8LQkLVTfumwbjAFTrqjZL9UPaFHR+ScOGUoaLUSmujJk8q8MvP1o61sTZWbFbJ1ItfL7cCNsWiw7ZBVNHuG0cGHhIqD1eEqIMXKAoUWuQYhoFRwjyGddRx3lhB5RBzVO8aLqjy2d6H9vkYPWF/H3Nshw6IdunjtMY+hhEQTZ3j+vG2doraxzwt89B0M5r6Y8qxfJaRCklhGZolMOnFujzzZfN5B1dCA64TDrDS3tB/Tg7o9OsFQEB3gEoJPEIA+Ho1N9Q6b1OA952DqnBqJ/VC6lPeVp7gGQt5zKwGLAq1AyfNANIHTnYnk7Bx7FLidOhKBoGTYAF8w9VhjMDfDuDg+IEUAC8ZAOz4wWvMVAF+J+Zt2uWl8SrdzKY3MrsipbnBhTsOzgE6BwV3jh/4HmUAADahGi0q8a87AAAAAElFTkSuQmCC"
      alt="atcoder"
      className="h-[18px] w-[18px] mr-1 inline-block align-middle"
    />
  ),
};

// Platform dot background colors
const platformDotColors: Record<string, string> = {
  leetcode: "#FFA116",
  codeforces: "#1F8ACB",
  codechef: "#6B4F2E",
  atcoder: "#2C2C54",
};

// YouTube PCD icon
const youtubeIcon = (
  <img
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJklEQVR4Ae2WpVaFQRSFcaeS4QVwIjTiLbgk7D1w9xeg4FQcOu6acHeXtNnDmsFd7in/WetLI+f7dbYDAFEsAUvgoeAQ5k5iSQFpIH1kkMyQFXJMTsgpwTuc6jlHes2M3qNP71mge7g76DLNg8gygZ1QckGmuSdZJ7Azq8RDCSQTCJGgBCoFBWqVQLegQJcSmPnWIr9oICMXcIr4C4FJJbD9rUX+NtzX+CIQlfVbgS0lcP4jAVNt/UCA7acCZ0oAPxfQdXMLFNUBvpHflvgbAVM7h0B6zrfeD3kB+Ucg/xLKf4biPyLJX3GH9GFUogRSBQUSTSBZEwskQpFs1USyl6E0gRSRJtJPhsnci1B69oVQeqzXzOo9+kmj3juBeDw2BkSxBCyBO+9s03HRLVCoAAAAAElFTkSuQmCC"
    alt="YouTube PCD"
    className="h-[18px] w-[18px] ml-1 inline-block align-middle"
  />
);

// Only these platforms
const platformOptions = [
  { label: "LeetCode", value: "leetcode" },
  { label: "Codeforces", value: "codeforces" },
  { label: "CodeChef", value: "codechef" },
  { label: "AtCoder", value: "atcoder" },
];

const eventTypeOptions = [
  { label: "Course Content", value: "course" },
  { label: "Global Contests", value: "global" },
];

const accentThemes = [
  { name: "Teal", from: "from-teal-400", to: "to-blue-500", color: "#14b8a6" },
  {
    name: "Purple",
    from: "from-purple-500",
    to: "to-pink-500",
    color: "#a21caf",
  },
  {
    name: "Orange",
    from: "from-orange-400",
    to: "to-yellow-500",
    color: "#fb923c",
  },
  {
    name: "Emerald",
    from: "from-emerald-400",
    to: "to-cyan-500",
    color: "#10b981",
  },
];

const CalendarPage = () => {
  const { isDarkMode } = useDarkMode();
  const { data: contests, isLoading, error } = useAllContests();
  const {
    data: pastContests,
    isLoading: isLoadingPast,
    error: errorPast,
  } = useAllPastContests();
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [plannedEvents, setPlannedEvents] = useState<any[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] =
    useState<UpcomingContest | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    platformOptions.map((p) => p.value)
  );
  const [selectedEventTypes, setSelectedEventTypes] = useState(
    Array.from(new Set([...eventTypeOptions.map((e) => e.value), "global"]))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [animateEvents, setAnimateEvents] = useState(false);
  const [accentIdx, setAccentIdx] = useState(0);
  const [starred, setStarred] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<any>(null);

  const baseEvents = useMemo(() => {
    const apiContestEvents = [];
    if (contests) {
      apiContestEvents.push(
        ...contests.map((contest) => {
          const platform = contest.site.toLowerCase().replace(/ /g, "");
          const startDate = new Date(contest.startTime);
          let endDate = new Date(contest.endTime);
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.log(
              `[DEBUG] ${
                contest.title
              }: start=${startDate.toISOString()}, end=${endDate.toISOString()}, duration=${
                (endDate.getTime() - startDate.getTime()) / 1000 / 60
              }min`
            );
          }
          if (
            startDate.getFullYear() === endDate.getFullYear() &&
            startDate.getMonth() === endDate.getMonth() &&
            startDate.getDate() === endDate.getDate()
          ) {
            endDate = new Date(startDate.getTime() + 60 * 1000);
          }
          return {
            title: contest.title,
            start: startDate,
            end: endDate,
            allDay: false,
            display: "block",
            extendedProps: {
              contest: contest,
              platform: platform,
              type: "global",
              isPast: false,
            },
          };
        })
      );
    }
    if (pastContests) {
      apiContestEvents.push(
        ...pastContests.map((contest) => {
          const platform =
            contest.site?.toLowerCase().replace(/ /g, "") || "other";
          const startDate = new Date(contest.startTime || contest.date);
          let endDate = new Date(contest.endTime || contest.date);
          if (
            startDate.getFullYear() === endDate.getFullYear() &&
            startDate.getMonth() === endDate.getMonth() &&
            startDate.getDate() === endDate.getDate()
          ) {
            endDate = new Date(startDate.getTime() + 60 * 1000);
          }
          return {
            title: contest.title,
            start: startDate,
            end: endDate,
            allDay: false,
            display: "block",
            extendedProps: {
              contest: contest,
              platform: platform,
              type: "global",
              isPast: true,
            },
          };
        })
      );
    }
    const courseEvents = plannedEvents.map((e) => ({
      ...e,
      extendedProps: {
        ...e.extendedProps,
        type: "course",
        platform: "other",
      },
    }));
    return [...apiContestEvents, ...courseEvents];
  }, [contests, pastContests, plannedEvents]);

  const filteredEvents = useMemo(() => {
    return baseEvents.filter((event) => {
      const { type, platform } = event.extendedProps;
      const typeMatch = selectedEventTypes.includes(type);
      const platformMatch =
        type === "course" || selectedPlatforms.includes(platform);
      return typeMatch && platformMatch;
    });
  }, [baseEvents, selectedPlatforms, selectedEventTypes]);

  useEffect(() => {
    setAnimateEvents(true);
    const timeout = setTimeout(() => setAnimateEvents(false), 600);
    return () => clearTimeout(timeout);
  }, [filteredEvents]);

  const searchedEvents = useMemo(() => {
    if (!searchTerm.trim()) return filteredEvents;
    return filteredEvents.filter((e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredEvents, searchTerm]);

  const handlePlanSubmit = (newEvents: any[]) => {
    setPlannedEvents((prev) => [...prev, ...newEvents]);
  };

  const handleEventClick = (clickInfo: any) => {
    clickInfo.jsEvent.preventDefault();
    const { extendedProps } = clickInfo.event;
    if (extendedProps?.contest) {
      setSelectedContest(extendedProps.contest);
      setIsDetailModalOpen(true);
    }
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    setIsPlanDialogOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedPlatforms(platformOptions.map((p) => p.value));
    setSelectedEventTypes(
      Array.from(new Set([...eventTypeOptions.map((e) => e.value), "global"]))
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((current) =>
      current.includes(platform)
        ? current.filter((p) => p !== platform)
        : [...current, platform]
    );
  };

  const toggleEventType = (eventType: string) => {
    setSelectedEventTypes((current) =>
      current.includes(eventType)
        ? current.filter((t) => t !== eventType)
        : [...current, eventType]
    );
  };

  const handleStarToggle = (title: string) => {
    setStarred((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isEmpty = !isLoading && !error && searchedEvents.length === 0;

  // Helper: Map date string (YYYY-MM-DD) to contest(s)
  const contestMap = useMemo(() => {
    const map: Record<string, any[]> = {};
    (contests || []).forEach((contest) => {
      const date = new Date(contest.startTime).toISOString().slice(0, 10);
      if (!map[date]) map[date] = [];
      map[date].push({ ...contest, isPast: false });
    });
    (pastContests || []).forEach((contest) => {
      const date = contest.date.slice(0, 10);
      if (!map[date]) map[date] = [];
      map[date].push({ ...contest, isPast: true });
    });
    return map;
  }, [contests, pastContests]);

  // Modal state for selected day/contests
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [modalContests, setModalContests] = useState<any[]>([]);

  // Handler for day click
  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    if (contestMap[dateStr]) {
      setSelectedDay(dateStr);
      setModalContests(contestMap[dateStr]);
      setIsDetailModalOpen(true);
    }
  };

  return (
    <>
      <div className="container mx-auto p-0 md:p-0 lg:p-0 max-w-6xl bg-white border border-slate-200 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-8 pt-8 pb-2 gap-2">
          <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight">
            Contest Calendar
          </h1>
          <div className="flex items-center gap-3">
            {/* Month/Year Navigation */}
            <button
              className="rounded-full bg-slate-100 text-slate-700 w-9 h-9 flex items-center justify-center text-xl hover:bg-slate-200 border border-slate-300 transition"
              onClick={() => calendarRef.current?.getApi().prev()}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="rounded-full bg-slate-100 text-slate-700 w-9 h-9 flex items-center justify-center text-xl hover:bg-slate-200 border border-slate-300 transition"
              onClick={() => calendarRef.current?.getApi().next()}
            >
              <ChevronRight size={20} />
            </button>
            {/* Reset Button */}
            <button
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 ml-2 transition text-base shadow-md"
              onClick={handleResetFilters}
            >
              <span className="font-semibold">Reset</span>
            </button>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl px-8 pt-4 pb-2 shadow-none mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-500 mb-1">
                Contest Platforms + Divisions
              </h3>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((opt) =>
                  selectedPlatforms.includes(opt.value) ? (
                    <span
                      key={opt.value}
                      className="flex items-center bg-blue-50 border border-blue-300 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer gap-1"
                    >
                      {opt.label}
                      <button
                        className="ml-1 text-blue-400 hover:text-blue-700 focus:outline-none"
                        onClick={() => togglePlatform(opt.value)}
                        aria-label={`Remove ${opt.label}`}
                      >
                        ×
                      </button>
                    </span>
                  ) : null
                )}
                {platformOptions
                  .filter((opt) => !selectedPlatforms.includes(opt.value))
                  .map((opt) => (
                    <span
                      key={opt.value}
                      className="flex items-center bg-slate-100 border border-slate-200 text-slate-500 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer gap-1 opacity-60"
                      onClick={() => togglePlatform(opt.value)}
                    >
                      {opt.label}
                    </span>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-500 mb-1">
                Event Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {eventTypeOptions.map((opt) =>
                  selectedEventTypes.includes(opt.value) ? (
                    <span
                      key={opt.value}
                      className="flex items-center bg-blue-50 border border-blue-300 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer gap-1"
                    >
                      {opt.label}
                      <button
                        className="ml-1 text-blue-400 hover:text-blue-700 focus:outline-none"
                        onClick={() => toggleEventType(opt.value)}
                        aria-label={`Remove ${opt.label}`}
                      >
                        ×
                      </button>
                    </span>
                  ) : null
                )}
                {eventTypeOptions
                  .filter((opt) => !selectedEventTypes.includes(opt.value))
                  .map((opt) => (
                    <span
                      key={opt.value}
                      className="flex items-center bg-slate-100 border border-slate-200 text-slate-500 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer gap-1 opacity-60"
                      onClick={() => toggleEventType(opt.value)}
                    >
                      {opt.label}
                    </span>
                  ))}
              </div>
            </div>
            <div className="w-full md:w-auto mt-2 md:mt-0 flex items-center gap-2">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base"
              />
            </div>
          </div>
          {/* Calendar and legend */}
          <div className="rounded-xl overflow-hidden min-h-[320px] bg-white">
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            )}
            {error && (
              <p className="text-red-500 text-sm">Failed to load contests.</p>
            )}
            {isEmpty && (
              <div className="flex flex-col items-center justify-center py-10">
                <img
                  src="/public/placeholder.svg"
                  alt="No events"
                  className="w-20 h-20 mb-2 opacity-70"
                />
                <h2 className="text-base font-bold mb-1 text-muted-foreground">
                  No events found
                </h2>
                <p className="text-xs text-muted-foreground mb-1">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
            {!isLoading && !error && !isEmpty && (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "",
                  center: "title",
                  right: "",
                }}
                height="auto"
                contentHeight={600}
                dayMaxEventRows={5}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                displayEventTime={false}
                events={searchedEvents.map((e) => ({
                  ...e,
                  end: undefined,
                  allDay: true,
                }))}
                eventContent={(arg) => {
                  // Always use purple for background and border, and show logo + name in a single line
                  return (
                    <div
                      style={{
                        background: "rgba(168, 85, 247, 0.15)",
                        border: "1.5px solid #a855f7",
                        borderRadius: "12px",
                        color: "#222",
                        fontWeight: 600,
                        padding: "6px 12px",
                        overflow: "hidden",
                        width: "100%",
                        minWidth: 0,
                        maxWidth: "100%",
                        boxShadow: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: 8,
                        }}
                      >
                        {platformLogos[arg.event.extendedProps?.platform]}
                      </span>
                      <span
                        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {arg.event.title}
                      </span>
                    </div>
                  );
                }}
                dayHeaderClassNames={() =>
                  "text-slate-700 font-bold text-base bg-white"
                }
                dayCellClassNames={(arg) => {
                  if (arg.isToday) {
                    return "bg-blue-200/40 border border-blue-300 text-slate-900 backdrop-blur-[2px] shadow-md";
                  }
                  return "bg-white border border-slate-200 text-slate-900";
                }}
                headerToolbar={{
                  left: "",
                  center: "title",
                  right: "",
                }}
                titleFormat={{ year: "numeric", month: "long" }}
                dayMaxEvents={3}
                themeSystem={undefined}
              />
            )}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-slate-700 text-sm font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#a259ff] inline-block" />
              Global Contest
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#22c55e] inline-block" />
              Ongoing
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#2563eb] inline-block" />
              Upcoming
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#f59e42] inline-block" />
              Internal Contest
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#e0e7ef] border border-slate-400 inline-block" />
              Course Content
            </span>
          </div>
        </div>
        <ContestDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          contest={selectedContest}
        />
      </div>
    </>
  );
};

export default CalendarPage;
