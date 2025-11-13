import React from "react";
import UpcomingEvents from "./UpcomingEvents";

function AttendedEvents() {
  return (
    <div className="gird gird-cols-3 gap-4">
      <div className="col-span-2">
        <UpcomingEvents />
      </div>
      <div></div>
    </div>
  );
}

export default AttendedEvents;
