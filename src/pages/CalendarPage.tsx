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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

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

const platformOptions = [
  { label: "LeetCode", value: "leetcode" },
  { label: "Codeforces", value: "codeforces" },
  { label: "CodeChef", value: "codechef" },
  { label: "AtCoder", value: "atcoder" },
  { label: "HackerRank", value: "hackerrank" },
  { label: "HackerEarth", value: "hackerearth" },
  { label: "TopCoder", value: "topcoder" },
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
    eventTypeOptions.map((e) => e.value)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [animateEvents, setAnimateEvents] = useState(false);
  const [accentIdx, setAccentIdx] = useState(0);
  const [starred, setStarred] = useState<string[]>([]);
  const calendarRef = useRef<any>(null);

  const baseEvents = useMemo(() => {
    const apiContestEvents = contests
      ? contests.map((contest) => {
          const platform = contest.site.toLowerCase().replace(/ /g, "");
          const siteColor = siteColors[platform] || siteColors.other;
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
            backgroundColor: siteColor,
            borderColor: siteColor,
            textColor: "#fff",
            extendedProps: {
              contest: contest,
              platform: platform,
              type: "global",
            },
          };
        })
      : [];

    const courseEvents = plannedEvents.map((e) => ({
      ...e,
      extendedProps: {
        ...e.extendedProps,
        type: "course",
        platform: "other",
      },
    }));

    return [...apiContestEvents, ...courseEvents];
  }, [contests, plannedEvents]);

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

  const handleResetFilters = () => {
    setSelectedPlatforms(platformOptions.map((p) => p.value));
    setSelectedEventTypes(eventTypeOptions.map((e) => e.value));
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

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div
        className={`flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 sticky top-0 z-20 bg-background/80 backdrop-blur-xl rounded-b-2xl shadow-md`}
      >
        <h1
          className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg`}
        >
          Course & Contest Calendar
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            className="flex items-center gap-2 px-4 py-2 font-semibold text-base"
            onClick={() => alert("Google Calendar integration coming soon!")}
          >
            <CalendarPlus className="h-5 w-5" /> Connect Google Calendar
          </Button>
          <Button onClick={() => setIsPlanDialogOpen(true)} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Create a Plan
          </Button>
          <Button onClick={handleResetFilters}>
            <RotateCw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 rounded-xl border border-muted bg-background/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all text-base"
        />
      </div>

      <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 mb-6">
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              Contest Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((opt) => (
                <Badge
                  key={opt.value}
                  variant={
                    selectedPlatforms.includes(opt.value)
                      ? "default"
                      : "secondary"
                  }
                  className="cursor-pointer"
                  onClick={() => togglePlatform(opt.value)}
                >
                  {opt.label}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              Event Types
            </h3>
            <div className="flex flex-wrap gap-2">
              {eventTypeOptions.map((opt) => (
                <Badge
                  key={opt.value}
                  variant={
                    selectedEventTypes.includes(opt.value)
                      ? "default"
                      : "secondary"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleEventType(opt.value)}
                >
                  {opt.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden min-h-[400px]">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          )}
          {error && <p className="text-red-500">Failed to load contests.</p>}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-16">
              <img
                src="/public/placeholder.svg"
                alt="No events"
                className="w-32 h-32 mb-4 opacity-70"
              />
              <h2 className="text-xl font-bold mb-2 text-muted-foreground">
                No events found
              </h2>
              <p className="text-muted-foreground mb-2">
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
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={searchedEvents}
              eventClick={handleEventClick}
              displayEventTime={false}
              eventContent={(arg) => {
                const bg = arg.event.backgroundColor || "#888";
                const text = arg.event.title;
                const isStarred = starred.includes(text);
                const contest = arg.event.extendedProps?.contest;
                return (
                  <Tooltip
                    content={
                      <div className="p-2 min-w-[180px]">
                        <div className="font-bold mb-1 flex items-center gap-2">
                          {text}
                        </div>
                        <div className="text-xs mb-1">
                          {arg.event.extendedProps?.platform
                            ?.charAt(0)
                            .toUpperCase() +
                            arg.event.extendedProps?.platform?.slice(1)}
                        </div>
                        <div className="text-xs mb-1">
                          {contest &&
                            new Date(contest.startTime).toLocaleString()}{" "}
                          -{" "}
                          {contest &&
                            new Date(contest.endTime).toLocaleString()}
                        </div>
                        {contest?.url && (
                          <a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 underline"
                          >
                            View Contest
                          </a>
                        )}
                      </div>
                    }
                  >
                    <div
                      style={{
                        background: bg,
                        color: "#fff",
                        borderRadius: "9999px",
                        padding: "2px 12px 2px 8px",
                        fontWeight: 600,
                        fontSize: "0.97em",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        boxShadow: isStarred
                          ? "0 0 0 2px gold, 0 2px 8px rgba(0,0,0,0.10)"
                          : "0 2px 8px rgba(0,0,0,0.10)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5em",
                        cursor: "pointer",
                        transform: animateEvents ? "scale(1.08)" : "scale(1)",
                        transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
                        position: "relative",
                      }}
                      title={text}
                      className="calendar-event-pill group hover:shadow-xl hover:scale-105 transition-all"
                    >
                      <span className="truncate">{text}</span>
                      <button
                        className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-all"
                        style={{ lineHeight: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarToggle(text);
                        }}
                        title={isStarred ? "Unstar" : "Star"}
                        tabIndex={-1}
                      >
                        {isStarred ? (
                          <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        ) : (
                          <StarOff className="w-4 h-4 text-white/70" />
                        )}
                      </button>
                    </div>
                  </Tooltip>
                );
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-card border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Legend</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {Object.entries(siteColors).map(([site, color]) => (
            <div key={site} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-sm font-medium capitalize">
                {site.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <CreatePlanDialog
        isOpen={isPlanDialogOpen}
        onClose={() => setIsPlanDialogOpen(false)}
        onSubmit={handlePlanSubmit}
        pastContests={pastContests || []}
        isLoading={isLoadingPast}
        error={errorPast !== null}
      />
      <ContestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        contest={selectedContest}
      />
    </div>
  );
};

export default CalendarPage;
