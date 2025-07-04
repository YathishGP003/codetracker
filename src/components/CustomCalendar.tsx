import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  type: string;
  icon?: React.ReactNode;
  [key: string]: any;
}

interface CustomCalendarProps {
  events: CalendarEvent[];
  month: Date;
  onMonthChange: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMonthChange(addMonths(month, -1))}
            className="rounded-full"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMonthChange(addMonths(month, 1))}
            className="rounded-full"
          >
            <ChevronRight />
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
              className={`min-h-[90px] flex flex-col items-start p-2 rounded-2xl ${
                isCurrentMonth ? "bg-[#E9EAEC]" : "bg-[#E9EAEC] opacity-60"
              } ${isToday ? "border border-blue-400" : ""}`}
            >
              <div className="text-xs font-semibold text-gray-400 mb-1 select-none">
                {day.getDate()}
              </div>
              <div className="flex flex-col gap-1 w-full">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={
                      "flex flex-col rounded-xl bg-white w-full mb-1 last:mb-0 px-3 py-2 cursor-pointer"
                    }
                    style={{ fontSize: "1rem" }}
                    onClick={() => onEventClick && onEventClick(event)}
                  >
                    <div className="font-bold text-black truncate leading-tight">
                      {event.title}
                    </div>
                    {event.description && (
                      <div className="text-xs text-gray-500 truncate leading-tight whitespace-pre-line">
                        {event.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
