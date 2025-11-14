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

import { cn } from "@/lib/utils";
import { CommunityPost, User } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Loader2,
  MoreHorizontal,
  BadgeCheck,
  Clock,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { multiValueFilter } from "@/lib/tableUtils";
import { changeCommunityPostStatus } from "@/app/actions/community/admin/changeCommunityPostStatus";
import { deleteCommunityPost } from "@/app/actions/community/admin/deleteCommunityPost";

export type CommunityPostWithUser = CommunityPost & {
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
    cell: (info) => {
      const title = info.getValue();
      return (
        title || <span className="text-muted-foreground italic">No title</span>
      );
    },
  }),
  columnHelper.accessor((row) => row.user.name, {
    id: "author",
    header: () => "Author",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("tag", {
    header: () => "Category",
    cell: (info) => {
      const tag = info.getValue();
      return tag ? (
        <span className="capitalize">{tag}</span>
      ) : (
        <span className="text-muted-foreground italic">None</span>
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
  columnHelper.accessor("_count.favorites", {
    id: "favorites",
    header: () => "Favorites",
    cell: (info) => info.getValue() || 0,
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;

      const [loading, setLoading] = useState(false);
      const [open, setOpen] = useState(false);
      const router = useRouter();

      const handleStatusChange = async (
        status: "approved" | "rejected" | "pending"
      ) => {
        // Prevent redundant update
        if (post.status === status) {
          toast.info(`Post is already ${status}.`);
          return;
        }

        try {
          setLoading(true);
          const res = await changeCommunityPostStatus(post.id, status);
          toast.message(res.message);
        } finally {
          setLoading(false);
        }
      };

      const handleDelete = async () => {
        try {
          setLoading(true);
          const res = await deleteCommunityPost(post.id);
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
              onClick={() => router.push(`/admin/community/${post.id}`)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={post.status === "approved"}
              onClick={() => handleStatusChange("approved")}
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={post.status === "rejected"}
              onClick={() => handleStatusChange("rejected")}
            >
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={post.status === "pending"}
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
                  <AlertDialogTitle>Delete Community Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">
                      {post.title || "this post"}
                    </span>
                    ? This action cannot be undone.
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
