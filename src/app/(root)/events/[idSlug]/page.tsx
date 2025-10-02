import { getEventById } from "@/lib/actions";
import { notFound } from "next/navigation";
import EventMobileLayout from "../_components/EventMobileLayout";
import EventDesktop from "../_components/EventDesktop";

interface PageProps {
  params: Promise<{ idSlug: string }>;
}

async function page({ params }: PageProps) {
  const url_param = await params;
  const id = url_param?.idSlug.split("_")[0];
  const event = await getEventById(id);

  if (!event) {
    return notFound();
  }

  return (
    <div className="min-h-screen ">
      <EventMobileLayout event={event} />

      <EventDesktop event={event} />
    </div>
  );
}

export default page;
