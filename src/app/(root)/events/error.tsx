"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground mb-2">
        We’re having trouble loading this page. Please try again later.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Reload
      </button>
    </div>
  );
}
