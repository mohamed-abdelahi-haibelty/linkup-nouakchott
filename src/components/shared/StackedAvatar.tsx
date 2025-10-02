"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn, getFallback } from "@/lib/utils";
import { User } from "@prisma/client";
import { AvatarGroup, AvatarGroupTooltip } from "./AvatarGroup";

type Props = {
  className?: string;
  users?: User[];
};

export const StackedAvatar = ({ className, users }: Props) => {
  const userList = users ?? []; // fallback to empty array
  const maxVisible = 6;
  const visibleUsers = userList.slice(0, maxVisible);
  const extraCount = Math.max(userList.length - maxVisible, 0);

  // If no users, show a single placeholder avatar
  const avatars =
    visibleUsers.length > 0
      ? [
          ...visibleUsers.map((user, i) => (
            <Avatar
              key={user.id ?? `user-${i}`}
              className={cn("size-7 border-3 border-background", className)}
            >
              <AvatarImage src={user.avatarUrl ?? undefined} />
              <AvatarFallback>{getFallback(user.name)}</AvatarFallback>
              <AvatarGroupTooltip>
                <p>{user.name}</p>
              </AvatarGroupTooltip>
            </Avatar>
          )),
          ...(extraCount > 0
            ? [
                <Avatar
                  key="extra"
                  className={cn(
                    "size-7 border-3 border-background bg-muted text-xs font-medium flex items-center justify-center",
                    className
                  )}
                >
                  <AvatarFallback>+{extraCount}</AvatarFallback>
                </Avatar>,
              ]
            : []),
        ]
      : [
          <Avatar
            key="placeholder"
            className={cn(
              "size-7 border-3 border-background bg-muted text-xs font-medium flex items-center justify-center",
              className
            )}
          >
            <AvatarFallback>–</AvatarFallback>
          </Avatar>,
        ];

  return (
    <AvatarGroup variant="motion" className="h-12 -space-x-3">
      {avatars}
    </AvatarGroup>
  );
};
export default StackedAvatar;
