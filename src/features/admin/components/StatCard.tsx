import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
