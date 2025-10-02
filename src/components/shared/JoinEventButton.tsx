"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface JoinEventButtonProps {
  eventId: string;
  isJoined?: boolean;
  className?: string;
  maxCapacity?: number;
  participantCount?: number;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
  onJoin?: (eventId: string) => Promise<void>;
  onLeave?: (eventId: string) => Promise<void>;
}

export function JoinEventButton({
  eventId,
  isJoined = false,
  participantCount = 0,
  maxCapacity,
  className,
  size = "default",
  variant = "default",
  disabled = false,
  onJoin,
}: JoinEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [joined, setJoined] = useState(isJoined);
  const isFull = maxCapacity ? participantCount >= maxCapacity : false;
  const isDisabled = disabled || isFull;

  async function handleJoinEvent() {
    if (isDisabled || isLoading) return;

    setIsLoading(true);
    try {
      await onJoin?.(eventId);
      setJoined(true);
    } catch (err) {
      console.error(" Join error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function getButtonText() {
    if (isLoading) return "Joining...";
    if (joined) return "Joined";
    if (isFull) return "Event Full";
    return "Join Event";
  }

  function getButtonVariant() {
    if (joined) return "outline";
    return variant;
  }

  return (
    <Button
      onClick={handleJoinEvent}
      disabled={isDisabled || isLoading}
      variant={getButtonVariant()}
      size={size}
      className={cn(
        "relative overflow-hidden transition-all p-6  duration-300 group",
        // Default styling
        !joined && !isDisabled && "hover:scale-[1.02] active:scale-[0.98]",
        // Joined state
        joined &&
          "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20",
        // Full state
        isFull && "opacity-60 cursor-not-allowed",
        // Loading state
        isLoading && "cursor-wait",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isJoined ? (
          <Check className="w-4 h-4" />
        ) : (
          <Users className="w-4 h-4 " />
        )}
        <span className="font-medium">{getButtonText()}</span>

        {participantCount > 0 && (
          <span className="text-xs opacity-75">
            ({participantCount} {maxCapacity ? `/${maxCapacity}` : ""})
          </span>
        )}

        {/* Subtle animation overlay */}
        {!joined && !isDisabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        )}
      </div>
    </Button>
  );
}

// Preset variants for common use cases
export function JoinEventButtonLarge(
  props: Omit<JoinEventButtonProps, "size">
) {
  return (
    <JoinEventButton {...props} size="lg" className="px-8 h-12 text-base" />
  );
}

export function JoinEventButtonCompact(
  props: Omit<JoinEventButtonProps, "size" | "variant">
) {
  return (
    <JoinEventButton {...props} size="sm" variant="outline" className="px-4" />
  );
}
