"use client";

import { useCallback, useEffect, useState } from "react";
import EventCard from "./EventCard";
import { useInView } from "react-intersection-observer";

import DotsLoader from "@/components/shared/DotsLoader";
import EventNotFound from "./EventNotFound";
import EventCardSkeleton from "./EventCardSkeleton";
import ErrorWrapper from "@/components/shared/ErrorWrapper";
import { EventWithParticipants } from "@/types/events";
import { getEvents } from "@/app/[locale]/actions/events/getEvents";
import { EventTag } from "@prisma/client";

type Props = {
  initialData: EventWithParticipants[];
  query?: string;
  tag?: EventTag;
  initialPagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
};

const NUMBER_OF_EVENTS_TO_FETCH = 12;

function EventList({ initialData, query, tag, initialPagination }: Props) {
  const [events, setEvents] = useState(initialData);
  const [page, setPage] = useState(initialPagination.page);
  const [hasMore, setHasMore] = useState(initialPagination.totalPages > 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSeaching] = useState(false);
  const { ref, inView } = useInView();

  const loadMoreEvents = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);
    try {
      const { data, pagination, error } = await getEvents({
        query,
        tag,
        page: page + 1,
        limit: NUMBER_OF_EVENTS_TO_FETCH,
      });

      if (error) setError(error);

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
  }, [isLoading, hasMore, page, query, tag]);

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
  }, [query, tag, initialData, initialPagination]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreEvents();
    }
  }, [inView, hasMore, isLoading, loadMoreEvents]);

  if (!events.length && !isLoading) {
    return <EventNotFound query={query} />;
  }

  // Show search loading state
  if (isSearching) {
    return (
      <div className="flex flex-col gap-3">
        <div className=" mt-4 flex items-start gap-x-4 gap-y-3 flex-wrap">
          {Array.from({ length: 9 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ErrorWrapper error={error} onRetry={retryLoadMore} isLoading={isLoading}>
      <div className="flex flex-col gap-3 ">
        <div className="mt-4 comtainer mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-x-4 gap-y-4 ">
          {events?.map((event) => (
            <EventCard {...event} key={event.id} />
          ))}
          {/* Show loading skeletons while loading more */}
          {isLoading &&
            Array.from({ length: 9 }).map((_, index) => (
              <EventCardSkeleton key={`loading-${index}`} />
            ))}
        </div>

        <div ref={ref}>{hasMore && !error && <DotsLoader />}</div>

        {/* End of results message */}
        {!hasMore && events.length > 0 && !error && (
          <div className="flex justify-center py-6">
            <p className="text-sm text-muted-foreground">
              You&apos;ve reached the end of the results
            </p>
          </div>
        )}
      </div>
    </ErrorWrapper>
  );
}

export default EventList;
