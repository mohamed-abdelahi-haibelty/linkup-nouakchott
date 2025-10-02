import { SlidersHorizontal } from "lucide-react";
import EventList from "./_components/EventList";
import SearchInput from "./_components/SearchInput";
import { getEvents } from "@/lib/actions";
import ErrorWrapper from "@/components/shared/ErrorWrapper";
import { Button } from "@/components/ui/button";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || "";
  const { data, pagination } = await getEvents({
    query,
    page: 1,
    limit: 12,
  });

  return (
    <div dir="ltr" className="min-h-full mt-4 ">
      <div className="flex items-center md:max-w-3xl md:mx-auto justify-between gap-x-3">
        <SearchInput />
        <SlidersHorizontal className="md:hidden" />
      </div>
      <div className="flex items-center justify-between mt-8 md:hidden">
        <p className="font-semibold md:text-xl tracking-wide md:hidden">
          Discover Trending Events
        </p>
        <Button className="shadow-xl">Create Event</Button>
      </div>
      <ErrorWrapper>
        <EventList
          initialData={data}
          query={query}
          initialPagination={pagination}
        />
      </ErrorWrapper>
    </div>
  );
}
