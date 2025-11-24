"use client";
import React, { useState } from "react";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFallback } from "@/lib/utils";
import { toast } from "sonner";

interface CommunityPostCardProps {
  post: {
    id: string;
    title: string | null;
    description: string;
    posterUrl: string | null;
    location: string | null;
    startTime: Date | null;
    endTime: Date | null;
    tag: string | null;
    status: string;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
    _count?: {
      favorites: number;
    };
  };
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = post.description.length > 150;
  const displayText =
    !shouldTruncate || isExpanded
      ? post.description
      : post.description.slice(0, 150) + "...";

  const getCategoryColor = (category: string | null) => {
    if (!category)
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";

    switch (category) {
      case "conference":
      case "tech":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "networking":
      case "business":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "workshop":
      case "education":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "seminar":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "social":
      case "community":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300";
      case "music":
      case "entertainment":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "sports":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "art":
      case "culture":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || "Community Post",
          text: post.description,
          url: `${window.location.origin}/community/${post.id}`,
        });
        toast("Link copied!", {
          description: "Post URL copied to your clipboard.",
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/community/${post.id}`
      );
      toast("Link copied!", {
        description: "Post URL copied to your clipboard.",
      });
    }
  };

  return (
    <div
      className="rounded-lg border p-6"
      style={{
        backgroundColor: "var(--card)",
        color: "var(--card-foreground)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 rounded-full object-cover">
            <AvatarImage
              src={post.user.avatarUrl || undefined}
              alt={post.user.name}
            />
            <AvatarFallback>{getFallback(post.user.name)}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold text-sm">{post.user.name}</h3>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {getTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.status === "pending" && (
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
              Pending
            </span>
          )}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Event Title */}
      {post.title && (
        <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
      )}

      {/* Category */}
      {post.tag && (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mb-3 ${getCategoryColor(
            post.tag
          )}`}
        >
          {post.tag}
        </span>
      )}

      {/* Poster Image */}
      {post.posterUrl && (
        <div
          className="mb-4 rounded-lg overflow-hidden"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <img
            src={post.posterUrl}
            alt={`${post.title} poster`}
            className="w-full h-64 sm:h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => window.open(post.posterUrl!, "_blank")}
          />
        </div>
      )}

      {/* Description */}
      <p
        className="text-sm mb-4 leading-relaxed"
        style={{ color: "var(--muted-foreground)" }}
      >
        {displayText}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 font-medium hover:underline"
            style={{ color: "var(--primary)" }}
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        )}
      </p>

      {/* Event Details */}
      {(post.startTime || post.location) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {post.startTime && (
            <>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--muted-foreground)" }}
              >
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(post.startTime), "MMM dd, yyyy")}</span>
              </div>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--muted-foreground)" }}
              >
                <Clock className="h-4 w-4" />
                <span>{format(new Date(post.startTime), "hh:mm a")}</span>
              </div>
            </>
          )}
          {post.location && (
            <div
              className="flex items-center gap-2 text-sm sm:col-span-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              <MapPin className="h-4 w-4" />
              <span>{post.location}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
