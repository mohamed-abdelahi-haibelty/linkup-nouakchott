import { getCommunityFeed } from "@/features/community/actions/getCommunityFeed";
import CommunityPageClient from "@/features/community/components/CommunityPageClient";

export default async function CommunityPage() {
  const result = await getCommunityFeed();
  const initialPosts = result.success && result.data ? result.data : [];

  return <CommunityPageClient initialPosts={initialPosts} />;
}
