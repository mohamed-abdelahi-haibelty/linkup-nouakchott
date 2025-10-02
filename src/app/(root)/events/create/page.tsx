import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import CreateEventForm from "../_components/CreateEventForm";

async function page() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }
  return (
    <div className="md:mt-[100px] bg-card border max-w-4xl mx-auto px-6 py-4">
      <CreateEventForm />
    </div>
  );
}

export default page;
