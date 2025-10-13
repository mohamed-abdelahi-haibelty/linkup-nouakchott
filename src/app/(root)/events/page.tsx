import { Plus, SlidersHorizontal, TrendingUp } from "lucide-react";
import EventList from "./_components/EventList";
import SearchInput from "./_components/SearchInput";
import { getEvents } from "@/lib/actions";
import ErrorWrapper from "@/components/shared/ErrorWrapper";
import { Button } from "@/components/ui/button";
import CreateEventButton from "./_components/CreateEventButton";

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
      <div className="flex items-center justify-between gap-4 md:hidden mt-8">
        <div className="flex items-center gap-2 flex-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl tracking-tight font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Discover Events
          </h2>
        </div>
        <Button
          className=" bg-accent hover:shadow-xl transition-all duration-300 gap-2 font-semibold"
          size="default"
        >
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </div>

      <div
        className="hidden fixed md:flex items-center justify-center bottom-5 z-50 w-12
           mx-auto left-0 right-0 "
      >
        <CreateEventButton />
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
