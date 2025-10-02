"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type BackButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function BackButton({ className = "", ...props }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`p-2 cursor-pointer sm:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 ${className}`}
      {...props}
    >
      <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
    </button>
  );
}
