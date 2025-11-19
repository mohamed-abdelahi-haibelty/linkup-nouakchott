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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User, UserRole } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Loader2,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { multiValueFilter } from "@/lib/tableUtils";
import { changeUserRole } from "@/app/[locale]/actions/community/user/changeUserRole";

export type UserWithCounts = Pick<
  User,
  "id" | "name" | "email" | "role" | "avatarUrl" | "phoneNumber" | "createdAt"
> & {
  _count: {
    events: number;
    posts: number;
    registrations: number;
  };
};

const roles = [
  {
    value: "admin",
    label: "Admin",
    className:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400",
    icon: ShieldCheck,
  },
  {
    value: "moderator",
    label: "Moderator",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
    icon: Shield,
  },
  {
    value: "user",
    label: "User",
    className:
      "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400",
    icon: UserCircle,
  },
];

const columnHelper = createColumnHelper<UserWithCounts>();

export const columns = [
  columnHelper.accessor("name", {
    header: () => "User",
    cell: ({ row }) => {
      const user = row.original;
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("role", {
    header: () => "Role",
    cell: ({ row }) => {
      const roleData = roles.find((r) => r.value === row.getValue("role"));

      if (!roleData) return null;

      const Icon = roleData.icon;

      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition",
            roleData.className
          )}
        >
          <Icon className="size-4 shrink-0" />
          <span className="capitalize">{roleData.label}</span>
        </div>
      );
    },
    filterFn: multiValueFilter,
  }),
  columnHelper.accessor("phoneNumber", {
    header: () => "Phone",
    cell: (info) => {
      const phone = info.getValue();
      return phone || <span className="text-muted-foreground italic">N/A</span>;
    },
  }),
  columnHelper.accessor("_count.events", {
    id: "events",
    header: () => "Events",
    cell: (info) => info.getValue() || 0,
  }),
  columnHelper.accessor("_count.posts", {
    id: "posts",
    header: () => "Posts",
    cell: (info) => info.getValue() || 0,
  }),
  columnHelper.accessor("_count.registrations", {
    id: "registrations",
    header: () => "Registrations",
    cell: (info) => info.getValue() || 0,
  }),
  columnHelper.accessor("createdAt", {
    header: () => "Joined",
    cell: (info) => {
      const date = new Date(info.getValue());
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const [loading, setLoading] = useState(false);

      const handleRoleChange = async (newRole: UserRole) => {
        if (user.role === newRole) {
          toast.info(`User is already a ${newRole}.`);
          return;
        }

        try {
          setLoading(true);
          const res = await changeUserRole(user.id, newRole);
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        } finally {
          setLoading(false);
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
            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={user.role === "user"}
              onClick={() => handleRoleChange("user")}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Set as User
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={user.role === "moderator"}
              onClick={() => handleRoleChange("moderator")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Set as Moderator
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={user.role === "admin"}
              onClick={() => handleRoleChange("admin")}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Set as Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
