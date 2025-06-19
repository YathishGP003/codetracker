import React from "react";
import { format, eachDayOfInterval, subDays, isSameDay } from "date-fns";

interface SubmissionHeatMapProps {
  data: Record<string, number>;
  days: number;
}

const SubmissionHeatMap: React.FC<SubmissionHeatMapProps> = ({
  data,
  days,
}) => {
  const today = new Date();
  const dateInterval = eachDayOfInterval({
    start: subDays(today, days - 1),
    end: today,
  });

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    if (count <= 2) return "bg-green-200 dark:bg-green-900";
    if (count <= 4) return "bg-green-400 dark:bg-green-700";
    if (count <= 6) return "bg-green-600 dark:bg-green-500";
    return "bg-green-800 dark:bg-green-300";
  };

  const getSubmissionCount = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return data[dateStr] || 0;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex flex-col gap-1">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="w-8">Mon</span>
          <div className="grid grid-flow-col gap-1">
            {Array.from({ length: Math.ceil(days / 7) }).map((_, weekIndex) => (
              <div key={weekIndex} className="w-4 h-4" />
            ))}
          </div>
        </div>
        {Array.from({ length: 7 }).map((_, dayIndex) => (
          <div key={dayIndex} className="flex items-center gap-1">
            <span className="w-8 text-xs text-gray-500">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIndex]}
            </span>
            <div className="grid grid-flow-col gap-1">
              {dateInterval
                .filter((date) => date.getDay() === dayIndex)
                .map((date) => {
                  const count = getSubmissionCount(date);
                  return (
                    <div
                      key={date.toISOString()}
                      className={`w-4 h-4 rounded-sm ${getColor(count)}`}
                      title={`${format(
                        date,
                        "MMM d, yyyy"
                      )}: ${count} submissions`}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="text-gray-500">Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="w-4 h-4 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="w-4 h-4 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="w-4 h-4 rounded-sm bg-green-600 dark:bg-green-500" />
          <div className="w-4 h-4 rounded-sm bg-green-800 dark:bg-green-300" />
        </div>
        <span className="text-gray-500">More</span>
      </div>
    </div>
  );
};

export default SubmissionHeatMap;
