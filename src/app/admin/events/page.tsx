import { DataTable } from "@/components/shared/DataTable";
import { getAllEventsForAdmin } from "@/lib/actions";
import React from "react";
import { columns } from "./columns";
import { EventWithOrganizer } from "@/types";

async function page() {
  const events = await getAllEventsForAdmin();
  return (
    <div className="">
      <DataTable<EventWithOrganizer, any>
        data={events.data ?? []}
        columns={columns}
      />
    </div>
  );
}

export default page;
