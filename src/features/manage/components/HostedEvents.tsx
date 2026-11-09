"use client";

import { useHostedEventsColumns } from "@/features/manage/tables/hosted-events";
import { DataTable } from "@/components/shared/DataTable";
import { EventWithParticipantsCount } from "@/types/index";

import { eventHostStatues } from "@/lib/constant";

interface Props {
  data: EventWithParticipantsCount[];
}

export default function HostedEventsTable({ data }: Props) {
  const columns = useHostedEventsColumns();

  return (
    <DataTable<EventWithParticipantsCount>
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
