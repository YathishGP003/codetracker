import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";

interface CalendarEvent {
  id: string;
  date: string; // ISO string (YYYY-MM-DD)
  title: string;
  description?: string;
  type: string; // platform: codeforces, leetcode, codechef, atcoder, etc.
  icon?: React.ReactNode;
  [key: string]: any;
}

interface CustomCalendarProps {
  events: CalendarEvent[];
  month: Date;
  onMonthChange: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

// Platform color and logo mapping
const platformStyles: Record<
  string,
  { bg: string; border: string; text: string; logo: React.ReactNode }
> = {
  codeforces: {
    bg: "bg-[#EAF3FB]",
    border: "border-[#1F8ACB]",
    text: "text-[#1F8ACB]",
    logo: (
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAjVBMVEVHcEwcmdQcmdQcmdQak9Ebl9IbldEZktD82XX82XT812/81m781WoYjs370mHCHCTNWC370mEXi8u7HSTAHCS+HCS8HSUXicu7HST5z1e7HST4zFD4y022HSX4yk23HSUWhcgVhMf3xkGzHib2xDwUgcb2xkL1wzkVgcawHyb2xD31wzkUf8QUgMWxHiamUe3qAAAAL3RSTlMATmz/q////0luJv/u/4glD/+rxP/ibf+R///wieD///+s//+N/7phkrbL8iDY8hvaMEAAAADLSURBVHgBxMm1AcMAEANAhZmZmWPvP16kN1Odaw9/VipTqeAqJn+rlUqNqvlZk3pR1qUgOY1GI5HNFrWVnFS2OtLletmLZ5dFfWVPLAc0DHKk7NmOgeFkSrOBckTMscpyzqIJuqpYLphLL2eWq9XKciF+rtfrGTYs2jJVfq5lh43dPpl2ByVr7+VRTkrWQcnxU+WlKsoz8xSl3UV5lquft5uSQ0yVnzdRqpR3Lx/A82aewNzLF4bvD10BfB2d8wWwdGkyRIRNvxGdVgHKfyOSwlpokQAAAABJRU5ErkJggg=="
        alt="codeforces"
        className="h-4 w-4 mr-1 inline-block align-middle"
      />
    ),
  },
  leetcode: {
    bg: "bg-[#FFF7E6]",
    border: "border-[#FFA116]",
    text: "text-[#FFA116]",
    logo: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 95 111"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1 inline-block align-middle"
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
  },
  codechef: {
    bg: "bg-[#F7F3ED]",
    border: "border-[#6B4F2E]",
    text: "text-[#6B4F2E]",
    logo: (
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAbFBMVEVYNyJUMRpNJgdJHwBVMx1PKQ5IHQBMJABRLBNWNR9SLhaGcWHFvK3n5NeHc2RrUD21qJnc18nSy7yklYVjRjP7++79/fDt697///SuoJL///Z1Wkj08uVdOySOe2qVhHRdPiqdjX3Uzb+9s6UG9M0gAAAA1UlEQVR4Ad2QxQHDMAxFY6q5QclY3n/GMmeD/Istll6zOBHKGCX3LxdsJZV+h7Sxznu31leXabveD+NEXkHTAd7kVGNsiIgYfcsfMZEiYMwRAyGlIty+0T5K9QYAvW1TXRs5INSx3Xonn013CLFV3JRrXoWYJFft9NxIdIj96rZnw0uFPF2n3Vb7Deq/4KstEKJVu+ebgPFANdlPz2W1roBDq7dhVNRFCFtejj199R1vp9SIdf84BTLGnfmDcDJzCC98W3LHl/pwfOH7gDdP8PIBflG6AAaYETfXpxQdAAAAAElFTkSuQmCC"
        alt="codechef"
        className="h-4 w-4 mr-1 inline-block align-middle"
      />
    ),
  },
  atcoder: {
    bg: "bg-[#F2F2F7]",
    border: "border-[#2C2C54]",
    text: "text-[#2C2C54]",
    logo: (
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAflBMVEX////o6OjR0dH29vbExMRnZmY0NDTLy8vs7OzW1tatra1HR0d0dHRvb288PDyXl5fl5eXg4OBQUFCjo6NhXl62traPj49ra2v4+PhYWFi/v7+bm5uEhISJiYm5ubl+fn56enr8/PywsLBNSUgdGxkmJSMOCg0AAAAeHB37+/uODyMpAAABZUlEQVR4AYzN0W6EIBCF4bOgK6AWR8RFQFS77db3f8HGhAvTtEm/2z8zB/93Y/gLL8p7xX8LQkLVTfumwbjAFTrqjZL9UPaFHR+ScOGUoaLUSmujJk8q8MvP1o61sTZWbFbJ1ItfL7cCNsWiw7ZBVNHuG0cGHhIqD1eEqIMXKAoUWuQYhoFRwjyGddRx3lhB5RBzVO8aLqjy2d6H9vkYPWF/H3Nshw6IdunjtMY+hhEQTZ3j+vG2doraxzwt89B0M5r6Y8qxfJaRCklhGZolMOnFujzzZfN5B1dCA64TDrDS3tB/Tg7o9OsFQEB3gEoJPEIA+Ho1N9Q6b1OA952DqnBqJ/VC6lPeVp7gGQt5zKwGLAq1AyfNANIHTnYnk7Bx7FLidOhKBoGTYAF8w9VhjMDfDuDg+IEUAC8ZAOz4wWvMVAF+J+Zt2uWl8SrdzKY3MrsipbnBhTsOzgE6BwV3jh/4HmUAADahGi0q8a87AAAAAElFTkSuQmCC"
        alt="atcoder"
        className="h-4 w-4 mr-1 inline-block align-middle"
      />
    ),
  },
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  events,
  month,
  onMonthChange,
  onEventClick,
}) => {
  // Map events by date for quick lookup
  const eventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const event of events) {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    }
    console.log("CustomCalendar: eventMap", map);
    return map;
  }, [events]);

  // Calculate grid days
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    days.push(d);
  }

  // Handler for Today button
  const handleToday = () => {
    const today = new Date();
    onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Render
  return (
    <div className="rounded-3xl bg-[#F6F5F2] p-6 border border-gray-100">
      {/* Header: Month navigation */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold font-serif text-gray-900 select-none text-left">
            {format(month, "MMMM yyyy")}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleToday}
            className="rounded-full border-[#D6E6FB] bg-[#0A1121] hover:bg-[#1A2233] border-2 transition-colors"
            title="Go to Today"
          >
            <CalendarIcon size={18} className="text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMonthChange(addMonths(month, -1))}
            className="rounded-full border-2 border-[#D6E6FB] group bg-white hover:bg-[#EAF4FF] transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="text-[#0A1121] group-hover:text-[#2563eb] transition-colors" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMonthChange(addMonths(month, 1))}
            className="rounded-full border-2 border-[#D6E6FB] group bg-white hover:bg-[#EAF4FF] transition-colors"
            title="Next Month"
          >
            <ChevronRight className="text-[#0A1121] group-hover:text-[#2563eb] transition-colors" />
          </Button>
        </div>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 mb-2 px-1">
        {weekDays.map((wd) => (
          <div
            key={wd}
            className="text-left text-base font-bold text-gray-500 pl-2"
          >
            {wd}
          </div>
        ))}
      </div>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const isCurrentMonth = isSameMonth(day, month);
          const isToday = isSameDay(day, new Date());
          const dayEvents = eventMap[dateStr] || [];
          return (
            <div
              key={dateStr}
              className={`w-[170px] h-[110px] min-h-0 flex flex-col items-start p-2 rounded-2xl transition-all duration-150 ${
                isCurrentMonth ? "bg-[#E9EAEC]" : "bg-[#E9EAEC] opacity-60"
              } ${
                isToday ? "border border-blue-400" : "border border-transparent"
              }`}
              style={{ boxSizing: "border-box" }}
            >
              <div className="text-xs font-semibold text-gray-400 mb-1 select-none">
                {day.getDate()}
              </div>
              {/* Event list: always scrollable if overflow */}
              <div className="flex flex-col w-full gap-1 overflow-y-auto max-h-[80px]">
                {dayEvents.map((event, idx) => {
                  const platform = event.type?.toLowerCase();
                  const style = platformStyles[platform] || {
                    bg: "bg-white",
                    border: "border-gray-200",
                    text: "text-gray-700",
                    logo: null,
                  };
                  // Only fade if contest is before today
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const faded = eventDate < today ? "opacity-80" : "";
                  return (
                    <div
                      key={event.id}
                      className={`flex items-center ${style.bg} ${style.border} border w-full px-1.5 py-0.5 cursor-pointer min-h-0 rounded-md transition-colors duration-100 hover:bg-gray-100/70 ${faded}`}
                      style={{
                        fontSize: "0.85rem",
                        minHeight: "0",
                        lineHeight: 1.1,
                        borderWidth: 1,
                      }}
                      onClick={() => onEventClick && onEventClick(event)}
                      title={event.title}
                    >
                      <span className="flex items-center mr-1">
                        {style.logo}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`truncate leading-tight font-medium ${style.text}`}
                          style={{ fontSize: "0.97em" }}
                        >
                          {event.title}
                        </div>
                        {event.description && (
                          <div
                            className="text-xs text-gray-500 truncate leading-tight whitespace-pre-line"
                            style={{ fontSize: "0.72em" }}
                          >
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
