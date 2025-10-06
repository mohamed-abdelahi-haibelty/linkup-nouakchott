import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

function EventDetailsFooter() {
  return (
    <div
      className="fixed bottom-0 z-50 w-full
           bg-card  px-3 py-3  left-0 right-0 sm:hidden"
    >
      <div className="flex items-center gap-x-2">
        <div className="p-4 border-2 border-none rounded-full bg-background hover:shadow-xs hover:bg-muted">
          <Heart className="w-4 h-4 " />
        </div>
        <Button className="w-full bg-accent flex-1  rounded-full p-6">
          Join
        </Button>
      </div>
    </div>
  );
}

export default EventDetailsFooter;
