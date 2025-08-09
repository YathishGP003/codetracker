import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Info, ChevronLeft, ChevronRight, Code2 } from "lucide-react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";

interface StreakCardProps {
  userKey: string; // unique per user (email or id)
}

type StreakStore = {
  visitedDays: Record<string, boolean>; // yyyy-MM-dd => true
};

const getKey = (userKey: string) => `ctpro_cpsheet_streak_${userKey}`;

function loadStore(userKey: string): StreakStore {
  try {
    const raw = localStorage.getItem(getKey(userKey));
    if (!raw) return { visitedDays: {} };
    const parsed = JSON.parse(raw) as StreakStore;
    return parsed?.visitedDays ? parsed : { visitedDays: {} };
  } catch {
    return { visitedDays: {} };
  }
}

function saveStore(userKey: string, store: StreakStore) {
  localStorage.setItem(getKey(userKey), JSON.stringify(store));
}

function toDateKey(date: Date) {
  // Always normalize to local midnight
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return format(d, "yyyy-MM-dd");
}

function computeCurrentStreak(visitedDays: Record<string, boolean>): number {
  let count = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 3650; i++) {
    const day = addDays(today, -i);
    const key = toDateKey(day);
    if (visitedDays[key]) count += 1;
    else break;
  }
  return count;
}

function computeMaxStreak(visitedDays: Record<string, boolean>): number {
  const keys = Object.keys(visitedDays)
    .filter((k) => visitedDays[k])
    .sort();
  if (keys.length === 0) return 0;
  let best = 1;
  let cur = 1;
  for (let i = 1; i < keys.length; i++) {
    const prev = new Date(keys[i - 1]);
    const curDate = new Date(keys[i]);
    const nextOfPrev = addDays(prev, 1);
    if (isSameDay(nextOfPrev, curDate)) {
      cur += 1;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}

const weekLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const DayDot: React.FC<{ state: "visited" | "missed" | "future" }> =
  // minimal visual primitive for the grid
  ({ state }) => {
    if (state === "visited") {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
          <Flame size={16} />
        </div>
      );
    }
    if (state === "missed") {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center text-base">
          <span role="img" aria-label="missed" className="opacity-80">
            😭
          </span>
        </div>
      );
    }
    return <div className="w-8 h-8 rounded-full bg-slate-800/40" />;
  };

const StreakCard: React.FC<StreakCardProps> = ({ userKey }) => {
  const [store, setStore] = useState<StreakStore>(() => loadStore(userKey));
  const [month, setMonth] = useState<Date>(() => {
    const t = new Date();
    t.setDate(1);
    t.setHours(0, 0, 0, 0);
    return t;
  });

  // Ensure we only record a single time on mount (avoid StrictMode double)
  const recordedRef = useRef(false);
  useEffect(() => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    const next = { ...store };
    const key = toDateKey(new Date());
    if (!next.visitedDays[key]) {
      next.visitedDays = { ...next.visitedDays, [key]: true };
      setStore(next);
      saveStore(userKey, next);
    }
  }, []); // intentionally run once

  const daysInView = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  }, [month]);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const currentStreak = useMemo(
    () => computeCurrentStreak(store.visitedDays),
    [store]
  );
  const maxStreak = useMemo(() => computeMaxStreak(store.visitedDays), [store]);

  return (
    <Card className="bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white text-xl">Monthly Streak</CardTitle>
          <div className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <Info size={16} />
            <span>Visit CP Sheet daily to keep the fire alive</span>
          </div>
        </div>
        <Badge className="bg-amber-500 text-white border-none">Streak</Badge>
      </CardHeader>
      <CardContent>
        {/* Month header */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-slate-700 bg-slate-900"
            onClick={() => setMonth((m) => addMonths(m, -1))}
            title="Previous Month"
          >
            <ChevronLeft />
          </Button>
          <div className="text-lg font-semibold text-white">
            {format(month, "MMMM yyyy")}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-slate-700 bg-slate-900"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            title="Next Month"
          >
            <ChevronRight />
          </Button>
        </div>

        {/* Week labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekLabels.map((w) => (
            <div
              key={w}
              className="text-center text-xs font-semibold text-slate-400"
            >
              {w}
            </div>
          ))}
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysInView.map((day) => {
            const key = toDateKey(day);
            const visited = !!store.visitedDays[key];
            // Determine state: past missed, future, or visited
            let state: "visited" | "missed" | "future" = "future";
            if (visited) state = "visited";
            else if (isBefore(day, today)) state = "missed";

            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <DayDot state={state} />
                <div
                  className={`text-xs ${
                    isSameMonth(day, month)
                      ? "text-slate-400"
                      : "text-slate-600/50"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-3">
            <Flame className="text-orange-400" />
            <div className="text-slate-300 text-sm">Current Streak</div>
            <div className="ml-2 text-white font-bold">{currentStreak}</div>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-3">
            <Code2 className="text-amber-400" />
            <div className="text-slate-300 text-sm">Max Streak</div>
            <div className="ml-2 text-white font-bold">{maxStreak}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCard;
