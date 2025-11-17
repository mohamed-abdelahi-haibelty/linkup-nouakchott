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
import { columns } from "../columns";
import { eventHostStatues } from "@/lib/constant";
import AttendedEvents from "./AttendedEvents";
import Posts from "./Posts";

type Props = {
  data: EventWithParticipantsCount[] | null | undefined;
};

function TabComponent({ data }: Props) {
  return (
    <Tabs className="mt-3 " defaultValue="host">
      <TabsList className="flex justify-center w-full bg-muted">
        <TabsTrigger value="host">
          <span>Host</span>
          <Sparkles />
        </TabsTrigger>
        <TabsTrigger value="attend">
          <span>Attend</span>
          <Ticket />
        </TabsTrigger>
        <TabsTrigger value="saved">
          <span>Saved</span>
          <BookmarkPlus />
        </TabsTrigger>
        <TabsTrigger value="posts">
          <span>Posts</span>
          <SquareDashedMousePointer />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="host" className="px-2 sm:px-4">
        <DataTable<EventWithParticipantsCount, any>
          data={data ?? []}
          columns={columns}
          filters={[
            {
              columnId: "status",
              title: "Status",
              options: eventHostStatues,
            },
          ]}
        />
      </TabsContent>
      <TabsContent value="attend">
        <AttendedEvents />
      </TabsContent>
      <TabsContent value="saved" className="px-2 sm:px-4">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">
            This feature is coming soon.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="posts">
        <Posts />
      </TabsContent>
    </Tabs>
  );
}

export default TabComponent;
