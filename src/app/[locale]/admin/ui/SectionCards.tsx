import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-y-3 w-full mx-auto lg:grid-cols-3 gap-x-6">
      <Card className="bg-gradient-to-t w-full lg:w-full from-primary/5 via-card to-card shadow-xs">
        <CardHeader>
          <CardDescription>Pending events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums ">
            10
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-gradient-to-t w-full lg:w-full  from-primary/5 via-card to-card shadow-xs">
        <CardHeader>
          <CardDescription>Pending community posts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums ">
            30
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-gradient-to-t w-full lg:w-full  from-primary/5 via-card to-card shadow-xs">
        <CardHeader>
          <CardDescription>Total users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums ">
            23
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
