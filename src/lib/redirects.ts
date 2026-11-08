/** Resolve only destinations on this application's configured origin. */
export function postLoginRedirect(candidate: string | null, origin: string) {
  const fallback = new URL("/events", origin);
  if (!candidate) return fallback;
  try {
    const destination = new URL(candidate, origin);
    return destination.origin === fallback.origin ? destination : fallback;
  } catch {
    return fallback;
  }
}
