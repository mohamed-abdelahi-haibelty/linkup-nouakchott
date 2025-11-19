"use client";
import { Button } from "@/components/ui/button";
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

import { cn } from "@/lib/utils";
import { CommunityPost, User } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Loader2, BadgeCheck, Clock, XCircle, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { multiValueFilter } from "@/lib/tableUtils";
import { formatDate } from "@/lib/utils";
import { deleteUserCommunityPost } from "@/app/[locale]/actions/community/user/deleteUserCommunityPost";

type CommunityPostWithUser = CommunityPost & {
  user: Pick<User, "id" | "name" | "email" | "avatarUrl">;
  _count?: {
    favorites: number;
  };
};

const statuses = [
  {
    value: "approved",
    label: "Approved",
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  },
  {
    value: "pending",
    label: "Pending",
    className:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400",
  },
  {
    value: "rejected",
    label: "Rejected",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  },
];

const icons = [BadgeCheck, Clock, XCircle];
const statusesWithIcons = statuses.map((status, index) => {
  const icon = icons[index];
  return { ...status, icon };
});

const columnHelper = createColumnHelper<CommunityPostWithUser>();

export const postColumns = [
  columnHelper.accessor("title", {
    header: () => "Title",
    cell: (info) => {
      const title = info.getValue();
      return title ? (
        <span className="font-medium">{title}</span>
      ) : (
        <span className="text-muted-foreground italic">No title</span>
      );
    },
  }),
  columnHelper.accessor("tag", {
    header: () => "Category",
    cell: (info) => {
      const tag = info.getValue();
      return tag ? (
        <span className="capitalize text-sm">{tag}</span>
      ) : (
        <span className="text-muted-foreground italic text-sm">None</span>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: ({ row }) => {
      const status = statusesWithIcons.find(
        (s) => s.value === row.getValue("status")
      );

      if (!status) return null;

      const Icon = status.icon;

      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
            status.className
          )}
        >
          {Icon && <Icon className="size-3.5 shrink-0" />}
          <span className="capitalize">{status.label}</span>
        </div>
      );
    },
    filterFn: multiValueFilter,
  }),
  columnHelper.accessor("createdAt", {
    header: () => "Posted",
    cell: (info) => {
      const date = info.getValue();
      return (
        <span className="text-sm text-muted-foreground">
          {formatDate(date)}
        </span>
      );
    },
  }),
  columnHelper.accessor("_count.favorites", {
    id: "favorites",
    header: () => "Likes",
    cell: (info) => {
      const count = info.getValue() || 0;
      return <span className="text-sm font-medium">{count}</span>;
    },
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const post = row.original;

      const [loading, setLoading] = useState(false);
      const [open, setOpen] = useState(false);
      const router = useRouter();

      const handleDelete = async () => {
        try {
          setLoading(true);
          const res = await deleteUserCommunityPost(post.id);
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        } finally {
          setLoading(false);
          setOpen(false);
        }
      };

      return (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/community/${post.id}`)}
            className="h-8"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={loading}
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {post.title || "this post"}
                  </span>
                  ? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-destructive/10 hover:bg-destructive/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  }),
];
