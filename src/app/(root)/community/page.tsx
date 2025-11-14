import { getCommunityFeed } from "@/app/actions/community/getCommunityFeed";
import CommunityPageClient from "./components/CommunityPageClient";

export default async function CommunityPage() {
  const result = await getCommunityFeed();
  const initialPosts = result.success && result.data ? result.data : [];

  return <CommunityPageClient initialPosts={initialPosts} />;
}
