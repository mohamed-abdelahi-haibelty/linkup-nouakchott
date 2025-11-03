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

function StatCard() {
  return (
    <div>
      <Card className="bg-gradient-to-t w-[200px] from-primary/5 via-card to-card shadow-xs">
        <CardHeader>
          <CardDescription>Pending events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums ">
            10
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default StatCard;
