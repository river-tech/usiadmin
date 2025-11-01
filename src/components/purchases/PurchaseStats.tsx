import { StatCard } from "@/components/ui/StatCard";
import { ShoppingCart, CheckCircle, Clock, DollarSign } from "lucide-react";
import { mockPurchases } from "@/lib/mock-data";
import { PurchasesOverview } from "@/lib/types";
import { formatCurrencyVND } from "@/lib/utils";

export function PurchaseStats({ overview }: { overview: PurchasesOverview | null }) {
  const totalPurchases = overview?.total_purchases || 0;
  const completedPurchases = overview?.completed || 0;
  const pendingPurchases = overview?.pending || 0;
  const totalRevenue = overview?.total_revenue || 0;

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
      value: formatCurrencyVND(totalRevenue),
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
