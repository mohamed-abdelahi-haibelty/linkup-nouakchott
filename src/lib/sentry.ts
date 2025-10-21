import * as Sentry from "@sentry/nextjs";

type LogLevel = "fatal" | "error" | "warning" | "info" | "debug";

type LogEventType = {
  message: string;
  category?: string;
  level?: LogLevel;
  data?: Record<string, any>;
  error?: unknown;
};

export function logEvent({
  message,
  category = "general",
  level = "error",
  data,
  error,
}: LogEventType) {
  Sentry.addBreadcrumb({
    category,
    message,
    level,
    data,
  });

  if (error) {
    Sentry.captureException(error, { extra: data });
  } else {
    Sentry.captureMessage(message, level);
  }
}

export function logError(error: unknown, context?: Record<string, any>) {
  Sentry.captureException(error, { level: "error", extra: context });
}

export function logWarning(message: string, context?: Record<string, any>) {
  Sentry.captureMessage(message, "warning");

  if (context) Sentry.setContext("warning", context);
}
