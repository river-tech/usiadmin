import { StatCard } from "@/components/ui/StatCard";
import { DollarSign, Users, Workflow, TrendingUp } from "lucide-react";
import { mockAnalytics } from "@/lib/mock-data";

export function MetricsCards() {
  const metrics = [
    {
      title: "Total Sales",
      value: mockAnalytics.totalSales,
      trend: { value: 12.5, isPositive: true },
      icon: <DollarSign className="h-4 w-4" />,
      description: "Total workflow sales"
    },
    {
      title: "Active Users",
      value: mockAnalytics.activeUsers,
      trend: { value: 8.2, isPositive: true },
      icon: <Users className="h-4 w-4" />,
      description: "Currently active users"
    },
    {
      title: "Total Workflows",
      value: "5",
      trend: { value: 2.1, isPositive: true },
      icon: <Workflow className="h-4 w-4" />,
      description: "Published workflows"
    },
    {
      title: "Monthly Revenue",
      value: `$${mockAnalytics.monthlyRevenue.toLocaleString()}`,
      trend: { value: 15.3, isPositive: true },
      icon: <TrendingUp className="h-4 w-4" />,
      description: "This month's revenue"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <StatCard
          key={index}
          title={metric.title}
          value={metric.value}
          trend={metric.trend}
          icon={metric.icon}
          description={metric.description}
        />
      ))}
    </div>
  );
}
