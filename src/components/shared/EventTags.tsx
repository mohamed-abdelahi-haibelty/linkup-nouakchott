"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type Tag = {
  title: string;
  value: string;
  color: string;
};

type Props = {
  tags: Tag[];
  selectedTag: string | undefined;
  onChange: (tag: string) => void;
};

function EventTags({ tags, selectedTag, onChange }: Props) {
  return (
    <div className=" mt-2 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.title}
          className={cn(
            " cursor-pointer transition-all hover:scale-105",
            selectedTag === tag.value ? tag.color : "hover:bg-muted"
          )}
          variant={selectedTag === tag.value ? "default" : "outline"}
          onClick={() => onChange(selectedTag === tag.value ? "" : tag.value)}
        >
          {tag.title}
        </Badge>
      ))}
    </div>
  );
}

export default EventTags;
