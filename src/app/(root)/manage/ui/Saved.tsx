import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, MessageSquare } from "lucide-react";
import { getUserFavorites } from "@/app/actions/favorite/getUserFavorites";
import { SavedEventCard } from "./SavedEventCard";
import { SavedPostCard } from "./SavedPostCard";

async function page() {
  const result = await getUserFavorites();

  if (!result.success) {
    if (result.code === 401) {
      redirect("/api/auth/login");
    }
  }

  const events = result.data?.events || [];
  const posts = result.data?.posts || [];

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold">Saved</h1>
        </div>
        <p className="text-muted-foreground">
          Your favorited events and community posts
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            All ({events.length + posts.length})
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger value="posts">
            <MessageSquare className="h-4 w-4 mr-2" />
            Posts ({posts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {events.length === 0 && posts.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No saved items yet</h3>
              <p className="text-muted-foreground">
                Start exploring events and posts to save your favorites
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Events */}
              {events.map((event) => (
                <SavedEventCard key={event.id} event={event} />
              ))}
              {/* Posts */}
              {posts.map((post) => (
                <SavedPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No saved events</h3>
              <p className="text-muted-foreground">
                Browse events and save your favorites
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <SavedEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
