import { Card, CardContent } from "@/components/ui/card";

function EventCardSkeleton() {
  return (
    <Card className="w-[330px] md:w-[360px] lg:w-[470px] xl:w-[390px]  h-[244px] animate-pulse">
      <CardContent className="h-full flex flex-col justify-between">
        <div className="flex items-start gap-x-2">
          {/* Image skeleton */}
          <div className="w-[130px] h-[140px] bg-muted rounded-[8px]" />

          <div className="space-y-2 flex-1">
            {/* Title skeleton */}
            <div className="h-4 bg-muted rounded w-3/4" />

            {/* Description skeleton */}
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
              <div className="h-3 bg-muted rounded w-4/6" />
              <div className="h-3 bg-muted rounded w-3/6" />
            </div>

            {/* Avatars and users skeleton */}
            <div className="flex items-center gap-x-2 mt-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-muted rounded-full" />
                <div className="w-6 h-6 bg-muted rounded-full" />
                <div className="w-6 h-6 bg-muted rounded-full" />
              </div>
              <div className="h-3 bg-muted rounded w-8" />
            </div>
          </div>
        </div>

        {/* Bottom info skeleton */}
        <div className="mt-2 bg-muted/50 rounded-[8px] p-2 flex items-center justify-around">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-12" />
          <div className="h-3 bg-muted rounded w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

export default EventCardSkeleton;
