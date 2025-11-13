import TabComponent from "./ui/TabComponent";
import { getHostedEvents } from "@/app/actions/events/organizer/getHostedEvents";

async function page() {
  const { data } = await getHostedEvents();
  return (
    <div className="mx-auto max-w-6xl">
      <TabComponent data={data} />
    </div>
  );
}

export default page;
