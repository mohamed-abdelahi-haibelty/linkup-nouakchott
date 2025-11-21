import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./columns";
import { EventWithOrganizer } from "@/types";
import { statuses } from "@/lib/constant";
import { getAllEvents } from "@/app/[locale]/actions/events/admin/getAllEvent";
import { deleteManyEvents } from "@/app/[locale]/actions/events/admin/deleteManyEvents";
import { getUserRole } from "@/app/[locale]/actions/user/getUserRole";
import { redirect } from "next/navigation";
import NotFound from "@/app/[locale]/not-found";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

async function page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { user, success, code } = await getUserRole();
  if (!user || !success) redirect("/api/auth/login");
  if (user.role !== "admin") return NotFound();
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
