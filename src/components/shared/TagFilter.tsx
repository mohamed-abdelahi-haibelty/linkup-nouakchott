"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventTag } from "@prisma/client";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";

const TAG_LABELS: Record<EventTag, string> = {
  music: "Music",
  sports: "Sports",
  education: "Education",
  tech: "Tech",
  business: "Business",
  art: "Art",
  food: "Food",
  culture: "Culture",
  charity: "Charity",
  entertainment: "Entertainment",
  health: "Health",
  community: "Community",
};

export default function TagDropdown({
  selectedTag,
}: {
  selectedTag?: EventTag;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagSelect = (tag?: EventTag) => {
    const params = new URLSearchParams(searchParams);

    if (!tag) {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }

    router.push(`/events?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <SlidersHorizontal className="h-5 w-5" />
          {selectedTag && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary/70 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-3">
        <div className="flex flex-wrap gap-2">
          <Badge
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => handleTagSelect(undefined)}
            variant={"outline"}
          >
            All Categories
          </Badge>

          {Object.entries(TAG_LABELS).map(([tag, label]) => {
            const isSelected = selectedTag === tag;
            return (
              <Badge
                key={tag}
                variant={"outline"}
                onClick={() => handleTagSelect(tag as EventTag)}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  isSelected ? "bg-primary/10" : ""
                }`}
              >
                {label}
              </Badge>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
