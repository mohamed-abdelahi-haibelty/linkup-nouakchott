import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import CreateEventForm from "../_components/CreateEventForm";

async function page() {
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
