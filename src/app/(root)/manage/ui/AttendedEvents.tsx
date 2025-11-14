import React from "react";
import UpcomingEvents from "./UpcomingEvents";
import PastEvents from "./PastEvents";

function AttendedEvents() {
  return (
    <div className="w-full">
      {/* Mobile Layout: Vertical stack */}
      <div className="block md:hidden space-y-8">
        {/* Upcoming Events Section */}
        <div>
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            Upcoming Events
          </h2>
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4">
              <React.Suspense fallback={<div>Loading...</div>}>
                <UpcomingEvents />
              </React.Suspense>
            </div>
          </div>
        </div>

        {/* Past Events Section */}
        <div>
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            Past Events
          </h2>
          <React.Suspense fallback={<div>Loading...</div>}>
            <PastEvents />
          </React.Suspense>
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-3 gap-8">
        {/* Upcoming Events - 2 columns */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            Upcoming Events
          </h2>
          <React.Suspense fallback={<div>Loading...</div>}>
            <UpcomingEvents />
          </React.Suspense>
        </div>

        {/* Past Events - 1 column */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            Past Events
          </h2>
          <PastEvents />
        </div>
      </div>
    </div>
  );
}

export default AttendedEvents;
