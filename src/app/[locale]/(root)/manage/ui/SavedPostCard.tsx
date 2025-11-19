"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Heart, Loader2, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

import { toast } from "sonner";
import { removeFromFavorites } from "@/app/[locale]/actions/favorite/removeFromFavorites";

type SavedPostCardProps = {
  post: {
    favoriteId: string;
    id: string;
    title: string | null;
    description: string;
    posterUrl: string | null;
    location: string | null;
    startTime: Date | null;
    tag: string | null;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
    _count?: {
      favorites: number;
    };
  };
};

export function SavedPostCard({ post }: SavedPostCardProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsRemoving(true);
      const res = await removeFromFavorites(post.favoriteId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/community/${post.id}`);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {post.posterUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={post.posterUrl}
            alt={post.title || "Post image"}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex-1">
            {post.title && (
              <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                {post.title}
              </h3>
            )}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.description}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 shrink-0 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
            ) : (
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            )}
          </Button>
        </div>

        {post.tag && (
          <Badge variant="secondary" className="capitalize mb-3">
            {post.tag}
          </Badge>
        )}

        {(post.startTime || post.location) && (
          <div className="space-y-2 text-sm text-muted-foreground mb-3">
            {post.startTime && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{formatDate(post.startTime)}</span>
              </div>
            )}
            {post.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{post.location}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.user.avatarUrl ? (
              <Image
                src={post.user.avatarUrl}
                alt={post.user.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {post.user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {post.user.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="text-sm">{post._count?.favorites || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
