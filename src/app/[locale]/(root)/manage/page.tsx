import { getHostedEvents } from "@/features/events/actions/organizer/getHostedEvents";
import TabComponent from "@/features/manage/components/TabComponent";
import { requireAuthUser } from "@/lib/auth";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

async function page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { user, success } = await requireAuthUser();
  if (!user || !success) redirect("/api/auth/login");
  const { data } = await getHostedEvents();
  return (
    <div className="mx-auto max-w-6xl">
      <TabComponent data={data} />
    </div>
  );
}

export default page;
