import PastEvents from "@/features/manage/components/PastEvents";
import UpcomingEvents from "@/features/manage/components/UpcomingEvents";
import { getTranslations } from "next-intl/server";
import React from "react";

async function AttendedEvents() {
  const t = await getTranslations("myhub.attendedEvents");
  return (
    <div className="w-full">
      {/* Mobile Layout: Vertical stack */}
      <div className="block md:hidden space-y-8">
        {/* Upcoming Events Section */}
        <div>
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            {t("upcoming")}
          </h2>
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4">
              <React.Suspense fallback={<div>{t("loading")}</div>}>
                <UpcomingEvents />
              </React.Suspense>
            </div>
          </div>
        </div>

        {/* Past Events Section */}
        <div>
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            {t("past")}
          </h2>
          <React.Suspense fallback={<div>{t("loading")}</div>}>
            <PastEvents />
          </React.Suspense>
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-3 gap-8">
        {/* {t("upcoming")} - 2 columns */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            {t("upcoming")}
          </h2>
          <React.Suspense fallback={<div>{t("loading")}</div>}>
            <UpcomingEvents />
          </React.Suspense>
        </div>

        {/* Past Events - 1 column */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            {t("past")}
          </h2>
          <PastEvents />
        </div>
      </div>
    </div>
  );
}

export default AttendedEvents;
