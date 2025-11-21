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
import { deleteEvent } from "@/app/[locale]/actions/events/organizer/deleteEvent";
import { cancelEvent } from "@/app/[locale]/actions/events/organizer/cancelEvent";
import { multiValueFilter } from "@/lib/tableUtils";
import { useTranslations } from "next-intl";

const columnHelper = createColumnHelper<EventWithParticipantsCount>();

export const useHostedEventsColumns = () => {
  const t = useTranslations("myhub.hostedEvents");

  return [
    columnHelper.accessor("title", {
      header: () => t("columns.title"),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("startTime", {
      header: () => t("columns.date"),
      cell: (info) => {
        const [mounted, setMounted] = React.useState(false);

        React.useEffect(() => setMounted(true), []);

        if (!mounted) return <span>{t("loading")}</span>;

        return formatDate(info.getValue());
      },
    }),
    columnHelper.accessor("participantsCount", {
      header: () => t("columns.participants"),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: () => t("columns.status"),
      cell: ({ row }) => {
        const status = eventHostStatues.find(
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
            <span className="capitalize">{t(`status.${status.value}`)}</span>
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

        const handleCancel = async () => {
          try {
            setLoading(true);
            const res = await cancelEvent(event.id);
            toast.message(res.message);
          } finally {
            setLoading(false);
            setOpenCancelModal(false);
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={loading}
              >
                <span className="sr-only">{t("actions.openMenu")}</span>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`/events/${event.id}_${event.slug}`)}
              >
                {t("actions.details")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/events/scan/${event.id}`)}
              >
                {t("actions.scanTickets")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/manage/event/${event.id}/participants`)
                }
              >
                {t("actions.participants")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/events/edit/${event.id}`)}
              >
                {t("actions.edit")}
              </DropdownMenuItem>

              {/* Cancel Modal */}
              <AlertDialog
                open={openCancelModal}
                onOpenChange={setOpenCancelModal}
              >
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    disabled={event.status === "cancelled"}
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenCancelModal(true);
                    }}
                  >
                    {t("actions.cancel")}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("cancel.title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("cancel.description", { title: event.title })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                      {t("cancel.close")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        t("cancel.confirm")
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Delete Modal */}
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpen(true);
                    }}
                  >
                    {t("actions.delete")}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("delete.description", { title: event.title })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                      {t("delete.close")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        t("delete.confirm")
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
};
