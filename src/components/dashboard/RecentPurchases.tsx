import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getRecentPurchases } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export function RecentPurchases() {
  const purchases = getRecentPurchases(5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Purchases</CardTitle>
          <CardDescription>
            Latest transactions in the system
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/purchases">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {purchase.userName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {purchase.workflowTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(purchase.date), { addSuffix: true })}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-medium">
                  ${purchase.amount}
                </p>
                <StatusBadge status={purchase.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
