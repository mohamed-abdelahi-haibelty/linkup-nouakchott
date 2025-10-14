import { getEventById } from "@/lib/actions";
import { notFound } from "next/navigation";
import EventMobileLayout from "../_components/EventMobileLayout";
import EventDesktop from "../_components/EventDesktop";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ idSlug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const url_param = await params;
  const id = url_param?.idSlug.split("_")[0];
  const event = await getEventById(id);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const eventUrl = `${baseUrl}/events/${url_param.idSlug}`;

  return {
    title: event?.title,
    description: event?.description,
    openGraph: {
      title: event?.title,
      description: event?.description,
      url: eventUrl,
      type: "website",
      images: [
        {
          url: event?.imageUrl!,
          width: 1200,
          height: 630,
          alt: event?.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event?.title,
      description: event?.description,
      images: [event?.imageUrl!],
    },
  };
}

async function page({ params }: PageProps) {
  const url_param = await params;
  const id = url_param?.idSlug.split("_")[0];
  const event = await getEventById(id);

  if (!event) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      <EventMobileLayout event={event} />

      <EventDesktop event={event} />
    </div>
  );
}

export default page;
