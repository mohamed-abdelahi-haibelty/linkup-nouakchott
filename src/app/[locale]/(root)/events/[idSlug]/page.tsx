import { notFound } from "next/navigation";
import EventMobileLayout from "../_components/EventMobileLayout";
import EventDesktop from "../_components/EventDesktop";
import { Metadata } from "next";
import { getEventById } from "@/app/[locale]/actions/events/organizer/getEventById";
import prisma from "@/lib/db";
import { getUserRole } from "@/app/[locale]/actions/user/getUserRole";

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

  const { user } = await getUserRole();
  // Define a clear shape for the data you need in the component
  const favoriteStatus = {
    isAuthenticated: !!user,
    isFavorited: false,
  };

  if (user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: event.id,
        },
      },
    });

    favoriteStatus.isFavorited = !!favorite;
  }
  return (
    <div className="min-h-screen">
      <EventMobileLayout
        event={event}
        favoriteStatus={favoriteStatus}
        phone={user?.phoneNumber!}
      />

      <EventDesktop event={event} phone={user?.phoneNumber!} />
    </div>
  );
}

export default page;
