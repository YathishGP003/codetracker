import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object in Indian Standard Time (IST) as 'MMM dd, yyyy hh:mm A IST'.
 * Example: 'Jun 18, 2025 08:00 PM IST'
 */
export function formatIST(date: Date): string {
  if (!date) return "-";
  // Convert to IST (UTC+5:30)
  const istDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  // Format as 'MMM dd, yyyy hh:mm A IST'
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };
  // Remove seconds and add IST suffix
  return istDate.toLocaleString("en-US", options).replace(",", "") + " IST";
}

export const getRatingColor = (rating: number) => {
  if (rating >= 2100) return "text-red-400";
  if (rating >= 1900) return "text-orange-400";
  if (rating >= 1600) return "text-purple-400";
  if (rating >= 1400) return "text-blue-400";
  if (rating >= 1200) return "text-green-400";
  if (rating > 0) return "text-gray-400";
  return "text-gray-500";
};

export const getRatingBadge = (rating: number) => {
  if (rating >= 3000) return "Legendary Grandmaster";
  if (rating >= 2600) return "International Grandmaster";
  if (rating >= 2400) return "Grandmaster";
  if (rating >= 2300) return "International Master";
  if (rating >= 2100) return "Master";
  if (rating >= 1900) return "Candidate Master";
  if (rating >= 1600) return "Expert";
  if (rating >= 1400) return "Specialist";
  if (rating >= 1200) return "Pupil";
  if (rating > 0) return "Newbie";
  return "Unrated";
};
