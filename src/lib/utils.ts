import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string): string {
  if (!title) return "event";
  return slugify(title, {
    lower: true,       // lowercase
    strict: true,      // remove special chars
    locale: "en",      // handles accents/transliteration
    trim: true,
  });
}

