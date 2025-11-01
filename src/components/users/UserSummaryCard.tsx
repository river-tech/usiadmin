import { StatCard } from "@/components/ui/StatCard";
import { Users, UserCheck, ShoppingCart, DollarSign } from "lucide-react";
import { mockUsers, mockAnalytics } from "@/lib/mock-data";
import { formatCurrencyVND } from "@/lib/utils";
import { UsersOverview } from "@/lib/types";

export function UserSummaryCard({ overview }: { overview: UsersOverview }) {
  const stats = [
    {
      title: "Total Users",
      value: overview?.total_users || 0,
      icon: <Users className="h-4 w-4" />,
      description: "All registered users"
    },
    {
      title: "Active Users",
      value: overview?.active_users || 0,
      icon: <UserCheck className="h-4 w-4" />,
      description: "Currently active"
    },
    {
      title: "Total Purchases",
      value: overview?.total_purchases || 0,
      icon: <ShoppingCart className="h-4 w-4" />,
      description: "All-time purchases"
    },
    {
      title: "Total Spent",
      value: formatCurrencyVND(overview?.total_spent || 0),
      icon: <DollarSign className="h-4 w-4" />,
      description: "All-time spending"
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
