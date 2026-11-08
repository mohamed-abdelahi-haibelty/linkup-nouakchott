"use client";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export function ErrorFallback({
  title = "Something went wrong",
  message = "Unable to fetch participants for this event.",
  onRetry,
  fullPage = false,
}: ErrorFallbackProps) {
  return (
    <div
      className={
        fullPage
          ? "min-h-screen flex flex-col items-center justify-center p-6 bg-background"
          : "flex flex-col items-center justify-center p-12 text-center"
      }
    >
      <div className="w-full max-w-sm bg-card/50 border border-border/20 rounded-lg p-8 backdrop-blur-sm">
        {/* Icon with subtle accent color */}
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-accent" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="space-y-2 mb-6">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="w-full gap-2 bg-transparent"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
