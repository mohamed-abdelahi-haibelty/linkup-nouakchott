"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  description: string;
};

const MAX_CHARS = 250;

function EventDescription({ description }: Props) {
  const t = useTranslations("events.details.tabs");
  const [expanded, setExpanded] = useState(false);

  const isLong = description.length > MAX_CHARS;
  const displayed = !isLong
    ? description
    : expanded
      ? description
      : `${description.slice(0, MAX_CHARS).trimEnd()}...`;

  return (
    <section>
      <h2 className="text-sm font-semibold text-foreground mb-2 border-b  pb-1">
        {t("description")}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {displayed}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((s) => !s)}
            className="ml-2 text-secondary-foreground font-semibold hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? t("readLess") : t("readMore")}
          </button>
        )}
      </p>
    </section>
  );
}

export default EventDescription;
