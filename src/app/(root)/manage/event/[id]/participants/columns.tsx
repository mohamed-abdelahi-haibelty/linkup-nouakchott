"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { participantsStatues } from "@/lib/constant";
import { cn, formatDate, getFallback } from "@/lib/utils";
import { ParticipantWithUser } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import React from "react";
import { multiValueFilter } from "@/lib/tableUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { confirmParticipantPayment } from "@/app/actions/events/organizer/confirmParticipantPayment";

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
        (s) => s.value === row.getValue("status")
      );

      if (!status) return null;

      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition hover:brightness-[0.97]",
            status.className
          )}
        >
          <span className="capitalize">{status.label}</span>
        </div>
      );
    },
    filterFn: multiValueFilter,
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const eventId = row.original.eventId;
      const status = row.original.status;
      const id = row.original.id;
      const [loading, setLoading] = useState(false);
      const [open, setOpen] = useState(false);

      const handlePaid = async () => {
        try {
          setLoading(true);
          const res = await confirmParticipantPayment(id, eventId);
          toast.message(res.message);
        } finally {
          setLoading(false);
          setOpen(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
              <span className="sr-only">Open menu</span>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <ConfirmDeleteDialog
              open={open}
              onOpenChange={setOpen}
              onConfirm={handlePaid}
              confirmLabel="Confirm"
              title="Confirm Payment"
              description="Once you confirm payment, this cannot be undone. A ticket will be sent to the participant."
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => {
                    // Prevent DropdownMenu from closing immediately
                    e.preventDefault();
                    setOpen(true);
                  }}
                  disabled={status === "paid"}
                >
                  Paid
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
