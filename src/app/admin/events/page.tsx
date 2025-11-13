import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./columns";
import { EventWithOrganizer } from "@/types";
import { statuses } from "@/lib/constant";
import { getAllEvents } from "@/app/actions/events/admin/getAllEvent";
import { deleteManyEvents } from "@/app/actions/events/admin/deleteManyEvents";

async function page() {
  const events = await getAllEvents();
  return (
    <div className="">
      <DataTable<EventWithOrganizer, any>
        data={events.data ?? []}
        columns={columns}
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: statuses,
          },
        ]}
        deleteAction={deleteManyEvents}
        deleteConfirmTitle="Delete selected events"
      />
    </div>
  );
}

export default page;
