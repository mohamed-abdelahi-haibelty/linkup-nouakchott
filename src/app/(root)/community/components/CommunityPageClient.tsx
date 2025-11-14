"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";

import { CommunityPostCard } from "./CommunityPostCard";
import { CreatePostModal } from "./CreatePostModal";

interface CommunityPageClientProps {
  initialPosts: any[];
}

export default function CommunityPageClient({
  initialPosts,
}: CommunityPageClientProps) {
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <div
      className="min-h-screen text-foreground"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b lg:border-dashed backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center px-4 max-w-2xl mx-auto">
          <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Community
          </h1>
          <div className="ml-auto">
            <button
              onClick={() => setShowPostModal(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 gap-2"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                boxShadow: "var(--shadow)",
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Post Event</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 max-w-lg mx-auto">
        {initialPosts.length === 0 ? (
          <div
            className="text-center py-12 rounded-lg border"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-lg font-medium mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              No posts yet
            </p>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              Be the first to share an event with the community!
            </p>
            <button
              onClick={() => setShowPostModal(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {initialPosts.map((post) => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
      />
    </div>
  );
}
