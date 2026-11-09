"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

function SearchInput() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const t = useTranslations("events.components.searchInput");

  const handleSearch = useDebouncedCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div
      className={cn(
        "border-input flex h-11 w-full min-w-0 rounded-[4px] border bg-card px-3 py-1 md:py-4 text-base  transition-[color,box-shadow] outline-none  md:text-sm",
        "flex items-center  gap-x-3 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]",
      )}
    >
      <Search className="w-5 h-5" />
      <Input
        placeholder={t("input.placeholder")}
        className=" shadow-none bg-transparent border-none focus-visible:border-none focus-visible:ring-0 focus:outline-none ring-0 focus:ring-0 outline-none"
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchInput;
