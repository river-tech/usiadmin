import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAnalytics } from "@/lib/mock-data";

type RevenuePoint = {
  date: string;
  revenue: number;
};

export function SalesChart() {
  const chartData: RevenuePoint[] = mockAnalytics.revenueChart.slice(-7); // Last 7 days

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>
          Revenue trends over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-end justify-between space-x-2">
          {chartData.map((item: RevenuePoint, index) => {
            const maxRevenue = Math.max(...chartData.map(d => d.revenue));
            const height = (item.revenue / maxRevenue) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div
                  className="w-full bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-sm transition-all duration-300 hover:from-primary to-primary/60"
                  style={{ height: `${height}%` }}
                />
                <div className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs font-medium">
                  ${item.revenue.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
