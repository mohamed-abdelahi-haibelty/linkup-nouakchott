"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GlobalLoaderProps {
  isLoading?: boolean;
  message?: string;
  variant?: "default" | "minimal" | "celebration";
  className?: string;
}

export function GlobalLoader({
  isLoading = true,
  message = "Loading your event experience...",
  variant = "default",
  className,
}: GlobalLoaderProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-6 loader-fade-in">
        {/* Main Loader Animation */}
        {variant === "default" && (
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-muted rounded-full loader-spin">
              <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"></div>
            </div>

            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-accent rounded-full loader-pulse"></div>
            </div>

            {/* Celebration particles */}
            <div className="absolute -inset-4">
              <div
                className="absolute top-0 left-1/2 w-1 h-1 bg-primary rounded-full loader-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute top-1/2 right-0 w-1 h-1 bg-accent rounded-full loader-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full loader-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="absolute top-1/2 left-0 w-1 h-1 bg-accent rounded-full loader-bounce"
                style={{ animationDelay: "0.6s" }}
              ></div>
            </div>
          </div>
        )}

        {variant === "minimal" && (
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-primary rounded-full loader-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 bg-accent rounded-full loader-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-primary rounded-full loader-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        )}

        {variant === "celebration" && (
          <div className="relative">
            {/* Main event icon */}
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center loader-pulse">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -inset-8">
              <div
                className="absolute top-2 left-4 w-2 h-2 bg-accent rounded-full loader-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute top-4 right-2 w-1.5 h-1.5 bg-primary rounded-full loader-bounce"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="absolute bottom-2 left-2 w-2 h-2 bg-accent rounded-full loader-bounce"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-primary rounded-full loader-bounce"
                style={{ animationDelay: "0.9s" }}
              ></div>
            </div>
          </div>
        )}

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">
            {message}
            <span className="inline-block w-8 text-left">{dots}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {"Preparing something amazing for you"}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full loader-spin origin-left"></div>
        </div>
      </div>
    </div>
  );
}
