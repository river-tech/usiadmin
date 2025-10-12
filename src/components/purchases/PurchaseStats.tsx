import { StatCard } from "@/components/ui/StatCard";
import { ShoppingCart, CheckCircle, Clock, DollarSign } from "lucide-react";
import { mockPurchases } from "@/lib/mock-data";

export function PurchaseStats() {
  const totalPurchases = mockPurchases.length;
  const completedPurchases = mockPurchases.filter(p => p.status === 'ACTIVE').length;
  const pendingPurchases = mockPurchases.filter(p => p.status === 'PENDING').length;
  const totalRevenue = mockPurchases
    .filter(p => p.status === 'ACTIVE')
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    {
      title: "Total Purchases",
      value: totalPurchases,
      icon: <ShoppingCart className="h-4 w-4" />,
      description: "All-time purchases"
    },
    {
      title: "Completed",
      value: completedPurchases,
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Successfully completed"
    },
    {
      title: "Pending",
      value: pendingPurchases,
      icon: <Clock className="h-4 w-4" />,
      description: "Awaiting completion"
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-4 w-4" />,
      description: "All-time revenue"
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
