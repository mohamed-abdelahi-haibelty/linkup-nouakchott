//app/admin/events/columns.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { statuses } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { EventWithOrganizer } from "@/types";
import { Event } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { BadgeCheck, Clock, TicketX, XCircle } from "lucide-react";
import { changeEventStatus } from "@/app/actions/events/admin/changeEventStatus";
import { deleteEvent } from "@/app/actions/events/admin/deleteEvent";
import { multiValueFilter } from "@/lib/tableUtils";

const icons = [BadgeCheck, Clock, TicketX, XCircle];
const newStatues = statuses.map((status, index) => {
  const icon = icons[index];
  return { ...status, icon };
});

const columnHelper = createColumnHelper<EventWithOrganizer>();
export const columns = [
  columnHelper.display({
    id: "checkbox",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  }),
  columnHelper.accessor("title", {
    header: () => "Title",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.organizer.name, {
    id: "organizer",
    header: () => "Organizer",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: ({ row }) => {
      const status = newStatues.find((s) => s.value === row.getValue("status"));

      if (!status) return null;

      const Icon = status.icon;

      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition hover:brightness-[0.97]",
            status.className
          )}
        >
          {Icon && <Icon className="size-4 shrink-0" />}
          <span className="capitalize">{status.label}</span>
        </div>
      );
    },
    filterFn: multiValueFilter,
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;

      const [loading, setLoading] = useState(false);
      const [open, setOpen] = useState(false);
      const router = useRouter();

      const handleStatusChange = async (
        status: "approved" | "rejected" | "pending"
      ) => {
        // Prevent redundant update
        if (event.status === status) {
          toast.info(`Event is already ${status}.`);
          return;
        }

        try {
          setLoading(true);
          const res = await changeEventStatus(event.id, status);
          toast.message(res.message);
        } finally {
          setLoading(false);
        }
      };

      const handleDelete = async () => {
        try {
          setLoading(true);
          const res = await deleteEvent(event.id);
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
            <DropdownMenuItem
              onClick={() => router.push(`/admin/events/${event.id}`)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={event.status === "approved"}
              onClick={() => handleStatusChange("approved")}
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={event.status === "rejected"}
              onClick={() => handleStatusChange("rejected")}
            >
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={event.status === "pending"}
              onClick={() => handleStatusChange("pending")}
            >
              Pending
            </DropdownMenuItem>

            {/* Delete confirmation modal */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    // Prevent DropdownMenu from closing immediately
                    e.preventDefault();
                    setOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">{event.title}</span>? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
