import { MetricsCards } from "@/components/dashboard/MetricsCards";
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

      {/* Recent Purchases */}
      <RecentPurchases />
    </div>
  );
}
