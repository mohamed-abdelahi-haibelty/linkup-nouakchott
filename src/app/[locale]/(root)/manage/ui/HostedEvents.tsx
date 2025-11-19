"use client";

import { DataTable } from "@/components/shared/DataTable";
import { useHostedEventsColumns } from "../columns";
import { EventWithParticipantsCount } from "@/types";

import { eventHostStatues } from "@/lib/constant";

interface Props {
  data: EventWithParticipantsCount[];
}

export default function HostedEventsTable({ data }: Props) {
  const columns = useHostedEventsColumns();

  return (
    <DataTable<EventWithParticipantsCount, any>
      data={data}
      columns={columns}
      filters={[
        {
          columnId: "status",
          title: "status",
          options: eventHostStatues,
        },
      ]}
    />
  );
}
