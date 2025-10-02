"use client";

import React, { ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorWrapperProps {
  children: ReactNode;
  error?: string | null;
  isLoading?: boolean;
  onRetry?: () => void;
  retryText?: string;
}

function ErrorWrapper({
  children,
  error,
  isLoading,
  onRetry,
  retryText = "Try Again",
}: ErrorWrapperProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-destructive/80 mx-auto" />
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {retryText}
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ErrorWrapper;
