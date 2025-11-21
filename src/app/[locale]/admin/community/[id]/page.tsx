import { formatDate, formatTime } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  User,
  Tag,
  AlertCircle,
  Clock,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCommunityPost } from "@/app/[locale]/actions/community/admin/getCommunityPost";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function page({ params }: PageProps) {
  const url_param = await params;
  const id = url_param?.id;
  const { data } = await getCommunityPost(id);
  const post = data;

  if (!post) {
    return notFound();
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10 pb-12">
        {/* Title Card */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 text-balance">
              {post.title || "Community Post"}
            </h1>
            {post.tag && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="w-4 h-4" />
                <span className="text-sm capitalize">{post.tag}</span>
              </div>
            )}
          </div>
          <Badge variant={getStatusVariant(post.status)} className="capitalize">
            {post.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Post Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Poster/Image Preview */}
            {post.posterUrl && (
              <Card className="border-2 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 " />
                    Post Image Preview
                    <Badge variant="outline" className="ml-auto text-xs">
                      Review Required
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-border bg-muted">
                      <Image
                        src={post.posterUrl || "/placeholder.svg"}
                        alt={post.title || "Post image"}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Please verify that the image is appropriate, relevant,
                        and meets content guidelines before approval.
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-semibold mb-1">Image URL:</p>
                      <p className="font-mono break-all bg-muted p-2 rounded">
                        {post.posterUrl}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 " />
                  Post Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {post.description}
                </p>
              </CardContent>
            </Card>

            {/* Post Details Grid */}
            {(post.startTime || post.endTime || post.location) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 " />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date */}
                    {post.startTime && (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                        <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                          <Calendar className="w-5 h-5 " />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-foreground mb-1">
                            Date
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(post.startTime)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Time */}
                    {post.startTime && post.endTime && (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                        <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                          <Clock className="w-5 h-5 " />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-foreground mb-1">
                            Time
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatTime(post.startTime)} -{" "}
                            {formatTime(post.endTime)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {post.location && (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border sm:col-span-2">
                        <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                          <MapPin className="w-5 h-5 " />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-foreground mb-1">
                            Location
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {post.location}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Author & Metadata */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 " />
                  Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {post.user.avatarUrl ? (
                      <Image
                        src={post.user.avatarUrl}
                        alt={post.user.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                        {post.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold truncate">{post.user.name}</p>
                      <p className="text-sm text-muted-foreground truncate w-[200px]">
                        {post.user.email}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      User ID
                    </p>
                    <p className="text-xs font-mono text-foreground break-all">
                      {post.userId}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Posted</p>
                    <p className="text-sm text-foreground">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>

                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Last Updated
                        </p>
                        <p className="text-sm text-foreground">
                          {formatDate(post.updatedAt)}
                        </p>
                      </div>
                    </>
                  )}

                  {post.approvedAt && post.approvedBy && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Approved By
                        </p>
                        <p className="text-sm text-foreground">
                          {post.approvedBy.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.approvedAt)}
                        </p>
                      </div>
                    </>
                  )}

                  {post.rejectedAt && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Rejected At
                        </p>
                        <p className="text-sm text-foreground">
                          {formatDate(post.rejectedAt)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Post Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Post ID</span>
                  <span className="text-xs font-mono text-foreground">
                    {post.id.slice(0, 8)}...
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Category
                  </span>
                  <Badge variant="outline" className="capitalize">
                    {post.tag || "Uncategorized"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    Favorites
                  </span>
                  <Badge variant="secondary">
                    {post._count?.favorites || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
