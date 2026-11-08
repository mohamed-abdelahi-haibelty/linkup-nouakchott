import CreateEventForm from "@/features/events/components/CreateEventForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

async function page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { isAuthenticated } = getKindeServerSession();

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
