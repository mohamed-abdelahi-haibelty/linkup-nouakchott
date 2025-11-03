import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify";
import { format } from "date-fns";
import { AVATAR_STYLES } from "./constant";
import { customAlphabet } from 'nanoid';
import prisma from "@/lib/db";
import { logError } from "./sentry";
import { Prisma } from "@prisma/client";



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

export function throwError(message: string): never {
  throw new Error(message);
}



const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const nanoid = customAlphabet(ALPHABET, 8);

export async function generateUniqueTicketCode(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const code = nanoid();
    const formattedCode = `TKT-${code.slice(0, 4)}-${code.slice(4, 8)}`;
    
    // Check if exists
    const exists = await prisma.ticket.findUnique({
      where: { code: formattedCode },
    });
    
    if (!exists) {
      return formattedCode;
    }
    
    attempts++;
  }
  
  throw new Error('Failed to generate unique ticket code after 10 attempts');
}

export function getErrorMessage(error : unknown) : string{
  if(error instanceof Error){
    return error.message
  }else {
    return "An unexpected error occurred"
  }
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

export function handlePrismaError(err: unknown) {
  logError(err);
  const message =
    err instanceof Prisma.PrismaClientKnownRequestError
      ? "Database operation failed. Please try again later."
      : "Unexpected error occurred. Please try again.";
  return { success: false, message, data: null }
}

