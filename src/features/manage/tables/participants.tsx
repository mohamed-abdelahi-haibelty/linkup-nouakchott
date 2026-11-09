"use client";

import { participantsStatues } from "@/lib/constant";
import { cn, formatDate, getFallback } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { multiValueFilter } from "@/lib/tableUtils";
import { ParticipantWithUser } from "@/types/index";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<ParticipantWithUser>();
export const columns = [
  columnHelper.accessor((row) => row.participant.name, {
    id: "name",
    header: () => "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-1">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={row.original.participant.avatarUrl!}
            alt={row.original.participant.name}
          />
          <AvatarFallback className="rounded-lg">
            {getFallback(row.original.participant.name)}
          </AvatarFallback>
        </Avatar>
        <span>{row.original.participant.name}</span>
      </div>
    ),
  }),
  columnHelper.accessor((row) => row.participant.email, {
    id: "email",
    header: () => "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.participant.phoneNumber, {
    id: "phone",
    header: () => "Phone",
    cell: (info) => {
      const phone = info.getValue() ?? "";
      if (!phone) return "-";
      const cleaned = String(phone).replace(/\D/g, "");
      const waUrl = `https://wa.me/${cleaned}`;
      return (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {phone}
        </a>
      );
    },
  }),
  columnHelper.accessor("createdAt", {
    header: () => "Joined At",
    cell: (info) => formatDate(info.getValue()),
  }),

  columnHelper.accessor("status", {
    header: () => "Status",
    cell: ({ row }) => {
      const status = participantsStatues.find(
        (s) => s.value === row.getValue("status"),
      );

      if (!status) return null;

      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition hover:brightness-[0.97]",
            status.className,
          )}
        >
          <span className="capitalize">{status.label}</span>
        </div>
      );
    },
    filterFn: multiValueFilter,
  }),
];
