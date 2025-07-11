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
