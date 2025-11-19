import { getEventParticipants } from "@/app/[locale]/actions/events/organizer/getEventParticipants";
import NotFound from "@/app/[locale]/not-found";
import { DataTable } from "@/components/shared/DataTable";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { ParticipantWithUser } from "@/types";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { participantsStatues } from "@/lib/constant";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function page({ params }: PageProps) {
  const url = await params;
  const id = url.id;
  const { data, success, code } = await getEventParticipants(id);

  if (code === 404 || code === 403) return NotFound();
  if (code === 401) redirect("/api/auth/login");

  if (!success) {
    return (
      <ErrorFallback
        title="Failed to load participants"
        message="Unable to fetch participants for this event."
      />
    );
  }

  return (
    <div>
      <DataTable<ParticipantWithUser, any>
        data={data ?? []}
        columns={columns}
        searchColumns={["name", "email", "phone"]}
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: participantsStatues,
          },
        ]}
      />
    </div>
  );
}

export default page;
