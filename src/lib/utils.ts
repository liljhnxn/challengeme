import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shorten wallet address for display, e.g. 0x1234...5678
 */
export function shortenAddress(address?: string): string {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format a unix timestamp in seconds to a human-readable string
 */
export function formatTimestamp(timestampInSeconds: number | bigint): string {
  const ts = Number(timestampInSeconds) * 1000;
  if (!ts || isNaN(ts)) return "N/A";
  const date = new Date(ts);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface TimeRemaining {
  isExpired: boolean;
  text: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculate countdown and time remaining relative to now
 */
export function calculateTimeRemaining(deadlineSeconds: number | bigint, currentTimestampSec: number): TimeRemaining {
  const deadline = Number(deadlineSeconds);
  const diff = deadline - currentTimestampSec;

  if (diff <= 0) {
    const overdueSeconds = Math.abs(diff);
    const overdueHours = Math.floor(overdueSeconds / 3600);
    const overdueDays = Math.floor(overdueHours / 24);
    
    let text = "Expired";
    if (overdueDays > 0) {
      text = `Expired ${overdueDays}d ago`;
    } else if (overdueHours > 0) {
      text = `Expired ${overdueHours}h ago`;
    } else {
      text = `Expired just now`;
    }

    return {
      isExpired: true,
      text,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(diff / (3600 * 24));
  const hours = Math.floor((diff % (3600 * 24)) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  let text = "";
  if (days > 0) {
    text = `${days}d ${hours}h left`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes}m left`;
  } else if (minutes > 0) {
    text = `${minutes}m ${seconds}s left`;
  } else {
    text = `${seconds}s left`;
  }

  return {
    isExpired: false,
    text,
    days,
    hours,
    minutes,
    seconds,
  };
}

