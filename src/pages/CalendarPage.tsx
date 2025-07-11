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
  Instagram,
  Youtube,
  FileText,
  Linkedin,
  Mail,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Alert } from "@/components/ui/alert";
import { CustomCalendar } from "@/components/CustomCalendar";
import { format, parseISO } from "date-fns";

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

// Demo events for illustration (replace with real data as needed)
const demoEvents = [
  {
    id: "1",
    date: "2024-09-02",
    title: "Instagram",
    description: "Behind the scenes\nImage + Caption",
    type: "instagram",
    icon: <Instagram size={16} />,
  },
  {
    id: "2",
    date: "2024-09-03",
    title: "Youtube",
    description: "Product Tutorial\nVideo",
    type: "youtube",
    icon: <Youtube size={16} />,
  },
  {
    id: "3",
    date: "2024-09-05",
    title: "Blog",
    description: '"10 Tips for Productiveness"',
    type: "blog",
    icon: <FileText size={16} />,
  },
  {
    id: "4",
    date: "2024-09-11",
    title: "LinkedIn",
    description: "Product announcement",
    type: "linkedin",
    icon: <Linkedin size={16} />,
  },
  {
    id: "5",
    date: "2024-09-12",
    title: "Newsletter",
    description: "Monthly Recap\nEmail Digest",
    type: "newsletter",
    icon: <Mail size={16} />,
  },
  {
    id: "6",
    date: "2024-09-17",
    title: "Instagram",
    description: "Behind the scenes\nImage + Caption",
    type: "instagram",
    icon: <Instagram size={16} />,
  },
];

const getCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const platformIcons: Record<string, React.ReactNode> = {
  codeforces: <Globe size={16} />, // Replace with actual icons if available
  leetcode: <Globe size={16} />, // Replace with actual icons if available
  codechef: <Globe size={16} />, // Replace with actual icons if available
  atcoder: <Globe size={16} />, // Replace with actual icons if available
  // Add more as needed
};

// Map platform/event type to icon and color type for CustomCalendar
const eventTypeIconMap: Record<
  string,
  { type: string; icon: React.ReactNode }
> = {
  instagram: { type: "instagram", icon: <Instagram size={16} /> },
  youtube: { type: "youtube", icon: <Youtube size={16} /> },
  blog: { type: "blog", icon: <FileText size={16} /> },
  linkedin: { type: "linkedin", icon: <Linkedin size={16} /> },
  newsletter: { type: "newsletter", icon: <Mail size={16} /> },
};

function getEventTypeAndIcon(title: string, site: string) {
  // Try to match by site or by title (case-insensitive)
  const key = (site || title || "").toLowerCase();
  if (key.includes("instagram")) return eventTypeIconMap.instagram;
  if (key.includes("youtube")) return eventTypeIconMap.youtube;
  if (key.includes("blog")) return eventTypeIconMap.blog;
  if (key.includes("linkedin")) return eventTypeIconMap.linkedin;
  if (key.includes("newsletter")) return eventTypeIconMap.newsletter;
  // fallback
  return { type: "default", icon: null };
}

const CalendarPage = () => {
  const { isDarkMode } = useDarkMode();
  const {
    data: upcoming,
    isLoading: loadingUpcoming,
    error: errorUpcoming,
  } = useAllContests();
  const {
    data: past,
    isLoading: loadingPast,
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
  const [month, setMonth] = useState(getCurrentMonth());

  // Debugging: Log past contests, events, and current month
  console.log("CalendarPage: past contests", past);

  // Map upcoming and past contests to CustomCalendar event format
  const events = useMemo(() => {
    const mapped: any[] = [];
    if (upcoming) {
      mapped.push(
        ...upcoming.map((contest, idx) => {
          // Use local date string for correct local day
          const date = new Date(contest.startTime).toLocaleDateString("en-CA");
          return {
            id: `upcoming-${idx}`,
            date,
            title: contest.title,
            description: contest.site,
            type: contest.site ? contest.site.toLowerCase() : "other",
            icon: null, // CustomCalendar uses its own logo
            _contest: contest,
          };
        })
      );
    }
    if (past) {
      mapped.push(
        ...past.map((contest, idx) => {
          // Use local date string for correct local day
          const date = new Date(contest.date).toLocaleDateString("en-CA");
          const platform = contest.site ? contest.site.toLowerCase() : "other";
          return {
            id: `past-${idx}`,
            date,
            title: contest.name,
            description: platform.charAt(0).toUpperCase() + platform.slice(1),
            type: platform,
            icon: null,
            _contest: contest,
          };
        })
      );
    }
    // If you have non-contest events, add them here using getEventTypeAndIcon
    // mapped.push(...demoEvents);

    console.log("CalendarPage: events", mapped);
    return mapped;
  }, [upcoming, past]);

  const isLoading = loadingUpcoming || loadingPast;
  const hasError = !!errorUpcoming || !!errorPast;

  const handlePlanSubmit = (newEvents: any[]) => {
    setPlannedEvents((prev) => [...prev, ...newEvents]);
  };

  const handleEventClick = (event: any) => {
    let contest = event._contest || event;
    // Ensure contest has url and site for past contests
    if (!contest.url && event.url) contest.url = event.url;
    if (!contest.site && event.site) contest.site = event.site;
    // Fallback: if still no url, try to find by title and date in upcoming/past
    if (!contest.url) {
      if (upcoming) {
        const found = upcoming.find(
          (c) => c.title === contest.title && c.startTime === contest.startTime
        );
        if (found && found.url) contest.url = found.url;
      }
      if (!contest.url && past) {
        const found = past.find(
          (c) =>
            (c.name === contest.title || c.title === contest.title) &&
            (c.date === contest.date || c.startTime === contest.startTime)
        );
        if (found && found.url) contest.url = found.url;
      }
    }
    setSelectedContest(contest);
    setIsDetailModalOpen(true);
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

  const isEmpty = !isLoading && events.length === 0;

  // Helper: Map date string (YYYY-MM-DD) to contest(s)
  const contestMap = useMemo(() => {
    const map: Record<string, any[]> = {};
    (upcoming || []).forEach((contest) => {
      // Use local date string for correct local day
      const date = new Date(contest.startTime).toLocaleDateString("en-CA");
      if (!map[date]) map[date] = [];
      map[date].push({ ...contest, isPast: false });
    });
    (past || []).forEach((contest) => {
      // Use local date string for correct local day
      const date = new Date(contest.date).toLocaleDateString("en-CA");
      if (!map[date]) map[date] = [];
      map[date].push({ ...contest, isPast: true });
    });
    return map;
  }, [upcoming, past]);

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

  // Log the current month
  console.log("CalendarPage: current month", month);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#F6F5F2] py-10">
      {/* Speech bubble */}
      <div className="w-full flex justify-center mb-4">
        <Alert className="rounded-2xl shadow-lg px-8 py-4 bg-white/90 border border-gray-200 text-2xl font-serif font-semibold text-gray-900 text-center w-fit">
          Contest Calendar
        </Alert>
      </div>
      {/* Error message */}
      {hasError && (
        <div className="flex items-center justify-center min-h-[100px] text-lg text-red-500 mb-4">
          {errorUpcoming?.message ||
            errorPast?.message ||
            "Failed to load contest data. Please try again later."}
        </div>
      )}
      {/* Calendar */}
      {isLoading && !hasError ? (
        <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-500">
          Loading events...
        </div>
      ) : !hasError ? (
        <CustomCalendar
          events={events}
          month={month}
          onMonthChange={setMonth}
          onEventClick={handleEventClick}
        />
      ) : null}
      <ContestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        contest={selectedContest}
      />
    </div>
  );
};

export default CalendarPage;
