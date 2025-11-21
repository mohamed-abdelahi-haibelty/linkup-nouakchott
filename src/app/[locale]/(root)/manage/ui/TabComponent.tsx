import { DataTable } from "@/components/shared/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventWithParticipantsCount } from "@/types";
import {
  BookmarkPlus,
  Sparkles,
  SquareDashedMousePointer,
  Ticket,
} from "lucide-react";
import React from "react";
import { eventHostStatues } from "@/lib/constant";
import AttendedEvents from "./AttendedEvents";
import Posts from "./Posts";
import { getTranslations } from "next-intl/server";
import HostedEventsTable from "./HostedEvents";

type Props = {
  data: EventWithParticipantsCount[] | null | undefined;
};

async function TabComponent({ data }: Props) {
  const t = await getTranslations("tabs");

  return (
    <Tabs className="mt-3" defaultValue="hosted">
      <TabsList className="flex justify-center w-full bg-muted overflow-x-auto">
        <TabsTrigger value="hosted">
          <span>{t("hosted")}</span>
          <Sparkles />
        </TabsTrigger>
        <TabsTrigger value="attended">
          <span>{t("attended")}</span>
          <Ticket />
        </TabsTrigger>
        <TabsTrigger className="hidden md:flex" value="saved">
          <span>{t("saved")}</span>
          <BookmarkPlus />
        </TabsTrigger>
        <TabsTrigger value="posts">
          <span>{t("posts")}</span>
          <SquareDashedMousePointer />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="hosted" className="px-2 sm:px-4">
        <HostedEventsTable data={data ?? []} />
      </TabsContent>
      <TabsContent value="attended">
        <AttendedEvents />
      </TabsContent>
      <TabsContent value="saved" className="px-2 sm:px-4">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>
        </div>
      </TabsContent>
      <TabsContent value="posts">
        <Posts />
      </TabsContent>
    </Tabs>
  );
}

export default TabComponent;
