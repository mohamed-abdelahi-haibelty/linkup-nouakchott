import { requireAuthUser } from "@/lib/auth";
import TabComponent from "./ui/TabComponent";
import { getHostedEvents } from "@/app/[locale]/actions/events/organizer/getHostedEvents";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

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
