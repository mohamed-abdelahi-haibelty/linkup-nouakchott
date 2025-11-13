import { getUpcomingEvents } from "@/app/actions/events/participant/getUpcomingEvent";
import UpcomingEventsCountdown from "./UpcomingEventsCountdown";

async function UpcomingEvents() {
  const { data } = await getUpcomingEvents();
  return <UpcomingEventsCountdown data={data!} />;
}

export default UpcomingEvents;
