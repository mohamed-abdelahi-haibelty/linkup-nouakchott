import { getPastEvents } from "@/app/actions/events/participant/getPastEvent";
import PastEvent from "./PastEvent";

export default async function PastEvents() {
  const { data } = await getPastEvents();

  if (data?.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No past events yet</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {data?.map((event) => (
        <PastEvent key={event.id} event={event} />
      ))}
    </div>
  );
}
