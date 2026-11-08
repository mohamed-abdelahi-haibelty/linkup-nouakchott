import ErrorWrapper from "@/components/shared/ErrorWrapper";
import TagFilter from "@/components/shared/TagFilter";
import { getEvents } from "@/features/events/actions/getEvents";
import CreateEventButton from "@/features/events/components/CreateEventButton";
import EventList from "@/features/events/components/EventList";
import SearchInput from "@/features/events/components/SearchInput";
import { EventTag } from "@prisma/client";
import { TrendingUp } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; tag?: EventTag; locale: string }>;
}) {
  const params = await searchParams;
  const query = params.query || "";
  const tag = params.tag;
  const locale = params.locale;
  setRequestLocale(locale);
  const t = await getTranslations("events.page");

  const { data, pagination } = await getEvents({
    query,
    tag,
    page: 1,
    limit: 12,
  });

  return (
    <div dir="ltr" className="min-h-full mt-4 ">
      <div className="flex items-center md:max-w-3xl md:mx-auto justify-between gap-x-3">
        <SearchInput />
        {/* Tag Filter */}
        <TagFilter selectedTag={tag} />
      </div>
      <div className="flex items-center justify-between gap-4 md:hidden mt-8">
        <div className="flex items-center gap-2 flex-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl tracking-tight font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t(`discover`)}
          </h2>
        </div>
        <CreateEventButton />
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
          tag={tag}
          initialPagination={pagination}
        />
      </ErrorWrapper>
    </div>
  );
}

export default page;
