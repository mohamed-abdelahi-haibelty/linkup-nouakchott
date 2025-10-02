import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify";
import { format } from "date-fns";
import { AVATAR_STYLES } from "./constant";

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

export function getFallback(name : string) : string{
  if(!name) return ''

  const parts = name.trim().split(' ')
  
  if(parts.length === 1){
    return parts[0].slice(0, 2).toUpperCase()// eg. "Mohamed" -> "MO"
  }

  return (parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase())
}

export function formatDate(date : Date){
  return format(date, "dd MMM yyyy")
}

export function formatTime(time : Date){
  return format(time, "hh:mm a")
}

export function generateRandomAvatar(id : string){
   const randomStyle = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
   const seed = `${id}`;
   const avatarUrl = `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${seed}`;
   return avatarUrl
}

