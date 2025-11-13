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
import { eventHostStatues } from "@/lib/constant";
import { cn, formatDate } from "@/lib/utils";
import { EventWithParticipantsCount } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";
import { deleteEvent } from "@/app/actions/events/organizer/deleteEvent";
import { cancelEvent } from "@/app/actions/events/organizer/cancelEvent";
import { multiValueFilter } from "@/lib/tableUtils";

const columnHelper = createColumnHelper<EventWithParticipantsCount>();
export const columns = [
  columnHelper.accessor("title", {
    header: () => "Title",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("startTime", {
    header: () => "Date",
    cell: (info) => {
      const [mounted, setMounted] = React.useState(false);

      React.useEffect(() => {
        setMounted(true);
      }, []);

      if (!mounted) {
        return <span>Loading...</span>; // or return null
      }

      return formatDate(info.getValue());
    },
  }),
  columnHelper.accessor("participantsCount", {
    header: () => "Participants",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: ({ row }) => {
      const status = eventHostStatues.find(
        (s) => s.value === row.getValue("status")
      );

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
      const [openCancelModal, setOpenCancelModal] = useState(false);
      const router = useRouter();

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

      async function handleCancel() {
        try {
          setLoading(true);
          const res = await cancelEvent(event.id);
          toast.message(res.message);
        } finally {
          setLoading(false);
          setOpenCancelModal(false);
        }
      }

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
              onClick={() => router.push(`/events/${event.id}_${event.slug}`)}
            >
              Details
            </DropdownMenuItem>
            <DropdownMenuItem>Scan Tickets</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/manage/event/${event.id}/participants`)
              }
            >
              Pariticipants
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/events/edit/${event.id}`)}
            >
              Edit
            </DropdownMenuItem>
            {/* Cancel confirmation modal  */}
            <AlertDialog
              open={openCancelModal}
              onOpenChange={setOpenCancelModal}
            >
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  disabled={event.status === "cancelled"}
                  onSelect={(e) => {
                    // Prevent DropdownMenu from closing immediately
                    e.preventDefault();
                    setOpenCancelModal(true);
                  }}
                >
                  Cancel
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to Cancel{" "}
                    <span className="font-semibold">{event.title}</span>? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>
                    Close
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel} disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Cancel"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

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
