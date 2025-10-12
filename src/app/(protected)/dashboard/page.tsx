import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentPurchases } from "@/components/dashboard/RecentPurchases";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your workflows today.
        </p>
      </div>

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Charts and Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart />
        <RecentActivity />
      </div>

      {/* Recent Purchases */}
      <RecentPurchases />
    </div>
  );
}
