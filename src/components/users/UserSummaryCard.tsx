import { StatCard } from "@/components/ui/StatCard";
import { Users, UserCheck, ShoppingCart, DollarSign } from "lucide-react";
import { mockUsers, mockAnalytics } from "@/lib/mock-data";

export function UserSummaryCard() {
  const activeUsers = mockUsers.filter(user => user.status === 'active').length;
  const totalSpent = mockUsers.reduce((sum, user) => sum + user.totalSpent, 0);
  const totalPurchases = mockUsers.reduce((sum, user) => sum + user.purchases, 0);

  const stats = [
    {
      title: "Total Users",
      value: mockUsers.length,
      icon: <Users className="h-4 w-4" />,
      description: "All registered users"
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: <UserCheck className="h-4 w-4" />,
      description: "Currently active"
    },
    {
      title: "Total Purchases",
      value: totalPurchases,
      icon: <ShoppingCart className="h-4 w-4" />,
      description: "All-time purchases"
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toLocaleString()}`,
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
