import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";
import { AVATAR_STYLES } from "./constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  if (!title) return "event";
  return slugify(title, {
    lower: true, // lowercase
    strict: true, // remove special chars
    locale: "en", // handles accents/transliteration
    trim: true,
  });
}

export function throwError(message: string): never {
  throw new Error(message);
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else {
    return "An unexpected error occurred";
  }
}

export function getFallback(name: string): string {
  if (!name) return "";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase(); // eg. "Mohamed" -> "MO"
  }

  return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
}

export function formatDate(date: Date) {
  return format(date, "dd MMM yyyy");
}

export function formatTime(time: Date) {
  return format(time, "hh:mm a");
}

export function generateRandomAvatar(id: string) {
  const hash = Array.from(id).reduce(
    (value, char) => (value * 31 + char.charCodeAt(0)) >>> 0,
    0,
  );
  const randomStyle = AVATAR_STYLES[hash % AVATAR_STYLES.length];
  const seed = `${id}`;
  const avatarUrl = `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${seed}`;
  return avatarUrl;
}
