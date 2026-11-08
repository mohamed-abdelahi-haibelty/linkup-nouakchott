import NotFound from "@/app/[locale]/not-found";
import { DataTable } from "@/components/shared/DataTable";
import { deleteManyEvents } from "@/features/events/actions/admin/deleteManyEvents";
import { getAllEvents } from "@/features/events/actions/admin/getAllEvent";
import { getUserRole } from "@/features/users/actions/getUserRole";
import { statuses } from "@/lib/constant";
import { EventWithOrganizer } from "@/types";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { columns } from "@/features/admin/tables/events";

type Props = {
  params: Promise<{ locale: string }>;
};

async function page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { user, success } = await getUserRole();
  if (!user || !success) redirect("/api/auth/login");
  if (user.role !== "admin") return NotFound();
  const events = await getAllEvents();
  return (
    <div className="">
      <DataTable<EventWithOrganizer>
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
