import { StatCard } from "@/components/ui/StatCard";
import { Workflow, DollarSign, TrendingUp, Users } from "lucide-react";
import { mockWorkflows, mockAnalytics } from "@/lib/mock-data";

export function WorkflowStats() {
  const publishedWorkflows = mockWorkflows.filter(w => w.status === 'published');
  const totalRevenue = publishedWorkflows.reduce((sum, w) => sum + w.revenue, 0);
  const totalSales = publishedWorkflows.reduce((sum, w) => sum + w.sales, 0);

  const stats = [
    {
      title: "Total Workflows",
      value: mockWorkflows.length,
      icon: <Workflow className="h-4 w-4" />,
      description: "All workflows in system"
    },
    {
      title: "Published",
      value: publishedWorkflows.length,
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Currently published"
    },
    {
      title: "Total Sales",
      value: totalSales,
      icon: <Users className="h-4 w-4" />,
      description: "All-time sales count"
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-4 w-4" />,
      description: "All-time revenue generated"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
        />
      ))}
    </div>
  );
}
