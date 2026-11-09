import { getUpcomingEvents } from "@/features/events/actions/participant/getUpcomingEvent";
import UpcomingEventsCountdown from "@/features/manage/components/UpcomingEventsCountdown";

async function UpcomingEvents() {
  const { data } = await getUpcomingEvents();
  return <UpcomingEventsCountdown data={data!} />;
}

export default UpcomingEvents;
