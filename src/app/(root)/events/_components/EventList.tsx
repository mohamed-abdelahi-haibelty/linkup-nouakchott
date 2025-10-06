"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { getEvents } from "@/lib/actions";
import { useInView } from "react-intersection-observer";

import DotsLoader from "@/components/shared/DotsLoader";
import EventNotFound from "./EventNotFound";
import EventCardSkeleton from "./EventCardSkeleton";
import ErrorWrapper from "@/components/shared/ErrorWrapper";
import { EventWithParticipants } from "@/types/events";

type Props = {
  initialData: EventWithParticipants[];
  query?: string;
  initialPagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
};

const NUMBER_OF_EVENTS_TO_FETCH = 12;

function EventList({ initialData, query, initialPagination }: Props) {
  const [events, setEvents] = useState(initialData);
  const [page, setPage] = useState(initialPagination.page);
  const [hasMore, setHasMore] = useState(initialPagination.totalPages > 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSeaching] = useState(false);
  const { ref, inView } = useInView();

  async function loadMoreEvents() {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);
    try {
      const { data, pagination, error } = await getEvents({
        query,
        page: page + 1,
        limit: NUMBER_OF_EVENTS_TO_FETCH,
      });

      if (error) {
        setError(error);
      }

      if (data.length === 0 || pagination.page > pagination.totalPages) {
        setHasMore(false);
      } else {
        setEvents((prevEvents) => [...prevEvents, ...data]);
        setPage((page) => page + 1);
      }
    } catch (error) {
      console.error("Error Loading more events", error);
      setError("Failed to load more events. Please try again");
    } finally {
      setIsLoading(false);
    }
  }

  function retryLoadMore() {
    setError(null);
    loadMoreEvents();
  }

  useEffect(() => {
    setIsSeaching(true);
    setEvents(initialData);
    setPage(initialPagination.page);
    setHasMore(initialPagination.totalPages > initialPagination.page);
    setError(null);

    // Simulate search delay for better UX
    const timer = setTimeout(() => {
      setIsSeaching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, initialData, initialPagination]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreEvents();
    }
  }, [inView, hasMore, isLoading]);

  if (!events.length && !isLoading) {
    return <EventNotFound query={query} />;
  }

  // Show search loading state
  if (isSearching) {
    return (
      <div className="flex flex-col gap-3">
        <div className=" mt-4 flex items-start gap-x-4 gap-y-3 flex-wrap">
          {Array.from({ length: 8 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ErrorWrapper error={error} onRetry={retryLoadMore} isLoading={isLoading}>
      <div className="flex flex-col gap-3">
        <div className="mt-4 flex items-start gap-x-4 gap-y-3 flex-wrap">
          {events?.map((event) => (
            <EventCard {...event} key={event.id} />
          ))}
          {/* Show loading skeletons while loading more */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <EventCardSkeleton key={`loading-${index}`} />
            ))}
        </div>

        <div ref={ref}>{hasMore && !error && <DotsLoader />}</div>

        {/* End of results message */}
        {!hasMore && events.length > 0 && !error && (
          <div className="flex justify-center py-6">
            <p className="text-sm text-muted-foreground">
              You've reached the end of the results
            </p>
          </div>
        )}
      </div>
    </ErrorWrapper>
  );
}

export default EventList;
