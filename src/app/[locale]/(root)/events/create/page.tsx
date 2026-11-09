import { getAppSession } from "@/lib/app-session";
import { redirect } from "next/navigation";
import CreateEventForm from "../_components/CreateEventForm";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

async function page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { isAuthenticated } = getAppSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }
  return (
    <div className="bg-card xl:rounded-xl border px-6 py-4">
      <CreateEventForm />
    </div>
  );
}

export default page;
