"use client";
import { useTranslations } from "next-intl";
import React from "react";

type Props = {
  query?: string;
};

function EventNotFound({ query }: Props) {
  const t = useTranslations("events.components.eventNotFound");
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-3">
        {query ? (
          <>
            <h2 className="text-xl font-semibold">{t("noSearchFound")}</h2>
            <p className="text-muted-foreground">
              {t("noMatch")}{" "}
              <span className=" text-destructive">&quot;{query}&quot;</span>.
              {t("try")}.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">{t("noEvents")}</h2>
            <p className="text-muted-foreground">{t("description")}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default EventNotFound;
