import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * Automatically converts Google Drive share/view/edit URLs or external image links
 * into bulletproof same-origin stream URLs via /api/image-proxy
 */
export function formatImageUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();

  // If already proxied, return as is
  if (trimmed.startsWith("/api/image-proxy")) return trimmed;

  // Convert Google Drive or googleusercontent links via Image Proxy API
  if (trimmed.includes("drive.google.com") || trimmed.includes("googleusercontent.com")) {
    return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}
