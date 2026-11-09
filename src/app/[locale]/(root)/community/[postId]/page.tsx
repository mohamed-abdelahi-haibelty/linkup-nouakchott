import { getCommunityPostDetail } from "@/features/community/actions/getCommunityPostDetail";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommunityPostCard } from "@/features/community/components/CommunityPostCard";

type Props = {
  params: Promise<{ postId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const result = await getCommunityPostDetail(postId);

  if (!result.success || !result.data) {
    return {
      title: "Post Not Found",
    };
  }

  const post = result.data;
  const description =
    post.description.length > 160
      ? post.description.slice(0, 157) + "..."
      : post.description;

  return {
    title: post.title || "Community Post",
    description: description,
    openGraph: {
      title: post.title || "Community Post",
      description: description,
      images: post.posterUrl ? [post.posterUrl] : [],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.user.name],
      siteName: "Linkup Nouakchott",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title || "Community Post",
      description: description,
      images: post.posterUrl ? [post.posterUrl] : [],
      creator: `@${post.user.name}`,
    },
  };
}

export default async function CommunityPostPage({ params }: Props) {
  const { postId } = await params;
  const result = await getCommunityPostDetail(postId);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="container px-4 py-6 max-w-lg mx-auto">
      <CommunityPostCard post={result.data} />
    </div>
  );
}
